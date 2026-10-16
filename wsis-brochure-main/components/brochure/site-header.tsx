'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRightIcon } from '@primer/octicons-react'
import { BrandLockup } from './brand-lockup'
import { ASSESSMENT_URL, INITIATIVE_URL } from '@/lib/site'

export function SiteHeader() {
  const [tone, setTone] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const toneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setTone((entry.target as HTMLElement).dataset.tone === 'dark' ? 'dark' : 'light')
        })
      },
      { rootMargin: '-40px 0px -92% 0px' },
    )
    document.querySelectorAll('[data-tone]').forEach((el) => toneObserver.observe(el))
    return () => toneObserver.disconnect()
  }, [])

  return (
    <header className="site-header" data-tone={tone}>
      <div className="wrap site-header__bar">
        <a href="#top" className="site-header__brand" aria-label="Net-Zero Water Resource Initiative, back to top">
          <BrandLockup />
        </a>
        <nav className="site-header__actions" aria-label="Primary">
          <a href={INITIATIVE_URL} target="_blank" rel="noopener noreferrer" className="site-header__link">
            Net Zero Initiative
            <ArrowUpRightIcon size={14} />
          </a>
          <a href={ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
            <span className="cta-long">Request a Water Assessment</span>
            <span className="cta-short" aria-hidden="true">
              Assessment
            </span>
            <ArrowUpRightIcon size={16} />
          </a>
        </nav>
      </div>
    </header>
  )
}
