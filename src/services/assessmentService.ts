import { supabase } from '../supabase/client'
import { ALLOWED_ATTACHMENT_TYPES, MAX_ATTACHMENT_SIZE_BYTES } from '../constants/assessment'
import type { AssessmentType } from '../types'

const ALLOWED_ATTACHMENT_TYPE_SET = new Set<string>(ALLOWED_ATTACHMENT_TYPES)

export type SubmissionProgressStage = 'preparing' | 'uploading' | 'submitting' | 'complete' | 'error'

export type SubmissionProgress = {
  stage: SubmissionProgressStage
  message: string
  percent: number
  uploaded: number
  total: number
}

type AssessmentAttachment = {
  section_id: string
  question_id: string
  file_name: string
  content_type: string
  size_bytes: number
  bucket_id: string
  storage_path: string
}

type PendingUpload = {
  file: File
  attachment: AssessmentAttachment
}

function serializeAnswer(
  value: unknown,
  sectionId: string,
  questionId: string,
  uploads: PendingUpload[],
): unknown {
  if (typeof File !== 'undefined' && value instanceof File) {
    if (!ALLOWED_ATTACHMENT_TYPE_SET.has(value.type)) {
      throw new Error(`${value.name} has an unsupported file type.`)
    }
    if (value.size > MAX_ATTACHMENT_SIZE_BYTES) {
      throw new Error(`${value.name} is larger than the 10 MB limit.`)
    }

    const attachment: AssessmentAttachment = {
      section_id: sectionId,
      question_id: questionId,
      file_name: value.name,
      content_type: value.type,
      size_bytes: value.size,
      bucket_id: '',
      storage_path: '',
    }
    uploads.push({ file: value, attachment })
    return attachment
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeAnswer(item, sectionId, questionId, uploads))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        serializeAnswer(nestedValue, sectionId, questionId, uploads),
      ]),
    )
  }

  return value
}

export type AssessmentPayload = {
  schemaVersion: number
  assessmentType: AssessmentType
  status: 'draft' | 'submitted'
  institutionName?: string
  questionnaireVersion: string
  answers: Record<string, unknown>
  metadata: {
    createdAt?: unknown
    updatedAt?: unknown
    submittedAt?: unknown
    createdBy?: string | null
  }
  attachments: unknown[]
}

export async function submitAssessment(
  assessment: AssessmentPayload,
  onProgress?: (progress: SubmissionProgress) => void,
) {
  const uploads: PendingUpload[] = []

  try {
    onProgress?.({ stage: 'preparing', message: 'Preparing submission...', percent: 5, uploaded: 0, total: 0 })

    const assessmentId = crypto.randomUUID()
    const bucketByType = {
      university: 'university-assessment-files',
      industry: 'industry-assessment-files',
      organization: 'organization-assessment-files',
      apartment: 'apartment-assessment-files',
    } satisfies Record<AssessmentType, string>
    const bucketId = bucketByType[assessment.assessmentType]
    const answers = Object.fromEntries(
      Object.entries(assessment.answers).map(([sectionId, sectionAnswers]) => [
        sectionId,
        Object.fromEntries(
          Object.entries(sectionAnswers as Record<string, unknown>).map(([questionId, value]) => [
            questionId,
            serializeAnswer(value, sectionId, questionId, uploads),
          ]),
        ),
      ]),
    )

    if (uploads.length > 100) {
      throw new Error('A submission can contain no more than 100 attachments.')
    }

    // Uploads previously ran one-by-one, so a handful of attachments added
    // several seconds of dead time before the row insert. Run them in parallel
    // (bounded, so we don't open dozens of simultaneous connections) and stop
    // at the first failure.
    const CONCURRENT_UPLOADS = 4
    let cursor = 0
    let firstError: Error | null = null
    let uploadedCount = 0
    const totalUploads = uploads.length

    if (totalUploads > 0) {
      onProgress?.({ stage: 'uploading', message: `Uploading files (0/${totalUploads})...`, percent: 10, uploaded: 0, total: totalUploads })
    } else {
      onProgress?.({ stage: 'uploading', message: 'Processing files...', percent: 15, uploaded: 0, total: 0 })
    }

    async function uploadWorker() {
      while (cursor < uploads.length) {
        if (firstError) return
        const upload = uploads[cursor++]
        const safeFileName = upload.file.name.replace(/[^\w.-]+/g, '_').slice(0, 120)
        const storagePath = `${assessmentId}/${crypto.randomUUID()}_${safeFileName}`
        upload.attachment.bucket_id = bucketId
        upload.attachment.storage_path = storagePath
        const { error } = await supabase.storage
          .from(bucketId)
          .upload(storagePath, upload.file, {
            contentType: upload.file.type,
            upsert: false,
          })
        if (error) {
          const errMsg = (error as any)?.message ?? 'Upload failed'
          firstError = error instanceof Error ? error : new Error(errMsg)
          return
        }
        uploadedCount++
        const percent = totalUploads === 0 ? 40 : 10 + Math.round((uploadedCount / totalUploads) * 40)
        onProgress?.({ stage: 'uploading', message: `Uploading files (${uploadedCount}/${totalUploads})...`, percent, uploaded: uploadedCount, total: totalUploads })
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(CONCURRENT_UPLOADS, uploads.length) }, () => uploadWorker()),
    )
    if (firstError) throw firstError

    onProgress?.({ stage: 'submitting', message: 'Saving submission...', percent: 70, uploaded: uploadedCount, total: totalUploads })

    const submission = {
      id: assessmentId,
      schema_version: assessment.schemaVersion,
      questionnaire_version: assessment.questionnaireVersion,
      organization_name: assessment.institutionName ?? '',
      answers,
      attachments: uploads.map(({ attachment }) => attachment),
      metadata: assessment.metadata,
    }

    const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    if (!publishableKey) {
      throw new Error('Supabase publishable key is not configured.')
    }
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: publishableKey,
      },
      body: JSON.stringify({
        assessmentType: assessment.assessmentType,
        ...submission,
      }),
    })
    const result = (await response.json().catch(() => null)) as
      | { ok?: boolean; assessmentId?: string; error?: string }
      | null
    if (!response.ok || !result?.ok || !result.assessmentId) {
      throw new Error(result?.error ?? `Submission API failed with status ${response.status}.`)
    }

    onProgress?.({ stage: 'complete', message: 'Submission complete!', percent: 100, uploaded: uploadedCount, total: totalUploads })
    return { ok: true, assessmentId }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    onProgress?.({ stage: 'error', message: message, percent: 100, uploaded: 0, total: 0 })
    return { ok: false, error: message }
  }
}
