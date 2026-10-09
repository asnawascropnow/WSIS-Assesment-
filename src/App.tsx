import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  CircleDashed,
  Save,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { questionnaire, type QuestionDefinition, type QuestionnaireSection } from './data/waterAssessmentQuestionnaire'
import { clearDraft, loadDraft, saveDraft } from './lib/draftService'
import { submitAssessment } from './services/assessmentService'

type SectionValues = Record<string, any>

type FormValues = Record<string, any>

const defaultSectionValues = Object.fromEntries(
  questionnaire.sections.map((section) => [section.id, {}]),
) as Record<string, SectionValues>

const makeSectionSchema = (sectionId: string) => {
  const general: Record<string, z.ZodTypeAny> = {
    institution_name: z.string().optional(),
    campus_address: z.string().optional(),
    google_maps_url: z.string().url().optional().or(z.literal('')),
    primary_contact_person: z.string().optional(),
    official_email_address: z.string().email().optional().or(z.literal('')),
    mobile_numbers: z.string().optional(),
    type_of_institution: z.string().optional(),
    total_campus_area_acres: z.coerce.number().nonnegative().optional(),
    buildings_and_rooftop_area: z.string().optional(),
  }

  const population: Record<string, z.ZodTypeAny> = {
    day_scholars_count: z.coerce.number().nonnegative().optional(),
    residential_students_count: z.coerce.number().nonnegative().optional(),
    girls_hostel_occupants: z.coerce.number().nonnegative().optional(),
    boys_hostel_occupants: z.coerce.number().nonnegative().optional(),
    teaching_staff_count: z.coerce.number().nonnegative().optional(),
    non_teaching_staff_count: z.coerce.number().nonnegative().optional(),
    population_summary_table: z.record(z.string(), z.any()).optional(),
  }

  const supply: Record<string, z.ZodTypeAny> = {
    water_sources: z.string().optional(),
    daily_quantity_by_source: z.record(z.string(), z.any()).optional(),
    water_source_costs: z.string().optional(),
    water_consumption_summary: z.record(z.string(), z.any()).optional(),
    ro_plant_details: z.string().optional(),
  }

  const sanitation: Record<string, z.ZodTypeAny> = {
    stp_count: z.coerce.number().nonnegative().optional(),
    stp_type: z.string().optional(),
    stp_capacity: z.coerce.number().nonnegative().optional(),
    monthly_stp_operating_cost: z.string().optional(),
    public_toilets_count: z.string().optional(),
    typical_toilet_and_wash_basin_photos: z.any().optional(),
    treated_water_application: z.string().optional(),
  }

  const cafeteria: Record<string, z.ZodTypeAny> = {
    cafeteria_usage: z.string().optional(),
  }

  const findings: Record<string, z.ZodTypeAny> = {
    ground_research_summary: z.string().optional(),
    used_water_storage_and_reuse: z.record(z.string(), z.any()).optional(),
    stp_units_verified: z.record(z.string(), z.any()).optional(),
    rainwater_harvesting: z.string().optional(),
    key_observations: z.string().optional(),
  }

  const conclusion: Record<string, z.ZodTypeAny> = {
    conclusion_text: z.string().optional(),
  }

  const disclaimer: Record<string, z.ZodTypeAny> = {
    disclaimer_note: z.string().optional(),
  }

  const annexure: Record<string, z.ZodTypeAny> = {
    annexure_caption: z.any().optional(),
  }

  const schemas: Record<string, z.ZodTypeAny> = {
    general_information: z.object(general).passthrough(),
    student_staff_population: z.object(population).passthrough(),
    water_supply: z.object(supply).passthrough(),
    sanitation_wastewater: z.object(sanitation).passthrough(),
    cafeteria: z.object(cafeteria).passthrough(),
    ground_research_findings: z.object(findings).passthrough(),
    conclusion: z.object(conclusion).passthrough(),
    disclaimer: z.object(disclaimer).passthrough(),
    annexure_site_photographs: z.object(annexure).passthrough(),
  }

  return schemas[sectionId] ?? z.object({}).passthrough()
}

function App() {
  const savedDraft = loadDraft() as FormValues
  const form = useForm<FormValues>({
    defaultValues: { ...defaultSectionValues, ...savedDraft },
    mode: 'onBlur',
  })

  const [view, setView] = useState<'welcome' | 'wizard' | 'review' | 'success'>('welcome')
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<number>>(() => new Set())
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [submitError, setSubmitError] = useState('')
  const backgroundVideoRef = useRef<HTMLVideoElement>(null)

  const currentSection = questionnaire.sections[currentSectionIndex]

  const renderBackgroundVideo = (src = '/ocean-background.mp4') => (
    <div className="ocean-atmosphere" aria-hidden="true">
      <video
        ref={backgroundVideoRef}
        className="ocean-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={(event) => console.error('Ocean background video failed to load.', event.currentTarget.error)}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )

  useEffect(() => {
    const video = backgroundVideoRef.current
    if (!video) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPlayback = () => {
      if (motionPreference.matches) {
        video.pause()
        return
      }

      video.playbackRate = 0.55
      void video.play().catch((error: unknown) => {
        console.error('Unable to autoplay the ocean background video.', error)
      })
    }

    syncPlayback()
    motionPreference.addEventListener('change', syncPlayback)
    return () => motionPreference.removeEventListener('change', syncPlayback)
  }, [view])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const values = form.getValues()
      saveDraft(values)
      setSaveStatus('saved')
    }, 400)

    return () => window.clearTimeout(timeout)
  }, [form.watch('general_information'), form.watch('student_staff_population'), form.watch('water_supply'), form.watch('sanitation_wastewater'), form.watch('cafeteria'), form.watch('ground_research_findings'), form.watch('conclusion'), form.watch('disclaimer'), form.watch('annexure_site_photographs')])

  const completionSummary = useMemo(() => {
    const totalSections = questionnaire.sections.length
    return { totalSections, completed: completedSections.size }
  }, [completedSections])

  const validateCurrentSection = () => {
    const sectionValues = form.getValues()[currentSection.id] ?? {}
    const schema = makeSectionSchema(currentSection.id)
    const parsed = schema.safeParse(sectionValues)

    if (!parsed.success) {
      form.clearErrors()
      parsed.error.issues.forEach((issue) => {
        const fieldPath = issue.path.length ? `${currentSection.id}.${issue.path.join('.')}` : currentSection.id
        form.setError(fieldPath as never, {
          type: 'manual',
          message: issue.message,
        })
      })
      const firstError = parsed.error.issues[0]?.path[0]
      if (firstError) {
        const inputId = `${currentSection.id}.${String(firstError)}`
        const input = document.getElementById(inputId) as HTMLElement | null
        if (input) input.focus()
      }
      return false
    }

    form.clearErrors()
    return true
  }

  const saveCurrentDraft = () => {
    setSaveStatus('saving')
    saveDraft(form.getValues())
    setSaveStatus('saved')
  }

  const handleNext = () => {
    if (!validateCurrentSection()) return
    if (currentSectionIndex < questionnaire.sections.length - 1) {
      saveCurrentDraft()
      setCompletedSections((sections) => new Set(sections).add(currentSectionIndex))
      setCurrentSectionIndex((index) => index + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setCompletedSections((sections) => new Set(sections).add(currentSectionIndex))
      setView('review')
    }
  }

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((index) => index - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setSubmitError('')
    const values = form.getValues()
    const result = await submitAssessment({
      schemaVersion: 1,
      status: 'submitted',
      institutionName: String((values.general_information as Record<string, unknown>)?.institution_name ?? ''),
      questionnaireVersion: '1.0',
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
      return
    }

    clearDraft()
    setView('success')
  }

  const renderTableQuestion = (section: QuestionnaireSection, question: QuestionDefinition) => {
    const table = question.tableDefinition
    if (!table) return null

    const tableValue = (form.watch(`${section.id}.${question.id}`) ?? {}) as Record<string, Record<string, string>>

    return (
      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {table.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.id}>
                  <td className="row-label">{row.label}</td>
                  {table.columns.slice(1).map((column, index) => {
                    const cellKey = index === 0 ? 'count' : 'basis'
                    const currentValue = tableValue[row.id]?.[cellKey] ?? ''
                    const isBasisCell = table.columns.length > 2 && index === 1

                    if (isBasisCell && table.basisOptions) {
                      return (
                        <td key={`${row.id}-${column}`}>
                          <select
                            id={`${section.id}.${question.id}.${row.id}.${cellKey}`}
                            value={currentValue}
                            onChange={(event) => {
                              const nextValue = { ...(tableValue[row.id] ?? {}), [cellKey]: event.target.value }
                              form.setValue(`${section.id}.${question.id}.${row.id}` as any, nextValue as any)
                            }}
                          >
                            <option value="">Select</option>
                            {table.basisOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                      )
                    }

                    return (
                      <td key={`${row.id}-${column}`}>
                        <input
                          id={`${section.id}.${question.id}.${row.id}.${cellKey}`}
                          type="text"
                          value={currentValue}
                          onChange={(event) => {
                            const nextValue = { ...(tableValue[row.id] ?? {}), [cellKey]: event.target.value }
                            form.setValue(`${section.id}.${question.id}.${row.id}` as any, nextValue as any)
                          }}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderQuestionInput = (section: QuestionnaireSection, question: QuestionDefinition) => {
    const fieldPath = `${section.id}.${question.id}`
    if (question.inputType === 'table') return renderTableQuestion(section, question)

    const fieldValue = String(form.watch(fieldPath as any) ?? '')

    const baseInputClass = 'input-field'

    switch (question.inputType) {
      case 'textarea':
        return (
          <textarea
            id={fieldPath}
            className={baseInputClass}
            placeholder={question.placeholder}
            value={fieldValue}
            onChange={(event) => form.setValue(fieldPath as any, event.target.value as any)}
            rows={5}
          />
        )
      case 'number':
        return (
          <input
            id={fieldPath}
            type="number"
            className={baseInputClass}
            placeholder={question.placeholder}
            value={fieldValue}
            onChange={(event) => form.setValue(fieldPath as any, event.target.value as any)}
          />
        )
      case 'email':
        return (
          <input
            id={fieldPath}
            type="email"
            className={baseInputClass}
            placeholder={question.placeholder}
            value={fieldValue}
            onChange={(event) => form.setValue(fieldPath as any, event.target.value as any)}
          />
        )
      case 'url':
        return (
          <input
            id={fieldPath}
            type="url"
            className={baseInputClass}
            placeholder={question.placeholder}
            value={fieldValue}
            onChange={(event) => form.setValue(fieldPath as any, event.target.value as any)}
          />
        )
      case 'tel':
        return (
          <input
            id={fieldPath}
            type="tel"
            className={baseInputClass}
            placeholder={question.placeholder}
            value={fieldValue}
            onChange={(event) => form.setValue(fieldPath as any, event.target.value as any)}
          />
        )
      case 'file':
        return (
          <div className="upload-box">
            <input
              id={fieldPath}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? [])
                form.setValue(fieldPath as any, files as any)
              }}
            />
            <div className="upload-meta">
              <UploadCloud size={18} />
              <span>Attach photographs and captions.</span>
            </div>
          </div>
        )
      default:
        return (
          <input
            id={fieldPath}
            type="text"
            className={baseInputClass}
            placeholder={question.placeholder}
            value={fieldValue}
            onChange={(event) => form.setValue(fieldPath as any, event.target.value as any)}
          />
        )
    }
  }

  const renderQuestionCard = (section: QuestionnaireSection, question: QuestionDefinition) => (
    <div className="question-card" key={question.id}>
      <label className="question-label" htmlFor={`${section.id}.${question.id}`}>
        {question.question}
      </label>
      <div className="example-box">
        <span className="example-label">Example from the assessment template</span>
        <p>{question.example}</p>
      </div>
      {renderQuestionInput(section, question)}
      {(form.formState.errors as Record<string, any>)?.[section.id]?.[question.id]?.message ? (
        <p className="error-text">{(form.formState.errors as Record<string, any>)[section.id][question.id].message}</p>
      ) : null}
    </div>
  )

  const renderWizard = () => (
    <div className="app-shell">
      {renderBackgroundVideo()}
      <aside className="sidebar">
        <div className="brand-box">
          <img className="brand-logo" src="/akashbhumi-logo.png" alt="Akash Bhumi" />
        </div>

        <div className="progress-panel">
          <div className="progress-head">
            <span>Progress</span>
            <strong>
              {completionSummary.completed}/{completionSummary.totalSections}
            </strong>
          </div>
          <div className="progress-bar">
            <span style={{ width: `${(completionSummary.completed / completionSummary.totalSections) * 100}%` }} />
          </div>
        </div>

        <nav
          aria-label="Questionnaire sections"
          className="section-nav"
          style={{
            '--step-progress': `${(currentSectionIndex / Math.max(questionnaire.sections.length - 1, 1)) * 100}%`,
          } as CSSProperties}
        >
          {questionnaire.sections.map((section, index) => {
            const isActive = index === currentSectionIndex
            const isDone = completedSections.has(index)
            return (
              <button
                key={section.id}
                type="button"
                className={`section-link ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => setCurrentSectionIndex(index)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${section.title}${isDone ? ', completed' : isActive ? ', current step' : ''}`}
              >
                <span className="step-marker" aria-hidden="true">
                  {isDone ? <CheckCircle2 size={19} /> : isActive ? index + 1 : <Circle size={19} />}
                </span>
                <span>{section.title}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Assessment form</p>
            <h2>{currentSection.title}</h2>
          </div>
          <div className="save-indicator">
            {saveStatus === 'saving' ? <CircleDashed size={16} /> : <CheckCircle2 size={16} />}
            <span>{saveStatus === 'saving' ? 'Saving progress…' : 'Saved locally'}</span>
          </div>
        </header>

        {currentSection.introduction ? <p className="section-intro">{currentSection.introduction}</p> : null}

        <div className="questions-stack">
          {currentSection.questions.map((question) => renderQuestionCard(currentSection, question))}
        </div>

        <div className="nav-actions">
          <button type="button" className="secondary-button" onClick={handlePrevious} disabled={currentSectionIndex === 0}>
            <ArrowLeft size={16} />
            Previous
          </button>
          <button type="button" className="ghost-button" onClick={saveCurrentDraft}>
            <Save size={16} />
            Save Progress
          </button>
          <button type="button" className="primary-button" onClick={handleNext}>
            {currentSectionIndex === questionnaire.sections.length - 1 ? 'Review & Submit' : 'Next'}
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  )

  const renderReview = () => (
    <div className="review-page">
      <div className="review-card">
        <div className="review-header">
          <div>
            <p className="eyebrow">Final review</p>
            <h2>Review & Submit Assessment</h2>
          </div>
          <div className="status-badge">
            <ShieldCheck size={16} />
            Draft Ready
          </div>
        </div>

        {questionnaire.sections.map((section) => {
          const values = form.getValues()[section.id] ?? {}
          const visibleEntries = Object.entries(values).filter(([, value]) => {
            if (typeof value === 'string') return value.trim().length > 0
            if (Array.isArray(value)) return value.length > 0
            if (value && typeof value === 'object') return Object.values(value as Record<string, unknown>).some((inner) => String(inner).trim().length > 0)
            return value !== undefined && value !== null && value !== ''
          })

          return (
            <div className="review-section" key={section.id}>
              <div className="review-section-head">
                <h3>{section.title}</h3>
                <button type="button" className="mini-button" onClick={() => setCurrentSectionIndex(questionnaire.sections.findIndex((item) => item.id === section.id))}>
                  Edit section
                </button>
              </div>
              {visibleEntries.length === 0 ? (
                <p className="empty-state">No answers recorded for this section yet.</p>
              ) : (
                <dl>
                  {visibleEntries.map(([key, value]) => (
                    <div key={key} className="review-row">
                      <dt>{key.replace(/_/g, ' ')}</dt>
                      <dd>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )
        })}

        {submitError ? <p className="error-text">{submitError}</p> : null}

        <div className="nav-actions">
          <button type="button" className="secondary-button" onClick={() => setView('wizard')}>
            <ArrowLeft size={16} />
            Back to form
          </button>
          <button type="button" className="primary-button" onClick={handleSubmit}>
            Submit Assessment
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderWelcome = () => (
    <section className="welcome-screen">
      {renderBackgroundVideo('/welcome-background.mp4')}
      <div className="welcome-card">
        <div className="welcome-badge initiative-badge">
          <img className="initiative-logo" src="/akashbhumi-logo.png" alt="Akash Bhumi" />
          NET ZERO INITIATIVE
        </div>
        <h1>{questionnaire.title}</h1>
        <p className="welcome-subtitle">{questionnaire.subtitle}</p>
        <p className="welcome-copy">
          This structured assessment captures campus water sourcing, demand, treatment, wastewater reuse, rainwater harvesting, and field observations for institutional sustainability planning and reporting.
        </p>
        <div className="welcome-flow">
          <span>Welcome</span>
          <span className="flow-arrow">→</span>
          <span>Sections 1–5</span>
          <span className="flow-arrow">→</span>
          <span>Review</span>
          <span className="flow-arrow">→</span>
          <span>Submit</span>
        </div>
        <button type="button" className="primary-button large-button" onClick={() => setView('wizard')}>
          Start Assessment
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )

  const renderSuccess = () => (
    <section className="welcome-screen">
      {renderBackgroundVideo()}
      <div className="welcome-card success-card">
        <div className="welcome-badge success-badge">
          <CheckCircle2 size={18} />
          Assessment submitted
        </div>
        <h1>Submission confirmed</h1>
        <p className="welcome-copy">
          Your assessment has been accepted and stored in the configured Firebase-backed workflow. You can continue working from the locally saved draft or create a fresh assessment for a new campus.
        </p>
        <button type="button" className="primary-button large-button" onClick={() => {
          clearDraft()
          form.reset(defaultSectionValues)
          setCompletedSections(new Set())
          setView('welcome')
        }}>
          Start a new assessment
        </button>
      </div>
    </section>
  )

  if (view === 'welcome') return renderWelcome()
  if (view === 'review') return renderReview()
  if (view === 'success') return renderSuccess()
  return <FormProvider {...form}>{renderWizard()}</FormProvider>
}

export default App
