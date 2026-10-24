import { Hero } from './hero'
import { SectionBand } from './motion-root'

export function Introduction() {
  return (
    <section id="introduction" className="intro" data-tone="light" aria-labelledby="intro-title">
      <Hero />

      <SectionBand title="Introduction" className="band--intro" />
      <div className="wrap intro__inner">
        <span className="eyebrow">01 · Introduction</span>
        <div className="intro__grid">
          <p className="body-lead intro__lead">
            <strong>CropNow</strong> and <strong>ALTTECH Foundation</strong> work together on Net-Zero Water projects, with{' '}
            <strong>Akash Bhumi</strong> providing the resource intelligence layer that connects spatial understanding, data, and decision-making. Together, the collaboration helps organisations understand their water requirements, identify opportunities, and implement solutions suited to their sites.
          </p>

          <div className="intro__head">
            <h2 id="intro-title" className="h2" data-lines>
              <span className="line">
                <span>Your Water. Your Resources.</span>
              </span>
              <span className="line">
                <span>
                  Your <span className="serif">Future.</span>
                </span>
              </span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  )
}

