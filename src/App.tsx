import { lazy, Suspense } from 'react'
import { useLinkInterceptor, usePathname } from './router'
import BrochurePage from './brochure/BrochurePage'

const AssessmentApp = lazy(() => import('./AssessmentApp'))

function App() {
  const pathname = usePathname()
  useLinkInterceptor()

  if (pathname.startsWith('/assessment')) {
    return (
      <Suspense fallback={<div className="route-loading" aria-hidden="true" />}>
        <AssessmentApp />
      </Suspense>
    )
  }

  return <BrochurePage />
}

export default App
