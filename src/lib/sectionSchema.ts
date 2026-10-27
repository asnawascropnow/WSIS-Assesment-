import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENT_SIZE_BYTES,
} from '../constants/assessment.js'
import type { AssessmentType, QuestionDefinition, QuestionnaireSection, TableDefinition } from '../types/index.js'
import type { SectionValues } from '../types/index.js'

export const NOT_APPLICABLE_VALUES = new Set(['-', 'none', 'nil'])
export const DRAFT_ATTACHMENT_RESELECT = '__attachment_requires_reselection__'

export function isValidPhoneNumber(value: string): boolean {
  const segments = value.split('/').map((segment) => segment.trim()).filter(Boolean)
  if (segments.length === 0) return false
  return segments.every((segment) => {
    if (!/^\+?[0-9()\-\s]+$/.test(segment)) return false
    const digits = segment.replace(/\D/g, '')
    return digits.length >= 7 && digits.length <= 15
  })
}

type ValidationError = {
  questionId: string
  message: string
}

function isAnswered(value: unknown): boolean {
  if (typeof value !== 'string') return value !== undefined && value !== null
  const normalized = value.trim()
  return normalized.length > 0 || NOT_APPLICABLE_VALUES.has(normalized.toLowerCase())
}

export function getTableCellKey(table: TableDefinition, index: number): string {
  if (table.basisOptions && index === 1) return 'basis'
  if (table.columns.length === 3) return index === 0 ? 'value' : 'details'
  if (table.columns.length === 2) return 'value'
  return `column_${index}`
}

function validateQuestion(
  question: QuestionDefinition,
  value: unknown,
  assessmentType?: AssessmentType,
): string | undefined {
  if (question.inputType === 'file') {
    if (typeof value === 'string' && NOT_APPLICABLE_VALUES.has(value.trim().toLowerCase())) return
    if (!Array.isArray(value) || value.length === 0) {
      return 'Attach at least one file, or enter - / none / nil if no file applies.'
    }
    if (value.some((file) => !(typeof File !== 'undefined' && file instanceof File))) {
      return 'Previously selected files must be selected again before submitting.'
    }
    const allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'pdf']
    if (value.some((file: File) => {
      const name = (file.name || '').toLowerCase()
      const extMatch = name.match(/\.([a-z0-9]+)$/i)
      const ext = extMatch ? extMatch[1] : name.split('.').pop() || ''
      const mimeOk = ALLOWED_ATTACHMENT_TYPES.includes(file.type as (typeof ALLOWED_ATTACHMENT_TYPES)[number]) || file.type === 'image/jpg' || (file.type || '').startsWith('image/')
      const extOk = allowedExt.includes(ext)
      return !mimeOk && !extOk
    })) {
      return 'Use JPG, PNG, WebP, or PDF files only.'
    }
    if (value.some((file: File) => file.size > MAX_ATTACHMENT_SIZE_BYTES)) {
      return 'Each file must be 10 MB or smaller.'
    }
    return
  }

  if (question.inputType === 'table') {
    const table = question.tableDefinition
    if (!table) return 'This table is not configured.'
    const tableValue = value && typeof value === 'object'
      ? value as Record<string, Record<string, unknown>>
      : {}
    for (const row of table.rows) {
      for (const [index] of table.columns.slice(1).entries()) {
        const cellValue = tableValue[row.id]?.[getTableCellKey(table, index)]
        if (!isAnswered(cellValue)) {
          return 'Complete every table cell. Enter - / none / nil where a value is unavailable or does not apply.'
        }
      }
    }
    return
  }

  if (!isAnswered(value)) {
    return 'This answer is required. Enter - / none / nil if it does not apply or is unavailable.'
  }

  if (typeof value !== 'string' || NOT_APPLICABLE_VALUES.has(value.trim().toLowerCase())) return
  const normalized = value.trim()

  // Format checks are limited to the Google Maps URL and contact number for
  // every category, and the email address for every category except
  // university. Every other answer (including numeric inputs) accepts any
  // combination of characters.
  if (assessmentType !== 'university' && question.inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return 'Enter a valid email address, or use - / none / nil.'
  }
  if (question.inputType === 'url') {
    try {
      new URL(normalized)
    } catch {
      return 'Enter a valid URL, or use - / none / nil.'
    }
  }
  if (question.inputType === 'tel' && !isValidPhoneNumber(normalized)) {
    return 'Enter a valid phone number (7-15 digits, +, -, spaces, parentheses allowed), or use - / none / nil.'
  }
}

export function validateQuestionnaireSection(
  section: QuestionnaireSection,
  values: SectionValues,
  assessmentType?: AssessmentType,
): ValidationError | undefined {
  for (const question of section.questions) {
    const message = validateQuestion(question, values[question.id], assessmentType)
    if (message) return { questionId: question.id, message }
  }
}

export function createDefaultSectionValues(
  sections: QuestionnaireSection[],
): Record<string, SectionValues> {
  return Object.fromEntries(sections.map((section) => [section.id, {}])) as Record<string, SectionValues>
}
