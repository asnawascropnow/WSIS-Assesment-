import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Download, ExternalLink, Eye, RotateCcw, ShieldCheck } from 'lucide-react'
import { useAdminAuth } from '../auth/useAdminAuth'
import { useAdminQuery } from '../lib/useAdminQuery'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import { adminApi, fetchAsBlob, triggerBlobDownload } from '../lib/api'
import { ASSESSMENT_TYPES, ASSESSMENT_TYPE_LABEL, formatBytes, formatDateTime } from '../lib/format'
import { roleCan } from '../lib/permissions'
import { Badge, EmptyState, ErrorState, LoadingPanel, Pagination } from '../components/ui'
import type { DocumentIndexRow, OrphanStorageRow, Paginated } from '../lib/types'

const PAGE_SIZE = 25

function VerificationBadge({ row }: { row: DocumentIndexRow }) {
  if (row.reference_valid) return <Badge tone="valid">Verified</Badge>
  if (!row.storage_exists) return <Badge tone="missing">Missing object</Badge>
  return <Badge tone="invalid">Invalid reference</Badge>
}

export function DocumentsPage() {
  const navigate = useNavigate()
  const { identity } = useAdminAuth()
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [verification, setVerification] = useState(searchParams.get('verification') ?? '')
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const [showOrphans, setShowOrphans] = useState(false)
  const debouncedSearch = useDebouncedValue(search, 350)

  const { data, error, loading, reload } = useAdminQuery<Paginated<DocumentIndexRow>>('documents', {
    search: debouncedSearch,
    category,
    verification,
    page,
    pageSize: PAGE_SIZE,
  })

  const orphans = useAdminQuery<Paginated<OrphanStorageRow>>(
    'orphans',
    { page: 1, pageSize: 50 },
    { enabled: showOrphans },
  )

  const canDownload = roleCan(identity?.role, 'documents.download')
  const canVerify = roleCan(identity?.role, 'documents.verify')

  const resolveUrl = (row: DocumentIndexRow) =>
    adminApi<{ url: string }>('documentUrl', { query: { bucket: row.bucket_id ?? '', path: row.storage_path ?? '' } })

  const handlePreview = async (row: DocumentIndexRow) => {
    setActionError('')
    setBusy(row.storage_path ?? '')
    try {
      const { url } = await resolveUrl(row)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Preview failed.')
    } finally {
      setBusy(null)
    }
  }

  const handleDownload = async (row: DocumentIndexRow) => {
    setActionError('')
    setBusy(row.storage_path ?? '')
    try {
      const { url } = await resolveUrl(row)
      const blob = await fetchAsBlob(url)
      triggerBlobDownload(blob, row.file_name ?? 'document')
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Download failed.')
    } finally {
      setBusy(null)
    }
  }

  const handleVerify = async (row: DocumentIndexRow) => {
    setActionError('')
    setBusy(row.storage_path ?? '')
    try {
      await adminApi('document.verify', { body: { bucket: row.bucket_id, path: row.storage_path } })
      await reload()
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Verification failed.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="admin-stack">
      <div className="admin-toolbar" role="search">
        <div className="admin-field grow">
          <label htmlFor="doc-search">Search</label>
          <input
            id="doc-search"
            className="admin-input"
            type="search"
            placeholder="File name or organization"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="doc-category">Category</label>
          <select
            id="doc-category"
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
        <div className="admin-field">
          <label htmlFor="doc-verification">Verification</label>
          <select
            id="doc-verification"
            className="admin-select"
            value={verification}
            onChange={(event) => {
              setVerification(event.target.value)
              setPage(1)
            }}
          >
            <option value="">All</option>
            <option value="valid">Verified</option>
            <option value="invalid">Invalid references</option>
            <option value="missing">Missing objects</option>
          </select>
        </div>
        <button
          type="button"
          className="admin-btn"
          onClick={() => {
            setSearch('')
            setCategory('')
            setVerification('')
            setPage(1)
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {actionError ? (
        <p className="admin-state error" style={{ margin: 0 }} role="alert">
          {actionError}
        </p>
      ) : null}

      {loading ? (
        <LoadingPanel label="Loading document register…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : !data || data.rows.length === 0 ? (
        <EmptyState title="No documents match these filters" />
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table" style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th scope="col">File</th>
                  <th scope="col">Organization / Category</th>
                  <th scope="col">Section / Question</th>
                  <th scope="col">Storage</th>
                  <th scope="col">Verification</th>
                  <th scope="col">Uploaded</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={`${row.bucket_id}:${row.storage_path}`}>
                    <td>
                      <div className="admin-doc-name">{row.file_name || '—'}</div>
                      <div className="admin-doc-sub">
                        {row.content_type || 'unknown'} · {formatBytes(row.size_bytes)}
                      </div>
                    </td>
                    <td>
                      <div>{row.organization_name || '—'}</div>
                      <div className="admin-doc-sub">{ASSESSMENT_TYPE_LABEL[row.assessment_type]}</div>
                    </td>
                    <td className="mono">
                      {row.section_id || '—'}
                      <br />
                      {row.question_id || '—'}
                    </td>
                    <td className="admin-mono" style={{ maxWidth: 240, overflowWrap: 'anywhere' }}>
                      {row.bucket_id}
                      <br />
                      {row.storage_path}
                    </td>
                    <td>
                      <VerificationBadge row={row} />
                    </td>
                    <td className="nowrap">{formatDateTime(row.submitted_at)}</td>
                    <td>
                      <div className="admin-inline">
                        <button
                          type="button"
                          className="admin-btn small"
                          onClick={() => void handlePreview(row)}
                          disabled={busy === row.storage_path}
                        >
                          <Eye size={13} /> Preview
                        </button>
                        {canDownload ? (
                          <button
                            type="button"
                            className="admin-btn small"
                            onClick={() => void handleDownload(row)}
                            disabled={busy === row.storage_path}
                          >
                            <Download size={13} /> Download
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="admin-btn small"
                          onClick={() => navigate(`/admin/assessments/${row.assessment_type}/${row.assessment_id}`)}
                        >
                          <ExternalLink size={13} /> Assessment
                        </button>
                        {canVerify ? (
                          <button
                            type="button"
                            className="admin-btn small"
                            onClick={() => void handleVerify(row)}
                            disabled={busy === row.storage_path}
                          >
                            <ShieldCheck size={13} /> Verify
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

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Orphaned storage objects</h2>
          <button type="button" className="admin-btn small" onClick={() => setShowOrphans((value) => !value)}>
            {showOrphans ? 'Hide' : 'Scan for unreferenced objects'}
          </button>
        </div>
        {showOrphans ? (
          orphans.loading ? (
            <LoadingPanel label="Scanning storage…" />
          ) : orphans.error ? (
            <ErrorState message={orphans.error} onRetry={() => void orphans.reload()} />
          ) : !orphans.data || orphans.data.rows.length === 0 ? (
            <EmptyState title="No orphaned objects found">
              <p className="admin-muted" style={{ margin: 0 }}>
                Every storage object in the assessment buckets is referenced by an assessment.
              </p>
            </EmptyState>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Bucket</th>
                    <th scope="col">Storage path</th>
                    <th scope="col">Size</th>
                    <th scope="col">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orphans.data.rows.map((row) => (
                    <tr key={`${row.bucket_id}:${row.storage_path}`}>
                      <td className="admin-mono">{row.bucket_id}</td>
                      <td className="admin-mono" style={{ overflowWrap: 'anywhere' }}>{row.storage_path}</td>
                      <td className="nowrap">{formatBytes(row.size_bytes)}</td>
                      <td className="nowrap">{formatDateTime(row.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <p className="admin-muted" style={{ margin: 0 }}>
            Unreferenced objects are objects present in an assessment bucket but not linked to any submission.
          </p>
        )}
      </section>
    </div>
  )
}
