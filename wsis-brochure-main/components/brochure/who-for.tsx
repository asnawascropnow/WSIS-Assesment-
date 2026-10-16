'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const AUDIENCES = [
  {
    title: 'Industries & Businesses',
    text: 'Manufacturing facilities, technology parks, commercial spaces, hotels, hospitals, and other water-intensive operations.',
    image: '/images/aud-industry.jpg',
    alt: 'Industrial plant with process water infrastructure',
  },
  {
    title: 'Institutions & Campuses',
    text: 'Schools, colleges, universities, research facilities, and institutional estates.',
    image: '/images/aud-campus.jpg',
    alt: 'Institutional campus buildings and green grounds',
  },
  {
    title: 'Residential Communities',
    text: 'Apartments, townships, villa communities, and large residential developments.',
    image: '/images/aud-residential.jpg',
    alt: 'Residential apartment community',
  },
  {
    title: 'Public & Large Assets',
    text: 'Airports, public facilities, government properties, and large urban landscapes.',
    image: '/images/aud-public.jpg',
    alt: 'Large public infrastructure facility',
  },
]

/** Vertical scroll drives a pinned horizontal track on desktop; stacks normally on small screens. */
export function WhoFor() {
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
          onUpdate: (self) => section.style.setProperty('--wp', self.progress.toFixed(4)),
        },
      })

      track.querySelectorAll<HTMLElement>('[data-hpar]').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.whofor__card'),
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={sectionRef} className="whofor" role="region" aria-labelledby="whofor-title">
      <div className="whofor__viewport">
        <div ref={trackRef} className="whofor__track">
          <div className="whofor__intro">
            <span className="eyebrow">Who is it for</span>
            <h3 id="whofor-title" className="h2">
              Who Is It <span className="serif">For?</span>
            </h3>
            <p className="body">
              Water-management requirements differ by site. Keep scrolling to see the kinds of organisations we work
              with.
            </p>
          </div>

          <ul className="whofor__list">
            {AUDIENCES.map((a, i) => (
              <li key={a.title} className="whofor__card">
                <div className="whofor__media">
                  <Image src={a.image} alt={a.alt} fill sizes="(max-width: 900px) 90vw, 40vw" data-hpar />
                </div>
                <span className="chip whofor__n">{`0${i + 1}`}</span>
                <div className="whofor__copy">
                  <h4 className="h3">{a.title}</h4>
                  <p>{a.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="wrap whofor__bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}
