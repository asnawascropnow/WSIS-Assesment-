import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useAdminQuery } from '../lib/useAdminQuery'
import { ASSESSMENT_TYPE_LABEL, formatDateTime } from '../lib/format'
import { EmptyState, ErrorState, LoadingPanel, ReviewStatusBadge } from '../components/ui'
import type { AssessmentListItem, AssessmentType } from '../lib/types'

const ASSESSMENT_TYPES = new Set<AssessmentType>(['university', 'industry', 'organization', 'apartment'])

type OrganizationResponse = {
  organization: { assessment_type: AssessmentType; organization_name: string }
  assessments: AssessmentListItem[]
}

export function OrganizationProfilePage() {
  const { type: rawType, name: rawName } = useParams<{ type: string; name: string }>()
  const navigate = useNavigate()

  const type = rawType && ASSESSMENT_TYPES.has(rawType as AssessmentType) ? (rawType as AssessmentType) : null
  const name = rawName ? decodeURIComponent(rawName) : ''

  const { data, error, loading, reload } = useAdminQuery<OrganizationResponse>(
    'organization',
    { type: type ?? '', name },
    { enabled: Boolean(type && name) },
  )

  if (!type || !name) return <ErrorState message="This organization link is not valid." />
  if (loading) return <LoadingPanel label="Loading organization profile…" />
  if (error) return <ErrorState message={error} onRetry={() => void reload()} />

  return (
    <div className="admin-stack">
      <div>
        <button type="button" className="admin-btn small" onClick={() => navigate('/admin/organizations')}>
          <ArrowLeft size={14} /> Back to directory
        </button>
      </div>

      <header className="admin-report-head">
        <div>
          <span className="admin-badge category">{ASSESSMENT_TYPE_LABEL[type]}</span>
          <h1>{name}</h1>
        </div>
        <p className="admin-muted" style={{ margin: 0 }}>
          {data?.assessments.length ?? 0} assessment{(data?.assessments.length ?? 0) === 1 ? '' : 's'} recorded for this
          organization in the {ASSESSMENT_TYPE_LABEL[type]} category.
        </p>
      </header>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Assessment history</h2>
        </div>
        {!data || data.assessments.length === 0 ? (
          <EmptyState title="No assessments yet" />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Assessment ID</th>
                  <th scope="col">Version</th>
                  <th scope="col">Submitted</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="right">Docs</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.assessments.map((item) => (
                  <tr key={item.id}>
                    <td className="mono">{item.id}</td>
                    <td className="nowrap">{item.questionnaire_version}</td>
                    <td className="nowrap">{formatDateTime(item.submitted_at)}</td>
                    <td>
                      <ReviewStatusBadge status={item.review_status} />
                    </td>
                    <td className="right">{item.document_count}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn small"
                        onClick={() => navigate(`/admin/assessments/${item.assessment_type}/${item.id}`)}
                      >
                        <ExternalLink size={13} /> Open report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
