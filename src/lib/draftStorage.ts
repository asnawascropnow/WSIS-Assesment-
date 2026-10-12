import { DEFAULT_ASSESSMENT_TYPE, DRAFT_STORAGE_KEY } from '../constants/assessment'
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
    window.localStorage.setItem(getDraftStorageKey(assessmentType), JSON.stringify(data))
  } catch {
    // ignore local storage quota issues
  }
}

export function clearDraft(assessmentType: AssessmentType = DEFAULT_ASSESSMENT_TYPE): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(getDraftStorageKey(assessmentType))
}
