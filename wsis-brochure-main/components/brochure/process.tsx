'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const STEPS = [
  {
    word: 'Catchment',
    kicker: 'Find the water around you.',
    text: [
      'Identify available rooftop rainwater, surface water, and suitable subsurface-water resources.',
      "Assess the site's catchment, rainfall, and opportunities for collection or recharge.",
    ],
    tags: ['Rooftop rainwater', 'Surface water', 'Subsurface water'],
    image: '/images/solutions/catchment-recharge-pond.png',
    alt: 'Aerial view of a campus catchment during monsoon, with rainwater channels flowing into a recharge pond',
  },
  {
    word: 'Collection',
    kicker: 'Capture and store it intelligently.',
    text: [
      "Plan storage based on the site's geography, climate, rainfall, demand, and available space.",
      'Design appropriate collection, overflow, pumping, and distribution arrangements.',
    ],
    tags: ['Geography', 'Climate', 'Rainfall', 'Demand'],
    image: '/images/reservoir.jpg',
    alt: 'Lined water storage reservoir on an industrial site',
  },
  {
    word: 'Consumption',
    kicker: 'Use water more intelligently.',
    text: [
      'Understand how water is consumed across the site.',
      'Improve distribution and water-efficient fixtures, treat used water to the quality required for its next use, and direct it towards suitable applications such as gardening, flushing, cooling, or other appropriate non-potable uses.',
    ],
    tags: ['Distribution', 'Fixtures', 'Treatment', 'Reuse'],
    image: '/images/solutions/reuse-lake.webp',
    alt: 'Urban lake reflecting residential towers beside a water treatment facility',
  },
]

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => section.style.setProperty('--p', self.progress.toFixed(4)),
        },
      })

      track.querySelectorAll<HTMLElement>('[data-hpar]').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.step'),
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })

      track.querySelectorAll<HTMLElement>('.step__copy').forEach((copy) => {
        gsap.from(copy.children, {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          ease: 'power3.out',
          duration: 1,
          scrollTrigger: { trigger: copy, containerAnimation: tween, start: 'left 75%' },
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <div id="principle-3c" ref={sectionRef} className="process" data-tone="dark">
      <div className="process__viewport">
        <svg className="process__flow" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 80 C 120 20, 240 110, 360 60 S 600 10, 720 70 S 900 110, 1000 40"
            fill="none"
            stroke="#8fd3ff"
            strokeWidth="1.5"
            pathLength={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div ref={trackRef} className="process__track">
          <div className="process__intro">
            <h2 id="how-title" className="h2" data-lines style={{ fontSize: 'clamp(36px, 4.4vw, 68px)' }}>
              <span className="line">
                <span>From Water Intelligence</span>
              </span>
              <span className="line">
                <span>
                  to <span className="serif">Practical</span> Action.
                </span>
              </span>
            </h2>
            <p className="body" style={{ color: 'var(--muted-dark)', maxWidth: '46ch' }}>
              We begin by understanding a site&apos;s water demand, sources, costs, infrastructure, and losses. We then
              identify suitable interventions, prioritise opportunities, and develop a practical pathway for
              implementation and measurement.
            </p>
            <p className="process__principle">
              <span>The Principle of 3C</span>
              Catchment <span className="process__arrow">{'→'}</span> Collection{' '}
              <span className="process__arrow">{'→'}</span> Consumption
            </p>
            <span className="process__hint">
              <span className="process__hint-bar" aria-hidden="true" />
              Keep scrolling to follow the water
            </span>
          </div>

          {STEPS.map((step, i) => (
            <article key={step.word} className="step" aria-labelledby={`step-${i}`}>
              <div className="step__media">
                <Image src={step.image} alt={step.alt} fill sizes="(max-width: 900px) 100vw, 45vw" data-hpar />
              </div>
              <div className="step__copy">
                <span className="step__num" aria-hidden="true">{`0${i + 1}`}</span>
                <div>
                  <h3 id={`step-${i}`} className="h3" style={{ fontSize: 'clamp(30px, 3vw, 44px)' }}>
                    {step.word}
                  </h3>
                  <p className="step__kicker">{step.kicker}</p>
                  {step.text.map((t) => (
                    <p key={t} className="body step__text">
                      {t}
                    </p>
                  ))}
                </div>
                <ul className="step__tags">
                  {step.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          <div className="process__outro">
            <p className="h3" style={{ fontSize: 'clamp(28px, 2.8vw, 44px)', lineHeight: 1.12 }}>
              The water system illustrated in our infographic connects local water resources with storage,{' '}
              <span className="serif">treatment, efficient distribution, and appropriate reuse.</span>
            </p>
          </div>
        </div>

        <ol className="process__progress" aria-hidden="true">
          {['Intro', ...STEPS.map((s) => s.word)].map((label, i) => (
            <li key={label} style={{ ['--i' as string]: i }}>
              <span>{`0${i}`}</span>
              <i />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
