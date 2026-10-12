import { ArrowRight, Building2, Factory, GraduationCap, Home, type LucideIcon } from 'lucide-react'
import type { AssessmentType } from '../../types'

type AssessmentChoice = {
  type: AssessmentType
  title: string
  description: string
  icon: LucideIcon
}

const assessmentChoices: AssessmentChoice[] = [
  {
    type: 'university',
    title: 'University',
    description: 'Assess campus water use, sanitation and reuse.',
    icon: GraduationCap,
  },
  {
    type: 'industry',
    title: 'Industries',
    description: 'Assess facility operations, water supply and treatment.',
    icon: Factory,
  },
  {
    type: 'organization',
    title: 'Organization / Company',
    description: 'Assess office, commercial-site and shared-building water use.',
    icon: Building2,
  },
  {
    type: 'apartment',
    title: 'Apartment / Vilas',
    description: 'Assess residential community, shared amenities and wastewater reuse.',
    icon: Home,
  },
]

type WelcomeViewProps = {
  onSelect: (type: AssessmentType) => void
}

export function WelcomeView({ onSelect }: WelcomeViewProps) {
  return (
    <section className="welcome-screen">
      <div className="welcome-card">
        <div className="welcome-badge initiative-badge">
          <img className="initiative-logo" src="/akashbhumi-logo.png" alt="Akash Bhumi" />
          NET ZERO INITIATIVE
        </div>
        <h1>Water Assessment</h1>
        <p className="welcome-subtitle">Choose the questionnaire for your organization</p>
        <p className="welcome-copy">
          Choose the assessment that best fits your site. Each questionnaire covers water supply, consumption,
          treatment, reuse, rainwater and on-site findings.
        </p>
        <div className="welcome-flow">
          <span>Welcome</span>
          <span className="flow-arrow">→</span>
          <span>Questionnaire</span>
          <span className="flow-arrow">→</span>
          <span>Review</span>
          <span className="flow-arrow">→</span>
          <span>Submit</span>
        </div>
        <div className="assessment-choices" aria-label="Choose an assessment">
          {assessmentChoices.map(({ type, title, description, icon: Icon }) => (
            <button key={type} type="button" className="assessment-choice" onClick={() => onSelect(type)}>
              <span className="assessment-choice-icon">
                <Icon size={24} />
              </span>
              <span className="assessment-choice-copy">
                <strong>{title}</strong>
                <span>{description}</span>
              </span>
              <ArrowRight size={19} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
