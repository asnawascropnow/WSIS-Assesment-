const DRAFT_STORAGE_KEY = 'water-assessment-draft-v1'

export type DraftState = Record<string, unknown>

export function loadDraft(): DraftState {
  if (typeof window === 'undefined') return {}

  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as DraftState
  } catch {
    return {}
  }
}

export function saveDraft(data: DraftState): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore local storage quota issues
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(DRAFT_STORAGE_KEY)
}
