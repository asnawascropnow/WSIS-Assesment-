import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import type { FormValues, Questionnaire } from '../../types'

type ReviewViewProps = {
  activeQuestionnaire: Questionnaire
  submitError: string
  isSubmitting: boolean
  onEditSection: (sectionId: string) => void
  onBackToForm: () => void
  onSubmit: () => void
}

export function ReviewView({
  activeQuestionnaire,
  submitError,
  isSubmitting,
  onEditSection,
  onBackToForm,
  onSubmit,
}: ReviewViewProps) {
  const form = useFormContext<FormValues>()

  return (
    <div className="review-page">
      <div className="review-card">
        <div className="review-header">
          <div>
            <p className="eyebrow">Final review</p>
            <h2>Review &amp; Submit Assessment</h2>
          </div>
          <div className="status-badge">
            <ShieldCheck size={16} />
            Draft Ready
          </div>
        </div>

        {activeQuestionnaire.sections.map((section) => {
          const values = form.getValues()[section.id] ?? {}
          const visibleEntries = Object.entries(values).filter(([, value]) => {
            if (typeof value === 'string') return value.trim().length > 0
            if (Array.isArray(value)) return value.length > 0
            if (value && typeof value === 'object') {
              return Object.values(value as Record<string, unknown>).some((inner) => String(inner).trim().length > 0)
            }
            return value !== undefined && value !== null && value !== ''
          })

          return (
            <div className="review-section" key={section.id}>
              <div className="review-section-head">
                <h3>{section.title}</h3>
                <button type="button" className="mini-button" onClick={() => onEditSection(section.id)}>
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
                      <dd>
                        {typeof value === 'object'
                          ? JSON.stringify(value, (_key, nestedValue: unknown) => (
                            typeof File !== 'undefined' && nestedValue instanceof File
                              ? nestedValue.name
                              : nestedValue
                          ))
                          : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )
        })}

        {submitError ? <p className="error-text">{submitError}</p> : null}

        <div className="nav-actions">
          <button type="button" className="secondary-button" onClick={onBackToForm} disabled={isSubmitting}>
            <ArrowLeft size={16} />
            Back to form
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={onSubmit}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Submitting…' : 'Submit Assessment'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
