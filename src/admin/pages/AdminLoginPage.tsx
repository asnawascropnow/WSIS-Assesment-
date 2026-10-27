import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LogIn, ShieldCheck } from 'lucide-react'
import { useAdminAuth } from '../auth/useAdminAuth'

export function AdminLoginPage() {
  const { signIn, signOut, status, error: authError } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') return <Navigate to="/admin" replace />

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <span className="admin-badge mint">
          <ShieldCheck size={14} aria-hidden /> Restricted area
        </span>
        <h1>Admin Sign In</h1>
        <p>Sign in with your administrator account to manage water assessment submissions.</p>

        {status === 'forbidden' ? (
          <div className="admin-state error" style={{ marginBottom: 16 }} role="alert">
            <strong>Access denied</strong>
            <p style={{ margin: '0 0 12px' }}>{authError || 'This account is not an administrator.'}</p>
            <button type="button" className="admin-btn" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        ) : null}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              className="admin-input"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              className="admin-input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? (
            <p className="admin-state error" style={{ margin: 0 }} role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="admin-btn primary" disabled={submitting}>
            <LogIn size={16} /> {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="admin-muted" style={{ marginTop: 18, fontSize: '.8rem' }}>
          Administrator accounts are provisioned by an existing super admin. Self-service registration is disabled.
        </p>
      </div>
    </div>
  )
}
