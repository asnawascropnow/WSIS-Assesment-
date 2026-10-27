import { UploadCloud } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { ACCEPTED_ATTACHMENT_ATTRIBUTE } from '../../constants/assessment'
import { DRAFT_ATTACHMENT_RESELECT, NOT_APPLICABLE_VALUES } from '../../lib/sectionSchema'
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

  const rawFieldValue = form.watch(fieldPath as any) as unknown
  const fieldValue = typeof rawFieldValue === 'string' ? rawFieldValue : ''
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
          type="text"
          inputMode="decimal"
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
      {
        const noAttachment = typeof rawFieldValue === 'string'
          && NOT_APPLICABLE_VALUES.has(rawFieldValue.trim().toLowerCase())
        const selectedFiles = Array.isArray(rawFieldValue) ? rawFieldValue : []
        const needsReselection = selectedFiles.includes(DRAFT_ATTACHMENT_RESELECT)

      return (
        <div className="upload-box">
          <input
            id={fieldPath}
            type="file"
            multiple
            accept={ACCEPTED_ATTACHMENT_ATTRIBUTE}
            onChange={(event) => {
              const incoming = Array.from(event.target.files ?? [])
              // Append to whatever is already attached instead of replacing it,
              // so uploading again adds to the existing documents. Skip exact
              // duplicates (same name, size and last-modified stamp).
              const existing = selectedFiles.filter((file): file is File => file instanceof File)
              const merged = [...existing]
              for (const file of incoming) {
                const isDuplicate = merged.some(
                  (kept) =>
                    kept.name === file.name &&
                    kept.size === file.size &&
                    kept.lastModified === file.lastModified,
                )
                if (!isDuplicate) merged.push(file)
              }
              form.setValue(fieldPath as any, merged as any, { shouldDirty: true })
              // Reset the native input so selecting the same file again still fires change.
              event.target.value = ''
            }}
          />
          <div className="upload-meta">
            <UploadCloud size={18} />
            <span>Attach files (maximum 10 MB each).</span>
          </div>
          {selectedFiles.some((file) => file instanceof File) ? (
            <ul className="upload-file-list">
              {selectedFiles.filter((file): file is File => file instanceof File).map((file) => (
                <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
              ))}
            </ul>
          ) : null}
          {needsReselection ? (
            <p className="upload-meta">Files are not kept in saved drafts. Select them again or mark this question not applicable.</p>
          ) : null}
          <label className="upload-na-option">
            <input
              type="checkbox"
              checked={noAttachment}
              onChange={(event) => {
                const fileInput = document.getElementById(fieldPath) as HTMLInputElement | null
                if (fileInput) fileInput.value = ''
                form.setValue(fieldPath as any, event.target.checked ? '-' : [], { shouldDirty: true })
              }}
            />
            No file to attach (not applicable)
          </label>
        </div>
      )
      }
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
