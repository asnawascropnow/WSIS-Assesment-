'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDownRightIcon, CheckIcon } from '@primer/octicons-react'
import { SERVICES } from '@/lib/site'
import { SectionBand } from './motion-root'

type Sheet = { src: string; label: string; alt: string; width: number; height: number }

type Shot = { src: string; alt: string; topic: string; label: string }

type Group = {
  letter: string
  title: string
  image: string
  alt: string
  services: number[]
  sheets?: Sheet[]
  gallery?: Shot[]
}

const mediaCount = (g: Group) => g.sheets?.length ?? g.gallery?.length ?? 1
const weightOf = (g: Group) => Math.max(1, mediaCount(g) * 0.5)

const RCGC_SHEETS: Sheet[] = [
  {
    src: '/images/solutions/assess-rcgc-drainage.png',
    label: 'Proposed drainage plan',
    alt: 'Proposed drainage plan for the Royal Calcutta Golf Club, Kolkata, showing drainage lines across the course',
    width: 395,
    height: 310,
  },
  {
    src: '/images/solutions/assess-rcgc-zones.png',
    label: 'Zoning: Zone 1, 3 & 3A',
    alt: 'Site plan of the Royal Calcutta Golf Club divided into water management zones 1, 3 and 3A with lakes marked in blue',
    width: 412,
    height: 310,
  },
  {
    src: '/images/solutions/assess-rcgc-microzone.png',
    label: 'Micro Zone 1 detail',
    alt: 'Micro Zone 1 detail plan marking recharge wells, check dams and lake interventions',
    width: 372,
    height: 265,
  },
]

/** Grouping follows the "Our Water Solutions" list in the approved brochure content. */
const GROUPS: Group[] = [
  {
    letter: 'A',
    title: 'Assess & Diagnose',
    image: '/images/solutions/assess-water-meter.webp',
    alt: 'Close-up of a water meter with its protective cover open',
    services: [0],
    sheets: RCGC_SHEETS,
  },
  {
    letter: 'B',
    title: 'Capture & Source',
    image: '/images/solutions/capture-rooftop-barrel.jpg',
    alt: 'Rainwater pouring from a roof gutter into a green collection barrel',
    services: [1],
    gallery: [
      {
        src: '/images/solutions/capture-rooftop-barrel.jpg',
        alt: 'Rainwater pouring from a roof gutter into a green collection barrel',
        topic: 'Rainwater harvesting',
        label: 'Rooftop',
      },
      {
        src: '/images/solutions/capture-subsoil-recharge.png',
        alt: 'Groundwater recharge well with concrete rings and a gravel filter being installed',
        topic: 'Rainwater harvesting',
        label: 'Subsoil recharge',
      },
      {
        src: '/images/solutions/capture-surface-pond.png',
        alt: 'Stone-pitched surface rainwater collection pond filled after monsoon rains',
        topic: 'Rainwater harvesting',
        label: 'Surface',
      },
    ],
  },
  {
    letter: 'C',
    title: 'Treat & Purify',
    image: '/images/solutions/treat-aeration-bengaluru.webp',
    alt: 'Aeration tank at a sewage treatment plant in Bengaluru',
    services: [2, 3, 4, 8],
    gallery: [
      {
        src: '/images/solutions/treat-aeration-bengaluru.webp',
        alt: 'Aeration tank with churning wastewater at a sewage treatment plant in Bengaluru',
        topic: 'Wastewater treatment',
        label: 'Aeration tank',
      },
      {
        src: '/images/solutions/treat-stp-doddabommasandra.webp',
        alt: 'Aerial view of the Doddabommasandra sewage treatment plant beside the lake in Bengaluru',
        topic: 'Wastewater treatment',
        label: 'STP, Doddabommasandra',
      },
    ],
  },
  {
    letter: 'D',
    title: 'Protect & Optimise',
    image: '/images/solutions/protect-pipe-joint.jpg',
    alt: 'Engineers aligning a large pipe joint in a trench',
    services: [5, 6],
    gallery: [
      {
        src: '/images/solutions/protect-pipe-joint.jpg',
        alt: 'Engineers in hard hats aligning a large glass-reinforced pipe joint in a trench',
        topic: 'Pipe longevity',
        label: 'Joint restoration',
      },
      {
        src: '/images/solutions/protect-pipe-trench.jpg',
        alt: 'New blue water main laid along a prepared trench',
        topic: 'Pipe longevity',
        label: 'Main replacement',
      },
      {
        src: '/images/solutions/protect-pipe-laying.jpg',
        alt: 'Excavator laying a steel water pipe into a roadside trench',
        topic: 'Pipe longevity',
        label: 'Pipeline laying',
      },
      {
        src: '/images/solutions/leak-sensor-riser.jpg',
        alt: 'Water riser fitted with pressure gauges and a monitoring sensor on the valve',
        topic: 'Leak detection & UFW',
        label: 'Sensor monitoring',
      },
      {
        src: '/images/solutions/leak-valve-actuator.jpg',
        alt: 'Valve assembly with gauges and an electric actuator on an external wall',
        topic: 'Leak detection & UFW',
        label: 'Pressure & valve control',
      },
      {
        src: '/images/solutions/leak-corroded-meter.jpg',
        alt: 'Corroded pipework with a pressure gauge and water meter on a building wall',
        topic: 'Leak detection & UFW',
        label: 'Corrosion & metering',
      },
    ],
  },
  {
    letter: 'E',
    title: 'Reuse & Improve Outcomes',
    image: '/images/solutions/reuse-lake.webp',
    alt: 'Urban lake reflecting residential towers',
    services: [7, 9, 10],
  },
]

function PlanSheets({
  sheets,
  front,
  onSelect,
}: {
  sheets: Sheet[]
  front: number
  onSelect: (i: number) => void
}) {
  return (
    <div className="plans">
      <ul className="plans__stack">
        {sheets.map((s, i) => {
          const depth = (i - front + sheets.length) % sheets.length
          return (
            <li key={s.src} className="plans__sheet" data-depth={depth}>
              <button type="button" onClick={() => onSelect(i)} aria-label={`Show ${s.label}`} aria-pressed={depth === 0}>
                <span className="plans__paper">
                  <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="420px" />
                </span>
                <span className="plans__label">
                  <em>{String(i + 1).padStart(2, '0')}</em>
                  {s.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <ol className="plans__dots" aria-hidden="true">
        {sheets.map((s, i) => (
          <li key={s.src} className={i === front ? 'is-on' : undefined} />
        ))}
      </ol>
      <p className="plans__site">
        <span>Site study</span>
        Royal Calcutta Golf Club, Kolkata
      </p>
    </div>
  )
}

function Gallery({ shots, front, onSelect }: { shots: Shot[]; front: number; onSelect: (i: number) => void }) {
  const current = shots[Math.min(front, shots.length - 1)]
  return (
    <div className="gallery">
      {shots.map((s, i) => (
        <div key={s.src} className={`gallery__img${i <= front ? ' is-active' : ''}`}>
          <Image src={s.src} alt={i === front ? s.alt : ''} fill sizes="(max-width: 960px) 100vw, 50vw" />
        </div>
      ))}
      <div className="gallery__meta">
        <p className="gallery__label" aria-live="polite">
          <span>{current.topic}</span>
          <strong>
            <em>{String(front + 1).padStart(2, '0')}</em>
            {current.label}
          </strong>
        </p>
        <div className="gallery__dots">
          {shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              className={i === front ? 'is-on' : undefined}
              aria-label={`Show ${s.topic}: ${s.label}`}
              aria-pressed={i === front}
              onClick={() => onSelect(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const WEIGHTS = GROUPS.map(weightOf)
const STARTS = WEIGHTS.map((_, i) => WEIGHTS.slice(0, i).reduce((a, b) => a + b, 0))
const TOTAL = WEIGHTS.reduce((a, b) => a + b, 0)

export function Solutions() {
  const [active, setActive] = useState(0)
  const [sheet, setSheet] = useState(0)
  const pinRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const group = GROUPS[active]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const pin = pinRef.current
    if (!pin) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
      triggerRef.current = ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.6 * TOTAL}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const pos = Math.min(self.progress * TOTAL, TOTAL - 0.0001)
          let idx = 0
          while (idx < GROUPS.length - 1 && pos >= STARTS[idx + 1]) idx++
          const local = (pos - STARTS[idx]) / WEIGHTS[idx]
          pin.style.setProperty('--sp', (idx + local).toFixed(3))
          setActive(idx)
          const count = mediaCount(GROUPS[idx])
          if (count > 1) setSheet(Math.min(count - 1, Math.floor(local * count)))
        },
      })
      return () => {
        triggerRef.current = null
      }
    })

    return () => mm.revert()
  }, [])

  const select = (i: number) => {
    const st = triggerRef.current
    if (!st) {
      setActive(i)
      setSheet(0)
      return
    }
    const target = st.start + ((st.end - st.start) * (STARTS[i] + 0.1)) / TOTAL
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <section id="solutions" className="solutions curtain" data-curtain data-tone="light" aria-labelledby="solutions-title">
      <SectionBand title="Our Solutions" reverse className="band--tight" />
      <div ref={pinRef} className="solutions__pin">
        <div className="wrap solutions__inner">
          <div className="solutions__top">
            <div>
              <span className="eyebrow">All 11 services</span>
              <h3 id="solutions-title" className="h2" data-lines>
                <span className="line">
                  <span>
                    Our Water <span className="serif">Solutions.</span>
                  </span>
                </span>
              </h3>
            </div>
            <div className="solutions__meta">
              <Rotor />
            </div>
          </div>

          <div className="solutions__grid">
            <div className={`explore${group.sheets ? ' explore--plans' : ''}`}>
              {GROUPS.map((g, i) => (
                <div
                  key={g.letter}
                  className={`explore__img${g.sheets ? ' explore__img--plans' : ''}${i <= active ? ' is-active' : ''}`}
                  aria-hidden={i !== active}
                  inert={i !== active}
                >
                  {g.sheets ? (
                    <PlanSheets sheets={g.sheets} front={i === active ? sheet : 0} onSelect={setSheet} />
                  ) : g.gallery ? (
                    <Gallery shots={g.gallery} front={i === active ? sheet : 0} onSelect={setSheet} />
                  ) : (
                    <Image src={g.image} alt={g.alt} fill sizes="(max-width: 960px) 100vw, 50vw" />
                  )}
                </div>
              ))}
              <div className="explore__tab">
                <p className="h3">
                  Explore our
                  <br />
                  solutions
                </p>
                <ArrowDownRightIcon size={32} />
              </div>
              <div className="explore__caption" aria-live="polite">
                <span className="explore__letter" aria-hidden="true">
                  {group.letter}
                </span>
                <span className="body" style={{ maxWidth: '26ch', textAlign: 'right' }}>
                  {group.title}
                </span>
              </div>
            </div>

            <div className="sol-panel">
              <div className="sol-tabs" role="tablist" aria-label="Solution groups">
                {GROUPS.map((g, i) => (
                  <button
                    key={g.letter}
                    type="button"
                    role="tab"
                    id={`sol-tab-${i}`}
                    aria-selected={i === active}
                    aria-controls="sol-tabpanel"
                    className="sol-tab"
                    style={{ ['--i' as string]: i }}
                    onClick={() => select(i)}
                  >
                    <span>{`0${i + 1}`}</span>
                    <span className="sol-tab__bar" />
                    <span className="sol-tab__label">{g.title}</span>
                  </button>
                ))}
              </div>

              <div
                key={active}
                id="sol-tabpanel"
                role="tabpanel"
                aria-labelledby={`sol-tab-${active}`}
                className="sol-card"
              >
                <div className="sol-card__head">
                  <span className="sol-card__letter" aria-hidden="true">
                    {group.letter}
                  </span>
                  <h4 className="h3">{group.title}</h4>
                  <span className="sol-card__count" aria-label={`${group.services.length} services`}>
                    {group.services.length}
                  </span>
                </div>
                <ul className="sol-list">
                  {group.services.map((s) => (
                    <li key={s}>
                      <span>{String(s + 1).padStart(2, '0')}</span>
                      <span>{SERVICES[s]}</span>
                      <CheckIcon size={16} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Rotor() {
  return (
    <span className="rotor" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <defs>
          <path id="rotor-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text>
          <textPath href="#rotor-path">Net Zero Water · Net Zero Water ·</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 24 24" width="28" height="28" style={{ position: 'static', animation: 'none' }}>
        <path
          d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
