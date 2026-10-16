import Image from 'next/image'
import { ScrubText, SectionBand } from './motion-root'
import { WhoFor } from './who-for'

const VALUES = [
  {
    title: 'Better visibility',
    text: 'Understand water sources, consumption, costs, and potential losses.',
    image: '/images/values/visibility.png',
    alt: 'Engineer reviewing water flow data on a tablet beside a flow meter',
  },
  {
    title: 'Improved efficiency',
    text: 'Identify opportunities to optimise water use, distribution, treatment, and pumping.',
    image: '/images/values/efficiency.png',
    alt: 'Pump room with rows of blue water pumps and steel pipework',
  },
  {
    title: 'Greater resource recovery',
    text: 'Explore suitable rainwater harvesting and treated-water reuse opportunities.',
    image: '/images/rooftop-harvesting.jpg',
    alt: 'Rooftop rainwater harvesting system',
  },
  {
    title: 'Stronger resilience',
    text: 'Reduce avoidable dependence on external water supplies where site conditions permit.',
    image: '/images/reservoir.jpg',
    alt: 'Lined water storage reservoir on an industrial site',
  },
  {
    title: 'Measurable outcomes',
    text: 'Track changes in purchased water, reuse, water intensity, and water-related energy use against an agreed baseline.',
    image: '/images/values/outcomes.png',
    alt: 'Aerial view of a green campus with a water reservoir and treatment ponds',
  },
]

export function Helps() {
  return (
    <section id="how-this-helps" className="helps curtain" data-curtain data-tone="light" aria-labelledby="helps-title">
      <SectionBand title="How This Helps" reverse />
      <div className="wrap">
        <div className="helps__head">
          <div>
            <span className="eyebrow">03 · How this helps you</span>
            <h2 id="helps-title" className="h2" data-lines>
              <span className="line">
                <span>A Smarter Way to</span>
              </span>
              <span className="line">
                <span>
                  <span className="serif">Manage</span> Your Water.
                </span>
              </span>
            </h2>
          </div>
          <ScrubText
            className="helps__lead"
            text="Every site has a different water profile. We help organisations understand their starting point and identify practical opportunities to reduce avoidable expenditure, improve resource efficiency, and strengthen water resilience."
          />
        </div>

        <ul className="values">
          {VALUES.map((v, i) => (
            <li key={v.title} className={`value value--${i + 1}`} data-reveal={(i % 2) * 0.08}>
              <div className="value__media">
                <Image src={v.image} alt={v.alt} fill sizes="(max-width: 900px) 100vw, 40vw" />
              </div>
              <div className="value__body">
                <span className="value__n" aria-hidden="true">{`0${i + 1}`}</span>
                <div>
                  <h4 className="h3">{v.title}</h4>
                  <p>{v.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <SectionBand title="Who Is It For" className="band--gap" />
      <WhoFor />
    </section>
  )
}
