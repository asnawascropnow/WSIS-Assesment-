import { ArrowLeft, ArrowRight, Save } from 'lucide-react'
import { Suspense, lazy } from 'react'
import type { RefObject } from 'react'
import type { AssessmentType, Questionnaire, QuestionnaireSection, SaveStatus } from '../../types'
import { Sidebar } from '../layout/Sidebar'
import { Topbar } from '../layout/Topbar'
import { QuestionCard } from '../questionnaire/QuestionCard'

// Testing helper, code-split so it only loads when actually shown (dev builds or
// the /testing route). It carries the sample data for every category.
const SampleDataPanel = lazy(() => import('../../dev/SampleDataPanel'))

type AssessmentWizardProps = {
  activeQuestionnaire: Questionnaire
  assessmentType: AssessmentType
  currentSection: QuestionnaireSection
  currentSectionIndex: number
  completedSections: Set<number>
  completionSummary: { completed: number; totalSections: number }
  saveStatus: SaveStatus
  mainPanelRef: RefObject<HTMLElement | null>
  onSelectSection: (index: number) => void
  onPrevious: () => void
  onSaveProgress: () => void
  onNext: () => void
  onBackToHomepage: () => void
  /** Force the sample-data helper on any category, e.g. on the /testing route. */
  testingMode?: boolean
}

export function AssessmentWizard({
  activeQuestionnaire,
  assessmentType,
  currentSection,
  currentSectionIndex,
  completedSections,
  completionSummary,
  saveStatus,
  mainPanelRef,
  onSelectSection,
  onPrevious,
  onSaveProgress,
  onNext,
  onBackToHomepage,
  testingMode = false,
}: AssessmentWizardProps) {
  const isLastSection = currentSectionIndex === activeQuestionnaire.sections.length - 1

  return (
    <div className="app-shell">
      <Sidebar
        sections={activeQuestionnaire.sections}
        currentSectionIndex={currentSectionIndex}
        completedSections={completedSections}
        completed={completionSummary.completed}
        total={completionSummary.totalSections}
        onSelectSection={onSelectSection}
        onBackToHomepage={onBackToHomepage}
      />

      <main className="main-panel" ref={mainPanelRef}>
        <Topbar title={currentSection.title} saveStatus={saveStatus} />

        {currentSection.introduction ? <p className="section-intro">{currentSection.introduction}</p> : null}
        <p className="required-guidance">
          Complete every question and table cell. Enter <strong>-</strong>, <strong>none</strong>, or <strong>nil</strong>
          {' '}when a value is not applicable or unavailable. Attach files or mark file questions not applicable.
        </p>

        <div className="questions-stack">
          {currentSection.questions.map((question) => (
            <QuestionCard
              key={question.id}
              section={currentSection}
              question={question}
              assessmentType={assessmentType}
            />
          ))}
        </div>

        <div className="nav-actions">
          <button type="button" className="secondary-button" onClick={onPrevious} disabled={currentSectionIndex === 0}>
            <ArrowLeft size={16} />
            Previous
          </button>
          <button type="button" className="ghost-button" onClick={onSaveProgress}>
            <Save size={16} />
            Save Progress
          </button>
          <button type="button" className="primary-button" onClick={onNext}>
            {isLastSection ? 'Review & Submit' : 'Next'}
            <ArrowRight size={16} />
          </button>
        </div>
      </main>

      {import.meta.env.DEV || testingMode ? (
        <Suspense fallback={null}>
          <SampleDataPanel assessmentType={assessmentType} />
        </Suspense>
      ) : null}
    </div>
  )
}
