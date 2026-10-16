import Image from 'next/image'
import { ScrubText, ScrubWords, SectionBand } from './motion-root'

const CHALLENGES = [
  { title: 'Dependence', text: 'Identify opportunities to reduce avoidable dependence on purchased water.' },
  {
    title: 'Inefficiency',
    text: 'Find water losses, inefficient consumption, and opportunities to improve treatment and distribution.',
  },
  {
    title: 'Untapped resources',
    text: 'Explore suitable rainwater harvesting, alternative sources, and treated-water reuse opportunities.',
  },
  {
    title: 'Operational pressure',
    text: 'Understand the relationship between water, pumping, treatment, energy costs, and supply resilience.',
  },
]

export function Challenge() {
  return (
    <section id="why" className="challenge curtain" data-curtain data-tone="dark" aria-labelledby="why-title">
      <SectionBand title="Why We Do This" />
      <div className="wrap">
        <div className="challenge__head">
          <span className="eyebrow">02 · Why we are doing this</span>
        </div>
        <h2 id="why-title" className="h2 challenge__title" data-lines>
          <span className="line">
            <span>
              Water Risk Is <span className="serif">Business</span> Risk.
            </span>
          </span>
        </h2>
        <p className="scrub-text" data-scrub-words>
          <ScrubWords text="Water is essential to every operation, but reliable and affordable supply cannot be taken for granted." />
        </p>

        <blockquote className="challenge__vow">
          <p data-scrub-words>
            <ScrubWords text="The sources you depend on today may not supply you with water tomorrow." />
          </p>
          <p className="challenge__vow-answer" data-reveal>
            Our solutions <span className="serif">will.</span>
          </p>
        </blockquote>

        <div className="challenge__body">
          <div className="challenge__media" data-clip>
            <Image
              src="/images/website/clarifiers-forest.jpg"
              alt="Aerial view of two circular water treatment clarifiers surrounded by forest"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              style={{ objectFit: 'cover' }}
              data-parallax="8"
            />
          </div>
          <div className="challenge__copy">
            <div className="challenge__paras">
              <ScrubText text="Dependence on municipal supply, borewells, and tankers can expose organisations to uncertain availability and rising costs. At the same time, leaks, inefficient systems, and missed reuse opportunities can cause valuable water and energy to go to waste." />
              <ScrubText
                className="challenge__emph"
                text="The challenge is not simply finding more water. It is understanding where water comes from, how it is used, where it is lost, and what can be recovered."
              />
              <ScrubText text="We bring water intelligence and practical engineering together to help organisations make informed decisions, improve resource efficiency, and build more resilient water systems." />
            </div>
            <h3 className="challenge__list-title">The challenges we address</h3>
            <ol className="benefits">
              {CHALLENGES.map((c, i) => (
                <li key={c.title} className="benefit" data-reveal={i * 0.08}>
                  <span className="benefit__n">{`0${i + 1}`}</span>
                  <div>
                    <h4 className="h3" style={{ fontSize: 22 }}>
                      {c.title}
                    </h4>
                    <p>{c.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
