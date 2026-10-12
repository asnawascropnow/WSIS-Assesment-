import type { AssessmentType, Questionnaire } from '../../types'
import { industrialQuestionnaire } from './industrial'
import { organizationQuestionnaire } from './organization'
import { universityQuestionnaire } from './university'

export { industrialQuestionnaire, organizationQuestionnaire, universityQuestionnaire }
export { sectionOrder } from './university'

export const questionnairesByType: Record<AssessmentType, Questionnaire> = {
  university: universityQuestionnaire,
  industry: industrialQuestionnaire,
  organization: organizationQuestionnaire,
}
