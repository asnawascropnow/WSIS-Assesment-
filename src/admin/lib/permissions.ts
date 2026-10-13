import type { AdminRole } from './types'

export type Capability =
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

// Kept in sync with the server-side map in api/admin.ts. The server is the
// source of truth; this mirror only controls what the UI offers.
export const ROLE_CAPABILITIES: Record<AdminRole, ReadonlySet<Capability>> = {
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

export function roleCan(role: AdminRole | null | undefined, capability: Capability): boolean {
  if (!role) return false
  return ROLE_CAPABILITIES[role].has(capability)
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  reviewer: 'Assessment Reviewer',
  analyst: 'Data Analyst',
  document_manager: 'Document Manager',
}

export const ROLE_DESCRIPTION: Record<AdminRole, string> = {
  super_admin: 'Full administrative access, including user and settings management.',
  reviewer: 'View assessments and manage the review status and notes.',
  analyst: 'View authorised data and generate reports and exports.',
  document_manager: 'Access and manage assessment evidence and documents.',
}
