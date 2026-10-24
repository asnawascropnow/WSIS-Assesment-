import Image from 'next/image'
import { ScrubText, SectionBand } from './motion-root'

type TeamMember = {
  name: string
  role: string
  image: string
  position?: string
}

const TEAM: TeamMember[] = [
  {
    name: 'Kabeer',
    role: 'Founder, CropNow',
    image: '/images/team/kabeer-founder.jpg',
    position: 'center center',
  },
  {
    name: 'Niki N Kalpa',
    role: 'Senior Associate, Strategy · AltTech Foundation',
    image: '/images/team/niki-n-kalpa.jpg',
    position: 'center center',
  },
  {
    name: 'Dr. Hariharan Chandrashekar',
    role: 'Mentor',
    image: '/images/team/hariharan.jpg',
    position: 'center center',
  },
  {
    name: 'Commander Haridas',
    role: 'Mentor',
    image: '/images/team/haridas.jpg',
    position: 'center 18%',
  },
  {
    name: 'U V Krishna Mohan Rao',
    role: 'Mentor',
    image: '/images/team/krishna-mohan-rao.jpg',
    position: '42% 20%',
  },
]

export function Team() {
  return (
    <section id="team" className="team curtain" data-curtain data-tone="light" aria-labelledby="team-title">
      <SectionBand title="The Team" reverse />
      <div className="wrap">
        <div className="team__head">
          <div>
            <span className="eyebrow">07 · The team</span>
            <h2 id="team-title" className="h2" data-lines>
              <span className="line">
                <span>Experience That</span>
              </span>
              <span className="line">
                <span>
                  Supports <span className="serif">Action.</span>
                </span>
              </span>
            </h2>
          </div>
          <ScrubText
            className="body-lead"
            text="The initiative brings together people working across resource intelligence, water solutions, strategy, and programme guidance."
          />
        </div>

        <ul className="team__grid">
          {TEAM.map((p, i) => (
            <li key={p.name} className="team-card" data-reveal={i * 0.08}>
              <div className="team-card__media">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  style={{ objectFit: 'cover', objectPosition: p.position ?? 'center center' }}
                />
              </div>
              <div className="team-card__meta">
                <h3 className="team-card__name">{p.name}</h3>
                <p className="team-card__role">{p.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
