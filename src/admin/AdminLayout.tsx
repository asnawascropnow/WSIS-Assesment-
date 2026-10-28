import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Building2,
  FileSpreadsheet,
  FolderLock,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { useAdminAuth } from './auth/useAdminAuth'
import { roleCan, ROLE_LABEL } from './lib/permissions'
import type { Capability } from './lib/permissions'

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  capability?: Capability
}

const NAV_ITEMS: NavItem[] = [
  { to: '', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: 'assessments', label: 'Assessments', icon: ListChecks, capability: 'assessments.read' },
  { to: 'organizations', label: 'Organizations', icon: Building2, capability: 'organizations.read' },
  { to: 'documents', label: 'Documents & Evidence', icon: FolderLock, capability: 'documents.read' },
  { to: 'exports', label: 'Exports & Reports', icon: FileSpreadsheet, capability: 'exports.run' },
  { to: 'users', label: 'Admin Users & Roles', icon: Users, capability: 'users.manage' },
  { to: 'settings', label: 'Settings & Audit Logs', icon: Settings, capability: 'settings.read' },
]

function getPageMeta(pathname: string) {
  const base = pathname.startsWith('/assessment/admin') ? '/assessment/admin' : '/admin'
  if (pathname === base || pathname === `${base}/`) {
    return { title: 'Overview', subtitle: 'Assessment activity across every category' }
  }
  if (pathname.startsWith(`${base}/assessments/`)) {
    return { title: 'Assessment Report', subtitle: 'Section-wise answers and documents' }
  }
  if (pathname.startsWith(`${base}/assessments`)) {
    return { title: 'Assessment Register', subtitle: 'Every questionnaire submission' }
  }
  if (pathname.startsWith(`${base}/organizations/`)) {
    return { title: 'Organization Profile', subtitle: 'Assessment history for this organization' }
  }
  if (pathname.startsWith(`${base}/organizations`)) {
    return { title: 'Organization Directory', subtitle: 'All categories, deduplicated per category' }
  }
  if (pathname.startsWith(`${base}/documents`)) {
    return { title: 'Documents & Evidence', subtitle: 'Uploaded files and reference verification' }
  }
  if (pathname.startsWith(`${base}/exports`)) {
    return { title: 'Exports & Reports', subtitle: 'Excel workbooks, ZIP archives and consolidated reports' }
  }
  if (pathname.startsWith(`${base}/users`)) {
    return { title: 'Admin Users & Roles', subtitle: 'Administrator access and permissions' }
  }
  if (pathname.startsWith(`${base}/settings`)) {
    return { title: 'Settings & Audit Logs', subtitle: 'Configuration, versions and administrative activity' }
  }
  return { title: 'Admin', subtitle: '' }
}

export function AdminLayout() {
  const { identity, signOut } = useAdminAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const meta = getPageMeta(location.pathname)
  const role = identity?.role

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Admin navigation">
        <div className="admin-brand">
          <img src="/akashbhumi-logo.png" alt="" />
          <span className="admin-brand-text">
            <strong>Water Assessment</strong>
            <span>Admin Console</span>
          </span>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.filter((item) => !item.capability || roleCan(role, item.capability)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              <item.icon size={17} aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-chip">
            <strong>{identity?.email ?? '—'}</strong>
            <span>{role ? ROLE_LABEL[role] : '—'}</span>
          </div>
          <button
            type="button"
            className="admin-btn small"
            style={{ width: '100%', marginTop: 10 }}
            onClick={() => void signOut()}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen ? (
        <div className="admin-sidebar-scrim" role="presentation" onClick={() => setSidebarOpen(false)} />
      ) : null}

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-btn small admin-menu-toggle"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle navigation"
              aria-expanded={sidebarOpen}
            >
              <Menu size={16} />
            </button>
            <div>
              <h1 className="admin-page-title">{meta.title}</h1>
              {meta.subtitle ? <p className="admin-page-subtitle">{meta.subtitle}</p> : null}
            </div>
          </div>
          <div className="admin-inline">
            <span className="admin-badge category">
              <ShieldCheck size={13} aria-hidden />
              {role ? ROLE_LABEL[role] : 'Admin'}
            </span>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
