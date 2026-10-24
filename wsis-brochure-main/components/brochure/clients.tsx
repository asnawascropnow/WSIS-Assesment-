import Image from 'next/image'
import { ScrubText, SectionBand } from './motion-root'

type Organisation = { name: string; logo: string; light?: boolean }

const ORGANISATIONS: Organisation[] = [
  { name: 'Indus 555-D TMT', logo: 'indus' },
  { name: 'BSH', logo: 'bsh' },
  { name: 'Saint-Gobain', logo: 'saint-gobain' },
  { name: 'FluxGen', logo: 'fluxgen' },
  { name: 'Doyen', logo: 'doyen', light: true },
  { name: 'ISKCON', logo: 'iskcon' },
  { name: 'Grape County', logo: 'grape-county', light: true },
  { name: 'Prestige Augusta Club', logo: 'prestige-augusta' },
  { name: 'Carlsberg', logo: 'carlsberg', light: true },
  { name: 'Royal Calcutta Golf Club', logo: 'royal-calcutta-golf', light: true },
  { name: 'Sisters of the Good Shepherd', logo: 'good-shepherd' },
]

function NameRow({ names, reverse }: { names: Organisation[]; reverse?: boolean }) {
  const group = (hidden: boolean) => (
    <span className="names__group" aria-hidden={hidden || undefined}>
      {names.map((o, i) => (
        <span key={o.name} className={i % 2 ? 'names__item names__item--outline' : 'names__item'}>
          {o.name}
          <span className={`names__logo${o.light ? ' names__logo--dark' : ''}`}>
            <Image src={`/images/clients/${o.logo}.png`} alt="" fill sizes="160px" loading="eager" />
          </span>
          <em aria-hidden="true" />
        </span>
      ))}
    </span>
  )
  return (
    <div className={`names__row${reverse ? ' names__row--reverse' : ''}`} aria-hidden="true">
      <div className="names__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}

export function Clients() {
  const half = Math.ceil(ORGANISATIONS.length / 2)
  return (
    <section id="clients" className="clients curtain" data-curtain data-tone="dark" aria-labelledby="clients-title">
      <SectionBand title="Clients & Sectors" />
      <div className="wrap clients__head">
        <div>
          <h2 id="clients-title" className="h2" data-lines>
            <span className="line">
              <span>Built for Different</span>
            </span>
            <span className="line">
              <span>
                <span className="serif">Water</span> Needs.
              </span>
            </span>
          </h2>
        </div>
        <ScrubText
          className="body-lead"
          text="Water-management requirements differ across industrial facilities, commercial buildings, hospitality, institutions, and residential communities. Our approach starts with the specific demands and conditions of each site."
        />
      </div>

      <div className="names">
        <ul className="sr-only" aria-label="Clients">
          {ORGANISATIONS.map((o) => (
            <li key={o.name}>{o.name}</li>
          ))}
        </ul>
        <NameRow names={ORGANISATIONS.slice(0, half)} />
        <NameRow names={ORGANISATIONS.slice(half)} reverse />
      </div>
    </section>
  )
}
