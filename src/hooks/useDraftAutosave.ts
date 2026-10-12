import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { AUTOSAVE_DELAY_MS } from '../constants/assessment'
import { saveDraft } from '../lib/draftStorage'
import type { AssessmentType, FormValues, SaveStatus } from '../types'

export function useDraftAutosave(
  form: UseFormReturn<FormValues>,
  assessmentType: AssessmentType,
  onStatusChange: (status: SaveStatus) => void,
) {
  useEffect(() => {
    let timeout: number | undefined
    const subscription = form.watch(() => {
      onStatusChange('saving')
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        saveDraft(form.getValues(), assessmentType)
        onStatusChange('saved')
      }, AUTOSAVE_DELAY_MS)
    })

    return () => {
      window.clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [assessmentType, form, onStatusChange])
}
