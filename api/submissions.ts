import { withSupabase } from '@supabase/server'
import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENT_SIZE_BYTES,
  QUESTIONNAIRE_VERSIONS,
} from '../src/constants/assessment.ts'
import { questionnairesByType } from '../src/data/questionnaires/index.ts'
import { getTableCellKey, isValidPhoneNumber, NOT_APPLICABLE_VALUES } from '../src/lib/sectionSchema.ts'
import type { AssessmentType } from '../src/types/index.ts'

const tableByType = {
  university: 'university_assessments',
  industry: 'industry_assessments',
  organization: 'organization_assessments',
  apartment: 'apartment_assessments',
} satisfies Record<AssessmentType, string>

const bucketByType = {
  university: 'university-assessment-files',
  industry: 'industry-assessment-files',
  organization: 'organization-assessment-files',
  apartment: 'apartment-assessment-files',
} satisfies Record<AssessmentType, string>

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isAnswered(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const normalized = value.trim()
  return normalized.length > 0 || NOT_APPLICABLE_VALUES.has(normalized.toLowerCase())
}

function isFileReference(
  value: unknown,
  assessmentId: string,
  bucketId: string,
  sectionId: string,
  questionId: string,
  attachmentsByPath: Map<string, JsonRecord>,
  usedAttachmentPaths: Set<string>,
): value is JsonRecord {
  if (!isRecord(value)) return false
  if (
    typeof value.storage_path !== 'string' ||
    typeof value.file_name !== 'string' ||
    typeof value.content_type !== 'string' ||
    typeof value.size_bytes !== 'number' ||
    typeof value.bucket_id !== 'string'
  ) {
    return false
  }

  const manifestEntry = attachmentsByPath.get(value.storage_path)
  if (
    !manifestEntry ||
    !value.storage_path.startsWith(`${assessmentId}/`) ||
    value.bucket_id !== bucketId ||
    value.section_id !== sectionId ||
    value.question_id !== questionId ||
    manifestEntry.section_id !== value.section_id ||
    manifestEntry.question_id !== value.question_id ||
    manifestEntry.file_name !== value.file_name ||
    manifestEntry.content_type !== value.content_type ||
    manifestEntry.size_bytes !== value.size_bytes ||
    manifestEntry.bucket_id !== value.bucket_id ||
    usedAttachmentPaths.has(value.storage_path)
  ) {
    return false
  }

  usedAttachmentPaths.add(value.storage_path)
  return true
}

function validatePayload(payload: unknown): { assessmentType: AssessmentType; row: JsonRecord } | undefined {
  if (!isRecord(payload)) return

  const assessmentType = payload.assessmentType
  if (
    assessmentType !== 'university' &&
    assessmentType !== 'industry' &&
    assessmentType !== 'organization' &&
    assessmentType !== 'apartment'
  ) {
    return
  }

  const questionnaire = questionnairesByType[assessmentType]
  const sectionIds = questionnaire.sections.map(({ id }) => id)
  const sectionAnswers = payload.answers
  const attachments = payload.attachments
  const assessmentId = payload.id
  const bucketId = bucketByType[assessmentType]

  if (
    payload.schema_version !== 1 ||
    payload.questionnaire_version !== QUESTIONNAIRE_VERSIONS[assessmentType] ||
    typeof assessmentId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assessmentId) ||
    typeof payload.organization_name !== 'string' ||
    payload.organization_name.length > 250 ||
    !isRecord(sectionAnswers) ||
    !Array.isArray(attachments) ||
    attachments.length > 100 ||
    !isRecord(payload.metadata) ||
    Object.keys(sectionAnswers).length !== sectionIds.length ||
    sectionIds.some((id) => !Object.hasOwn(sectionAnswers, id))
  ) {
    return
  }

  const attachmentsByPath = new Map<string, JsonRecord>()
  const usedAttachmentPaths = new Set<string>()
  for (const attachment of attachments) {
    if (
      !isRecord(attachment) ||
      typeof attachment.storage_path !== 'string' ||
      !new RegExp(`^${assessmentId}/[^/]+$`).test(attachment.storage_path) ||
      typeof attachment.section_id !== 'string' ||
      typeof attachment.question_id !== 'string' ||
      typeof attachment.file_name !== 'string' ||
      attachment.file_name.length === 0 ||
      attachment.file_name.length > 255 ||
      typeof attachment.content_type !== 'string' ||
      !ALLOWED_ATTACHMENT_TYPES.includes(attachment.content_type as (typeof ALLOWED_ATTACHMENT_TYPES)[number]) ||
      typeof attachment.size_bytes !== 'number' ||
      !Number.isInteger(attachment.size_bytes) ||
      attachment.size_bytes < 0 ||
      attachment.size_bytes > MAX_ATTACHMENT_SIZE_BYTES ||
      attachment.bucket_id !== bucketId ||
      attachmentsByPath.has(attachment.storage_path)
    ) {
      return
    }
    attachmentsByPath.set(attachment.storage_path, attachment)
  }

  for (const section of questionnaire.sections) {
    const answers = sectionAnswers[section.id]
    if (!isRecord(answers) || Object.keys(answers).length !== section.questions.length) return

    for (const question of section.questions) {
      if (!Object.hasOwn(answers, question.id)) return
      const answer = answers[question.id]

      if (question.inputType === 'file') {
        if (typeof answer === 'string' && NOT_APPLICABLE_VALUES.has(answer.trim().toLowerCase())) continue
        if (
          !Array.isArray(answer) ||
          answer.length === 0 ||
          answer.some((file) =>
            !isFileReference(
              file,
              assessmentId,
              bucketId,
              section.id,
              question.id,
              attachmentsByPath,
              usedAttachmentPaths,
            ),
          )
        ) {
          return
        }
        continue
      }

      if (question.inputType === 'table') {
        const table = question.tableDefinition
        if (!table || !isRecord(answer)) return
        for (const row of table.rows) {
          const rowAnswers = answer[row.id]
          if (!isRecord(rowAnswers)) return
          for (const [index] of table.columns.slice(1).entries()) {
            if (!isAnswered(rowAnswers[getTableCellKey(table, index)])) return
          }
        }
        continue
      }

      if (!isAnswered(answer)) return
      const normalized = answer.trim()
      if (NOT_APPLICABLE_VALUES.has(normalized.toLowerCase())) continue
      if (assessmentType !== 'university' && question.inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return
      if (question.inputType === 'url') {
        try {
          new URL(normalized)
        } catch {
          return
        }
      }
      if (question.inputType === 'tel' && !isValidPhoneNumber(normalized)) return
    }
  }
  if (usedAttachmentPaths.size !== attachmentsByPath.size) return

  const row = {
    id: assessmentId,
    schema_version: payload.schema_version,
    questionnaire_version: payload.questionnaire_version,
    organization_name: payload.organization_name,
    answers: sectionAnswers,
    attachments,
    metadata: payload.metadata,
  }

  return { assessmentType, row }
}

const submitAssessment = withSupabase({ auth: 'publishable' }, async (request, { supabaseAdmin }) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 2 * 1024 * 1024) {
    return Response.json({ error: 'Submission is too large.' }, { status: 413 })
  }

  let body: unknown
  try {
    const rawBody = await request.text()
    if (new TextEncoder().encode(rawBody).byteLength > 2 * 1024 * 1024) {
      return Response.json({ error: 'Submission is too large.' }, { status: 413 })
    }
    body = JSON.parse(rawBody)
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const payload = validatePayload(body)
  if (!payload) {
    return Response.json({ error: 'Submission data is incomplete or invalid.' }, { status: 400 })
  }

  try {
    const { error } = await supabaseAdmin.from(tableByType[payload.assessmentType]).insert(payload.row)
    if (error) {
      console.error('Supabase assessment insert failed:', error.code, error.message)
      return Response.json({ error: 'Submission could not be saved. Please try again.' }, { status: 500 })
    }
  } catch (error) {
    console.error('Supabase admin client failed to save assessment:', error)
    return Response.json({ error: 'Submission could not be saved. Please try again.' }, { status: 500 })
  }

  return Response.json({ ok: true, assessmentId: payload.row.id })
})

export default { fetch: submitAssessment }
