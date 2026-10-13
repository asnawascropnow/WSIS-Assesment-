import type ExcelJS from 'exceljs'
import { triggerBlobDownload } from '../api'
import { ASSESSMENT_TYPES, ASSESSMENT_TYPE_LABEL, REVIEW_STATUSES, REVIEW_STATUS_LABEL, formatDateTime } from '../format'
import type { AssessmentListItem } from '../types'

const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF9CF3D0' } } as const
const BORDER = {
  top: { style: 'thin' as const, color: { argb: 'FF171717' } },
  left: { style: 'thin' as const, color: { argb: 'FF171717' } },
  bottom: { style: 'thin' as const, color: { argb: 'FF171717' } },
  right: { style: 'thin' as const, color: { argb: 'FF171717' } },
}

function styleHeader(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = { bold: true }
    cell.fill = HEADER_FILL
    cell.border = BORDER
    cell.alignment = { vertical: 'middle', wrapText: true }
  })
}

function addTable(
  workbook: ExcelJS.Workbook,
  name: string,
  columns: Array<{ header: string; key: string; width: number }>,
  rows: Array<Record<string, unknown>>,
) {
  const sheet = workbook.addWorksheet(name)
  sheet.columns = columns
  styleHeader(sheet.getRow(1))
  sheet.views = [{ state: 'frozen', ySplit: 1 }]
  for (const data of rows) {
    const row = sheet.addRow(data)
    row.eachCell((cell) => {
      cell.border = BORDER
      cell.alignment = { vertical: 'top', wrapText: true }
    })
  }
  return sheet
}

export async function downloadConsolidatedReport(
  rows: AssessmentListItem[],
  options: { label: string; filters: Record<string, string> },
): Promise<void> {
  const excelModule = await import('exceljs')
  const ExcelJSImport = (excelModule.default ?? excelModule) as typeof ExcelJS
  const workbook = new ExcelJSImport.Workbook()
  workbook.creator = 'Water Assessment Admin'
  workbook.created = new Date()

  addTable(
    workbook,
    'Assessment Register',
    [
      { header: 'Organization', key: 'organization', width: 34 },
      { header: 'Category', key: 'category', width: 22 },
      { header: 'Assessment ID', key: 'id', width: 38 },
      { header: 'Questionnaire version', key: 'version', width: 22 },
      { header: 'Submitted at', key: 'submitted', width: 22 },
      { header: 'Review status', key: 'status', width: 18 },
      { header: 'Documents', key: 'documents', width: 12 },
    ],
    rows.map((row) => ({
      organization: row.organization_name,
      category: ASSESSMENT_TYPE_LABEL[row.assessment_type],
      id: row.id,
      version: row.questionnaire_version,
      submitted: formatDateTime(row.submitted_at),
      status: REVIEW_STATUS_LABEL[row.review_status] ?? row.review_status,
      documents: row.document_count,
    })),
  )

  // Organization directory, deduplicated per category + exact name.
  const orgMap = new Map<string, { organization: string; category: string; count: number; latest: string; status: string }>()
  for (const row of rows) {
    const key = `${row.assessment_type}::${row.organization_name}`
    const existing = orgMap.get(key)
    if (!existing) {
      orgMap.set(key, {
        organization: row.organization_name,
        category: ASSESSMENT_TYPE_LABEL[row.assessment_type],
        count: 1,
        latest: row.submitted_at,
        status: REVIEW_STATUS_LABEL[row.review_status] ?? row.review_status,
      })
    } else {
      existing.count += 1
      if (new Date(row.submitted_at) > new Date(existing.latest)) {
        existing.latest = row.submitted_at
        existing.status = REVIEW_STATUS_LABEL[row.review_status] ?? row.review_status
      }
    }
  }
  addTable(
    workbook,
    'Organizations',
    [
      { header: 'Organization', key: 'organization', width: 34 },
      { header: 'Category', key: 'category', width: 22 },
      { header: 'Assessments', key: 'count', width: 14 },
      { header: 'Latest submission', key: 'latest', width: 24 },
      { header: 'Latest status', key: 'status', width: 18 },
    ],
    Array.from(orgMap.values()).map((value) => ({ ...value, latest: formatDateTime(value.latest) })),
  )

  addTable(
    workbook,
    'Category Summary',
    [
      { header: 'Category', key: 'category', width: 26 },
      { header: 'Assessments', key: 'count', width: 16 },
      { header: 'Documents', key: 'documents', width: 16 },
    ],
    ASSESSMENT_TYPES.map((type) => ({
      category: ASSESSMENT_TYPE_LABEL[type],
      count: rows.filter((row) => row.assessment_type === type).length,
      documents: rows.filter((row) => row.assessment_type === type).reduce((total, row) => total + row.document_count, 0),
    })),
  )

  addTable(
    workbook,
    'Review Status',
    [
      { header: 'Review status', key: 'status', width: 22 },
      { header: 'Assessments', key: 'count', width: 16 },
    ],
    REVIEW_STATUSES.map((status) => ({
      status: REVIEW_STATUS_LABEL[status],
      count: rows.filter((row) => row.review_status === status).length,
    })),
  )

  const notes = workbook.addWorksheet('Notes')
  notes.columns = [{ header: 'Item', key: 'item', width: 40 }, { header: 'Detail', key: 'detail', width: 90 }]
  styleHeader(notes.getRow(1))
  const noteRows: Array<[string, string]> = [
    ['Generated at', new Date().toISOString()],
    ['Report label', options.label],
    ['Filters applied', JSON.stringify(options.filters)],
    [
      'Scope',
      'This consolidated workbook summarises the assessment register, organizations, categories and review status for the filtered set.',
    ],
    [
      'Measurement assumptions',
      'Water source, consumption, treatment, rainwater and reuse metrics live inside each questionnaire as free-form or tabular answers. They are preserved verbatim in each individual assessment Excel export and are not aggregated here to avoid inventing units or conflating missing values with zero.',
    ],
    [
      'Missing vs zero',
      'Only values explicitly submitted are counted. Unanswered questions are never treated as zero.',
    ],
  ]
  for (const [item, detail] of noteRows) {
    const row = notes.addRow([item, detail])
    row.getCell(1).font = { bold: true }
    row.eachCell((cell) => {
      cell.border = BORDER
      cell.alignment = { vertical: 'top', wrapText: true }
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const stamp = new Date().toISOString().slice(0, 10)
  triggerBlobDownload(blob, `${options.label.replace(/[^\w.-]+/g, '_').slice(0, 40) || 'report'}_${stamp}.xlsx`)
}
