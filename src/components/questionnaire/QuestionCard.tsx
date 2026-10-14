import { useFormContext } from 'react-hook-form'
import type { FormValues, QuestionDefinition, QuestionnaireSection } from '../../types'
import { getQuestionExample } from '../../data/questionnaireExamples'
import { InfoTip } from './InfoTip'
import { QuestionField } from './QuestionField'

type QuestionCardProps = {
  section: QuestionnaireSection
  question: QuestionDefinition
}

export function QuestionCard({ section, question }: QuestionCardProps) {
  const form = useFormContext<FormValues>()
  const errors = form.formState.errors as Record<string, any>
  const errorMessage = errors?.[section.id]?.[question.id]?.message

  const example = getQuestionExample(section.id, question.id) ?? question.example

  return (
    <div className="question-card">
      <div className="question-head">
        <label className="question-label" htmlFor={`${section.id}.${question.id}`}>
          {question.question} <span className="required-indicator" aria-label="required">*</span>
        </label>
        {example ? <InfoTip text={example} /> : null}
      </div>
      <div className="example-box">
        <span className="example-label">What to include</span>
        <p>{question.example}</p>
      </div>
      <QuestionField section={section} question={question} />
      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
    </div>
  )
}
