import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  FileSpreadsheet,
  FolderLock,
  HardDrive,
  ListChecks,
  PackageX,
  Building2,
} from 'lucide-react'
import { useAdminQuery } from '../lib/useAdminQuery'
import { ASSESSMENT_TYPES, ASSESSMENT_TYPE_LABEL, REVIEW_STATUSES, REVIEW_STATUS_LABEL, formatDateTime, humanizeAction } from '../lib/format'
import { EmptyState, ErrorState, LoadingPanel, ReviewStatusBadge } from '../components/ui'
import { roleCan } from '../lib/permissions'
import { useAdminAuth } from '../auth/useAdminAuth'
import type { AssessmentListItem, OverviewStats, RecentActivityItem } from '../lib/types'

type OverviewResponse = {
  stats: OverviewStats
  recentAssessments: AssessmentListItem[]
  recentActivity: RecentActivityItem[]
}

export function OverviewPage() {
  const navigate = useNavigate()
  const { identity } = useAdminAuth()
  const { data, error, loading, reload } = useAdminQuery<OverviewResponse>('overview')

  if (loading) return <LoadingPanel label="Loading dashboard metrics…" />
  if (error) return <ErrorState message={error} onRetry={() => void reload()} />
  if (!data) return <EmptyState title="No metrics available" />

  const { stats, recentAssessments, recentActivity } = data
  const byType = stats.byType ?? {}
  const byStatus = stats.byStatus ?? {}

  return (
    <div className="admin-stack">
      <section className="admin-section">
        <div className="admin-stat-grid">
          <button type="button" className="admin-stat accent-mint" onClick={() => navigate('/admin/assessments')}>
            <span className="admin-stat-value">{stats.total}</span>
            <span className="admin-stat-label">Total assessments</span>
          </button>
          <button type="button" className="admin-stat" onClick={() => navigate('/admin/organizations')}>
            <span className="admin-stat-value">{stats.organizations}</span>
            <span className="admin-stat-label">Organizations</span>
          </button>
          <button type="button" className="admin-stat" onClick={() => navigate('/admin/documents')}>
            <span className="admin-stat-value">{stats.documents}</span>
            <span className="admin-stat-label">Uploaded documents</span>
          </button>
          <button
            type="button"
            className="admin-stat accent-pink"
            onClick={() => navigate('/admin/documents?verification=invalid')}
          >
            <span className="admin-stat-value">{stats.invalidDocuments}</span>
            <span className="admin-stat-label">
              <AlertTriangle size={12} style={{ verticalAlign: '-1px' }} aria-hidden /> Invalid references
            </span>
          </button>
          <button
            type="button"
            className="admin-stat accent-pink"
            onClick={() => navigate('/admin/documents?verification=missing')}
          >
            <span className="admin-stat-value">{stats.missingStorage}</span>
            <span className="admin-stat-label">
              <PackageX size={12} style={{ verticalAlign: '-1px' }} aria-hidden /> Missing objects
            </span>
          </button>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Assessments by category</h2>
        </div>
        <div className="admin-stat-grid">
          {ASSESSMENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className="admin-stat"
              onClick={() => navigate(`/admin/assessments?type=${type}`)}
            >
              <span className="admin-stat-value">{byType[type] ?? 0}</span>
              <span className="admin-stat-label">{ASSESSMENT_TYPE_LABEL[type]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Review status</h2>
        </div>
        <div className="admin-stat-grid">
          {REVIEW_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              className="admin-stat"
              onClick={() => navigate(`/admin/assessments?status=${status}`)}
            >
              <span className="admin-stat-value">{byStatus[status] ?? 0}</span>
              <span className="admin-stat-label">{REVIEW_STATUS_LABEL[status]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Quick actions</h2>
        </div>
        <div className="admin-inline">
          <button type="button" className="admin-btn mint" onClick={() => navigate('/admin/assessments?status=submitted')}>
            <ListChecks size={15} /> Review new submissions
          </button>
          <button type="button" className="admin-btn" onClick={() => navigate('/admin/documents')}>
            <FolderLock size={15} /> Manage documents
          </button>
          {roleCan(identity?.role, 'exports.run') ? (
            <button type="button" className="admin-btn" onClick={() => navigate('/admin/exports')}>
              <FileSpreadsheet size={15} /> Generate reports
            </button>
          ) : null}
          <button type="button" className="admin-btn" onClick={() => navigate('/admin/settings')}>
            <HardDrive size={15} /> Settings &amp; audit
          </button>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-columns">
          <div className="admin-card">
            <div className="admin-section-head">
              <h2>Recent submissions</h2>
              <button type="button" className="admin-btn small" onClick={() => navigate('/admin/assessments')}>
                View all
              </button>
            </div>
            {recentAssessments.length === 0 ? (
              <EmptyState title="No submissions yet">
                <p className="admin-muted" style={{ margin: 0 }}>Submissions will appear here as they arrive.</p>
              </EmptyState>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table" style={{ minWidth: 520 }}>
                  <thead>
                    <tr>
                      <th scope="col">Organization</th>
                      <th scope="col">Category</th>
                      <th scope="col">Status</th>
                      <th scope="col">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAssessments.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <button
                            type="button"
                            className="admin-row-link"
                            style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
                            onClick={() => navigate(`/admin/assessments/${item.assessment_type}/${item.id}`)}
                          >
                            {item.organization_name || 'Untitled'}
                          </button>
                        </td>
                        <td>
                          <span className="admin-badge category">{ASSESSMENT_TYPE_LABEL[item.assessment_type]}</span>
                        </td>
                        <td>
                          <ReviewStatusBadge status={item.review_status} />
                        </td>
                        <td className="nowrap">{formatDateTime(item.submitted_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="admin-card">
            <div className="admin-section-head">
              <h2>Recent administrative activity</h2>
            </div>
            {recentActivity.length === 0 ? (
              <p className="admin-muted" style={{ margin: 0 }}>No administrative activity recorded yet.</p>
            ) : (
              <div className="admin-activity">
                {recentActivity.map((entry) => (
                  <div className="admin-activity-row" key={entry.id}>
                    <span>
                      <strong>{humanizeAction(entry.action)}</strong>
                      {entry.target_type ? <span className="admin-muted"> · {entry.target_type}</span> : null}
                      <br />
                      <span className="admin-muted">{entry.actor_email ?? 'system'}</span>
                    </span>
                    <span className="admin-muted nowrap">{formatDateTime(entry.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="admin-section">
        <p className="admin-muted" style={{ margin: 0 }}>
          <Building2 size={14} style={{ verticalAlign: '-2px' }} aria-hidden /> All metrics are computed live from the
          assessment tables and document metadata. No values are hardcoded.
        </p>
      </section>
    </div>
  )
}
