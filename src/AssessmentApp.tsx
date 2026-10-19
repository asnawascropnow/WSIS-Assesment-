import { FormProvider } from 'react-hook-form'
import { ReviewView } from './components/views/ReviewView'
import { SuccessView } from './components/views/SuccessView'
import { WelcomeView } from './components/views/WelcomeView'
import { AssessmentWizard } from './components/wizard/AssessmentWizard'
import { useAssessmentWizard } from './hooks/useAssessmentWizard'

export default function AssessmentApp({ testingMode = false }: { testingMode?: boolean }) {
  const {
    activeQuestionnaire,
    assessmentType,
    currentSection,
    currentSectionIndex,
    completedSections,
    completionSummary,
    saveStatus,
    submitError,
    isSubmitting,
    view,
    form,
    mainPanelRef,
    saveCurrentDraft,
    startAssessment,
    handleNext,
    handlePrevious,
    handleSubmit,
    resetAssessment,
    backToHomepage,
    editSection,
    backToForm,
    selectSection,
  } = useAssessmentWizard()

  const renderView = () => {
    switch (view) {
      case 'welcome':
        return <WelcomeView onSelect={startAssessment} />
      case 'review':
        return (
          <ReviewView
            activeQuestionnaire={activeQuestionnaire}
            submitError={submitError}
            isSubmitting={isSubmitting}
            onEditSection={editSection}
            onBackToForm={backToForm}
            onSubmit={handleSubmit}
          />
        )
      case 'success':
        return <SuccessView onRestart={resetAssessment} />
      case 'wizard':
      default:
        return (
          <AssessmentWizard
            activeQuestionnaire={activeQuestionnaire}
            assessmentType={assessmentType}
            currentSection={currentSection}
            currentSectionIndex={currentSectionIndex}
            completedSections={completedSections}
            completionSummary={completionSummary}
            saveStatus={saveStatus}
            mainPanelRef={mainPanelRef}
            onSelectSection={selectSection}
            onPrevious={handlePrevious}
            onSaveProgress={saveCurrentDraft}
            onNext={handleNext}
            onBackToHomepage={backToHomepage}
            testingMode={testingMode}
          />
        )
    }
  }

  return (
    <FormProvider {...form}>
      <div className="public-app">{renderView()}</div>
    </FormProvider>
  )
}
