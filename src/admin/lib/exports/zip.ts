import type JSZipType from 'jszip'
import type { Questionnaire } from '../../../types'
import { adminApi, fetchAsBlob, triggerBlobDownload } from '../api'
import { ASSESSMENT_TYPE_LABEL } from '../format'
import type { AssessmentRow, AssessmentType, DocumentIndexRow } from '../types'

export type ZipExportSummary = {
  included: number
  failed: number
  failures: Array<{ fileName: string; storagePath: string; reason: string }>
}

function safeSegment(value: string, fallback: string): string {
  const cleaned = value
    .replace(/[\\/]+/g, '_')
    .replace(/\.\.+/g, '_')
    .replace(/[^\w.\- ]+/g, '_')
    .trim()
  return cleaned.length > 0 ? cleaned.slice(0, 120) : fallback
}

export async function downloadAssessmentDocumentsZip(
  assessment: AssessmentRow,
  assessmentType: AssessmentType,
  questionnaire: Questionnaire,
  verificationByPath?: Map<string, DocumentIndexRow>,
  onProgress?: (completed: number, total: number) => void,
): Promise<ZipExportSummary> {
  const jszipModule = await import('jszip')
  const JSZip = (jszipModule.default ?? jszipModule) as typeof JSZipType

  const zip = new JSZip()
  const attachments = assessment.attachments ?? []
  const sectionById = new Map(questionnaire.sections.map((section) => [section.id, section]))
  const usedPaths = new Set<string>()
  const manifest: Array<Record<string, unknown>> = []
  const failures: ZipExportSummary['failures'] = []

  const rootName = safeSegment(assessment.organization_name || assessmentType, 'assessment')
  const root = `${rootName}_${assessment.id.slice(0, 8)}`

  let included = 0

  for (const [index, attachment] of attachments.entries()) {
    const section = sectionById.get(attachment.section_id)
    const question = section?.questions.find((item) => item.id === attachment.question_id)
    const folder = [
      root,
      safeSegment(attachment.section_id || 'unknown-section', 'section'),
      safeSegment(attachment.question_id || 'unknown-question', 'question'),
    ].join('/')

    const verification = verificationByPath?.get(attachment.storage_path)
    manifest.push({
      assessmentId: assessment.id,
      organization: assessment.organization_name,
      category: assessmentType,
      sectionId: attachment.section_id,
      sectionTitle: section?.title ?? '',
      questionId: attachment.question_id,
      questionLabel: question?.question ?? '',
      fileName: attachment.file_name,
      contentType: attachment.content_type,
      sizeBytes: attachment.size_bytes,
      bucketId: attachment.bucket_id,
      storagePath: attachment.storage_path,
      verification: verification
        ? verification.reference_valid
          ? 'valid'
          : verification.storage_exists
            ? 'invalid-reference'
            : 'missing-object'
        : 'unverified',
    })

    try {
      const { url } = await adminApi<{ url: string }>('documentUrl', {
        query: { bucket: attachment.bucket_id, path: attachment.storage_path },
      })
      const blob = await fetchAsBlob(url)

      let fileName = safeSegment(attachment.file_name, `file-${index + 1}`)
      let target = `${folder}/${fileName}`
      let attempt = 1
      while (usedPaths.has(target)) {
        fileName = `${fileName.replace(/(\.[^.]+)$/, '')}_${attempt}${fileName.match(/(\.[^.]+)$/)?.[0] ?? ''}`
        target = `${folder}/${fileName}`
        attempt += 1
      }
      usedPaths.add(target)
      zip.file(target, blob)
      included += 1
    } catch (error) {
      failures.push({
        fileName: attachment.file_name,
        storagePath: attachment.storage_path,
        reason: error instanceof Error ? error.message : 'Download failed.',
      })
    } finally {
      onProgress?.(index + 1, attachments.length)
    }
  }

  zip.file('manifest.json', JSON.stringify(manifest, null, 2))

  const failureReport = failures.length
    ? `\nFAILED FILES (${failures.length}):\n${failures
        .map((failure) => `- ${failure.fileName} (${failure.storagePath}): ${failure.reason}`)
        .join('\n')}\n`
    : ''

  zip.file(
    'README.txt',
    [
      `Water Assessment document export`,
      `Organization: ${assessment.organization_name || '—'}`,
      `Category: ${ASSESSMENT_TYPE_LABEL[assessmentType]}`,
      `Assessment ID: ${assessment.id}`,
      `Questionnaire version: ${assessment.questionnaire_version}`,
      `Exported at: ${new Date().toISOString()}`,
      ``,
      `Documents are organised as <assessment> / <section id> / <question id> / <original filename>.`,
      `manifest.json maps every file to its assessment, section, question and storage path.`,
      failureReport,
    ].join('\n'),
  )

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 5 } })
  triggerBlobDownload(blob, `${root}.zip`)

  return { included, failed: failures.length, failures }
}
