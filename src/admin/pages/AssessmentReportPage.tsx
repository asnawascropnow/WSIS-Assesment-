import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileSpreadsheet, Package, PencilLine, Printer } from 'lucide-react'
import { questionnairesByType } from '../../data/questionnaires'
import type { AssessmentType } from '../../types'
import { useAdminAuth } from '../auth/useAdminAuth'
import { useAdminQuery } from '../lib/useAdminQuery'
import { adminApi } from '../lib/api'
import { downloadAssessmentWorkbook } from '../lib/exports/excel'
import { downloadAssessmentDocumentsZip, type ZipExportSummary } from '../lib/exports/zip'
import { documentsForQuestion, getAnswer } from '../lib/answers'
import { ASSESSMENT_TYPE_LABEL, REVIEW_STATUSES, REVIEW_STATUS_LABEL, formatDateTime } from '../lib/format'
import { roleCan } from '../lib/permissions'
import { AnswerValue } from '../components/AnswerValue'
import { ErrorState, LoadingPanel, Modal, ReviewStatusBadge } from '../components/ui'
import type { AssessmentRow, DocumentIndexRow, Paginated, ReviewStatus } from '../lib/types'

const ASSESSMENT_TYPES = new Set<AssessmentType>(['university', 'industry', 'organization', 'apartment'])

export function AssessmentReportPage() {
  const { type: rawType, id } = useParams<{ type: string; id: string }>()
  const navigate = useNavigate()
  const { identity } = useAdminAuth()

  const type = rawType && ASSESSMENT_TYPES.has(rawType as AssessmentType) ? (rawType as AssessmentType) : null

  const assessmentQuery = useAdminQuery<{ assessment: AssessmentRow; assessmentType: AssessmentType }>(
    'assessment',
    { type: type ?? '', id: id ?? '' },
    { enabled: Boolean(type && id) },
  )
  const documentsQuery = useAdminQuery<Paginated<DocumentIndexRow>>(
    'documents',
    { assessmentId: id ?? '', pageSize: 100 },
    { enabled: Boolean(id) },
  )

  const [exporting, setExporting] = useState(false)
  const [zipping, setZipping] = useState(false)
  const [zipProgress, setZipProgress] = useState<{ done: number; total: number } | null>(null)
  const [actionError, setActionError] = useState('')
  const [actionNotice, setActionNotice] = useState('')

  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('submitted')
  const [reviewNotes, setReviewNotes] = useState('')
  const [savingReview, setSavingReview] = useState(false)

  const verificationByPath = useMemo(() => {
    const map = new Map<string, DocumentIndexRow>()
    for (const row of documentsQuery.data?.rows ?? []) {
      if (row.storage_path) map.set(row.storage_path, row)
    }
    return map
  }, [documentsQuery.data])

  if (!type || !id) {
    return <ErrorState message="This assessment link is not valid." />
  }

  if (assessmentQuery.loading) return <LoadingPanel label="Loading assessment report…" />
  if (assessmentQuery.error) return <ErrorState message={assessmentQuery.error} onRetry={() => void assessmentQuery.reload()} />

  const assessment = assessmentQuery.data?.assessment
  if (!assessment) return <ErrorState message="Assessment not found." />

  const questionnaire = questionnairesByType[type]
  const canExport = roleCan(identity?.role, 'exports.run')
  const canReview = roleCan(identity?.role, 'assessments.review')
  const canDownload = roleCan(identity?.role, 'documents.download')

  const openReview = () => {
    setReviewStatus(assessment.review_status)
    setReviewNotes(assessment.review?.notes ?? '')
    setReviewOpen(true)
  }

  const submitReview = async () => {
    setSavingReview(true)
    setActionError('')
    try {
      await adminApi('review.update', {
        body: { type, id, status: reviewStatus, notes: reviewNotes },
      })
      setReviewOpen(false)
      setActionNotice('Review status updated.')
      await assessmentQuery.reload()
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Could not update the review status.')
    } finally {
      setSavingReview(false)
    }
  }

  const handleExportExcel = async () => {
    setExporting(true)
    setActionError('')
    try {
      await downloadAssessmentWorkbook(assessment, type, questionnaire, verificationByPath)
      await adminApi('audit.log', { body: { action: 'export.excel', targetType: type, targetId: id } })
      setActionNotice('Excel workbook generated.')
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Excel export failed.')
    } finally {
      setExporting(false)
    }
  }

  const handleExportZip = async () => {
    setZipping(true)
    setActionError('')
    setActionNotice('')
    setZipProgress({ done: 0, total: assessment.attachments?.length ?? 0 })
    try {
      const summary: ZipExportSummary = await downloadAssessmentDocumentsZip(
        assessment,
        type,
        questionnaire,
        verificationByPath,
        (done, total) => setZipProgress({ done, total }),
      )
      await adminApi('audit.log', { body: { action: 'export.zip', targetType: type, targetId: id } })
      setActionNotice(
        summary.failed > 0
          ? `ZIP generated with ${summary.included} file(s). ${summary.failed} file(s) failed — see the manifest.`
          : `ZIP generated with ${summary.included} file(s).`,
      )
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'ZIP export failed.')
    } finally {
      setZipping(false)
      setZipProgress(null)
    }
  }

  return (
    <div className="admin-stack">
      <div>
        <button type="button" className="admin-btn small" onClick={() => navigate('/admin/assessments')}>
          <ArrowLeft size={14} /> Back to register
        </button>
      </div>

      {actionError ? (
        <p className="admin-state error" style={{ margin: 0 }} role="alert">
          {actionError}
        </p>
      ) : null}
      {actionNotice ? (
        <p className="admin-state" style={{ margin: 0, background: 'var(--mint)' }} role="status">
          {actionNotice}
        </p>
      ) : null}

      <header className="admin-report-head">
        <div>
          <span className="admin-badge category">{ASSESSMENT_TYPE_LABEL[type]}</span>
          <h1>{assessment.organization_name || 'Untitled submission'}</h1>
        </div>

        <div className="admin-report-meta">
          <div>
            <span>Assessment ID</span>
            <span className="admin-mono">{assessment.id}</span>
          </div>
          <div>
            <span>Submitted</span>
            <span>{formatDateTime(assessment.submitted_at)}</span>
          </div>
          <div>
            <span>Questionnaire version</span>
            <span>{assessment.questionnaire_version}</span>
          </div>
          <div>
            <span>Documents</span>
            <span>{assessment.attachments?.length ?? 0}</span>
          </div>
          <div>
            <span>Review status</span>
            <ReviewStatusBadge status={assessment.review_status} />
          </div>
          {assessment.review?.reviewer_email ? (
            <div>
              <span>Reviewed by</span>
              <span>{assessment.review.reviewer_email}</span>
            </div>
          ) : null}
        </div>

        <div className="admin-report-actions">
          {canExport ? (
            <button type="button" className="admin-btn primary" onClick={() => void handleExportExcel()} disabled={exporting}>
              <FileSpreadsheet size={15} /> {exporting ? 'Building workbook…' : 'Export Excel'}
            </button>
          ) : null}
          {canDownload ? (
            <button type="button" className="admin-btn" onClick={() => void handleExportZip()} disabled={zipping}>
              <Package size={15} />
              {zipping && zipProgress ? ` Zipping ${zipProgress.done}/${zipProgress.total}` : ' Download all documents (ZIP)'}
            </button>
          ) : null}
          {canReview ? (
            <button type="button" className="admin-btn mint" onClick={openReview}>
              <PencilLine size={15} /> Change review status
            </button>
          ) : null}
          <button type="button" className="admin-btn" onClick={() => window.print()}>
            <Printer size={15} /> Print
          </button>
        </div>
      </header>

      <nav className="admin-report-nav" aria-label="Questionnaire sections">
        {questionnaire.sections.map((section, index) => (
          <button
            key={section.id}
            type="button"
            className="admin-btn small"
            onClick={() => document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth' })}
          >
            {index + 1}. {section.title}
          </button>
        ))}
      </nav>

      {questionnaire.sections.map((section) => (
        <section className="admin-report-section" id={`section-${section.id}`} key={section.id}>
          <h2>{section.title}</h2>
          {section.introduction ? <p className="admin-section-intro">{section.introduction}</p> : null}

          {section.questions.map((question) => {
            const value = getAnswer(assessment.answers, section.id, question.id)
            const documents = documentsForQuestion(assessment.attachments, section.id, question.id, value)
            return (
              <article className="admin-report-question" id={`q-${section.id}-${question.id}`} key={question.id}>
                <h3>{question.question}</h3>
                <div className="admin-report-qid">
                  {section.id} / {question.id}
                </div>
                <AnswerValue
                  question={question}
                  value={value}
                  documentReferences={documents}
                  verificationByPath={verificationByPath}
                  readOnlyDocuments={!canDownload}
                />
              </article>
            )
          })}
        </section>
      ))}

      {reviewOpen ? (
        <Modal
          title="Update review status"
          onClose={() => setReviewOpen(false)}
          actions={
            <>
              <button type="button" className="admin-btn" onClick={() => setReviewOpen(false)}>
                Cancel
              </button>
              <button type="button" className="admin-btn primary" onClick={() => void submitReview()} disabled={savingReview}>
                {savingReview ? 'Saving…' : 'Save review'}
              </button>
            </>
          }
        >
          <div className="admin-field" style={{ marginBottom: 14 }}>
            <label htmlFor="review-status">Review status</label>
            <select
              id="review-status"
              className="admin-select"
              value={reviewStatus}
              onChange={(event) => setReviewStatus(event.target.value as ReviewStatus)}
            >
              {REVIEW_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {REVIEW_STATUS_LABEL[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="review-notes">Review notes</label>
            <textarea
              id="review-notes"
              className="admin-textarea"
              value={reviewNotes}
              maxLength={4000}
              onChange={(event) => setReviewNotes(event.target.value)}
              placeholder="Internal notes for this review. Original answers are never modified."
            />
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
