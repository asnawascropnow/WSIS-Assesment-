import { withSupabase } from '@supabase/server'
import {
  ALLOWED_ATTACHMENT_TYPES,
  ASSESSMENT_SCHEMA_VERSION,
  MAX_ATTACHMENT_SIZE_BYTES,
  QUESTIONNAIRE_VERSIONS,
} from '../src/constants/assessment.ts'
import type { AssessmentType } from '../src/types/index.ts'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABLE_BY_TYPE = {
  university: 'university_assessments',
  industry: 'industry_assessments',
  organization: 'organization_assessments',
  apartment: 'apartment_assessments',
} satisfies Record<AssessmentType, string>

const BUCKET_BY_TYPE = {
  university: 'university-assessment-files',
  industry: 'industry-assessment-files',
  organization: 'organization-assessment-files',
  apartment: 'apartment-assessment-files',
} satisfies Record<AssessmentType, string>

const ALL_BUCKETS = Object.values(BUCKET_BY_TYPE)

const REVIEW_STATUSES = ['submitted', 'under_review', 'needs_correction', 'approved', 'rejected'] as const

type AdminRole = 'super_admin' | 'reviewer' | 'analyst' | 'document_manager'
type ReviewStatus = (typeof REVIEW_STATUSES)[number]

type Capability =
  | 'assessments.read'
  | 'assessments.review'
  | 'organizations.read'
  | 'documents.read'
  | 'documents.download'
  | 'documents.verify'
  | 'exports.run'
  | 'users.manage'
  | 'settings.read'
  | 'audit.read'

const ROLE_CAPABILITIES: Record<AdminRole, ReadonlySet<Capability>> = {
  super_admin: new Set<Capability>([
    'assessments.read',
    'assessments.review',
    'organizations.read',
    'documents.read',
    'documents.download',
    'documents.verify',
    'exports.run',
    'users.manage',
    'settings.read',
    'audit.read',
  ]),
  reviewer: new Set<Capability>([
    'assessments.read',
    'assessments.review',
    'organizations.read',
    'documents.read',
    'documents.download',
    'exports.run',
    'settings.read',
    'audit.read',
  ]),
  analyst: new Set<Capability>([
    'assessments.read',
    'organizations.read',
    'documents.read',
    'documents.download',
    'exports.run',
    'settings.read',
  ]),
  document_manager: new Set<Capability>([
    'assessments.read',
    'organizations.read',
    'documents.read',
    'documents.download',
    'documents.verify',
    'settings.read',
  ]),
}

const CLIENT_AUDIT_ACTIONS = new Set(['assessment.viewed', 'document.downloaded', 'export.excel', 'export.zip'])
const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SupabaseAdmin = {
  from: (table: string) => any
  rpc: (fn: string, args?: Record<string, unknown>) => any
  storage: { from: (bucket: string) => any }
  auth: { admin: any }
}

type AdminActor = { id: string; email: string; role: AdminRole }

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function fail(message: string, status = 400) {
  return json({ error: message }, status)
}

function isAssessmentType(value: unknown): value is AssessmentType {
  return value === 'university' || value === 'industry' || value === 'organization' || value === 'apartment'
}

function isRole(value: unknown): value is AdminRole {
  return value === 'super_admin' || value === 'reviewer' || value === 'analyst' || value === 'document_manager'
}

function isReviewStatus(value: unknown): value is ReviewStatus {
  return typeof value === 'string' && (REVIEW_STATUSES as readonly string[]).includes(value)
}

function sanitizeSearch(value: string): string {
  return value.replace(/[,()\\]/g, ' ').trim().slice(0, 120)
}

function parsePositiveInt(value: unknown, fallback: number, max = Number.MAX_SAFE_INTEGER): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(Math.floor(parsed), max)
}

async function loadActor(
  supabaseAdmin: SupabaseAdmin,
  userId: string,
  email: string | undefined,
): Promise<AdminActor | null> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('user_id, email, role, is_active')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !data || data.is_active !== true || !isRole(data.role)) return null
  return { id: userId, email: data.email ?? email ?? '', role: data.role }
}

function can(actor: AdminActor, capability: Capability): boolean {
  return ROLE_CAPABILITIES[actor.role].has(capability)
}

async function writeAudit(
  supabaseAdmin: SupabaseAdmin,
  actor: AdminActor | null,
  action: string,
  targetType: string | null,
  targetId: string | null,
  outcome: 'success' | 'failure',
  metadata: Record<string, unknown>,
) {
  try {
    await supabaseAdmin.from('admin_audit_logs').insert({
      actor_id: actor?.id ?? null,
      actor_email: actor?.email ?? null,
      action,
      target_type: targetType,
      target_id: targetId,
      outcome,
      metadata,
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
  }
}

// ---------------------------------------------------------------------------
// Action handlers
// ---------------------------------------------------------------------------

async function listAssessments(supabaseAdmin: SupabaseAdmin, params: URLSearchParams) {
  const type = params.get('type')
  const status = params.get('status')
  const search = params.get('search') ?? ''
  const from = params.get('from')
  const to = params.get('to')
  const sortColumn = params.get('sort') === 'organization_name' ? 'organization_name' : 'submitted_at'
  const ascending = params.get('dir') === 'asc'
  const page = parsePositiveInt(params.get('page'), 1)
  const pageSize = parsePositiveInt(params.get('pageSize'), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)

  let query = supabaseAdmin
    .from('admin_assessment_index')
    .select(
      'assessment_type,id,schema_version,questionnaire_version,organization_name,review_status,submitted_at,document_count,metadata',
      { count: 'exact' },
    )

  if (type && isAssessmentType(type)) query = query.eq('assessment_type', type)
  if (status && isReviewStatus(status)) query = query.eq('review_status', status)
  if (from) query = query.gte('submitted_at', from)
  if (to) query = query.lte('submitted_at', to)

  const term = sanitizeSearch(search)
  if (term) {
    const filters = [`organization_name.ilike.%${term}%`]
    if (/^[0-9a-f-]{6,}$/i.test(term)) filters.push(`id.eq.${term}`)
    query = query.or(filters.join(','))
  }

  const offset = (page - 1) * pageSize
  const { data, count, error } = await query
    .order(sortColumn, { ascending })
    .order('id', { ascending: true })
    .range(offset, offset + pageSize - 1)

  if (error) throw error
  return json({ data: { rows: data ?? [], total: count ?? 0, page, pageSize } })
}

async function getAssessment(supabaseAdmin: SupabaseAdmin, actor: AdminActor, params: URLSearchParams) {
  const type = params.get('type')
  const id = params.get('id')
  if (!isAssessmentType(type) || !id) return fail('A valid assessment type and id are required.')
  if (!/^[0-9a-f-]{36}$/i.test(id)) return fail('The assessment id is not valid.')

  const { data, error } = await supabaseAdmin
    .from(TABLE_BY_TYPE[type])
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) return fail('Assessment not found.', 404)

  await writeAudit(supabaseAdmin, actor, 'assessment.viewed', type, id, 'success', {})
  return json({ data: { assessment: data, assessmentType: type } })
}

async function getOverview(supabaseAdmin: SupabaseAdmin) {
  const { data: stats, error: statsError } = await supabaseAdmin.rpc('admin_overview_stats')
  if (statsError) throw statsError

  const { data: recent, error: recentError } = await supabaseAdmin
    .from('admin_assessment_index')
    .select('assessment_type,id,organization_name,review_status,submitted_at,document_count')
    .order('submitted_at', { ascending: false })
    .limit(8)
  if (recentError) throw recentError

  const { data: activity, error: activityError } = await supabaseAdmin
    .from('admin_audit_logs')
    .select('id,actor_email,action,target_type,target_id,outcome,created_at')
    .order('created_at', { ascending: false })
    .limit(8)
  if (activityError) throw activityError

  return json({ data: { stats, recentAssessments: recent ?? [], recentActivity: activity ?? [] } })
}

async function listOrganizations(supabaseAdmin: SupabaseAdmin, params: URLSearchParams) {
  const category = params.get('category')
  const search = params.get('search') ?? ''
  const page = parsePositiveInt(params.get('page'), 1)
  const pageSize = parsePositiveInt(params.get('pageSize'), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)

  let query = supabaseAdmin
    .from('admin_organization_index')
    .select('*', { count: 'exact' })

  if (category && isAssessmentType(category)) query = query.eq('assessment_type', category)
  const term = sanitizeSearch(search)
  if (term) query = query.ilike('organization_name', `%${term}%`)

  const offset = (page - 1) * pageSize
  const { data, count, error } = await query
    .order('latest_submitted_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) throw error
  return json({ data: { rows: data ?? [], total: count ?? 0, page, pageSize } })
}

async function getOrganization(supabaseAdmin: SupabaseAdmin, params: URLSearchParams) {
  const type = params.get('type')
  const name = params.get('name')
  if (!isAssessmentType(type) || !name) return fail('A valid category and organization name are required.')

  const { data, error } = await supabaseAdmin
    .from('admin_assessment_index')
    .select('assessment_type,id,questionnaire_version,review_status,submitted_at,document_count,metadata')
    .eq('assessment_type', type)
    .eq('organization_name', name)
    .order('submitted_at', { ascending: false })

  if (error) throw error
  return json({ data: { organization: { assessment_type: type, organization_name: name }, assessments: data ?? [] } })
}

async function listDocuments(supabaseAdmin: SupabaseAdmin, params: URLSearchParams) {
  const category = params.get('category')
  const assessmentId = params.get('assessmentId')
  const section = params.get('section')
  const verification = params.get('verification')
  const search = params.get('search') ?? ''
  const page = parsePositiveInt(params.get('page'), 1)
  const pageSize = parsePositiveInt(params.get('pageSize'), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)

  let query = supabaseAdmin.from('admin_document_index').select('*', { count: 'exact' })

  if (category && isAssessmentType(category)) query = query.eq('assessment_type', category)
  if (assessmentId) query = query.eq('assessment_id', assessmentId)
  if (section) query = query.eq('section_id', section)
  if (verification === 'valid') query = query.eq('reference_valid', true)
  if (verification === 'invalid') query = query.eq('reference_valid', false)
  if (verification === 'missing') query = query.eq('storage_exists', false)

  const term = sanitizeSearch(search)
  if (term) query = query.or(`file_name.ilike.%${term}%,organization_name.ilike.%${term}%`)

  const offset = (page - 1) * pageSize
  const { data, count, error } = await query
    .order('submitted_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) throw error
  return json({ data: { rows: data ?? [], total: count ?? 0, page, pageSize } })
}

async function listOrphans(supabaseAdmin: SupabaseAdmin, params: URLSearchParams) {
  const search = params.get('search') ?? ''
  const page = parsePositiveInt(params.get('page'), 1)
  const pageSize = parsePositiveInt(params.get('pageSize'), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)

  let query = supabaseAdmin.from('admin_orphan_storage').select('*', { count: 'exact' })
  const term = sanitizeSearch(search)
  if (term) query = query.ilike('storage_path', `%${term}%`)

  const offset = (page - 1) * pageSize
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) throw error
  return json({ data: { rows: data ?? [], total: count ?? 0, page, pageSize } })
}

async function createDocumentUrl(supabaseAdmin: SupabaseAdmin, actor: AdminActor, params: URLSearchParams) {
  const bucket = params.get('bucket')
  const path = params.get('path')
  if (!bucket || !path || !ALL_BUCKETS.includes(bucket)) return fail('A valid bucket and storage path are required.')

  const { data: reference } = await supabaseAdmin
    .from('admin_document_index')
    .select('assessment_type,assessment_id,storage_exists')
    .eq('bucket_id', bucket)
    .eq('storage_path', path)
    .maybeSingle()

  if (!reference) return fail('This document is not referenced by any assessment.', 404)
  if (reference.storage_exists === false) return fail('The document object is missing from storage.', 410)

  const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, 300)
  if (error || !data?.signedUrl) return fail('A signed URL could not be generated.', 500)

  await writeAudit(supabaseAdmin, actor, 'document.signed_url', reference.assessment_type, reference.assessment_id, 'success', {
    bucket,
    path,
  })
  return json({ data: { url: data.signedUrl, expiresIn: 300 } })
}

async function updateReview(supabaseAdmin: SupabaseAdmin, actor: AdminActor, body: Record<string, unknown>) {
  const type = body.type
  const id = body.id
  const status = body.status
  const notes = typeof body.notes === 'string' ? body.notes.slice(0, 4000) : ''
  if (!isAssessmentType(type) || typeof id !== 'string' || !isReviewStatus(status)) {
    return fail('A valid assessment type, id, and review status are required.')
  }

  const review = {
    status,
    notes,
    reviewer_id: actor.id,
    reviewer_email: actor.email,
    reviewed_at: new Date().toISOString(),
  }

  const { data, error } = await supabaseAdmin
    .from(TABLE_BY_TYPE[type])
    .update({ review_status: status, review })
    .eq('id', id)
    .select('id, review_status, review')
    .maybeSingle()

  if (error) throw error
  if (!data) return fail('Assessment not found.', 404)

  await writeAudit(supabaseAdmin, actor, 'assessment.review_updated', type, id, 'success', { status })
  return json({ data: { review_status: data.review_status, review: data.review } })
}

async function verifyDocument(supabaseAdmin: SupabaseAdmin, actor: AdminActor, body: Record<string, unknown>) {
  const bucket = body.bucket
  const path = body.path
  if (typeof bucket !== 'string' || typeof path !== 'string') return fail('Bucket and path are required.')

  const { data, error } = await supabaseAdmin
    .from('admin_document_index')
    .select('*')
    .eq('bucket_id', bucket)
    .eq('storage_path', path)
    .maybeSingle()

  if (error) throw error
  await writeAudit(supabaseAdmin, actor, 'document.verified', null, path, 'success', {
    referenceValid: data?.reference_valid ?? false,
  })
  return json({ data: { document: data } })
}

async function logClientAudit(supabaseAdmin: SupabaseAdmin, actor: AdminActor, body: Record<string, unknown>) {
  const action = body.action
  if (typeof action !== 'string' || !CLIENT_AUDIT_ACTIONS.has(action)) return fail('Unsupported audit action.')
  await writeAudit(
    supabaseAdmin,
    actor,
    action,
    typeof body.targetType === 'string' ? body.targetType : null,
    typeof body.targetId === 'string' ? body.targetId : null,
    'success',
    typeof body.metadata === 'object' && body.metadata !== null ? (body.metadata as Record<string, unknown>) : {},
  )
  return json({ data: { ok: true } })
}

async function listUsers(supabaseAdmin: SupabaseAdmin, actor: AdminActor) {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('user_id,email,role,is_active,created_at')
    .order('created_at', { ascending: true })
  if (error) throw error
  return json({ data: { rows: data ?? [], me: { id: actor.id, email: actor.email, role: actor.role } } })
}

async function countActiveSuperAdmins(supabaseAdmin: SupabaseAdmin): Promise<number> {
  const { count } = await supabaseAdmin
    .from('admin_users')
    .select('user_id', { count: 'exact', head: true })
    .eq('role', 'super_admin')
    .eq('is_active', true)
  return count ?? 0
}

async function createUser(supabaseAdmin: SupabaseAdmin, actor: AdminActor, body: Record<string, unknown>) {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const role = body.role
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('A valid email address is required.')
  if (password.length < 8) return fail('The password must be at least 8 characters.')
  if (!isRole(role)) return fail('A valid role is required.')

  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error || !created?.user) return fail(error?.message ?? 'The user could not be created.', 400)

  const userId: string = created.user.id
  const { error: insertError } = await supabaseAdmin
    .from('admin_users')
    .insert({ user_id: userId, email, role, created_by: actor.id })
  if (insertError) {
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return fail('The administrator record could not be created.', 500)
  }

  await writeAudit(supabaseAdmin, actor, 'admin.created', 'admin_user', userId, 'success', { email, role })
  return json({ data: { user_id: userId, email, role, is_active: true } })
}

async function updateUserRole(supabaseAdmin: SupabaseAdmin, actor: AdminActor, body: Record<string, unknown>) {
  const userId = body.userId
  const role = body.role
  if (typeof userId !== 'string' || !isRole(role)) return fail('A valid user and role are required.')

  const { data: target } = await supabaseAdmin
    .from('admin_users')
    .select('user_id,role,is_active')
    .eq('user_id', userId)
    .maybeSingle()
  if (!target) return fail('Administrator not found.', 404)

  if (target.role === 'super_admin' && role !== 'super_admin' && target.is_active) {
    const supers = await countActiveSuperAdmins(supabaseAdmin)
    if (supers <= 1) return fail('You cannot demote the last active super admin.', 409)
  }

  const { error } = await supabaseAdmin.from('admin_users').update({ role, updated_at: new Date().toISOString() }).eq('user_id', userId)
  if (error) throw error
  await writeAudit(supabaseAdmin, actor, 'admin.role_changed', 'admin_user', userId, 'success', { role })
  return json({ data: { user_id: userId, role } })
}

async function setUserActive(supabaseAdmin: SupabaseAdmin, actor: AdminActor, body: Record<string, unknown>) {
  const userId = body.userId
  const isActive = body.isActive === true
  if (typeof userId !== 'string') return fail('A valid user is required.')
  if (userId === actor.id && !isActive) return fail('You cannot deactivate your own account.', 409)

  if (!isActive) {
    const { data: target } = await supabaseAdmin.from('admin_users').select('role,is_active').eq('user_id', userId).maybeSingle()
    if (target?.role === 'super_admin' && target.is_active) {
      const supers = await countActiveSuperAdmins(supabaseAdmin)
      if (supers <= 1) return fail('You cannot deactivate the last active super admin.', 409)
    }
  }

  const { error } = await supabaseAdmin
    .from('admin_users')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (error) throw error
  await writeAudit(supabaseAdmin, actor, isActive ? 'admin.activated' : 'admin.deactivated', 'admin_user', userId, 'success', {})
  return json({ data: { user_id: userId, is_active: isActive } })
}

async function deleteUser(supabaseAdmin: SupabaseAdmin, actor: AdminActor, body: Record<string, unknown>) {
  const userId = body.userId
  if (typeof userId !== 'string') return fail('A valid user is required.')
  if (userId === actor.id) return fail('You cannot delete your own account.', 409)

  const { data: target } = await supabaseAdmin.from('admin_users').select('role,is_active').eq('user_id', userId).maybeSingle()
  if (target?.role === 'super_admin' && target.is_active) {
    const supers = await countActiveSuperAdmins(supabaseAdmin)
    if (supers <= 1) return fail('You cannot delete the last active super admin.', 409)
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) return fail(error.message ?? 'The user could not be deleted.', 500)
  await writeAudit(supabaseAdmin, actor, 'admin.deleted', 'admin_user', userId, 'success', {})
  return json({ data: { user_id: userId } })
}

async function listAudit(supabaseAdmin: SupabaseAdmin, params: URLSearchParams) {
  const action = params.get('action')
  const actionPrefix = params.get('actionPrefix')
  const page = parsePositiveInt(params.get('page'), 1)
  const pageSize = parsePositiveInt(params.get('pageSize'), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)

  let query = supabaseAdmin
    .from('admin_audit_logs')
    .select('id,actor_id,actor_email,action,target_type,target_id,outcome,metadata,created_at', { count: 'exact' })
  if (action) query = query.eq('action', action)
  if (actionPrefix) query = query.like('action', `${sanitizeSearch(actionPrefix)}%`)

  const offset = (page - 1) * pageSize
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)
  if (error) throw error
  return json({ data: { rows: data ?? [], total: count ?? 0, page, pageSize } })
}

function getSettings(actor: AdminActor) {
  return json({
    data: {
      schemaVersion: ASSESSMENT_SCHEMA_VERSION,
      questionnaireVersions: QUESTIONNAIRE_VERSIONS,
      maxAttachmentSizeBytes: MAX_ATTACHMENT_SIZE_BYTES,
      allowedAttachmentTypes: ALLOWED_ATTACHMENT_TYPES,
      reviewStatuses: REVIEW_STATUSES,
      actor: { id: actor.id, email: actor.email, role: actor.role },
    },
  })
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const REQUIRED_CAPABILITY: Record<string, Capability> = {
  me: 'assessments.read',
  overview: 'assessments.read',
  assessments: 'assessments.read',
  assessment: 'assessments.read',
  organizations: 'organizations.read',
  organization: 'organizations.read',
  documents: 'documents.read',
  orphans: 'documents.read',
  documentUrl: 'documents.download',
  users: 'users.manage',
  audit: 'audit.read',
  settings: 'settings.read',
  'review.update': 'assessments.review',
  'document.verify': 'documents.verify',
  'audit.log': 'assessments.read',
  'users.create': 'users.manage',
  'users.updateRole': 'users.manage',
  'users.setActive': 'users.manage',
  'users.delete': 'users.manage',
}

const adminApi = withSupabase({ auth: 'user' }, async (request, ctx) => {
  const claims = ctx.userClaims
  if (!claims) return fail('Authentication is required.', 401)

  const supabaseAdmin = ctx.supabaseAdmin as unknown as SupabaseAdmin
  const actor = await loadActor(supabaseAdmin, claims.id, claims.email)
  if (!actor) return fail('Your account does not have administrator access.', 403)

  const url = new URL(request.url)
  let body: Record<string, unknown> = {}
  if (request.method === 'POST') {
    try {
      const raw = await request.text()
      body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
    } catch {
      return fail('Request body must be valid JSON.')
    }
  }

  const action = (request.method === 'POST' ? body.action : url.searchParams.get('action')) as string | undefined
  if (!action) return fail('An action is required.')

  const required = REQUIRED_CAPABILITY[action]
  if (!required) return fail('Unknown action.', 404)
  if (!can(actor, required)) {
    await writeAudit(supabaseAdmin, actor, 'authorization.denied', action, null, 'failure', { capability: required })
    return fail('You do not have permission to perform this action.', 403)
  }

  try {
    switch (action) {
      case 'me':
        return json({ data: { id: actor.id, email: actor.email, role: actor.role } })
      case 'overview':
        return await getOverview(supabaseAdmin)
      case 'assessments':
        return await listAssessments(supabaseAdmin, url.searchParams)
      case 'assessment':
        return await getAssessment(supabaseAdmin, actor, url.searchParams)
      case 'organizations':
        return await listOrganizations(supabaseAdmin, url.searchParams)
      case 'organization':
        return await getOrganization(supabaseAdmin, url.searchParams)
      case 'documents':
        return await listDocuments(supabaseAdmin, url.searchParams)
      case 'orphans':
        return await listOrphans(supabaseAdmin, url.searchParams)
      case 'documentUrl':
        return await createDocumentUrl(supabaseAdmin, actor, url.searchParams)
      case 'users':
        return await listUsers(supabaseAdmin, actor)
      case 'audit':
        return await listAudit(supabaseAdmin, url.searchParams)
      case 'settings':
        return getSettings(actor)
      case 'review.update':
        return await updateReview(supabaseAdmin, actor, body)
      case 'document.verify':
        return await verifyDocument(supabaseAdmin, actor, body)
      case 'audit.log':
        return await logClientAudit(supabaseAdmin, actor, body)
      case 'users.create':
        return await createUser(supabaseAdmin, actor, body)
      case 'users.updateRole':
        return await updateUserRole(supabaseAdmin, actor, body)
      case 'users.setActive':
        return await setUserActive(supabaseAdmin, actor, body)
      case 'users.delete':
        return await deleteUser(supabaseAdmin, actor, body)
      default:
        return fail('Unknown action.', 404)
    }
  } catch (error) {
    console.error(`Admin action "${action}" failed:`, error)
    return fail('The request could not be completed.', 500)
  }
})

export const config = { runtime: 'edge' }
export default adminApi
