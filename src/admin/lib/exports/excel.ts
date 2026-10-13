import type ExcelJS from 'exceljs'
import type { Questionnaire } from '../../../types'
import { triggerBlobDownload } from '../api'
import {
  asText,
  classifyAnswer,
  documentsForQuestion,
  getAnswer,
  getTableRows,
  isNotApplicableString,
} from '../answers'
import { ASSESSMENT_TYPE_LABEL, REVIEW_STATUS_LABEL, formatBytes, formatDateTime } from '../format'
import type { AssessmentRow, AssessmentType, DocumentIndexRow } from '../types'

const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD8FF63' } } as const
const SUBHEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F0E9' } } as const
const BORDER = {
  top: { style: 'thin' as const, color: { argb: 'FF171717' } },
  left: { style: 'thin' as const, color: { argb: 'FF171717' } },
  bottom: { style: 'thin' as const, color: { argb: 'FF171717' } },
  right: { style: 'thin' as const, color: { argb: 'FF171717' } },
}

function sanitizeSheetName(name: string, index: number): string {
  const cleaned = name.replace(/[[\]:*?/\\]/g, ' ').trim() || `Section ${index + 1}`
  return cleaned.slice(0, 31)
}

function answerToText(value: unknown): string {
  const state = classifyAnswer(value)
  if (state === 'not_answered') return 'Not answered'
  if (state === 'not_applicable') return 'Not applicable'
  return asText(value)
}

export async function downloadAssessmentWorkbook(
  assessment: AssessmentRow,
  assessmentType: AssessmentType,
  questionnaire: Questionnaire,
  verificationByPath?: Map<string, DocumentIndexRow>,
): Promise<void> {
  const excelModule = await import('exceljs')
  const ExcelJSImport = (excelModule.default ?? excelModule) as typeof ExcelJS
  const workbook = new ExcelJSImport.Workbook()
  workbook.creator = 'Water Assessment Admin'
  workbook.created = new Date()

  // ---- Summary sheet ------------------------------------------------------
  const summary = workbook.addWorksheet('Assessment Summary', {
    properties: { defaultColWidth: 32 },
  })
  summary.columns = [
    { header: 'Field', key: 'field', width: 34 },
    { header: 'Value', key: 'value', width: 62 },
  ]
  summary.getRow(1).eachCell((cell) => {
    cell.font = { bold: true }
    cell.fill = HEADER_FILL
    cell.border = BORDER
  })
  summary.views = [{ state: 'frozen', ySplit: 1 }]

  const review = assessment.review ?? {}
  const summaryRows: Array<[string, string]> = [
    ['Organization name', assessment.organization_name || '—'],
    ['Assessment category', ASSESSMENT_TYPE_LABEL[assessmentType]],
    ['Assessment ID', assessment.id],
    ['Questionnaire version', assessment.questionnaire_version],
    ['Schema version', String(assessment.schema_version ?? '')],
    ['Submitted at', formatDateTime(assessment.submitted_at)],
    ['Review status', REVIEW_STATUS_LABEL[assessment.review_status] ?? assessment.review_status],
    ['Review notes', review.notes || '—'],
    ['Reviewed by', review.reviewer_email || '—'],
    ['Reviewed at', review.reviewed_at ? formatDateTime(review.reviewed_at) : '—'],
    ['Total documents', String(assessment.attachments?.length ?? 0)],
  ]
  summaryRows.forEach(([field, value], index) => {
    const row = summary.addRow([field, value])
    row.getCell(1).font = { bold: true }
    row.eachCell((cell) => {
      cell.border = BORDER
      cell.alignment = { vertical: 'top', wrapText: true }
    })
    if (index % 2 === 1) row.eachCell((cell) => (cell.fill = SUBHEADER_FILL))
  })

  // ---- Section sheets -----------------------------------------------------
  questionnaire.sections.forEach((section, index) => {
    const sheet = workbook.addWorksheet(sanitizeSheetName(`${index + 1}. ${section.title}`, index), {
      properties: { defaultColWidth: 18 },
    })
    sheet.columns = [
      { header: '#', key: 'number', width: 6 },
      { header: 'Question ID', key: 'questionId', width: 28 },
      { header: 'Question', key: 'question', width: 48 },
      { header: 'Answer', key: 'answer', width: 60 },
      { header: 'Unit', key: 'unit', width: 12 },
      { header: 'Documents', key: 'documents', width: 44 },
    ]
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
      cell.fill = HEADER_FILL
      cell.border = BORDER
      cell.alignment = { vertical: 'middle', wrapText: true }
    })
    sheet.views = [{ state: 'frozen', ySplit: 1 }]

    section.questions.forEach((question, questionIndex) => {
      const value = getAnswer(assessment.answers, section.id, question.id)
      const documents = documentsForQuestion(assessment.attachments, section.id, question.id, value)
      const documentNames = documents.map((document) => document.file_name).join('\n')

      if (question.inputType === 'table' && question.tableDefinition) {
        const tableRow = sheet.addRow([questionIndex + 1, question.id, question.question, '', '', documentNames])
        tableRow.getCell(3).font = { bold: true }
        tableRow.eachCell((cell) => {
          cell.border = BORDER
          cell.alignment = { vertical: 'top', wrapText: true }
        })
        const rows = getTableRows(question.tableDefinition, value)
        rows.forEach((tableRowValue) => {
          const continuation = sheet.addRow([
            '',
            `${question.id}:${tableRowValue.id}`,
            `↳ ${tableRowValue.label}`,
            tableRowValue.cells.map((cell) => answerToText(cell)).join(' | '),
            '',
            '',
          ])
          continuation.eachCell((cell) => {
            cell.border = BORDER
            cell.alignment = { vertical: 'top', wrapText: true }
            cell.fill = SUBHEADER_FILL
          })
        })
        return
      }

      let answer = answerToText(value)
      if (question.inputType === 'file') {
        answer = documents.length > 0 ? documents.map((document) => document.file_name).join('\n') : 'Not answered'
      } else if (isNotApplicableString(value)) {
        answer = 'Not applicable'
      }

      const row = sheet.addRow([
        questionIndex + 1,
        question.id,
        question.question,
        answer,
        '',
        documentNames || (question.inputType === 'file' ? '—' : ''),
      ])
      row.eachCell((cell) => {
        cell.border = BORDER
        cell.alignment = { vertical: 'top', wrapText: true }
      })
    })

    const introRow = sheet.addRow([])
    introRow.getCell(1).value = section.introduction ?? ''
  })

  // ---- Document manifest --------------------------------------------------
  const manifest = workbook.addWorksheet('Document Manifest', { properties: { defaultColWidth: 18 } })
  manifest.columns = [
    { header: 'Assessment ID', key: 'assessmentId', width: 38 },
    { header: 'Organization', key: 'organization', width: 30 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Section', key: 'section', width: 30 },
    { header: 'Section ID', key: 'sectionId', width: 24 },
    { header: 'Question', key: 'question', width: 40 },
    { header: 'Question ID', key: 'questionId', width: 24 },
    { header: 'File name', key: 'fileName', width: 30 },
    { header: 'Content type', key: 'contentType', width: 20 },
    { header: 'Size (bytes)', key: 'size', width: 14 },
    { header: 'Bucket', key: 'bucket', width: 26 },
    { header: 'Storage path', key: 'storagePath', width: 50 },
    { header: 'Verification', key: 'verification', width: 18 },
  ]
  manifest.getRow(1).eachCell((cell) => {
    cell.font = { bold: true }
    cell.fill = HEADER_FILL
    cell.border = BORDER
    cell.alignment = { vertical: 'middle', wrapText: true }
  })
  manifest.views = [{ state: 'frozen', ySplit: 1 }]

  const sectionById = new Map(questionnaire.sections.map((section) => [section.id, section]))
  for (const attachment of assessment.attachments ?? []) {
    const section = sectionById.get(attachment.section_id)
    const question = section?.questions.find((item) => item.id === attachment.question_id)
    const verification = verificationByPath?.get(attachment.storage_path)
    const status = verification
      ? verification.reference_valid
        ? 'Verified'
        : verification.storage_exists
          ? 'Invalid reference'
          : 'Missing object'
      : 'Unverified'
    const row = manifest.addRow([
      assessment.id,
      assessment.organization_name,
      ASSESSMENT_TYPE_LABEL[assessmentType],
      section?.title ?? '',
      attachment.section_id,
      question?.question ?? '',
      attachment.question_id,
      attachment.file_name,
      attachment.content_type,
      attachment.size_bytes,
      attachment.bucket_id,
      attachment.storage_path,
      status,
    ])
    row.eachCell((cell) => {
      cell.border = BORDER
      cell.alignment = { vertical: 'top', wrapText: true }
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const safeName = (assessment.organization_name || assessmentType).replace(/[^\w.-]+/g, '_').slice(0, 60)
  triggerBlobDownload(blob, `${safeName}_${assessment.id.slice(0, 8)}.xlsx`)
}

export function describeDocument(attachment: { content_type: string; size_bytes: number }): string {
  return `${attachment.content_type} · ${formatBytes(attachment.size_bytes)}`
}
