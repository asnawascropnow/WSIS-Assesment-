import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!

if (window.location.pathname.startsWith('/admin')) {
  // Admin console is code-split so the public questionnaire bundle stays lean.
  void import('./admin/AdminApp.tsx').then(({ AdminApp }) => {
    createRoot(container).render(
      <StrictMode>
        <AdminApp />
      </StrictMode>,
    )
  })
} else if (window.location.pathname.startsWith('/components')) {
  // ui-layouts component gallery — code-split so it never touches the public app.
  void import('./components/gallery/UiGallery.tsx').then(({ UiGallery }) => {
    createRoot(container).render(
      <StrictMode>
        <UiGallery />
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
