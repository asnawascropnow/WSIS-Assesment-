import Image from 'next/image'
import { ArrowUpRightIcon, ArrowDownRightIcon, SparkleFillIcon } from '@primer/octicons-react'
import { ASSESSMENT_URL, SERVICES } from '@/lib/site'

const MARQUEE_THUMBS = [
  '/images/solutions/assess-water-meter.webp',
  '/images/solutions/capture-rooftop-rwh.webp',
  '/images/solutions/treat-aeration-tank.webp',
  '/images/solutions/protect-pipeline.webp',
  '/images/solutions/reuse-lake.webp',
]

export function Hero() {
  return (
    <>
      <div id="top" className="hero" data-tone="light">
        <div className="wrap hero__grid">
          <div className="hero__rail-top" data-hero-blur>
            <span className="hero__badge">
              <Image src="/images/website/clarifier-topdown.jpg" alt="" width={112} height={112} />
            </span>
            <span>
              Net-Zero Water
              <br />
              Resource Initiative
            </span>
          </div>

          <h1 id="hero-title" className="display hero__title">
            <span className="line" data-hero-line>
              <span>From utility dependence</span>
            </span>
            <span className="line" data-hero-line>
              <span>
                to{' '}
                <span className="word-pill" data-hero-pill>
                  <span className="serif">resource</span> resilience.
                </span>
              </span>
            </span>
          </h1>

          <a href="#solutions" className="hero__side" data-hero-blur>
            <span className="hero__drops" aria-hidden="true">
              {MARQUEE_THUMBS.slice(0, 3).map((src) => (
                <span key={src}>
                  <Image src={src} alt="" width={76} height={76} />
                </span>
              ))}
            </span>
            <span className="hero__side-num">11</span>
            <span className="hero__side-label">
              Water services
              <ArrowUpRightIcon size={16} />
            </span>
          </a>

          <div className="hero__media">
            <div className="hero__frame" data-hero-media>
              <Image
                src="/images/hero-water.png"
                alt="Rainwater harvesting pool in a modern campus courtyard at dusk, with an engineer reviewing data on a tablet"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 80vw"
                style={{ objectFit: 'cover' }}
                data-hero-parallax
              />
              <div className="hero__chips">
                <ul aria-label="The principle of 3C">
                  <li className="chip">Catchment</li>
                  <li className="chip">Collection</li>
                  <li className="chip">Consumption</li>
                </ul>
              </div>
            </div>
            <div className="notch-card" data-hero-blur>
              <p className="body">
                A collaborative initiative connecting water intelligence with practical water solutions.
              </p>
            </div>
          </div>

          <div className="hero__tagline-cell" aria-hidden="true">
            <div className="hero__tagline" data-hero-blur>
              <SparkleFillIcon size={16} />
              <span>
                CropNow × ALTTECH
                <br />
                Foundation × Akash Bhumi
              </span>
            </div>
          </div>

          <div className="hero__foot" data-hero-blur>
            <div className="hero__ctas">
              <a href="#solutions" className="btn btn--ghost">
                Explore Our Solutions
                <ArrowDownRightIcon size={16} />
              </a>
              <a href={ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
                Request a Water Assessment
                <ArrowUpRightIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <ServiceMarquee />
    </>
  )
}

function ServiceMarquee() {
  const group = (hidden: boolean) => (
    <ul className="marquee__group" aria-hidden={hidden || undefined}>
      {SERVICES.map((name, i) => (
        <li key={name} className="marquee__item">
          {name}
          <span className="marquee__thumb">
            <Image src={MARQUEE_THUMBS[i % MARQUEE_THUMBS.length]} alt="" width={168} height={104} />
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="marquee" role="region" aria-label="Our eleven water services">
      <div className="marquee__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}
