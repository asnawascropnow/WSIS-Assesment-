import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!

// The admin console lives at /admin; /assessment/admin is accepted as an alias
// so the dashboard is also reachable from the assessment section. Must be
// checked before the /assessment branch, which would otherwise render the form.
const path = window.location.pathname
const isAdminRoute = path.startsWith('/admin') || path.startsWith('/assessment/admin')

if (isAdminRoute) {
  void import('./admin/AdminApp.tsx').then(({ AdminApp }) => {
    createRoot(container).render(
      <StrictMode>
        <AdminApp />
      </StrictMode>,
    )
  })
} else if (window.location.pathname.startsWith('/components')) {
  void import('./components/gallery/UiGallery.tsx').then(({ UiGallery }) => {
    createRoot(container).render(
      <StrictMode>
        <UiGallery />
      </StrictMode>,
    )
  })
} else if (window.location.pathname.startsWith('/testing')) {
  void import('./AssessmentApp.tsx').then(({ default: AssessmentApp }) => {
    createRoot(container).render(
      <StrictMode>
        <AssessmentApp testingMode />
      </StrictMode>,
    )
  })
} else {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
