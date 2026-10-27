import type { AssessmentType } from '../types'

export const ASSESSMENT_SCHEMA_VERSION = 1

export const DEFAULT_ASSESSMENT_TYPE: AssessmentType = 'university'

export const DRAFT_STORAGE_KEY = 'water-assessment-draft-v1'

export const AUTOSAVE_DELAY_MS = 400

export const QUESTIONNAIRE_VERSIONS: Record<AssessmentType, string> = {
  university: 'university-1.1',
  industry: 'industrial-1.1',
  organization: 'organization-1.1',
  apartment: 'apartment-1.1',
}

export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024

export const ALLOWED_ATTACHMENT_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
] as const

export const ACCEPTED_ATTACHMENT_ATTRIBUTE = 'image/*,.jpg,.jpeg,.png,.webp,.pdf'
