'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRightIcon } from '@primer/octicons-react'
import { ASSESSMENT_URL } from '@/lib/site'

const PAINS = [
  {
    tag: 'Tankers',
    title: 'Every summer, the same queue.',
    text: 'Bills that climb every season, deliveries that arrive late or not at all, and operations that pause until the next truck turns up.',
    image: '/images/problem/water-supply-tanker.jpg',
    alt: 'A red private water supply tanker parked on a Bengaluru street with a green hose running to a building',
    points: ['Rising tanker bills', 'Unreliable delivery', 'Price spikes in peak season'],
  },
  {
    tag: 'Borewells',
    title: 'Drilling deeper. Getting less.',
    text: 'Falling water tables leave borewells dry or failing, while every new bore costs more and promises nothing.',
    image: '/images/problem/borewell.avif',
    alt: 'A truck-mounted rig drilling a new borewell on an urban site',
    points: ['Falling water tables', 'Dry and failed bores', 'Costly re-drilling'],
  },
  {
    tag: 'Municipal water',
    title: 'Supply on someone else’s schedule.',
    text: 'Municipal water arrives in limited hours and uncertain volumes, and growing cities keep stretching the same network thinner.',
    image: '/images/problem/municipal-treatment-plant.jpg',
    alt: 'Concrete settling basins and metal walkways at a municipal water treatment plant',
    points: ['Rationed supply hours', 'Low and uneven pressure', 'Rising tariffs'],
  },
]

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const state = { v: 0 }
      gsap.to(state, {
        v: to,
        duration: 1.8,
        ease: 'power3.out',
        onUpdate: () => {
          el.textContent = String(Math.round(state.v))
        },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    })
    return () => mm.revert()
  }, [to])

  return <span ref={ref}>{to}</span>
}

export function Problem() {
  return (
    <section id="the-problem" className="problem" data-tone="dark" aria-labelledby="problem-title">
      <div className="wrap">
        <div className="problem__head">
          <span className="eyebrow">The problem you live with</span>
          <h2 id="problem-title" className="h2 problem__title" data-lines>
            <span className="line">
              <span>Tankers on speed dial.</span>
            </span>
            <span className="line">
              <span>
                Borewells running <span className="serif">dry.</span>
              </span>
            </span>
          </h2>
          <p className="problem__lead" data-reveal>
            If your site depends on tankers, borewells, and municipal supply, you already know the cost: unpredictable bills, uncertain
            supply, and a water source that can disappear when you need it most.
          </p>
        </div>

        <ul className="problem__pains">
          {PAINS.map((p, i) => (
            <li key={p.tag} className="pain" data-reveal={i * 0.1}>
              <div className="pain__media" data-clip>
                <Image src={p.image} alt={p.alt} fill sizes="(max-width: 900px) 100vw, 50vw" data-parallax="6" />
                <span className="pain__tag">{p.tag}</span>
              </div>
              <div className="pain__body">
                <h3 className="h3">{p.title}</h3>
                <p>{p.text}</p>
                <ul className="pain__points" aria-label={`${p.tag} problems`}>
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>

        <div className="problem__promise">
          <p className="problem__kicker" data-reveal>
            With our integrated water solutions, you can
          </p>
          <p className="problem__stat" aria-label="Cut up to 50 to 70 percent">
            <span className="problem__stat-cut" aria-hidden="true">
              Cut up to
            </span>
            <span className="problem__stat-num" aria-hidden="true">
              <Counter to={50} />
              <span className="problem__dash">{'–'}</span>
              <Counter to={70} />
              <span className="problem__pct">%</span>
            </span>
          </p>
          <div className="problem__promise-foot">
            <p className="problem__of" data-reveal>
              of your <strong>tanker</strong> and <strong>borewell</strong> dependency, with water you capture, treat,
              and reuse on your own site.
            </p>
            <a href={ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="btn btn--solid" data-reveal>
              Find out how much you can cut
              <ArrowUpRightIcon size={16} />
            </a>
          </div>
          <div className="problem__meter" aria-hidden="true">
            <span className="problem__meter-before">
              <em>As low as 30%</em>
              Tankers &amp; borewells
            </span>
            <span className="problem__meter-after">
              <em>Up to 70%</em>
              Water from your own site
            </span>
          </div>
          <p className="problem__note">Achievable reduction depends on site conditions, rainfall, demand, and existing infrastructure.</p>
        </div>
      </div>
    </section>
  )
}
