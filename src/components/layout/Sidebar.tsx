import type { QuestionnaireSection } from '../../types'
import { ProgressPanel } from './ProgressPanel'
import { SectionNav } from './SectionNav'

type SidebarProps = {
  sections: QuestionnaireSection[]
  currentSectionIndex: number
  completedSections: Set<number>
  completed: number
  total: number
  onSelectSection: (index: number) => void
}

export function Sidebar({
  sections,
  currentSectionIndex,
  completedSections,
  completed,
  total,
  onSelectSection,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-box">
        <img className="brand-logo" src="/akashbhumi-logo.png" alt="Akash Bhumi" />
      </div>

      <ProgressPanel completed={completed} total={total} />

      <SectionNav
        sections={sections}
        currentSectionIndex={currentSectionIndex}
        completedSections={completedSections}
        onSelect={onSelectSection}
      />
    </aside>
  )
}
