import { useEffect } from 'react'
import './globals.css'
import { SiteHeader } from './site-header'
import { Introduction } from './intro'
import { WhoWeAre } from './who-we-are'
import { Problem } from './problem'
import { Challenge } from './challenge'
import { Helps } from './audiences'
import { Process } from './process'
import { Infographic } from './infographic'
import { Stages } from './stages'
import { Solutions } from './solutions'
import { Projects } from './projects'
import { Clients } from './clients'
import { Team } from './team'
import { Closing } from './closing'
import { SiteFooter } from './site-footer'
import { MotionRoot, SectionBand } from './motion-root'

export default function BrochurePage() {
  useEffect(() => {
    document.body.classList.add('brochure-active')
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('js-motion')
    }
    return () => {
      document.body.classList.remove('brochure-active')
      document.documentElement.classList.remove('js-motion')
    }
  }, [])

  return (
    <div className="brochure">
      <a href="#main" className="sr-only skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Introduction />
        <Problem />
        <WhoWeAre />
        <Challenge />
        <Helps />
        <section id="how-we-do-it" aria-labelledby="how-title">
          <div className="band-block" data-tone="dark">
            <SectionBand title="How We Do It" />
          </div>
          <Process />
          <Infographic />
          <Stages />
          <Solutions />
        </section>
        <Projects />
        <Clients />
        <Team />
        <Closing />
      </main>
      <SiteFooter />
      <MotionRoot />
    </div>
  )
}
