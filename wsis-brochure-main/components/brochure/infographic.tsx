import { useEffect, useState } from 'react'
import { ScrubText, SectionBand } from './motion-root'

const SYSTEM = [
  {
    title: 'Alternative sources',
    stage: 'Catchment',
    detail: 'Rooftop water · Surface water · Suitable subsurface water',
    icon: 'rain',
  },
  {
    title: 'Collection & storage',
    stage: 'Storage',
    detail: 'Sized according to geography, climate, and demand',
    icon: 'tank',
  },
  {
    title: 'Treatment',
    stage: 'Purification',
    detail: 'Appropriate to the intended use',
    icon: 'treat',
  },
  {
    title: 'Distribution',
    stage: 'Efficiency',
    detail: 'Optimised, with water-efficient fixtures',
    icon: 'tap',
  },
  {
    title: 'Reuse',
    stage: 'Circular Loop',
    detail: 'Gardening, flushing, cooling, and other appropriate non-potable uses',
    icon: 'loop',
  },
] as const

function NodeIcon({ name }: { name: (typeof SYSTEM)[number]['icon'] }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'rain':
      return (
        <svg {...common}>
          <path d="M7 14a4 4 0 0 1 .5-8 5 5 0 0 1 9.6 1.5A3.5 3.5 0 0 1 17 14H7Z" />
          <path d="M8 17.5 7 20M12 17.5 11 20M16 17.5 15 20" />
        </svg>
      )
    case 'tank':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="7" ry="2.5" />
          <path d="M5 6v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
          <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
        </svg>
      )
    case 'treat':
      return (
        <svg {...common}>
          <path d="M12 3s5.5 6 5.5 10a5.5 5.5 0 0 1-11 0C6.5 9 12 3 12 3Z" />
          <path d="m9.5 13.5 1.8 1.8 3.2-3.6" />
        </svg>
      )
    case 'tap':
      return (
        <svg {...common}>
          <path d="M4 9h9a3 3 0 0 1 3 3v1" />
          <path d="M4 6v6M9 6V4M7 4h4" />
          <path d="M16 16.5s1.5 1.8 1.5 2.8a1.5 1.5 0 0 1-3 0c0-1 1.5-2.8 1.5-2.8Z" />
        </svg>
      )
    case 'loop':
      return (
        <svg {...common}>
          <path d="M20 12a8 8 0 0 1-14.2 5" />
          <path d="M4 12a8 8 0 0 1 14.2-5" />
          <path d="M18.5 3v4h-4M5.5 21v-4h4" />
        </svg>
      )
  }
}

export function Infographic() {
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (!modalOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [modalOpen])

  return (
    <section
      id="water-system"
      className="system curtain"
      data-curtain
      data-tone="light"
      aria-labelledby="system-title"
    >
      <SectionBand title="The Water System" reverse />
      <div className="wrap">
        <div className="system__head">
          <div>
            <h3 id="system-title" className="h2" data-lines>
              <span className="line">
                <span>What the</span>
              </span>
              <span className="line">
                <span>
                  <span className="serif">infographic</span> means.
                </span>
              </span>
            </h3>
          </div>
          <ScrubText
            className="body-lead"
            text="The diagram contrasts conventional supply (municipal water, borewells, and tankers) with a site-specific system designed to capture, store, treat, and reuse suitable water resources."
          />
        </div>

        <div className="system__board" role="group" aria-label="Water system diagram">
          {/* LEFT: Infographic Image Showcase */}
          <div
            className="lane lane--infographic"
            data-reveal
            onClick={() => setModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setModalOpen(true)
              }
            }}
            aria-label="Click to enlarge water independence infographic"
          >
            <button
              type="button"
              className="infographic-preview__enlarge"
              onClick={(e) => {
                e.stopPropagation()
                setModalOpen(true)
              }}
              aria-label="Enlarge infographic overview"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              <span>Enlarge</span>
            </button>
            <img
              src="/images/water-system-infographic.jpg"
              alt="3D isometric infographic showing water independence lifecycle: external supply vs. on-site catchment, treatment, storage, distribution, and reuse"
              className="infographic-preview__image"
              loading="lazy"
            />
          </div>

          {/* RIGHT: Site-Specific System (Vertical Flow) */}
          <div className="lane lane--system" data-reveal="0.1">
            <div className="vflow">
              <ol className="vflow__list">
                {SYSTEM.map((n, i) => (
                  <li
                    key={n.title}
                    className={`vflow__item ${i === 4 ? 'vflow__item--loop' : ''}`}
                    data-reveal={i * 0.08}
                  >
                    <div className="vflow__marker-col">
                      <span className="vflow__icon">
                        <NodeIcon name={n.icon} />
                      </span>
                      {i < SYSTEM.length - 1 && (
                        <div className="vflow__connector" aria-hidden="true">
                          <span className="vflow__connector-line" />
                          <span className="vflow__connector-arrow" />
                        </div>
                      )}
                    </div>

                    <div className="vflow__body">
                      <div className="vflow__header">
                        <span className="vflow__step">{`Stage 0${i + 1}`}</span>
                        <span className="vflow__tag">{n.stage}</span>
                      </div>
                      <h5 className="vflow__name">{n.title}</h5>
                      <p className="vflow__detail">{n.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="vflow__return">
                <div className="vflow__return-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 21h5v-5" />
                  </svg>
                </div>
                <div className="vflow__return-text">
                  <strong>Circular Cycle:</strong> Reused water directly offsets conventional intake, returning recycled volume back into non-potable service.
                </div>
              </div>
            </div>
          </div>

          {/* TARGET BANNER */}
          <div className="target" data-reveal>
            <div className="target__copy">
              <span className="target__tag">Illustrative target</span>
              <p className="target__num">
                10<span>%</span>
              </p>
              <p className="target__cap">of the water currently purchased</p>
            </div>
            <div className="target__bars" aria-hidden="true">
              <div>
                <span>Purchased today</span>
                <i style={{ ['--w' as string]: 1 }} data-grow />
              </div>
              <div>
                <span>Illustrative target</span>
                <i style={{ ['--w' as string]: 0.1 }} data-grow />
              </div>
            </div>
          </div>
        </div>

        <ScrubText
          className="system__statement"
          text="It illustrates the potential to reduce purchased-water dependence by making better use of local resources and water already used on site."
        />
      </div>

      {/* LIGHTBOX MODAL */}
      {modalOpen && (
        <div
          className="infographic-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Full size infographic"
        >
          <div
            className="infographic-modal__backdrop"
            onClick={() => setModalOpen(false)}
          />
          <div className="infographic-modal__dialog">
            <div className="infographic-modal__bar">
              <div className="infographic-modal__title">
                <strong>Water Independence Blueprint</strong>
                <span>From external dependence to circular independence</span>
              </div>
              <button
                type="button"
                className="infographic-modal__close"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="infographic-modal__content">
              <img
                src="/images/water-system-infographic.jpg"
                alt="Detailed full size diagram of water independence system"
                className="infographic-modal__image"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
