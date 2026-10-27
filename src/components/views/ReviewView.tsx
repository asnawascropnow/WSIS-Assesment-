import { ArrowLeft, ArrowRight, FileText, ShieldCheck } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { DRAFT_ATTACHMENT_RESELECT, getTableCellKey, NOT_APPLICABLE_VALUES } from '../../lib/sectionSchema'
import type { FormValues, QuestionDefinition, Questionnaire, QuestionnaireSection, TableDefinition } from '../../types'
import type { SubmissionProgress } from '../../services/assessmentService'

type ReviewViewProps = {
  activeQuestionnaire: Questionnaire
  submitError: string
  isSubmitting: boolean
  submitProgress?: SubmissionProgress | null
  onEditSection: (sectionId: string) => void
  onBackToForm: () => void
  onSubmit: () => void
}

type AnswerState = 'answered' | 'not_applicable' | 'empty'

function classifyAnswer(value: unknown): AnswerState {
  if (value === undefined || value === null) return 'empty'
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return 'empty'
    return NOT_APPLICABLE_VALUES.has(trimmed.toLowerCase()) ? 'not_applicable' : 'answered'
  }
  if (Array.isArray(value)) return value.length > 0 ? 'answered' : 'empty'
  if (typeof value === 'object') return Object.keys(value).length > 0 ? 'answered' : 'empty'
  return 'answered'
}

function asText(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ReviewTable({ table, value }: { table: TableDefinition; value: unknown }) {
  const record = (value && typeof value === 'object' && !Array.isArray(value) ? value : {}) as Record<
    string,
    Record<string, unknown>
  >

  return (
    <div className="review-table-scroll">
      <table className="review-table">
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="row-label">
                {row.label}
              </th>
              {table.columns.slice(1).map((column, index) => {
                const cell = record[row.id]?.[getTableCellKey(table, index)]
                const text = asText(cell).trim()
                return (
                  <td key={`${row.id}-${column}`}>
                    {text ? text : <span className="review-muted">—</span>}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ReviewFiles({ value }: { value: unknown }) {
  if (classifyAnswer(value) === 'not_applicable') {
    return <span className="review-na">Not applicable — no file attached.</span>
  }

  const items = Array.isArray(value) ? value : []
  const files = items.filter((item): item is File => typeof File !== 'undefined' && item instanceof File)
  const needsReselection = items.includes(DRAFT_ATTACHMENT_RESELECT)

  if (files.length === 0) {
    if (needsReselection) {
      return (
        <span className="review-note">
          Files are not kept in saved drafts. Select them again before submitting.
        </span>
      )
    }
    return <span className="review-muted">No files attached yet.</span>
  }

  return (
    <ul className="review-file-list">
      {files.map((file) => (
        <li key={`${file.name}-${file.lastModified}`}>
          <FileText size={15} aria-hidden />
          <span className="review-file-name">{file.name}</span>
          {formatBytes(file.size) ? <span className="review-file-size">{formatBytes(file.size)}</span> : null}
        </li>
      ))}
      {needsReselection ? (
        <li className="review-file-note">Some earlier files were not kept in the saved draft — select them again.</li>
      ) : null}
    </ul>
  )
}

function ReviewAnswer({ question, value }: { question: QuestionDefinition; value: unknown }) {
  const state = classifyAnswer(value)

  if (question.inputType === 'file') {
    return <ReviewFiles value={value} />
  }

  if (state === 'empty') return <span className="review-muted">Not answered</span>
  if (state === 'not_applicable') return <span className="review-na">Not applicable</span>

  if (question.inputType === 'table') {
    if (!question.tableDefinition) return <span>{asText(value)}</span>
    return <ReviewTable table={question.tableDefinition} value={value} />
  }

  const text = asText(value)
  const linkTarget = text.replace(/\s+/g, '')

  if (question.inputType === 'url') {
    return (
      <a href={text} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    )
  }
  if (question.inputType === 'email') {
    return <a href={`mailto:${text}`}>{text}</a>
  }
  if (question.inputType === 'tel') {
    return <a href={`tel:${linkTarget}`}>{text}</a>
  }

  return <span className={question.inputType === 'textarea' ? 'review-text' : undefined}>{text}</span>
}

function ReviewSection({
  section,
  values,
  onEditSection,
}: {
  section: QuestionnaireSection
  values: Record<string, unknown>
  onEditSection: (sectionId: string) => void
}) {
  const answeredCount = section.questions.filter(
    (question) => classifyAnswer(values[question.id]) !== 'empty',
  ).length

  return (
    <div className="review-section">
      <div className="review-section-head">
        <h3>{section.title}</h3>
        <div className="review-section-tools">
          <span className="review-count">
            {answeredCount}/{section.questions.length} answered
          </span>
          <button type="button" className="mini-button" onClick={() => onEditSection(section.id)}>
            Edit section
          </button>
        </div>
      </div>
      <dl>
        {section.questions.map((question) => (
          <div key={question.id} className="review-row">
            <dt>{question.question}</dt>
            <dd>
              <ReviewAnswer question={question} value={values[question.id]} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function ReviewView({
  activeQuestionnaire,
  submitError,
  isSubmitting,
  submitProgress,
  onEditSection,
  onBackToForm,
  onSubmit,
}: ReviewViewProps) {
  const form = useFormContext<FormValues>()
  const allValues = form.getValues()

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

        {activeQuestionnaire.sections.map((section) => (
          <ReviewSection
            key={section.id}
            section={section}
            values={(allValues[section.id] ?? {}) as Record<string, unknown>}
            onEditSection={onEditSection}
          />
        ))}

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
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
