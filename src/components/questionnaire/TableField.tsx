import { useFormContext } from 'react-hook-form'
import { getTableCellKey } from '../../lib/sectionSchema'
import type { FormValues, QuestionDefinition, QuestionnaireSection } from '../../types'

type TableFieldProps = {
  section: QuestionnaireSection
  question: QuestionDefinition
}

export function TableField({ section, question }: TableFieldProps) {
  const form = useFormContext<FormValues>()
  const table = question.tableDefinition
  if (!table) return null

  const tableValue = (form.watch(`${section.id}.${question.id}`) ?? {}) as Record<string, Record<string, string>>

  return (
    <div className="table-card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {table.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.id}>
                <td className="row-label">{row.label}</td>
                {table.columns.slice(1).map((column, index) => {
                  const cellKey = getTableCellKey(table, index)
                  const currentValue = tableValue[row.id]?.[cellKey] ?? ''
                  const isBasisCell = Boolean(table.basisOptions) && index === 1

                  if (isBasisCell && table.basisOptions) {
                    return (
                      <td key={`${row.id}-${column}`}>
                        <select
                          id={`${section.id}.${question.id}.${row.id}.${cellKey}`}
                          value={currentValue}
                          onChange={(event) => {
                            const nextValue = { ...(tableValue[row.id] ?? {}), [cellKey]: event.target.value }
                            form.setValue(`${section.id}.${question.id}.${row.id}` as any, nextValue as any)
                          }}
                        >
                          <option value="">Select</option>
                          <option value="-">-</option>
                          <option value="none">none</option>
                          <option value="nil">nil</option>
                          {table.basisOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                    )
                  }

                  return (
                    <td key={`${row.id}-${column}`}>
                      <input
                        id={`${section.id}.${question.id}.${row.id}.${cellKey}`}
                        type="text"
                        value={currentValue}
                        onChange={(event) => {
                          const nextValue = { ...(tableValue[row.id] ?? {}), [cellKey]: event.target.value }
                          form.setValue(`${section.id}.${question.id}.${row.id}` as any, nextValue as any)
                        }}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
