import { ScrubText, SectionBand } from './motion-root'

const CONVENTIONAL = ['Municipal grid', 'Borewells', 'Tankers']

const SYSTEM = [
  {
    title: 'Alternative sources',
    detail: 'Rooftop water · Surface water · Suitable subsurface water',
    icon: 'rain',
  },
  {
    title: 'Collection & storage',
    detail: 'Sized according to geography, climate, and demand',
    icon: 'tank',
  },
  {
    title: 'Treatment',
    detail: 'Appropriate to the intended use',
    icon: 'treat',
  },
  {
    title: 'Distribution',
    detail: 'Optimised, with water-efficient fixtures',
    icon: 'tap',
  },
  {
    title: 'Reuse',
    detail: 'Gardening, flushing, cooling, and other appropriate non-potable uses',
    icon: 'loop',
  },
] as const

function NodeIcon({ name }: { name: (typeof SYSTEM)[number]['icon'] }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'rain':
      return (
        <svg {...common}>
          <path d="M7 14a4 4 0 0 1 .5-8 5 5 0 0 1 9.6 1.5A3.5 3.5 0 0 1 17 14H7Z" />
          <path d="M8 17.5 7 20M12 17.5 11 20M16 17.5 15 20" />
        </svg>
      )
    case 'tank':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="7" ry="2.5" />
          <path d="M5 6v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
          <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
        </svg>
      )
    case 'treat':
      return (
        <svg {...common}>
          <path d="M12 3s5.5 6 5.5 10a5.5 5.5 0 0 1-11 0C6.5 9 12 3 12 3Z" />
          <path d="m9.5 13.5 1.8 1.8 3.2-3.6" />
        </svg>
      )
    case 'tap':
      return (
        <svg {...common}>
          <path d="M4 9h9a3 3 0 0 1 3 3v1" />
          <path d="M4 6v6M9 6V4M7 4h4" />
          <path d="M16 16.5s1.5 1.8 1.5 2.8a1.5 1.5 0 0 1-3 0c0-1 1.5-2.8 1.5-2.8Z" />
        </svg>
      )
    case 'loop':
      return (
        <svg {...common}>
          <path d="M20 12a8 8 0 0 1-14.2 5" />
          <path d="M4 12a8 8 0 0 1 14.2-5" />
          <path d="M18.5 3v4h-4M5.5 21v-4h4" />
        </svg>
      )
  }
}

export function Infographic() {
  return (
    <section
      id="water-system"
      className="system curtain"
      data-curtain
      data-tone="light"
      aria-labelledby="system-title"
    >
      <SectionBand title="The Water System" reverse />
      <div className="wrap">
        <div className="system__head">
          <div>
            <h3 id="system-title" className="h2" data-lines>
              <span className="line">
                <span>What the</span>
              </span>
              <span className="line">
                <span>
                  <span className="serif">infographic</span> means.
                </span>
              </span>
            </h3>
          </div>
          <ScrubText
            className="body-lead"
            text="The diagram contrasts conventional supply (municipal water, borewells, and tankers) with a site-specific system designed to capture, store, treat, and reuse suitable water resources."
          />
        </div>

        <div className="system__board" role="group" aria-label="Water system diagram">
          <div className="lane lane--conventional" data-reveal>
            <span className="lane__label">Conventional supply</span>
            <ul className="lane__sources">
              {CONVENTIONAL.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <span className="lane__arrow" aria-hidden="true" />
            <span className="lane__sink">Purchased water</span>
          </div>

          <div className="lane lane--system">
            <span className="lane__label">Site-specific system</span>
            <div className="flow">
              <svg className="flow__wire" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M20 20 H980"
                  pathLength={1}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  data-draw
                />
              </svg>
              <ol className="flow__nodes">
                {SYSTEM.map((n, i) => (
                  <li key={n.title} className="flow__node" data-reveal={i * 0.09}>
                    <span className="flow__icon">
                      <NodeIcon name={n.icon} />
                    </span>
                    <span className="flow__step">{`0${i + 1}`}</span>
                    <h4>{n.title}</h4>
                    <p>{n.detail}</p>
                  </li>
                ))}
              </ol>
              <svg className="flow__loop" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M900 4 C 900 70, 520 76, 500 40 S 500 4, 500 4"
                  pathLength={1}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="0.012 0.012"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>

          <div className="target" data-reveal>
            <div className="target__copy">
              <span className="target__tag">Illustrative target</span>
              <p className="target__num">
                10<span>%</span>
              </p>
              <p className="target__cap">of the water currently purchased</p>
            </div>
            <div className="target__bars" aria-hidden="true">
              <div>
                <span>Purchased today</span>
                <i style={{ ['--w' as string]: 1 }} data-grow />
              </div>
              <div>
                <span>Illustrative target</span>
                <i style={{ ['--w' as string]: 0.1 }} data-grow />
              </div>
            </div>
          </div>
        </div>

        <ScrubText
          className="system__statement"
          text="It illustrates the potential to reduce purchased-water dependence by making better use of local resources and water already used on site."
        />
      </div>
    </section>
  )
}
