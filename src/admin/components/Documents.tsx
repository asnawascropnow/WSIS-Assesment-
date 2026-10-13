import { useState } from 'react'
import { Download, Eye, FileText, ShieldAlert, ShieldCheck } from 'lucide-react'
import { adminApi, fetchAsBlob, triggerBlobDownload } from '../lib/api'
import { formatBytes } from '../lib/format'
import type { AttachmentReference, DocumentIndexRow } from '../lib/types'
import { Badge } from './ui'

type DocumentListProps = {
  references: AttachmentReference[]
  verificationByPath?: Map<string, DocumentIndexRow>
  readOnly?: boolean
}

function VerificationBadge({ row }: { row: DocumentIndexRow | undefined }) {
  if (!row) return <Badge tone="neutral">Unverified</Badge>
  if (row.reference_valid) return <Badge tone="valid">Verified</Badge>
  if (!row.storage_exists) return <Badge tone="missing">Missing object</Badge>
  return <Badge tone="invalid">Invalid reference</Badge>
}

export function DocumentList({ references, verificationByPath, readOnly = false }: DocumentListProps) {
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  if (references.length === 0) {
    return <p className="admin-muted" style={{ margin: '8px 0 0' }}>No documents attached to this question.</p>
  }

  const resolveUrl = async (reference: AttachmentReference): Promise<string> => {
    const data = await adminApi<{ url: string }>('documentUrl', {
      query: { bucket: reference.bucket_id, path: reference.storage_path },
    })
    return data.url
  }

  const handlePreview = async (reference: AttachmentReference) => {
    setError('')
    setBusy(reference.storage_path)
    try {
      const url = await resolveUrl(reference)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Preview failed.')
    } finally {
      setBusy(null)
    }
  }

  const handleDownload = async (reference: AttachmentReference) => {
    setError('')
    setBusy(reference.storage_path)
    try {
      const url = await resolveUrl(reference)
      const blob = await fetchAsBlob(url)
      triggerBlobDownload(blob, reference.file_name)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Download failed.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="admin-doc-list">
      {references.map((reference) => {
        const row = verificationByPath?.get(reference.storage_path)
        const invalid = row ? !row.reference_valid : false
        return (
          <div className="admin-doc-row" key={reference.storage_path}>
            <div className="admin-doc-meta">
              <span className="admin-doc-name">
                <FileText size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} aria-hidden />
                {reference.file_name}
              </span>
              <span className="admin-doc-sub">
                {reference.content_type || 'unknown type'} · {formatBytes(reference.size_bytes)} ·{' '}
                <span className="admin-mono">{reference.section_id}/{reference.question_id}</span>
              </span>
              <span className="admin-doc-sub">
                <span className="admin-inline">
                  {row?.reference_valid ? <ShieldCheck size={13} aria-hidden /> : <ShieldAlert size={13} aria-hidden />}
                  <VerificationBadge row={row} />
                </span>{' '}
                <span className="admin-mono">{reference.storage_path}</span>
              </span>
            </div>
            <div className="admin-doc-actions">
              <button
                type="button"
                className="admin-btn small"
                onClick={() => handlePreview(reference)}
                disabled={busy === reference.storage_path}
              >
                <Eye size={14} /> Preview
              </button>
              {!readOnly ? (
                <button
                  type="button"
                  className="admin-btn small"
                  onClick={() => handleDownload(reference)}
                  disabled={busy === reference.storage_path}
                >
                  <Download size={14} /> Download
                </button>
              ) : null}
            </div>
            {invalid ? (
              <div className="admin-doc-warning">
                This document reference does not match its assessment, bucket, or storage object. Do not trust this file.
              </div>
            ) : null}
          </div>
        )
      })}
      {error ? (
        <p className="admin-state error" style={{ margin: 0 }} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
