import { DEFAULT_ASSESSMENT_TYPE, DRAFT_STORAGE_KEY } from '../constants/assessment'
import { DRAFT_ATTACHMENT_RESELECT } from './sectionSchema'
import type { AssessmentType } from '../types'

export type DraftState = Record<string, unknown>

function getDraftStorageKey(assessmentType: AssessmentType = DEFAULT_ASSESSMENT_TYPE) {
  return assessmentType === DEFAULT_ASSESSMENT_TYPE
    ? DRAFT_STORAGE_KEY
    : `${DRAFT_STORAGE_KEY}-${assessmentType}`
}

export function loadDraft(assessmentType: AssessmentType = DEFAULT_ASSESSMENT_TYPE): DraftState {
  if (typeof window === 'undefined') return {}

  try {
    const raw = window.localStorage.getItem(getDraftStorageKey(assessmentType))
    if (!raw) return {}
    return JSON.parse(raw) as DraftState
  } catch {
    return {}
  }
}

export function saveDraft(data: DraftState, assessmentType: AssessmentType = DEFAULT_ASSESSMENT_TYPE): void {
  if (typeof window === 'undefined') return

  try {
    const serialized = JSON.stringify(data, (_key, value: unknown) => {
      if (typeof File !== 'undefined' && value instanceof File) return DRAFT_ATTACHMENT_RESELECT
      return value
    })
    window.localStorage.setItem(getDraftStorageKey(assessmentType), serialized)
  } catch {
    // ignore local storage quota issues
  }
}

export function clearDraft(assessmentType: AssessmentType = DEFAULT_ASSESSMENT_TYPE): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(getDraftStorageKey(assessmentType))
}
