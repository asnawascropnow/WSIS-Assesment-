import { Img as Image } from './img'
import { ScrubText, ScrubWords, SectionBand } from './motion-root'

type Capability = {
  name: string
  role: string
  logo?: { src: string; width: number; height: number }
}

const CAPABILITIES: Capability[] = [
  {
    name: 'Akash Bhumi',
    role: 'Resource intelligence',
    logo: { src: '/brand/akashbhumi-logo.webp', width: 262, height: 81 },
  },
  {
    name: 'ALTTECH Foundation',
    role: 'Water solutions',
    logo: { src: '/brand/alttech-wordmark.webp', width: 447, height: 123 },
  },
  { name: 'CropNow', role: 'The wider initiative' },
]

export function WhoWeAre() {
  return (
    <>
      <section id="who-we-are" className="chapter chapter--light" data-tone="light" aria-labelledby="who-title">
        <SectionBand title="Who We Are" />

        <div className="wrap chapter__grid">
          <div className="chapter__aside">
            <div className="chapter__orb" data-clip>
              <Image
                src="/images/website/clarifier-topdown.webp"
                alt="Top-down view of a circular water clarifier tank with its rotating bridge"
                fill
                sizes="(max-width: 900px) 80vw, 34vw"
                data-rotate
              />
              <span className="chapter__orb-ring" aria-hidden="true" />
            </div>
          </div>

          <div className="chapter__body">
            <h2 id="who-title" className="chapter__title" data-scrub-words>
              <ScrubWords text="Three capabilities. One connected water mission." />
            </h2>
            <ScrubText
              className="chapter__text"
              text="CropNow and ALTTECH Foundation are collaborating on practical Net-Zero Water solutions, supported by Akash Bhumi's resource intelligence and spatial understanding."
            />
            <ScrubText
              className="chapter__text"
              text="The initiative brings together the ability to understand water conditions, identify opportunities, and translate insights into practical water-management interventions."
            />
            <ul className="chapter__caps">
              {CAPABILITIES.map((c, i) => (
                <li key={c.name} data-reveal={i * 0.08}>
                  <div className="cap-logo">
                    {c.logo ? (
                      <Image src={c.logo.src} alt={c.name} width={c.logo.width} height={c.logo.height} />
                    ) : (
                      <span className="cap-logo__word" role="img" aria-label={c.name}>
                        Crop<b>Now</b>
                      </span>
                    )}
                  </div>
                  <span>{`0${i + 1}`}</span>
                  <strong>{c.name}</strong>
                  <em>{c.role}</em>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="what-we-do" className="chapter chapter--dark curtain" data-curtain data-tone="dark" aria-labelledby="what-title">
        <SectionBand title="What We Do" reverse />

        <div className="wrap chapter__grid">
          <div className="chapter__aside">
            <div className="chapter__frame" data-clip>
              <Image
                src="/images/website/self-reliant-campus.webp"
                alt="Aerial view of a water self-reliant campus with rooftop harvesting, a storage reservoir, a treatment plant and irrigated lawns"
                fill
                sizes="(max-width: 900px) 90vw, 36vw"
                data-parallax="8"
              />
            </div>
          </div>

          <div className="chapter__body">
            <h2 id="what-title" className="chapter__title" data-scrub-words>
              <ScrubWords text="From understanding water to managing it better." />
            </h2>
            <ScrubText
              className="chapter__text"
              text="We help organisations assess their water use, identify losses, explore alternative water sources, improve treatment and reuse, and optimise water distribution."
            />

            <div className="roi-card" data-reveal>
              <div className="roi-card__metric-col">
                <h3 className="roi-card__metric-label">
                  Return on <span className="serif">Investment.</span>
                </h3>
                <div className="roi-card__metric">
                  <span className="roi-card__num">18–24</span>
                  <span className="roi-card__unit">months</span>
                </div>
              </div>
              <div className="roi-card__divider" aria-hidden="true" />
              <div className="roi-card__info">
                <p className="roi-card__desc">
                  Achieved through <span className="roi-card__highlight">50–70%</span> reduced dependence on purchased water tankers and borewells.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
