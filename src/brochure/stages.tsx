
import { useRef, useState } from 'react'
import { Img as Image } from './img'
import { SectionBand } from './motion-root'

const STAGES = [
  {
    name: 'Understand',
    title: 'Understand',
    text: 'Review water sources, demand, quality, cost, infrastructure, STPs, pumps, and energy use, and identify where water is being lost.',
    image: '/images/solutions/assess-water-meter.webp',
    alt: 'Close-up of a water meter with its cover open',
  },
  {
    name: 'Capture',
    title: 'Capture & Protect',
    text: 'Evaluate rooftop, surface, and subsurface rainwater harvesting, suitable alternative sources, leak detection, pipe restoration, and infrastructure improvements.',
    image: '/images/solutions/capture-rooftop-rwh.webp',
    alt: 'Rooftop rainwater harvesting downpipes feeding a storage tank',
  },
  {
    name: 'Store & Treat',
    title: 'Treat & Make Water Fit for Purpose',
    text: 'Plan storage and identify appropriate wastewater treatment, drinking-water solutions, filtration, and biological contamination treatment for the intended use.',
    image: '/images/solutions/treat-aeration-bengaluru.webp',
    alt: 'Aeration tank at a sewage treatment plant in Bengaluru',
  },
  {
    name: 'Reuse',
    title: 'Reuse & Optimise',
    text: 'Return treated water to flushing, gardening, cooling, and other suitable uses, improve distribution and fixtures, and recycle greywater and blackwater.',
    image: '/images/reuse-irrigation.webp',
    alt: 'Treated water being reused for landscape irrigation',
  },
  {
    name: 'Measure',
    title: 'Measure & Improve',
    text: 'Track purchased water, harvested water, reuse, energy, and cost against an agreed baseline. Use the results to prioritise the next phase.',
    image: '/images/website/clarifier-topdown.webp',
    alt: 'Top-down view of a circular clarifier tank',
  },
]

export function Stages() {
  const [active, setActive] = useState<number | null>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const list = listRef.current
    const float = floatRef.current
    if (!list || !float) return
    const box = list.getBoundingClientRect()
    float.style.transform = `translate3d(${e.clientX - box.left}px, ${e.clientY - box.top}px, 0) translate(32px, -50%)`
  }

  return (
    <section id="approach" className="stages curtain" data-curtain data-tone="dark" aria-labelledby="stages-title">
      <SectionBand title="Our Approach" />
      <div className="wrap">
        <div className="jrny__head">
          <div>
            <h3 id="stages-title" className="h2" data-lines>
              <span className="line">
                <span>
                  Our <span className="serif">Five-Stage</span>
                </span>
              </span>
              <span className="line">
                <span>Approach.</span>
              </span>
            </h3>
          </div>
          <p className="jrny__path" data-reveal>
            {STAGES.map((s, i) => (
              <span key={s.name}>
                {s.name}
                {i < STAGES.length - 1 && <em aria-hidden="true">{'→'}</em>}
              </span>
            ))}
          </p>
        </div>

        <div className="jrny__stage">
          <ol ref={listRef} className="jrny__list" onMouseMove={onMove} onMouseLeave={() => setActive(null)}>
            {STAGES.map((s, i) => (
              <li
                key={s.name}
                className={`jrny__row${active === i ? ' is-active' : ''}${active !== null && active !== i ? ' is-dim' : ''}`}
                onMouseEnter={() => setActive(i)}
                data-reveal={i * 0.06}
              >
                <span className="jrny__n" aria-hidden="true">{`0${i + 1}`}</span>
                <h4 className="jrny__name">{s.name}</h4>
                <div className="jrny__text">
                  {s.title !== s.name && <strong>{s.title}</strong>}
                  <p>{s.text}</p>
                </div>
                <span className="jrny__thumb">
                  <Image src={s.image} alt={s.alt} fill sizes="(max-width: 900px) 90vw, 1px" />
                </span>
              </li>
            ))}
          </ol>

          <div ref={floatRef} className={`jrny__float${active !== null ? ' is-on' : ''}`} aria-hidden="true">
            {STAGES.map((s, i) => (
              <div key={s.name} className={`jrny__float-img${active === i ? ' is-active' : ''}`}>
                <Image src={s.image} alt="" fill sizes="360px" />
              </div>
            ))}
          </div>
        </div>

        <p className="fine-print" data-reveal>
          The interventions selected for each site depend on its conditions, water quality, infrastructure, and intended
          uses.
        </p>
      </div>
    </section>
  )
}
