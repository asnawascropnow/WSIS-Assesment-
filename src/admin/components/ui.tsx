import { type ReactNode } from 'react'
import { AlertTriangle, Inbox, X } from 'lucide-react'
import { REVIEW_STATUS_LABEL } from '../lib/format'
import type { ReviewStatus } from '../lib/types'

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: string }) {
  return <span className={`admin-badge ${tone}`}>{children}</span>
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus | null | undefined }) {
  if (!status) return <Badge tone="neutral">Unknown</Badge>
  return <Badge tone={status}>{REVIEW_STATUS_LABEL[status] ?? status}</Badge>
}

export function Spinner() {
  return <span className="admin-spinner" role="status" aria-label="Loading" />
}

export function LoadingPanel({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="admin-state" role="status" aria-live="polite">
      <div className="admin-skeleton-stack">
        <span className="admin-skeleton" style={{ width: '38%' }} />
        <span className="admin-skeleton" style={{ width: '72%' }} />
        <span className="admin-skeleton" style={{ width: '58%' }} />
      </div>
      <span className="admin-muted">{label}</span>
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="admin-state">
      <Inbox size={26} style={{ marginBottom: 8 }} aria-hidden />
      <strong>{title}</strong>
      {children}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="admin-state error" role="alert">
      <AlertTriangle size={24} style={{ marginBottom: 8 }} aria-hidden />
      <strong>Something went wrong</strong>
      <p style={{ margin: '0 0 12px' }}>{message}</p>
      {onRetry ? (
        <button type="button" className="admin-btn" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  )
}

export function Pagination({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number
  pageSize: number
  total: number
  onPage: (page: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <nav className="admin-pagination" aria-label="Pagination">
      <span className="admin-muted">
        Showing {start}–{end} of {total}
      </span>
      <span className="admin-pagination-controls">
        <button
          type="button"
          className="admin-btn small"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="admin-inline">
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          className="admin-btn small"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </span>
    </nav>
  )
}

export function Modal({
  title,
  children,
  onClose,
  actions,
}: {
  title: string
  children: ReactNode
  onClose: () => void
  actions?: ReactNode
}) {
  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="admin-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="admin-inline" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button type="button" className="admin-btn small" onClick={onClose} aria-label="Close dialog">
            <X size={15} />
          </button>
        </div>
        {children}
        {actions ? <div className="admin-modal-actions">{actions}</div> : null}
      </div>
    </div>
  )
}
