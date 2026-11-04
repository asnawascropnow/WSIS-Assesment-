import { Img as Image } from './img'
import { ArrowUpRightIcon, MailIcon } from '@primer/octicons-react'
import { ASSESSMENT_URL, CONTACT } from './site'
import { ScrubText, SectionBand } from './motion-root'

export function Closing() {
  return (
    <section id="contact" className="contact curtain" data-curtain data-tone="dark" aria-labelledby="contact-title">
      <div className="contact__bg" aria-hidden="true">
        <Image src="/images/website/clarifiers-forest.webp" alt="" fill sizes="100vw" data-parallax="6" />
      </div>
      <SectionBand title="Get In Touch" className="band--over" />
      <div className="wrap contact__inner">
        <div className="contact__grid">
          <div>
            <h2 id="contact-title" className="display contact__title" data-lines>
              <span className="line">
                <span>{"Let's Understand"}</span>
              </span>
              <span className="line">
                <span>
                  Your{' '}
                  <span className="word-pill word-pill--dark">
                    <span className="serif">Water.</span>
                  </span>
                </span>
              </span>
            </h2>
            <p className="contact__sub" data-reveal>
              {"Every site has a different starting point. Let's understand yours."}
            </p>
            <ScrubText
              className="body-lead contact__body"
              text="Whether you manage an industrial facility, a campus, a residential community, or a large property, the first step is to understand your current water situation and identify where practical improvements may be possible."
            />
          </div>

          <div className="contact__card" data-reveal>
            <h3 className="h3">Request a Water Assessment</h3>
            <p>
              Start by sharing information about your site, its water sources, consumption, and current challenges. We
              can use that information to identify the appropriate next steps.
            </p>
            <div className="contact__ctas">
              <a href={ASSESSMENT_URL} className="btn btn--solid">
                Request a Water Assessment
                <ArrowUpRightIcon size={16} />
              </a>
              <a href={`mailto:${CONTACT.email}`} className="btn btn--ghost">
                Talk to Our Team
                <MailIcon size={16} />
              </a>
            </div>
            <dl className="contact__list">
              <div>
                <dt>Contact</dt>
                <dd>{CONTACT.person}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="giant-marquee contact__marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((k) => (
            <span key={k}>
              Catchment <em>·</em> Collection <em>·</em> Consumption <em>·</em>{' '}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
