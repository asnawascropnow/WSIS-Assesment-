const UNIVERSITY_DRAFT_KEY = 'water-assessment-draft-v1'

type AssessmentType = 'university' | 'industry' | 'organization'

function getDraftStorageKey(assessmentType: AssessmentType = 'university') {
  return assessmentType === 'university'
    ? UNIVERSITY_DRAFT_KEY
    : `${UNIVERSITY_DRAFT_KEY}-${assessmentType}`
}

export type DraftState = Record<string, unknown>

export function loadDraft(assessmentType: AssessmentType = 'university'): DraftState {
  if (typeof window === 'undefined') return {}

  try {
    const raw = window.localStorage.getItem(getDraftStorageKey(assessmentType))
    if (!raw) return {}
    return JSON.parse(raw) as DraftState
  } catch {
    return {}
  }
}

export function saveDraft(data: DraftState, assessmentType: AssessmentType = 'university'): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(getDraftStorageKey(assessmentType), JSON.stringify(data))
  } catch {
    // ignore local storage quota issues
  }
}

export function clearDraft(assessmentType: AssessmentType = 'university'): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(getDraftStorageKey(assessmentType))
}
