import { useState } from 'react'
import { useAdminQuery } from '../lib/useAdminQuery'
import { ASSESSMENT_TYPES, ASSESSMENT_TYPE_LABEL, REVIEW_STATUSES, REVIEW_STATUS_LABEL, formatBytes, formatDateTime, humanizeAction } from '../lib/format'
import { roleCan } from '../lib/permissions'
import { useAdminAuth } from '../auth/useAdminAuth'
import { EmptyState, ErrorState, LoadingPanel, Pagination } from '../components/ui'
import type { AuditLogRow, Paginated, ReviewStatus } from '../lib/types'
import type { AssessmentType } from '../../types'

type SettingsResponse = {
  schemaVersion: number
  questionnaireVersions: Record<AssessmentType, string>
  maxAttachmentSizeBytes: number
  allowedAttachmentTypes: string[]
  reviewStatuses: ReviewStatus[]
  actor: { id: string; email: string; role: string }
}

const AUDIT_ACTIONS = [
  '',
  'assessment.viewed',
  'assessment.review_updated',
  'document.signed_url',
  'document.downloaded',
  'document.verified',
  'export.excel',
  'export.zip',
  'export.consolidated',
  'admin.created',
  'admin.role_changed',
  'admin.deactivated',
  'admin.activated',
  'admin.deleted',
  'authorization.denied',
]

export function SettingsPage() {
  const { identity } = useAdminAuth()
  const settings = useAdminQuery<SettingsResponse>('settings')
  const [action, setAction] = useState('')
  const [page, setPage] = useState(1)

  const canReadAudit = roleCan(identity?.role, 'audit.read')
  const audit = useAdminQuery<Paginated<AuditLogRow>>(
    'audit',
    { action, page, pageSize: 20 },
    { enabled: canReadAudit },
  )

  const settingsData = settings.data

  return (
    <div className="admin-stack">
      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Questionnaire &amp; schema versions</h2>
        </div>
        {settings.loading ? (
          <LoadingPanel label="Loading settings…" />
        ) : settings.error ? (
          <ErrorState message={settings.error} onRetry={() => void settings.reload()} />
        ) : settingsData ? (
          <div className="admin-card">
            <dl className="admin-report-meta" style={{ margin: 0 }}>
              <div>
                <dt>Assessment schema version</dt>
                <dd>{settingsData.schemaVersion}</dd>
              </div>
              {ASSESSMENT_TYPES.map((type) => (
                <div key={type}>
                  <dt>{ASSESSMENT_TYPE_LABEL[type]} questionnaire</dt>
                  <dd>{settingsData.questionnaireVersions[type]}</dd>
                </div>
              ))}
              <div>
                <dt>Max attachment size</dt>
                <dd>{formatBytes(settingsData.maxAttachmentSizeBytes)}</dd>
              </div>
              <div>
                <dt>Allowed file types</dt>
                <dd>{settingsData.allowedAttachmentTypes.join(', ')}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Configured assessment categories</h2>
        </div>
        <div className="admin-card">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {ASSESSMENT_TYPES.map((type) => (
              <li key={type}>
                <strong>{ASSESSMENT_TYPE_LABEL[type]}</strong> — table <span className="admin-mono">{type}_assessments</span>,
                bucket <span className="admin-mono">{type}-assessment-files</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Review workflow statuses</h2>
        </div>
        <div className="admin-card">
          <div className="admin-inline">
            {REVIEW_STATUSES.map((status) => (
              <span key={status} className={`admin-badge ${status}`}>
                {REVIEW_STATUS_LABEL[status]}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Audit log</h2>
          {canReadAudit ? (
            <div className="admin-field">
              <label htmlFor="audit-filter">Filter by action</label>
              <select
                id="audit-filter"
                className="admin-select"
                value={action}
                onChange={(event) => {
                  setPage(1)
                  setAction(event.target.value)
                }}
              >
                {AUDIT_ACTIONS.map((value) => (
                  <option key={value || 'all'} value={value}>
                    {value ? humanizeAction(value) : 'All actions'}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        {!canReadAudit ? (
          <p className="admin-muted" style={{ margin: 0 }}>
            Your role does not include permission to read the audit log.
          </p>
        ) : audit.loading ? (
          <LoadingPanel label="Loading audit log…" />
        ) : audit.error ? (
          <ErrorState message={audit.error} onRetry={() => void audit.reload()} />
        ) : !audit.data || audit.data.rows.length === 0 ? (
          <EmptyState title="No audit entries yet" />
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">When</th>
                    <th scope="col">Actor</th>
                    <th scope="col">Action</th>
                    <th scope="col">Target</th>
                    <th scope="col">Outcome</th>
                    <th scope="col">Metadata</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.data.rows.map((entry) => (
                    <tr key={entry.id}>
                      <td className="nowrap">{formatDateTime(entry.created_at)}</td>
                      <td>{entry.actor_email ?? 'system'}</td>
                      <td>{humanizeAction(entry.action)}</td>
                      <td className="admin-mono">
                        {entry.target_type ? `${entry.target_type}: ` : ''}
                        {entry.target_id ?? '—'}
                      </td>
                      <td>
                        <span className={`admin-badge ${entry.outcome === 'success' ? 'valid' : 'invalid'}`}>{entry.outcome}</span>
                      </td>
                      <td className="admin-mono" style={{ maxWidth: 260, overflowWrap: 'anywhere' }}>
                        {Object.keys(entry.metadata ?? {}).length > 0 ? JSON.stringify(entry.metadata) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={audit.data.page} pageSize={audit.data.pageSize} total={audit.data.total} onPage={setPage} />
          </>
        )}
      </section>
    </div>
  )
}
