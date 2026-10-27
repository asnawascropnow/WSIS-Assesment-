import { questionnairesByType } from '../data/questionnaires'
import { getTableCellKey } from '../lib/sectionSchema'
import type { AssessmentType } from '../types'
import { sampleDataByType } from './sampleData'
import type { SampleData } from './sampleData'

const MIME_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  pdf: 'application/pdf',
}

/** Loads a test file from `/testing/<name>` and wraps it as a File for the form. */
async function fetchSampleFile(name: string): Promise<File> {
  const response = await fetch(`/testing/${encodeURIComponent(name)}`)
  if (!response.ok) {
    throw new Error(`Could not load "${name}" from the testing folder (HTTP ${response.status}).`)
  }
  const blob = await response.blob()
  const extension = name.split('.').pop()?.toLowerCase() ?? ''
  const type =
    blob.type && blob.type !== 'application/octet-stream'
      ? blob.type
      : MIME_BY_EXTENSION[extension] ?? 'application/octet-stream'
  return new File([blob], name, { type })
}

/**
 * Builds a complete, validation-ready set of answers for any assessment category
 * using the authored sample data and the attachments served from `/testing`.
 * Missing values fall back to "-" (not applicable) so the form always validates.
 */
export async function buildSampleValues(
  assessmentType: AssessmentType,
  onProgress?: (message: string) => void,
): Promise<Record<string, Record<string, unknown>>> {
  const questionnaire = questionnairesByType[assessmentType]
  const data: SampleData = sampleDataByType[assessmentType]

  const fileCache = new Map<string, Promise<File>>()
  const getFile = (name: string) => {
    let pending = fileCache.get(name)
    if (!pending) {
      pending = fetchSampleFile(name)
      fileCache.set(name, pending)
    }
    return pending
  }

  const values: Record<string, Record<string, unknown>> = {}

  for (const section of questionnaire.sections) {
    const sectionValues: Record<string, unknown> = {}

    for (const question of section.questions) {
      if (question.inputType === 'file') {
        const names = data.attachments[question.id] ?? []
        if (names.length === 0) {
          sectionValues[question.id] = '-'
          continue
        }
        onProgress?.(`Loading ${names.length} test file(s) for "${question.id}"...`)
        sectionValues[question.id] = await Promise.all(names.map(getFile))
        continue
      }

      if (question.inputType === 'table') {
        const table = question.tableDefinition
        if (!table) continue
        const authoredRows = data.tableRows[question.id] ?? []
        const tableValue: Record<string, Record<string, string>> = {}
        table.rows.forEach((row, rowIndex) => {
          const cells = authoredRows[rowIndex] ?? []
          const rowValue: Record<string, string> = {}
          table.columns.slice(1).forEach((_column, columnIndex) => {
            rowValue[getTableCellKey(table, columnIndex)] = cells[columnIndex] ?? '-'
          })
          tableValue[row.id] = rowValue
        })
        sectionValues[question.id] = tableValue
        continue
      }

      sectionValues[question.id] = data.textAnswers[question.id] ?? '-'
    }

    values[section.id] = sectionValues
  }

  return values
}
