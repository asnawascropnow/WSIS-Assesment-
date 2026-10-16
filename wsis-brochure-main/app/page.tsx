import { SiteHeader } from '@/components/brochure/site-header'
import { Introduction } from '@/components/brochure/intro'
import { WhoWeAre } from '@/components/brochure/who-we-are'
import { Problem } from '@/components/brochure/problem'
import { Challenge } from '@/components/brochure/challenge'
import { Helps } from '@/components/brochure/audiences'
import { Process } from '@/components/brochure/process'
import { Infographic } from '@/components/brochure/infographic'
import { Stages } from '@/components/brochure/stages'
import { Solutions } from '@/components/brochure/solutions'
import { Collaboration } from '@/components/brochure/collaboration'
import { Projects } from '@/components/brochure/projects'
import { Clients } from '@/components/brochure/clients'
import { Team } from '@/components/brochure/team'
import { Closing } from '@/components/brochure/closing'
import { SiteFooter } from '@/components/brochure/site-footer'
import { MotionRoot, SectionBand } from '@/components/brochure/motion-root'

export default function Page() {
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
          <Collaboration />
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
