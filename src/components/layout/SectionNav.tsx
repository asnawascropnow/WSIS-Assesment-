import { CheckCircle2, Circle } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { QuestionnaireSection } from '../../types'

type SectionNavProps = {
  sections: QuestionnaireSection[]
  currentSectionIndex: number
  completedSections: Set<number>
  onSelect: (index: number) => void
}

export function SectionNav({
  sections,
  currentSectionIndex,
  completedSections,
  onSelect,
}: SectionNavProps) {
  return (
    <nav
      aria-label="Questionnaire sections"
      className="section-nav"
      style={{
        '--step-progress': `${(currentSectionIndex / Math.max(sections.length - 1, 1)) * 100}%`,
      } as CSSProperties}
    >
      {sections.map((section, index) => {
        const isActive = index === currentSectionIndex
        const isDone = completedSections.has(index)
        return (
          <button
            key={section.id}
            type="button"
            className={`section-link ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
            onClick={() => onSelect(index)}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`${section.title}${isDone ? ', completed' : isActive ? ', current step' : ''}`}
          >
            <span className="step-marker" aria-hidden="true">
              {isDone ? <CheckCircle2 size={19} /> : isActive ? index + 1 : <Circle size={19} />}
            </span>
            <span>{section.title}</span>
          </button>
        )
      })}
    </nav>
  )
}
