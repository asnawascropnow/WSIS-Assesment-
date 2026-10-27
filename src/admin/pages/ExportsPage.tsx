import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, FileSpreadsheet, Package } from 'lucide-react'
import { questionnairesByType } from '../../data/questionnaires'
import { useAdminQuery } from '../lib/useAdminQuery'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import { adminApi } from '../lib/api'
import { downloadAssessmentWorkbook } from '../lib/exports/excel'
import { downloadAssessmentDocumentsZip } from '../lib/exports/zip'
import { downloadConsolidatedReport } from '../lib/exports/consolidated'
import {
  ASSESSMENT_TYPES,
  ASSESSMENT_TYPE_LABEL,
  REVIEW_STATUSES,
  REVIEW_STATUS_LABEL,
  formatDateTime,
  humanizeAction,
} from '../lib/format'
import { EmptyState, ErrorState, LoadingPanel, Pagination, ReviewStatusBadge } from '../components/ui'
import type { AssessmentListItem, AssessmentRow, AuditLogRow, Paginated } from '../lib/types'

const PAGE_SIZE = 10

export function ExportsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const debouncedSearch = useDebouncedValue(search, 350)

  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [generating, setGenerating] = useState(false)

  const [historyPage, setHistoryPage] = useState(1)

  const assessments = useAdminQuery<Paginated<AssessmentListItem>>('assessments', {
    search: debouncedSearch,
    page,
    pageSize: PAGE_SIZE,
  })

  const history = useAdminQuery<Paginated<AuditLogRow>>('audit', {
    actionPrefix: 'export.',
    page: historyPage,
    pageSize: 15,
  })

  const loadAssessment = async (item: AssessmentListItem) => {
    const result = await adminApi<{ assessment: AssessmentRow }>('assessment', {
      query: { type: item.assessment_type, id: item.id },
    })
    return result.assessment
  }

  const handleExcel = async (item: AssessmentListItem) => {
    setError('')
    setNotice('')
    setBusy(`excel:${item.id}`)
    try {
      const full = await loadAssessment(item)
      await downloadAssessmentWorkbook(full, item.assessment_type, questionnairesByType[item.assessment_type])
      await adminApi('audit.log', { body: { action: 'export.excel', targetType: item.assessment_type, targetId: item.id } })
      setNotice('Excel workbook generated.')
      await history.reload()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Excel export failed.')
    } finally {
      setBusy(null)
    }
  }

  const handleZip = async (item: AssessmentListItem) => {
    setError('')
    setNotice('')
    setBusy(`zip:${item.id}`)
    try {
      const full = await loadAssessment(item)
      await downloadAssessmentDocumentsZip(full, item.assessment_type, questionnairesByType[item.assessment_type])
      await adminApi('audit.log', { body: { action: 'export.zip', targetType: item.assessment_type, targetId: item.id } })
      setNotice('Document ZIP generated.')
      await history.reload()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'ZIP export failed.')
    } finally {
      setBusy(null)
    }
  }

  const fetchAllAssessments = async (): Promise<AssessmentListItem[]> => {
    const all: AssessmentListItem[] = []
    const pageSize = 100
    for (let currentPage = 1; currentPage <= 25; currentPage += 1) {
      const result = await adminApi<Paginated<AssessmentListItem>>('assessments', {
        query: { category, status, from, to, page: currentPage, pageSize },
      })
      all.push(...result.rows)
      if (all.length >= result.total || result.rows.length < pageSize) break
    }
    return all
  }

  const handleConsolidated = async () => {
    setError('')
    setNotice('')
    setGenerating(true)
    try {
      const rows = await fetchAllAssessments()
      if (rows.length === 0) {
        setError('No assessments match the selected filters.')
        return
      }
      const label = `water-assessment-${category || 'all-categories'}`
      await downloadConsolidatedReport(rows, { label, filters: { category, status, from, to } })
      await adminApi('audit.log', {
        body: { action: 'export.consolidated', targetType: 'assessments', targetId: label, metadata: { count: rows.length } },
      })
      setNotice(`Consolidated report generated from ${rows.length} assessment(s).`)
      await history.reload()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Consolidated export failed.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="admin-stack">
      {error ? (
        <p className="admin-state error" style={{ margin: 0 }} role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="admin-state" style={{ margin: 0, background: 'var(--mint)' }} role="status">
          {notice}
        </p>
      ) : null}

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Individual assessment export</h2>
        </div>
        <div className="admin-toolbar" role="search">
          <div className="admin-field grow">
            <label htmlFor="export-search">Find an assessment</label>
            <input
              id="export-search"
              className="admin-input"
              type="search"
              placeholder="Organization name or assessment ID"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>

        {assessments.loading ? (
          <LoadingPanel label="Loading assessments…" />
        ) : assessments.error ? (
          <ErrorState message={assessments.error} onRetry={() => void assessments.reload()} />
        ) : !assessments.data || assessments.data.rows.length === 0 ? (
          <EmptyState title="No assessments match this search" />
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Organization</th>
                    <th scope="col">Category</th>
                    <th scope="col">Submitted</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.data.rows.map((item) => (
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
                      <td className="nowrap">{formatDateTime(item.submitted_at)}</td>
                      <td>
                        <ReviewStatusBadge status={item.review_status} />
                      </td>
                      <td>
                        <div className="admin-inline">
                          <button
                            type="button"
                            className="admin-btn small"
                            onClick={() => void handleExcel(item)}
                            disabled={busy === `excel:${item.id}`}
                          >
                            <FileSpreadsheet size={13} /> Excel
                          </button>
                          <button
                            type="button"
                            className="admin-btn small"
                            onClick={() => void handleZip(item)}
                            disabled={busy === `zip:${item.id}`}
                          >
                            <Package size={13} /> ZIP
                          </button>
                          <button
                            type="button"
                            className="admin-btn small"
                            onClick={() => navigate(`/admin/assessments/${item.assessment_type}/${item.id}`)}
                          >
                            <ExternalLink size={13} /> Open
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={assessments.data.page}
              pageSize={assessments.data.pageSize}
              total={assessments.data.total}
              onPage={setPage}
            />
          </>
        )}
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Consolidated reports</h2>
        </div>
        <div className="admin-toolbar">
          <div className="admin-field">
            <label htmlFor="report-category">Category</label>
            <select id="report-category" className="admin-select" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {ASSESSMENT_TYPES.map((value) => (
                <option key={value} value={value}>
                  {ASSESSMENT_TYPE_LABEL[value]}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="report-status">Review status</label>
            <select id="report-status" className="admin-select" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {REVIEW_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {REVIEW_STATUS_LABEL[value]}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="report-from">From</label>
            <input id="report-from" className="admin-input" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="report-to">To</label>
            <input id="report-to" className="admin-input" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </div>
          <button type="button" className="admin-btn primary" onClick={() => void handleConsolidated()} disabled={generating}>
            <FileSpreadsheet size={15} /> {generating ? 'Generating…' : 'Generate workbook'}
          </button>
        </div>
        <p className="admin-muted" style={{ margin: 0 }}>
          Consolidated workbooks summarise the assessment register, organizations, categories and review status. Water
          quantity and quality figures remain verbatim inside each assessment export and are not aggregated or converted.
        </p>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Export history</h2>
        </div>
        {history.loading ? (
          <LoadingPanel label="Loading export history…" />
        ) : history.error ? (
          <ErrorState message={history.error} onRetry={() => void history.reload()} />
        ) : !history.data || history.data.rows.length === 0 ? (
          <EmptyState title="No exports yet" />
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Action</th>
                    <th scope="col">Actor</th>
                    <th scope="col">Target</th>
                    <th scope="col">Outcome</th>
                    <th scope="col">When</th>
                  </tr>
                </thead>
                <tbody>
                  {history.data.rows.map((entry) => (
                    <tr key={entry.id}>
                      <td>{humanizeAction(entry.action)}</td>
                      <td>{entry.actor_email ?? '—'}</td>
                      <td className="admin-mono">{entry.target_id ?? '—'}</td>
                      <td>
                        <span className={`admin-badge ${entry.outcome === 'success' ? 'valid' : 'invalid'}`}>{entry.outcome}</span>
                      </td>
                      <td className="nowrap">{formatDateTime(entry.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={history.data.page}
              pageSize={history.data.pageSize}
              total={history.data.total}
              onPage={setHistoryPage}
            />
          </>
        )}
      </section>
    </div>
  )
}
