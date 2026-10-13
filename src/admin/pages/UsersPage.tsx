import { useState } from 'react'
import { Plus, Trash2, UserCheck, UserX } from 'lucide-react'
import { useAdminAuth } from '../auth/useAdminAuth'
import { useAdminQuery } from '../lib/useAdminQuery'
import { adminApi } from '../lib/api'
import { ROLE_DESCRIPTION, ROLE_LABEL } from '../lib/permissions'
import { formatDateTime } from '../lib/format'
import { Badge, EmptyState, ErrorState, LoadingPanel, Modal } from '../components/ui'
import type { AdminIdentity, AdminRole, AdminUserRow } from '../lib/types'

type UsersResponse = { rows: AdminUserRow[]; me: AdminIdentity }

const ROLE_OPTIONS: AdminRole[] = ['super_admin', 'reviewer', 'analyst', 'document_manager']

export function UsersPage() {
  const { identity } = useAdminAuth()
  const { data, error, loading, reload } = useAdminQuery<UsersResponse>('users')

  const [createOpen, setCreateOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AdminRole>('reviewer')
  const [formError, setFormError] = useState('')
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<AdminUserRow | null>(null)

  const handleCreate = async () => {
    setFormError('')
    setBusy(true)
    try {
      await adminApi('users.create', { body: { email: email.trim(), password, role } })
      setCreateOpen(false)
      setEmail('')
      setPassword('')
      setRole('reviewer')
      await reload()
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : 'Could not create the administrator.')
    } finally {
      setBusy(false)
    }
  }

  const handleRoleChange = async (user: AdminUserRow, nextRole: AdminRole) => {
    setActionError('')
    try {
      await adminApi('users.updateRole', { body: { userId: user.user_id, role: nextRole } })
      await reload()
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Could not update the role.')
    }
  }

  const handleToggleActive = async (user: AdminUserRow) => {
    setActionError('')
    try {
      await adminApi('users.setActive', { body: { userId: user.user_id, isActive: !user.is_active } })
      await reload()
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Could not update the account.')
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setActionError('')
    setBusy(true)
    try {
      await adminApi('users.delete', { body: { userId: pendingDelete.user_id } })
      setPendingDelete(null)
      await reload()
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Could not delete the administrator.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-stack">
      <div className="admin-inline" style={{ justifyContent: 'space-between' }}>
        <p className="admin-muted" style={{ margin: 0 }}>
          Administrator accounts are provisioned here using Supabase Auth admin APIs. Self-service registration is not
          available.
        </p>
        <button type="button" className="admin-btn primary" onClick={() => setCreateOpen(true)}>
          <Plus size={15} /> Add administrator
        </button>
      </div>

      {actionError ? (
        <p className="admin-state error" style={{ margin: 0 }} role="alert">
          {actionError}
        </p>
      ) : null}

      {loading ? (
        <LoadingPanel label="Loading administrators…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : !data || data.rows.length === 0 ? (
        <EmptyState title="No administrators configured" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Added</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((user) => {
                const isSelf = user.user_id === identity?.id
                return (
                  <tr key={user.user_id}>
                    <td>
                      {user.email}
                      {isSelf ? <span className="admin-muted"> (you)</span> : null}
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        style={{ minHeight: 36 }}
                        value={user.role}
                        onChange={(event) => void handleRoleChange(user, event.target.value as AdminRole)}
                        aria-label={`Role for ${user.email}`}
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {ROLE_LABEL[option]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <Badge tone={user.is_active ? 'valid' : 'invalid'}>{user.is_active ? 'Active' : 'Disabled'}</Badge>
                    </td>
                    <td className="nowrap">{formatDateTime(user.created_at)}</td>
                    <td>
                      <div className="admin-inline">
                        <button
                          type="button"
                          className="admin-btn small"
                          onClick={() => void handleToggleActive(user)}
                          disabled={isSelf}
                        >
                          {user.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                          {user.is_active ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          type="button"
                          className="admin-btn small danger"
                          onClick={() => setPendingDelete(user)}
                          disabled={isSelf}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Role reference</h2>
        </div>
        <div className="admin-card">
          <dl className="admin-stack" style={{ margin: 0 }}>
            {ROLE_OPTIONS.map((option) => (
              <div key={option}>
                <dt style={{ fontWeight: 900 }}>{ROLE_LABEL[option]}</dt>
                <dd className="admin-muted" style={{ margin: '2px 0 0' }}>
                  {ROLE_DESCRIPTION[option]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {createOpen ? (
        <Modal
          title="Add administrator"
          onClose={() => setCreateOpen(false)}
          actions={
            <>
              <button type="button" className="admin-btn" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
              <button type="button" className="admin-btn primary" onClick={() => void handleCreate()} disabled={busy}>
                {busy ? 'Creating…' : 'Create account'}
              </button>
            </>
          }
        >
          <div className="admin-stack">
            <div className="admin-field">
              <label htmlFor="new-admin-email">Email address</label>
              <input
                id="new-admin-email"
                className="admin-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="new-admin-password">Temporary password</label>
              <input
                id="new-admin-password"
                className="admin-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="new-admin-role">Role</label>
              <select
                id="new-admin-role"
                className="admin-select"
                value={role}
                onChange={(event) => setRole(event.target.value as AdminRole)}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {ROLE_LABEL[option]}
                  </option>
                ))}
              </select>
            </div>
            {formError ? (
              <p className="admin-state error" style={{ margin: 0 }} role="alert">
                {formError}
              </p>
            ) : null}
          </div>
        </Modal>
      ) : null}

      {pendingDelete ? (
        <Modal
          title="Delete administrator"
          onClose={() => setPendingDelete(null)}
          actions={
            <>
              <button type="button" className="admin-btn" onClick={() => setPendingDelete(null)}>
                Cancel
              </button>
              <button type="button" className="admin-btn danger" onClick={() => void handleDelete()} disabled={busy}>
                {busy ? 'Deleting…' : 'Delete account'}
              </button>
            </>
          }
        >
          <p>
            Delete <strong>{pendingDelete.email}</strong>? This removes the administrator record and disables their sign-in.
            This action cannot be undone.
          </p>
        </Modal>
      ) : null}
    </div>
  )
}
