import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { firestore } from '../lib/firebase'

export type AssessmentPayload = {
  schemaVersion: number
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
  try {
    const reference = await addDoc(collection(firestore, 'assessments'), {
      ...assessment,
      metadata: {
        ...assessment.metadata,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      },
    })

    await updateDoc(doc(firestore, 'assessments', reference.id), {
      status: 'submitted',
    })

    return { ok: true, assessmentId: reference.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { ok: false, error: message }
  }
}
