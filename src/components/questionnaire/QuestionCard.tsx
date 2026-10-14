import { useFormContext } from 'react-hook-form'
import type { FormValues, QuestionDefinition, QuestionnaireSection } from '../../types'
import { getQuestionExample } from '../../data/questionnaireExamples'
import { getQuestionTableExample } from '../../data/questionnaireTableExamples'
import { InfoTip, type InfoTipTable } from './InfoTip'
import { QuestionField } from './QuestionField'

type QuestionCardProps = {
  section: QuestionnaireSection
  question: QuestionDefinition
}

/**
 * Builds the structured example shown in the ⓘ tooltip for table questions.
 * Rows are taken from the question's own table definition (so the order always
 * matches the input table) and the authored example values fill the columns
 * after the label column.
 */
function buildTableExample(
  section: QuestionnaireSection,
  question: QuestionDefinition,
): InfoTipTable | undefined {
  const definition = question.tableDefinition
  if (!definition || definition.columns.length === 0 || definition.rows.length === 0) {
    return undefined
  }
  const values = getQuestionTableExample(section.id, question.id)
  const { columns } = definition
  const rows = definition.rows.map((row, index) => {
    const cells = [row.label, ...(values?.[index] ?? [])]
    while (cells.length < columns.length) cells.push('—')
    return cells.slice(0, columns.length)
  })
  return { columns, rows }
}

export function QuestionCard({ section, question }: QuestionCardProps) {
  const form = useFormContext<FormValues>()
  const errors = form.formState.errors as Record<string, any>
  const errorMessage = errors?.[section.id]?.[question.id]?.message

  const tableExample = buildTableExample(section, question)
  const example = getQuestionExample(section.id, question.id) ?? question.example

  return (
    <div className="question-card">
      <div className="question-head">
        <label className="question-label" htmlFor={`${section.id}.${question.id}`}>
          {question.question} <span className="required-indicator" aria-label="required">*</span>
        </label>
        {tableExample ? (
          <InfoTip
            table={tableExample}
            title="Example values"
            hint="Fill the table row by row, in this order."
          />
        ) : example ? (
          <InfoTip text={example} />
        ) : null}
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
