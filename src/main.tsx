import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!

if (window.location.pathname.startsWith('/admin')) {
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
