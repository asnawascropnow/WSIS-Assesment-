import { BrandLockup } from './brand-lockup'
import { ASSESSMENT_URL, CONTACT, INITIATIVE_URL, PARTNER_LINKS } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__top">
          <div className="site-footer__id">
            <span className="site-footer__brand">
              <BrandLockup />
            </span>
            <p>Net-Zero Water Resource Initiative</p>
          </div>
          <div className="site-footer__cols">
            <div>
              <h2>Partners</h2>
              <ul>
                <li>
                  <a href={PARTNER_LINKS.cropnow} target="_blank" rel="noopener noreferrer">
                    CropNow
                  </a>
                </li>
                <li>
                  <a href={PARTNER_LINKS.alttech} target="_blank" rel="noopener noreferrer">
                    ALTTECH Foundation
                  </a>
                </li>
                <li>
                  <a href={PARTNER_LINKS.akashbhumi} target="_blank" rel="noopener noreferrer">
                    Akash Bhumi
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2>Contact</h2>
              <ul>
                <li>{CONTACT.person}</li>
                <li>
                  <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </li>
              </ul>
            </div>
            <div>
              <h2>Initiative</h2>
              <ul>
                <li>
                  <a href={INITIATIVE_URL} target="_blank" rel="noopener noreferrer">
                    Net Zero Initiative
                  </a>
                </li>
                <li>
                  <a href={ASSESSMENT_URL} target="_blank" rel="noopener noreferrer">
                    Water Assessment
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>{`© ${new Date().getFullYear()} CropNow × ALTTECH Foundation × Akash Bhumi`}</span>
          <a href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  )
}
