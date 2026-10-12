import { UploadCloud } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { ACCEPTED_ATTACHMENT_ATTRIBUTE } from '../../constants/assessment'
import type { FormValues, QuestionDefinition, QuestionnaireSection } from '../../types'
import { TableField } from './TableField'

type QuestionFieldProps = {
  section: QuestionnaireSection
  question: QuestionDefinition
}

export function QuestionField({ section, question }: QuestionFieldProps) {
  const form = useFormContext<FormValues>()
  const fieldPath = `${section.id}.${question.id}`

  if (question.inputType === 'table') {
    return <TableField section={section} question={question} />
  }

  const fieldValue = String(form.watch(fieldPath as any) ?? '')
  const baseInputClass = 'input-field'

  const handleChange = (value: string) => form.setValue(fieldPath as any, value as any)

  switch (question.inputType) {
    case 'textarea':
      return (
        <textarea
          id={fieldPath}
          className={baseInputClass}
          placeholder={question.placeholder}
          value={fieldValue}
          onChange={(event) => handleChange(event.target.value)}
          rows={5}
        />
      )
    case 'number':
      return (
        <input
          id={fieldPath}
          type="number"
          className={baseInputClass}
          placeholder={question.placeholder}
          value={fieldValue}
          onChange={(event) => handleChange(event.target.value)}
        />
      )
    case 'email':
      return (
        <input
          id={fieldPath}
          type="email"
          className={baseInputClass}
          placeholder={question.placeholder}
          value={fieldValue}
          onChange={(event) => handleChange(event.target.value)}
        />
      )
    case 'url':
      return (
        <input
          id={fieldPath}
          type="url"
          className={baseInputClass}
          placeholder={question.placeholder}
          value={fieldValue}
          onChange={(event) => handleChange(event.target.value)}
        />
      )
    case 'tel':
      return (
        <input
          id={fieldPath}
          type="tel"
          className={baseInputClass}
          placeholder={question.placeholder}
          value={fieldValue}
          onChange={(event) => handleChange(event.target.value)}
        />
      )
    case 'file':
      return (
        <div className="upload-box">
          <input
            id={fieldPath}
            type="file"
            multiple
            accept={ACCEPTED_ATTACHMENT_ATTRIBUTE}
            onChange={(event) => {
              const files = Array.from(event.target.files ?? [])
              form.setValue(fieldPath as any, files as any)
            }}
          />
          <div className="upload-meta">
            <UploadCloud size={18} />
            <span>Attach photographs and captions.</span>
          </div>
        </div>
      )
    default:
      return (
        <input
          id={fieldPath}
          type="text"
          className={baseInputClass}
          placeholder={question.placeholder}
          value={fieldValue}
          onChange={(event) => handleChange(event.target.value)}
        />
      )
  }
}
