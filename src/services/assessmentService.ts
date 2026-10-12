import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { deleteObject, ref, uploadBytes } from 'firebase/storage'
import { firestore, storage } from '../firebase/client'

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024
const ALLOWED_ATTACHMENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

type AssessmentAttachment = {
  sectionId: string
  questionId: string
  name: string
  contentType: string
  size: number
  storagePath: string
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
    if (!ALLOWED_ATTACHMENT_TYPES.has(value.type)) {
      throw new Error(`${value.name} has an unsupported file type.`)
    }
    if (value.size > MAX_ATTACHMENT_SIZE) {
      throw new Error(`${value.name} is larger than the 10 MB limit.`)
    }

    const attachment: AssessmentAttachment = {
      sectionId,
      questionId,
      name: value.name,
      contentType: value.type,
      size: value.size,
      storagePath: '',
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
  assessmentType: 'university' | 'industry' | 'organization'
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

export async function submitAssessment(assessment: AssessmentPayload) {
  const uploads: PendingUpload[] = []
  const uploadedPaths: string[] = []

  try {
    const reference = doc(collection(firestore, 'assessments'))
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

    for (const upload of uploads) {
      const storagePath = `assessments/${reference.id}/${crypto.randomUUID()}`
      upload.attachment.storagePath = storagePath
      await uploadBytes(ref(storage, storagePath), upload.file, {
        contentType: upload.file.type,
      })
      uploadedPaths.push(storagePath)
    }

    await setDoc(reference, {
      ...assessment,
      answers,
      attachments: uploads.map(({ attachment }) => attachment),
      metadata: {
        ...assessment.metadata,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      },
    })

    return { ok: true, assessmentId: reference.id }
  } catch (error) {
    const cleanupResults = await Promise.allSettled(
      uploadedPaths.map((storagePath) => deleteObject(ref(storage, storagePath))),
    )
    cleanupResults.forEach((result) => {
      if (result.status === 'rejected') {
        console.error('Failed to clean up an uploaded assessment attachment:', result.reason)
      }
    })
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { ok: false, error: message }
  }
}
