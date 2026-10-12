import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ASSESSMENT_SCHEMA_VERSION,
  DEFAULT_ASSESSMENT_TYPE,
  QUESTIONNAIRE_VERSIONS,
} from '../constants/assessment'
import { questionnairesByType } from '../data/questionnaires'
import { clearDraft, loadDraft, saveDraft } from '../lib/draftStorage'
import { createDefaultSectionValues, validateQuestionnaireSection } from '../lib/sectionSchema'
import { submitAssessment } from '../services/assessmentService'
import type { AssessmentType, FormValues, SaveStatus, WizardView } from '../types'
import { useDraftAutosave } from './useDraftAutosave'

export function useAssessmentWizard() {
  const [assessmentType, setAssessmentType] = useState<AssessmentType>(DEFAULT_ASSESSMENT_TYPE)
  const activeQuestionnaire = questionnairesByType[assessmentType]
  const defaultSectionValues = createDefaultSectionValues(activeQuestionnaire.sections)
  const savedDraft = loadDraft(assessmentType) as FormValues
  const form = useForm<FormValues>({
    defaultValues: { ...defaultSectionValues, ...savedDraft },
    mode: 'onBlur',
  })

  const [view, setView] = useState<WizardView>('welcome')
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<number>>(() => new Set())
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const mainPanelRef = useRef<HTMLElement>(null)
  const currentSection = activeQuestionnaire.sections[currentSectionIndex]

  useDraftAutosave(form, assessmentType, setSaveStatus)

  const completionSummary = useMemo(() => {
    const totalSections = activeQuestionnaire.sections.length
    return { totalSections, completed: completedSections.size }
  }, [activeQuestionnaire.sections.length, completedSections])

  const scrollFormToTop = () => {
    mainPanelRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const validateCurrentSection = () => {
    const sectionValues = form.getValues()[currentSection.id] ?? {}
    const validationError = validateQuestionnaireSection(currentSection, sectionValues)

    if (validationError) {
      form.clearErrors()
      const fieldPath = `${currentSection.id}.${validationError.questionId}`
      form.setError(fieldPath as never, {
        type: 'manual',
        message: validationError.message,
      })
      const input = document.getElementById(fieldPath) as HTMLElement | null
      if (input) input.focus()
      return false
    }

    form.clearErrors()
    return true
  }

  const validateAllSections = () => {
    form.clearErrors()
    for (const [sectionIndex, section] of activeQuestionnaire.sections.entries()) {
      const sectionValues = form.getValues()[section.id] ?? {}
      const validationError = validateQuestionnaireSection(section, sectionValues)

      if (validationError) {
        form.setError(`${section.id}.${validationError.questionId}` as never, {
          type: 'manual',
          message: validationError.message,
        })
        setCurrentSectionIndex(sectionIndex)
        setView('wizard')
        setSubmitError(`Complete the required answer in “${section.title}” before submitting.`)
        scrollFormToTop()
        return false
      }
    }
    return true
  }

  const saveCurrentDraft = () => {
    setSaveStatus('saving')
    saveDraft(form.getValues(), assessmentType)
    setSaveStatus('saved')
  }

  const startAssessment = (type: AssessmentType) => {
    const selectedQuestionnaire = questionnairesByType[type]
    const defaults = createDefaultSectionValues(selectedQuestionnaire.sections)
    const draft = loadDraft(type) as FormValues
    form.reset({ ...defaults, ...draft })
    setAssessmentType(type)
    setCurrentSectionIndex(0)
    setCompletedSections(new Set())
    setSubmitError('')
    setView('wizard')
  }

  const handleNext = () => {
    if (!validateCurrentSection()) return
    if (currentSectionIndex < activeQuestionnaire.sections.length - 1) {
      saveCurrentDraft()
      setCompletedSections((sections) => new Set(sections).add(currentSectionIndex))
      setCurrentSectionIndex((index) => index + 1)
      scrollFormToTop()
    } else {
      if (!validateAllSections()) return
      setCompletedSections((sections) => new Set(sections).add(currentSectionIndex))
      setView('review')
    }
  }

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((index) => index - 1)
      scrollFormToTop()
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setSubmitError('')
    if (!validateAllSections()) return
    setIsSubmitting(true)
    const values = form.getValues()
    const institutionName = String(
      (values.general_information as Record<string, unknown> | undefined)?.institution_name ??
        (values.industry_general_information as Record<string, unknown> | undefined)?.organisation_name ??
        (values.organization_general_information as Record<string, unknown> | undefined)?.organization_name ??
        '',
    )
    const result = await submitAssessment({
      schemaVersion: ASSESSMENT_SCHEMA_VERSION,
      assessmentType,
      status: 'submitted',
      institutionName,
      questionnaireVersion: QUESTIONNAIRE_VERSIONS[assessmentType],
      answers: values,
      metadata: {
        createdBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
      },
      attachments: [],
    })

    if (!result.ok) {
      setSubmitError(result.error ?? 'Submission failed. Please retry.')
      setIsSubmitting(false)
      return
    }

    clearDraft(assessmentType)
    setIsSubmitting(false)
    setView('success')
  }

  const resetAssessment = () => {
    clearDraft(assessmentType)
    form.reset(createDefaultSectionValues(activeQuestionnaire.sections))
    setCompletedSections(new Set())
    setView('welcome')
  }

  const backToHomepage = () => {
    saveCurrentDraft()
    setView('welcome')
  }

  const editSection = (sectionId: string) => {
    setCurrentSectionIndex(activeQuestionnaire.sections.findIndex((item) => item.id === sectionId))
    setView('wizard')
    scrollFormToTop()
  }

  const backToForm = () => setView('wizard')

  const selectSection = (index: number) => {
    setCurrentSectionIndex(index)
    scrollFormToTop()
  }

  return {
    activeQuestionnaire,
    currentSection,
    currentSectionIndex,
    completedSections,
    completionSummary,
    saveStatus,
    submitError,
    isSubmitting,
    view,
    form,
    mainPanelRef,
    saveCurrentDraft,
    startAssessment,
    handleNext,
    handlePrevious,
    handleSubmit,
    resetAssessment,
    backToHomepage,
    editSection,
    backToForm,
    selectSection,
  }
}

export type AssessmentWizardController = ReturnType<typeof useAssessmentWizard>
