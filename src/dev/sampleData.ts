import type { AssessmentType } from '../types'
import {
  apartmentSampleAttachments,
  apartmentSampleTableRows,
  apartmentSampleTextAnswers,
} from './apartmentSampleData'
import {
  industrialSampleAttachments,
  industrialSampleTableRows,
  industrialSampleTextAnswers,
} from './industrialSampleData'
import {
  organizationSampleAttachments,
  organizationSampleTableRows,
  organizationSampleTextAnswers,
} from './organizationSampleData'
import {
  universitySampleAttachments,
  universitySampleTableRows,
  universitySampleTextAnswers,
} from './universitySampleData'

/**
 * Authored sample data for one questionnaire: plain text answers keyed by
 * question id, table cell values keyed by table id (row order), and attachment
 * file names (from the repo `testing/` folder) keyed by file question id.
 */
export type SampleData = {
  textAnswers: Record<string, string>
  tableRows: Record<string, string[][]>
  attachments: Record<string, string[]>
}

/** Sample data for every assessment category, so the dev panel works anywhere. */
export const sampleDataByType: Record<AssessmentType, SampleData> = {
  university: {
    textAnswers: universitySampleTextAnswers,
    tableRows: universitySampleTableRows,
    attachments: universitySampleAttachments,
  },
  industry: {
    textAnswers: industrialSampleTextAnswers,
    tableRows: industrialSampleTableRows,
    attachments: industrialSampleAttachments,
  },
  organization: {
    textAnswers: organizationSampleTextAnswers,
    tableRows: organizationSampleTableRows,
    attachments: organizationSampleAttachments,
  },
  apartment: {
    textAnswers: apartmentSampleTextAnswers,
    tableRows: apartmentSampleTableRows,
    attachments: apartmentSampleAttachments,
  },
}
