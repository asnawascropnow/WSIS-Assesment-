import { getTableCellKey } from '../../lib/sectionSchema'
import type { QuestionDefinition, TableDefinition } from '../../types'
import type { AttachmentReference, JsonRecord } from './types'

export const NOT_APPLICABLE_VALUES = ['-', 'none', 'nil']

export type AnswerState = 'answered' | 'not_applicable' | 'not_answered'

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isNotApplicableString(value: unknown): boolean {
  return typeof value === 'string' && NOT_APPLICABLE_VALUES.includes(value.trim().toLowerCase())
}

export function classifyAnswer(value: unknown): AnswerState {
  if (value === undefined || value === null) return 'not_answered'
  if (typeof value === 'string') {
    if (isNotApplicableString(value)) return 'not_applicable'
    return value.trim().length > 0 ? 'answered' : 'not_answered'
  }
  if (Array.isArray(value)) return value.length > 0 ? 'answered' : 'not_answered'
  if (isRecord(value)) return Object.keys(value).length > 0 ? 'answered' : 'not_answered'
  return 'answered'
}

/**
 * Answers are stored nested by section and question id:
 * `answers[section_id][question_id]`. Some historic payloads were flat, so we
 * fall back to a top-level lookup by question id.
 */
export function getSectionAnswers(answers: JsonRecord | null | undefined, sectionId: string): JsonRecord {
  const section = answers?.[sectionId]
  return isRecord(section) ? section : {}
}

export function getAnswer(
  answers: JsonRecord | null | undefined,
  sectionId: string,
  questionId: string,
): unknown {
  const section = answers?.[sectionId]
  if (isRecord(section) && Object.hasOwn(section, questionId)) return section[questionId]
  if (answers && Object.hasOwn(answers, questionId)) return answers[questionId]
  return undefined
}

export function asText(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function asAttachmentReferences(value: unknown): AttachmentReference[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is AttachmentReference =>
      isRecord(item) &&
      typeof item.file_name === 'string' &&
      typeof item.storage_path === 'string' &&
      typeof item.bucket_id === 'string',
  )
}

export type TableRowValue = {
  id: string
  label: string
  cells: unknown[]
}

export function getTableRows(table: TableDefinition, value: unknown): TableRowValue[] {
  const record = isRecord(value) ? value : {}
  return table.rows.map((row) => {
    const rowValue = isRecord(record[row.id]) ? (record[row.id] as JsonRecord) : {}
    const cells = table.columns.slice(1).map((_, index) => rowValue[getTableCellKey(table, index)])
    return { id: row.id, label: row.label, cells }
  })
}

/**
 * Documents for a question come from the assessment attachment manifest, keyed
 * by section and question id. If the manifest is empty we fall back to the
 * references embedded directly in the answer value.
 */
export function documentsForQuestion(
  attachments: AttachmentReference[] | null | undefined,
  sectionId: string,
  questionId: string,
  answerValue: unknown,
): AttachmentReference[] {
  const fromManifest = (attachments ?? []).filter(
    (attachment) => attachment.section_id === sectionId && attachment.question_id === questionId,
  )
  if (fromManifest.length > 0) return fromManifest
  return asAttachmentReferences(answerValue)
}

export function isFileQuestion(question: QuestionDefinition): boolean {
  return question.inputType === 'file'
}

export function answerIsAnswered(value: unknown): boolean {
  return classifyAnswer(value) === 'answered'
}
