import { Img as Image } from './img'
import { ScrubWords, SectionBand } from './motion-root'

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
      <div className="challenge__bg" aria-hidden="true">
        <Image
          src="/images/website/clarifiers-forest.webp"
          alt=""
          fill
          sizes="100vw"
          data-parallax="6"
        />
      </div>
      <SectionBand title="Why We Do This" className="band--challenge" />
      <div className="wrap">
        <h2 id="why-title" className="h2 challenge__title" data-lines>
          <span className="line">
            <span>
              Water Risk Is <span className="serif">Business</span> Risk.
            </span>
          </span>
        </h2>

        <div className="challenge__hero-panel">
          <blockquote className="challenge__vow">
            <p data-scrub-words>
              <ScrubWords text="The sources you depend on today may not supply you with water tomorrow." />
            </p>
            <p className="challenge__vow-answer" data-reveal>
              Our solutions <span className="serif">will.</span>
            </p>
          </blockquote>

          <div className="challenge__insight-bar">
            <h3 className="challenge__tag" data-reveal>
              The Core <span className="serif">Challenge.</span>
            </h3>
            <p className="challenge__insight-text" data-reveal>
              The challenge is not simply finding more water. It is understanding where water comes from, how it is used, where it is lost, and what can be recovered.
            </p>
          </div>
        </div>

        <div className="challenge__section-foot">
          <h3 className="challenge__list-title" data-reveal>
            The Challenges We <span className="serif">Address.</span>
          </h3>
          <div className="challenge__grid">
            {CHALLENGES.map((c, i) => (
              <div key={c.title} className="challenge__card" data-reveal={i * 0.08}>
                <span className="challenge__card-num">{`0${i + 1}`}</span>
                <h4 className="challenge__card-title">{c.title}</h4>
                <p className="challenge__card-text">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
