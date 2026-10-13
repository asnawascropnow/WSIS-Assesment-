import type { AssessmentType, ReviewStatus } from './types'

export const ASSESSMENT_TYPE_LABEL: Record<AssessmentType, string> = {
  university: 'University',
  industry: 'Industries',
  organization: 'Organization / Company',
  apartment: 'Apartment / Vilas',
}

export const ASSESSMENT_TYPES: AssessmentType[] = ['university', 'industry', 'organization', 'apartment']

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  needs_correction: 'Needs Correction',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const REVIEW_STATUSES: ReviewStatus[] = [
  'submitted',
  'under_review',
  'needs_correction',
  'approved',
  'rejected',
]

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function shortId(id: string | null | undefined): string {
  if (!id) return '—'
  return id.length > 12 ? `${id.slice(0, 8)}…${id.slice(-3)}` : id
}

export function humanizeAction(action: string): string {
  return action
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}
