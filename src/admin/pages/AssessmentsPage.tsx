import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ExternalLink, FileSpreadsheet, RotateCcw, Search } from 'lucide-react'
import { questionnairesByType } from '../../data/questionnaires'
import { useAdminAuth } from '../auth/useAdminAuth'
import { useAdminQuery } from '../lib/useAdminQuery'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import { adminApi } from '../lib/api'
import { downloadAssessmentWorkbook } from '../lib/exports/excel'
import {
  ASSESSMENT_TYPES,
  ASSESSMENT_TYPE_LABEL,
  REVIEW_STATUSES,
  REVIEW_STATUS_LABEL,
  formatDateTime,
  shortId,
} from '../lib/format'
import { roleCan } from '../lib/permissions'
import { EmptyState, ErrorState, LoadingPanel, Pagination, ReviewStatusBadge } from '../components/ui'
import type { AssessmentListItem, AssessmentRow, Paginated, ReviewStatus } from '../lib/types'

const PAGE_SIZE = 20

export function AssessmentsPage() {
  const navigate = useNavigate()
  const { identity } = useAdminAuth()
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [type, setType] = useState<string>(searchParams.get('type') ?? '')
  const [status, setStatus] = useState<string>(searchParams.get('status') ?? '')
  const [from, setFrom] = useState(searchParams.get('from') ?? '')
  const [to, setTo] = useState(searchParams.get('to') ?? '')
  const [sort, setSort] = useState<'submitted_at' | 'organization_name'>('submitted_at')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState<string | null>(null)
  const [exportError, setExportError] = useState('')

  const debouncedSearch = useDebouncedValue(search, 350)

  const { data, error, loading, reload } = useAdminQuery<Paginated<AssessmentListItem>>('assessments', {
    search: debouncedSearch,
    type,
    status,
    from,
    to,
    sort,
    dir,
    page,
    pageSize: PAGE_SIZE,
  })

  const canExport = roleCan(identity?.role, 'exports.run')

  const handleExportExcel = async (item: AssessmentListItem) => {
    setExportError('')
    setExporting(item.id)
    try {
      const result = await adminApi<{ assessment: AssessmentRow }>('assessment', {
        query: { type: item.assessment_type, id: item.id },
      })
      await downloadAssessmentWorkbook(
        result.assessment,
        item.assessment_type,
        questionnairesByType[item.assessment_type],
      )
      await adminApi('audit.log', {
        body: { action: 'export.excel', targetType: item.assessment_type, targetId: item.id },
      })
    } catch (caught) {
      setExportError(caught instanceof Error ? caught.message : 'Export failed.')
    } finally {
      setExporting(null)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setType('')
    setStatus('')
    setFrom('')
    setTo('')
    setSort('submitted_at')
    setDir('desc')
    setPage(1)
  }

  return (
    <div className="admin-stack">
      <div className="admin-toolbar" role="search">
        <div className="admin-field grow">
          <label htmlFor="assessment-search">Search</label>
          <input
            id="assessment-search"
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
        <div className="admin-field">
          <label htmlFor="assessment-type">Category</label>
          <select
            id="assessment-type"
            className="admin-select"
            value={type}
            onChange={(event) => {
              setType(event.target.value)
              setPage(1)
            }}
          >
            <option value="">All categories</option>
            {ASSESSMENT_TYPES.map((value) => (
              <option key={value} value={value}>
                {ASSESSMENT_TYPE_LABEL[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor="assessment-status">Review status</label>
          <select
            id="assessment-status"
            className="admin-select"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
          >
            <option value="">All statuses</option>
            {REVIEW_STATUSES.map((value) => (
              <option key={value} value={value}>
                {REVIEW_STATUS_LABEL[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor="assessment-from">From</label>
          <input
            id="assessment-from"
            className="admin-input"
            type="date"
            value={from}
            onChange={(event) => {
              setFrom(event.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="assessment-to">To</label>
          <input
            id="assessment-to"
            className="admin-input"
            type="date"
            value={to}
            onChange={(event) => {
              setTo(event.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="assessment-sort">Sort</label>
          <select
            id="assessment-sort"
            className="admin-select"
            value={`${sort}:${dir}`}
            onChange={(event) => {
              const [nextSort, nextDir] = event.target.value.split(':')
              setSort(nextSort as 'submitted_at' | 'organization_name')
              setDir(nextDir as 'asc' | 'desc')
              setPage(1)
            }}
          >
            <option value="submitted_at:desc">Newest first</option>
            <option value="submitted_at:asc">Oldest first</option>
            <option value="organization_name:asc">Organization A–Z</option>
            <option value="organization_name:desc">Organization Z–A</option>
          </select>
        </div>
        <button type="button" className="admin-btn" onClick={resetFilters}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {exportError ? (
        <p className="admin-state error" style={{ margin: 0 }} role="alert">
          {exportError}
        </p>
      ) : null}

      {loading ? (
        <LoadingPanel label="Loading assessments…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : !data || data.rows.length === 0 ? (
        <EmptyState title="No assessments match these filters">
          <p className="admin-muted" style={{ margin: '6px 0 0' }}>
            <Search size={14} style={{ verticalAlign: '-2px' }} aria-hidden /> Try widening the search or clearing filters.
          </p>
        </EmptyState>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Organization</th>
                  <th scope="col">Category</th>
                  <th scope="col">Assessment ID</th>
                  <th scope="col">Version</th>
                  <th scope="col">Submitted</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="right">Docs</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((item) => (
                  <tr key={item.id}>
                    <td>{item.organization_name || <span className="admin-muted">Untitled</span>}</td>
                    <td>
                      <span className="admin-badge category">{ASSESSMENT_TYPE_LABEL[item.assessment_type]}</span>
                    </td>
                    <td className="mono" title={item.id}>
                      {shortId(item.id)}
                    </td>
                    <td className="nowrap">{item.questionnaire_version}</td>
                    <td className="nowrap">{formatDateTime(item.submitted_at)}</td>
                    <td>
                      <ReviewStatusBadge status={item.review_status as ReviewStatus} />
                    </td>
                    <td className="right">{item.document_count}</td>
                    <td>
                      <div className="admin-inline">
                        <button
                          type="button"
                          className="admin-btn small"
                          onClick={() => navigate(`/admin/assessments/${item.assessment_type}/${item.id}`)}
                        >
                          <ExternalLink size={13} /> Open
                        </button>
                        {canExport ? (
                          <button
                            type="button"
                            className="admin-btn small"
                            onClick={() => void handleExportExcel(item)}
                            disabled={exporting === item.id}
                          >
                            <FileSpreadsheet size={13} /> {exporting === item.id ? '…' : 'Excel'}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  )
}

