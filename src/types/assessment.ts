import type { AssessmentType } from './questionnaire'

export type WizardView = 'welcome' | 'wizard' | 'review' | 'success'

export type SaveStatus = 'saved' | 'saving' | 'error'

export type SectionValues = Record<string, any>

export type FormValues = Record<string, SectionValues>

export type AssessmentTypeOption = {
  type: AssessmentType
  label: string
  description: string
}
