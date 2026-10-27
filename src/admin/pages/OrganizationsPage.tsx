import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ExternalLink, RotateCcw } from 'lucide-react'
import { useAdminQuery } from '../lib/useAdminQuery'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import { ASSESSMENT_TYPES, ASSESSMENT_TYPE_LABEL, formatDateTime } from '../lib/format'
import { EmptyState, ErrorState, LoadingPanel, Pagination, ReviewStatusBadge } from '../components/ui'
import type { OrganizationIndexRow, Paginated } from '../lib/types'

const PAGE_SIZE = 20

export function OrganizationsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search, 350)

  const { data, error, loading, reload } = useAdminQuery<Paginated<OrganizationIndexRow>>('organizations', {
    search: debouncedSearch,
    category,
    page,
    pageSize: PAGE_SIZE,
  })

  return (
    <div className="admin-stack">
      <div className="admin-toolbar" role="search">
        <div className="admin-field grow">
          <label htmlFor="org-search">Search organizations</label>
          <input
            id="org-search"
            className="admin-input"
            type="search"
            placeholder="Organization name"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="org-category">Category</label>
          <select
            id="org-category"
            className="admin-select"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value)
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
        <button
          type="button"
          className="admin-btn"
          onClick={() => {
            setSearch('')
            setCategory('')
            setPage(1)
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {loading ? (
        <LoadingPanel label="Loading organization directory…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : !data || data.rows.length === 0 ? (
        <EmptyState title="No organizations found">
          <p className="admin-muted" style={{ margin: 0 }}>
            The directory lists organizations from all four assessment categories.
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
                  <th scope="col" className="right">Assessments</th>
                  <th scope="col">Latest submission</th>
                  <th scope="col">Latest status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={`${row.assessment_type}:${row.organization_name}`}>
                    <td>{row.organization_name}</td>
                    <td>
                      <span className="admin-badge category">{ASSESSMENT_TYPE_LABEL[row.assessment_type]}</span>
                    </td>
                    <td className="right">{row.assessment_count}</td>
                    <td className="nowrap">{formatDateTime(row.latest_submitted_at)}</td>
                    <td>
                      <ReviewStatusBadge status={row.latest_review_status} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn small"
                        onClick={() =>
                          navigate(`/admin/organizations/${row.assessment_type}/${encodeURIComponent(row.organization_name)}`)
                        }
                      >
                        <ExternalLink size={13} /> View profile
                      </button>
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
