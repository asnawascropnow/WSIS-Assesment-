export type InputType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'url'
  | 'tel'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'table'
  | 'file'

export type TableDefinition = {
  id: string
  columns: string[]
  rows: { id: string; label: string }[]
  basisOptions?: string[]
}

export type QuestionDefinition = {
  id: string
  question: string
  example: string
  inputType: InputType
  required?: boolean
  helpText?: string | null
  options?: string[]
  tableDefinition?: TableDefinition | null
  placeholder?: string
}

export type QuestionnaireSection = {
  id: string
  title: string
  introduction?: string
  questions: QuestionDefinition[]
}

export type Questionnaire = {
  title: string
  subtitle: string
  sections: QuestionnaireSection[]
}

export type AssessmentType = 'university' | 'industry' | 'organization'
