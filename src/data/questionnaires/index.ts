import type { AssessmentType, Questionnaire } from '../../types/index.js'
import { apartmentQuestionnaire } from './apartment.js'
import { industrialQuestionnaire } from './industrial.js'
import { organizationQuestionnaire } from './organization.js'
import { universityQuestionnaire } from './university.js'

export { apartmentQuestionnaire, industrialQuestionnaire, organizationQuestionnaire, universityQuestionnaire }
export { sectionOrder } from './university.js'

export const questionnairesByType: Record<AssessmentType, Questionnaire> = {
  university: universityQuestionnaire,
  industry: industrialQuestionnaire,
  organization: organizationQuestionnaire,
  apartment: apartmentQuestionnaire,
}
