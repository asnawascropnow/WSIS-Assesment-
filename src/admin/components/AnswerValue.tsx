import type { QuestionDefinition } from '../../types'
import { asText, classifyAnswer, getTableRows } from '../lib/answers'
import type { AttachmentReference, DocumentIndexRow, JsonRecord } from '../lib/types'
import { DocumentList } from './Documents'

type AnswerValueProps = {
  question: QuestionDefinition
  value: unknown
  answersMap?: JsonRecord
  documentReferences?: AttachmentReference[]
  verificationByPath?: Map<string, DocumentIndexRow>
  readOnlyDocuments?: boolean
}

function NotAnswered() {
  return (
    <p className="admin-report-answer not-answered" title="This question was not answered in the submission.">
      Not answered
    </p>
  )
}

function NotApplicable() {
  return (
    <p className="admin-report-answer not-applicable" title="The respondent marked this question as not applicable.">
      Not applicable
    </p>
  )
}

export function AnswerValue({
  question,
  value,
  documentReferences = [],
  verificationByPath,
  readOnlyDocuments = false,
}: AnswerValueProps) {
  const state = classifyAnswer(value)

  if (question.inputType === 'file') {
    if (state === 'not_applicable') return <NotApplicable />
    if (state === 'not_answered' || documentReferences.length === 0) {
      return (
        <p className="admin-report-answer not-answered">No files were uploaded for this question.</p>
      )
    }
    return <DocumentList references={documentReferences} verificationByPath={verificationByPath} readOnly={readOnlyDocuments} />
  }

  if (state === 'not_answered') return <NotAnswered />
  if (state === 'not_applicable') return <NotApplicable />

  if (question.inputType === 'table') {
    const table = question.tableDefinition
    if (!table) return <p className="admin-report-answer">{asText(value)}</p>
    const rows = getTableRows(table, value)
    const headers = table.columns
    return (
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-report-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" className="row-label">
                  {row.label}
                </th>
                {row.cells.map((cell, index) => (
                  <td key={index}>
                    {classifyAnswer(cell) === 'not_answered' ? (
                      <span className="admin-muted">—</span>
                    ) : (
                      asText(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const text = asText(value)

  if (question.inputType === 'url') {
    return (
      <p className="admin-report-answer">
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      </p>
    )
  }

  if (question.inputType === 'email') {
    return (
      <p className="admin-report-answer">
        <a href={`mailto:${text}`}>{text}</a>
      </p>
    )
  }

  if (question.inputType === 'tel') {
    return (
      <p className="admin-report-answer">
        <a href={`tel:${text.replace(/\s+/g, '')}`}>{text}</a>
      </p>
    )
  }

  const preserve = question.inputType === 'textarea'
  return <p className={`admin-report-answer${preserve ? ' prewrap' : ''}`}>{text}</p>
}
