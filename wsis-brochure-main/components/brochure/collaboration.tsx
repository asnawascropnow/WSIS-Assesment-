import { AkashBhumiLogo, AlttechLogo } from './brand-lockup'
import { PARTNER_LINKS } from '@/lib/site'
import { ScrubText, SectionBand } from './motion-root'

const PARTNERS = [
  {
    key: 'cropnow',
    role: 'The wider initiative',
    name: 'CropNow',
    text: 'CropNow is the organisation behind Akash Bhumi and participates in the collaboration advancing the Net-Zero Water initiative.',
    href: PARTNER_LINKS.cropnow,
  },
  {
    key: 'akashbhumi',
    role: 'Resource intelligence',
    name: 'Akash Bhumi',
    text: 'Akash Bhumi connects Earth observation, spatial understanding, and resource intelligence to help identify where water pressure and opportunities for intervention exist.',
    href: PARTNER_LINKS.akashbhumi,
  },
  {
    key: 'alttech',
    role: 'Water solutions',
    name: 'ALTTECH Foundation',
    text: 'ALTTECH Foundation brings water-conservation expertise across diagnostics, solution design, implementation, monitoring, and water-use efficiency.',
    href: PARTNER_LINKS.alttech,
  },
] as const

export function Collaboration() {
  return (
    <section
      id="collaboration"
      className="collab curtain"
      data-curtain
      data-tone="dark"
      aria-labelledby="collab-title"
    >
      <SectionBand title="Collaboration" />
      <div className="wrap">
        <div className="collab__head">
          <span className="eyebrow">Three partners</span>
          <h3 id="collab-title" className="h2" data-lines>
            <span className="line">
              <span>The Collaboration</span>
            </span>
            <span className="line">
              <span>
                Behind the <span className="serif">Approach.</span>
              </span>
            </span>
          </h3>
        </div>

        <div className="collab__track">
          <span className="collab__wire" aria-hidden="true">
            <i />
          </span>
          <ul className="collab__list">
          {PARTNERS.map((p, i) => (
            <li key={p.key} className={`collab__card collab__card--${i + 1}`} data-reveal={i * 0.1}>
              <span className="collab__role">{p.role}</span>
              <div className="collab__mark">
                {p.key === 'akashbhumi' && <AkashBhumiLogo height={30} />}
                {p.key === 'alttech' && <AlttechLogo height={30} />}
                {p.key === 'cropnow' && <span className="collab__wordmark">CropNow</span>}
              </div>
              <p>{p.text}</p>
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="collab__link">
                {`Visit ${p.name}`}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          </ul>
        </div>

        <ScrubText
          className="collab__foot"
          text="Together, the collaboration connects intelligence with practical action. The selected interventions and delivery arrangements are tailored to each site's needs."
        />
      </div>
    </section>
  )
}
