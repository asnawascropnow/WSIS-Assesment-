import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './admin.css'
import { AdminAuthProvider } from './auth/AdminAuthProvider'
import { useAdminAuth } from './auth/useAdminAuth'
import { AdminLayout } from './AdminLayout'
import { roleCan, type Capability } from './lib/permissions'
import { ErrorState, Spinner } from './components/ui'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { OverviewPage } from './pages/OverviewPage'
import { AssessmentsPage } from './pages/AssessmentsPage'
import { AssessmentReportPage } from './pages/AssessmentReportPage'
import { OrganizationsPage } from './pages/OrganizationsPage'
import { OrganizationProfilePage } from './pages/OrganizationProfilePage'
import { DocumentsPage } from './pages/DocumentsPage'
import { ExportsPage } from './pages/ExportsPage'
import { UsersPage } from './pages/UsersPage'
import { SettingsPage } from './pages/SettingsPage'

function FullScreenLoading() {
  return (
    <div className="admin-login-screen">
      <div className="admin-inline">
        <Spinner />
        <span>Loading admin console…</span>
      </div>
    </div>
  )
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { status } = useAdminAuth()
  if (status === 'loading') return <FullScreenLoading />
  if (status !== 'authenticated') return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

function CapabilityGate({ capability, children }: { capability: Capability; children: ReactNode }) {
  const { identity } = useAdminAuth()
  if (!roleCan(identity?.role, capability)) {
    return <ErrorState message="Your role does not have permission to view this section." />
  }
  return <>{children}</>
}

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<CapabilityGate capability="assessments.read"><OverviewPage /></CapabilityGate>} />
            <Route
              path="assessments"
              element={
                <CapabilityGate capability="assessments.read">
                  <AssessmentsPage />
                </CapabilityGate>
              }
            />
            <Route
              path="assessments/:type/:id"
              element={
                <CapabilityGate capability="assessments.read">
                  <AssessmentReportPage />
                </CapabilityGate>
              }
            />
            <Route
              path="organizations"
              element={
                <CapabilityGate capability="organizations.read">
                  <OrganizationsPage />
                </CapabilityGate>
              }
            />
            <Route
              path="organizations/:type/:name"
              element={
                <CapabilityGate capability="organizations.read">
                  <OrganizationProfilePage />
                </CapabilityGate>
              }
            />
            <Route
              path="documents"
              element={
                <CapabilityGate capability="documents.read">
                  <DocumentsPage />
                </CapabilityGate>
              }
            />
            <Route
              path="exports"
              element={
                <CapabilityGate capability="exports.run">
                  <ExportsPage />
                </CapabilityGate>
              }
            />
            <Route
              path="users"
              element={
                <CapabilityGate capability="users.manage">
                  <UsersPage />
                </CapabilityGate>
              }
            />
            <Route
              path="settings"
              element={
                <CapabilityGate capability="settings.read">
                  <SettingsPage />
                </CapabilityGate>
              }
            />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  )
}
