-- ============================================================================
-- Admin dashboard schema (additive, non-destructive)
-- ----------------------------------------------------------------------------
-- Adds: admin_users, admin_audit_logs, review workflow columns + indexes on the
-- four assessment tables, and read-only reporting views + an overview RPC.
--
-- All new objects are locked down: access is revoked from anon/authenticated
-- and granted only to service_role. The /api/admin edge function holds the
-- secret key, verifies the caller's JWT, checks the caller's role here, and is
-- the single gateway to this data. The public browser client never reads these
-- tables directly.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Administrator accounts and roles
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null check (role in ('super_admin', 'reviewer', 'analyst', 'document_manager')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from public, anon, authenticated, service_role;
grant select, insert, update, delete on table public.admin_users to service_role;

-- ---------------------------------------------------------------------------
-- 2. Audit trail
-- ---------------------------------------------------------------------------
create table if not exists public.admin_audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid,
  actor_email text,
  action text not null,
  target_type text,
  target_id text,
  outcome text not null default 'success' check (outcome in ('success', 'failure')),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_logs_created_at_idx on public.admin_audit_logs (created_at desc);
create index if not exists admin_audit_logs_action_idx on public.admin_audit_logs (action);

alter table public.admin_audit_logs enable row level security;
revoke all on table public.admin_audit_logs from public, anon, authenticated, service_role;
grant select, insert on table public.admin_audit_logs to service_role;

-- ---------------------------------------------------------------------------
-- 3. Review workflow columns on each assessment table (never touches answers)
-- ---------------------------------------------------------------------------
do $$
declare
  target text;
begin
  foreach target in array array[
    'university_assessments', 'industry_assessments',
    'organization_assessments', 'apartment_assessments'
  ]
  loop
    execute format(
      'alter table public.%I add column if not exists review_status text not null default ''submitted'' '
      'check (review_status in (''submitted'', ''under_review'', ''needs_correction'', ''approved'', ''rejected''))',
      target
    );
    execute format(
      'alter table public.%I add column if not exists review jsonb not null default ''{}''::jsonb check (jsonb_typeof(review) = ''object'')',
      target
    );
    execute format('create index if not exists %I on public.%I (submitted_at desc)', target || '_submitted_at_idx', target);
    execute format('create index if not exists %I on public.%I (review_status)', target || '_review_status_idx', target);
    execute format('create index if not exists %I on public.%I (organization_name)', target || '_organization_name_idx', target);
    -- service_role may now read/update for admin actions.
    execute format('grant select, update on table public.%I to service_role', target);
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- 4. Unified assessment index view (all categories, normalized)
-- ---------------------------------------------------------------------------
create or replace view public.admin_assessment_index as
  select 'university'::text as assessment_type, id, schema_version, questionnaire_version,
         organization_name, review_status, review, attachments, metadata, submitted_at,
         jsonb_array_length(attachments) as document_count
  from public.university_assessments
  union all
  select 'industry'::text, id, schema_version, questionnaire_version,
         organization_name, review_status, review, attachments, metadata, submitted_at,
         jsonb_array_length(attachments)
  from public.industry_assessments
  union all
  select 'organization'::text, id, schema_version, questionnaire_version,
         organization_name, review_status, review, attachments, metadata, submitted_at,
         jsonb_array_length(attachments)
  from public.organization_assessments
  union all
  select 'apartment'::text, id, schema_version, questionnaire_version,
         organization_name, review_status, review, attachments, metadata, submitted_at,
         jsonb_array_length(attachments)
  from public.apartment_assessments;

-- ---------------------------------------------------------------------------
-- 5. Organization directory view (deduplicated per category + exact name)
-- ---------------------------------------------------------------------------
create or replace view public.admin_organization_index as
  select
    assessment_type,
    organization_name,
    count(*)::int as assessment_count,
    max(submitted_at) as latest_submitted_at,
    (array_agg(review_status order by submitted_at desc))[1] as latest_review_status,
    (array_agg(id order by submitted_at desc))[1] as latest_assessment_id
  from public.admin_assessment_index
  where coalesce(organization_name, '') <> ''
  group by assessment_type, organization_name;

-- ---------------------------------------------------------------------------
-- 6. Flattened document register view (with storage verification)
-- ---------------------------------------------------------------------------
create or replace view public.admin_document_index as
with base as (
  select i.assessment_type, i.id as assessment_id, i.organization_name, i.submitted_at,
         jsonb_array_elements(i.attachments) as a
  from public.admin_assessment_index i
)
select
  b.assessment_type,
  b.assessment_id,
  b.organization_name,
  b.submitted_at,
  a->>'section_id' as section_id,
  a->>'question_id' as question_id,
  a->>'file_name' as file_name,
  a->>'content_type' as content_type,
  nullif(a->>'size_bytes', '')::bigint as size_bytes,
  a->>'bucket_id' as bucket_id,
  a->>'storage_path' as storage_path,
  case b.assessment_type
    when 'university' then 'university-assessment-files'
    when 'industry' then 'industry-assessment-files'
    when 'organization' then 'organization-assessment-files'
    when 'apartment' then 'apartment-assessment-files'
  end as expected_bucket,
  (o.id is not null) as storage_exists,
  (coalesce(a->>'storage_path', '') like (b.assessment_id::text || '/%')) as path_matches_assessment,
  (
    coalesce(a->>'section_id', '') <> ''
    and coalesce(a->>'question_id', '') <> ''
    and (a->>'bucket_id') = case b.assessment_type
      when 'university' then 'university-assessment-files'
      when 'industry' then 'industry-assessment-files'
      when 'organization' then 'organization-assessment-files'
      when 'apartment' then 'apartment-assessment-files'
    end
    and (coalesce(a->>'storage_path', '') like (b.assessment_id::text || '/%'))
    and o.id is not null
  ) as reference_valid
from base b
left join storage.objects o
  on o.bucket_id = a->>'bucket_id'
 and o.name = a->>'storage_path';

-- ---------------------------------------------------------------------------
-- 7. Orphaned storage objects (present in a bucket but not referenced anywhere)
-- ---------------------------------------------------------------------------
create or replace view public.admin_orphan_storage as
select o.bucket_id, o.name as storage_path, o.created_at,
       coalesce((o.metadata->>'size')::bigint, 0) as size_bytes,
       o.metadata->>'mimetype' as content_type
from storage.objects o
where o.bucket_id in (
    'university-assessment-files', 'industry-assessment-files',
    'organization-assessment-files', 'apartment-assessment-files'
  )
  and not exists (
    select 1 from public.admin_document_index d
    where d.bucket_id = o.bucket_id and d.storage_path = o.name
  );

-- ---------------------------------------------------------------------------
-- 8. Overview metrics RPC
-- ---------------------------------------------------------------------------
create or replace function public.admin_overview_stats()
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'total', (select count(*)::int from public.admin_assessment_index),
    'byType', coalesce((
      select jsonb_object_agg(t.assessment_type, t.c)
      from (select assessment_type, count(*)::int as c from public.admin_assessment_index group by 1) t
    ), '{}'::jsonb),
    'byStatus', coalesce((
      select jsonb_object_agg(t.review_status, t.c)
      from (select review_status, count(*)::int as c from public.admin_assessment_index group by 1) t
    ), '{}'::jsonb),
    'organizations', (select count(*)::int from public.admin_organization_index),
    'documents', (select coalesce(sum(document_count), 0)::int from public.admin_assessment_index),
    'invalidDocuments', (select count(*)::int from public.admin_document_index where not reference_valid),
    'missingStorage', (select count(*)::int from public.admin_document_index where not storage_exists),
    'orphanStorage', (select count(*)::int from public.admin_orphan_storage)
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Lock down the views and function
-- ---------------------------------------------------------------------------
revoke all on table public.admin_assessment_index from public, anon, authenticated, service_role;
revoke all on table public.admin_organization_index from public, anon, authenticated, service_role;
revoke all on table public.admin_document_index from public, anon, authenticated, service_role;
revoke all on table public.admin_orphan_storage from public, anon, authenticated, service_role;

grant select on table public.admin_assessment_index to service_role;
grant select on table public.admin_organization_index to service_role;
grant select on table public.admin_document_index to service_role;
grant select on table public.admin_orphan_storage to service_role;

revoke all on function public.admin_overview_stats() from public, anon, authenticated;
grant execute on function public.admin_overview_stats() to service_role;

-- ---------------------------------------------------------------------------
-- 10. Bootstrap the first super admin
-- ----------------------------------------------------------------------------
-- There is intentionally NO self-service admin registration. To create the first
-- administrator:
--   1. Create the user in Supabase Auth (Dashboard > Authentication > Users, or
--      the /admin/users screen once a super admin exists).
--   2. Run, replacing the email:
--        insert into public.admin_users (user_id, email, role)
--        select id, email, 'super_admin' from auth.users where email = 'you@example.com'
--        on conflict (user_id) do update set role = excluded.role, is_active = true;
-- ---------------------------------------------------------------------------
