import { ScrubText, SectionBand } from './motion-root'

const PROJECTS = [
  {
    n: '01',
    name: 'Wipro Unit, Hyderabad',
    kicker: 'A water-efficiency opportunity in a technology campus.',
    text: 'The source presentation describes a 32-acre site with a demand of 150 KLD and approximately 50 million litres of water purchased or used annually.',
    stats: [
      { value: '₹70 lakh', label: 'Reported annual savings', lead: true },
      { value: '₹88 lakh', label: 'Reported existing annual cost' },
      { value: '32 acres', label: 'Site area' },
      { value: '150 KLD', label: 'Reported demand' },
    ],
    note: "The presentation reports these savings against the site's existing annual cost. The figures require validation before external publication.",
  },
  {
    n: '02',
    name: 'Residential Villa Enclave, Bengaluru',
    kicker: 'Connecting alternative water sources with treatment and reuse.',
    text: 'The source presentation describes a 27-acre residential community with a reported demand of 300 KLD. The approach includes alternative surface-water and shallow-well resources, alongside treated-water reuse.',
    stats: [
      { value: '₹1.6 crore', label: 'Reported annual savings', lead: true },
      { value: '75 million litres', label: 'Reported treated-water reuse' },
      { value: '27 acres', label: 'Site area' },
      { value: '300 KLD', label: 'Reported demand' },
    ],
    note: 'These figures are reproduced from the supplied ALTTECH presentation and require validation before external publication.',
  },
]

const LESSONS = [
  "Understand the site's water demand and operating costs.",
  'Identify suitable local resources and recovery opportunities.',
  'Plan treatment and reuse around intended water uses.',
  'Evaluate outcomes against a defined baseline.',
]

export function Projects() {
  return (
    <section id="projects" className="projects curtain" data-curtain data-tone="light" aria-labelledby="projects-title">
      <SectionBand title="Recent Projects" reverse />
      <div className="wrap">
        <div className="projects__head">
          <div>
            <h2 id="projects-title" className="h2" data-lines>
              <span className="line">
                <span>Solutions in Real</span>
              </span>
              <span className="line">
                <span>
                  <span className="serif">Operating</span> Contexts.
                </span>
              </span>
            </h2>
          </div>
          <ScrubText
            className="body-lead"
            text="Every site has a different water profile. These examples from the ALTTECH Foundation presentation illustrate how coordinated water-management interventions can be applied in industrial and residential settings."
          />
        </div>

        <ol className="stack">
          {PROJECTS.map((p, i) => (
            <li key={p.n} className={`project project--${i + 1}`}>
              <article aria-labelledby={`project-${p.n}`}>
                <div className="project__top">
                  <span className="project__tag">{`Project ${p.n}`}</span>
                  <span className="project__big" aria-hidden="true">
                    {p.n}
                  </span>
                </div>
                <div className="project__body">
                  <div className="project__copy">
                    <h3 id={`project-${p.n}`} className="h3 project__name">
                      {p.name}
                    </h3>
                    <p className="project__kicker">{p.kicker}</p>
                    <p className="project__text">{p.text}</p>
                  </div>
                  <dl className="project__stats">
                    {p.stats.map((s) => (
                      <div key={s.label} className={s.lead ? 'is-lead' : undefined}>
                        <dt>{s.label}</dt>
                        <dd>{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <p className="project__note">{p.note}</p>
              </article>
            </li>
          ))}
        </ol>

        <div className="lessons">
          <h3 className="h3" data-reveal>
            What These Examples Demonstrate
          </h3>
          <ul>
            {LESSONS.map((l, i) => (
              <li key={l} data-reveal={i * 0.06}>
                <span aria-hidden="true">{`0${i + 1}`}</span>
                {l}
              </li>
            ))}
          </ul>
          <p className="lessons__caveat" data-reveal>
            <strong>Every site is different.</strong> Project outcomes are examples, not guarantees of equivalent
            savings elsewhere.
          </p>
        </div>
      </div>
    </section>
  )
}
