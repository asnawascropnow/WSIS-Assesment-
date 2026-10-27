import type { AssessmentType } from '../../types'

export type { AssessmentType }

export type AdminRole = 'super_admin' | 'reviewer' | 'analyst' | 'document_manager'

export type ReviewStatus = 'submitted' | 'under_review' | 'needs_correction' | 'approved' | 'rejected'

export type AttachmentReference = {
  section_id: string
  question_id: string
  file_name: string
  content_type: string
  size_bytes: number
  bucket_id: string
  storage_path: string
}

export type ReviewRecord = {
  status?: ReviewStatus
  notes?: string
  reviewer_id?: string
  reviewer_email?: string
  reviewed_at?: string
}

export type JsonRecord = Record<string, unknown>

export type AssessmentIndexRow = {
  assessment_type: AssessmentType
  id: string
  schema_version: number
  questionnaire_version: string
  organization_name: string
  review_status: ReviewStatus
  submitted_at: string
  document_count: number
  metadata?: JsonRecord | null
}

export type AssessmentRow = AssessmentIndexRow & {
  answers: Record<string, JsonRecord>
  attachments: AttachmentReference[]
  review?: ReviewRecord | null
}

export type OrganizationIndexRow = {
  assessment_type: AssessmentType
  organization_name: string
  assessment_count: number
  latest_submitted_at: string
  latest_review_status: ReviewStatus | null
  latest_assessment_id: string | null
}

export type DocumentIndexRow = {
  assessment_type: AssessmentType
  assessment_id: string
  organization_name: string
  submitted_at: string
  section_id: string | null
  question_id: string | null
  file_name: string | null
  content_type: string | null
  size_bytes: number | null
  bucket_id: string | null
  storage_path: string | null
  expected_bucket: string | null
  storage_exists: boolean
  path_matches_assessment: boolean
  reference_valid: boolean
}

export type OrphanStorageRow = {
  bucket_id: string
  storage_path: string
  created_at: string
  size_bytes: number
  content_type: string | null
}

export type AuditLogRow = {
  id: number
  actor_id: string | null
  actor_email: string | null
  action: string
  target_type: string | null
  target_id: string | null
  outcome: 'success' | 'failure'
  metadata: JsonRecord
  created_at: string
}

export type AdminUserRow = {
  user_id: string
  email: string
  role: AdminRole
  is_active: boolean
  created_at: string
}

export type OverviewStats = {
  total: number
  byType: Partial<Record<AssessmentType, number>>
  byStatus: Partial<Record<ReviewStatus, number>>
  organizations: number
  documents: number
  invalidDocuments: number
  missingStorage: number
  orphanStorage: number
}

export type Paginated<T> = {
  rows: T[]
  total: number
  page: number
  pageSize: number
}

export type AssessmentListItem = Pick<
  AssessmentIndexRow,
  | 'assessment_type'
  | 'id'
  | 'questionnaire_version'
  | 'organization_name'
  | 'review_status'
  | 'submitted_at'
  | 'document_count'
>

export type RecentActivityItem = {
  id: number
  actor_email: string | null
  action: string
  target_type: string | null
  target_id: string | null
  outcome: 'success' | 'failure'
  created_at: string
}

export type AdminIdentity = {
  id: string
  email: string
  role: AdminRole
}
