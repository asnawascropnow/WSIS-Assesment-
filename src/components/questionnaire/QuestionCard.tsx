import { useFormContext } from 'react-hook-form'
import type { FormValues, QuestionDefinition, QuestionnaireSection } from '../../types'
import { QuestionField } from './QuestionField'

type QuestionCardProps = {
  section: QuestionnaireSection
  question: QuestionDefinition
}

export function QuestionCard({ section, question }: QuestionCardProps) {
  const form = useFormContext<FormValues>()
  const errors = form.formState.errors as Record<string, any>
  const errorMessage = errors?.[section.id]?.[question.id]?.message

  return (
    <div className="question-card">
      <label className="question-label" htmlFor={`${section.id}.${question.id}`}>
        {question.question} <span className="required-indicator" aria-label="required">*</span>
      </label>
      <div className="example-box">
        <p>{question.example}</p>
      </div>
      <QuestionField section={section} question={question} />
      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
    </div>
  )
}
