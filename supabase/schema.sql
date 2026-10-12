create table if not exists public.university_assessments (
  id uuid primary key,
  schema_version integer not null check (schema_version = 1),
  questionnaire_version text not null check (questionnaire_version in ('university-1.0', 'university-1.1')),
  organization_name text not null default '' check (char_length(organization_name) <= 250),
  answers jsonb not null check (
    jsonb_typeof(answers) = 'object'
    and answers ?& array[
      'general_information',
      'student_staff_population',
      'water_supply',
      'sanitation_wastewater',
      'cafeteria',
      'ground_research_findings',
      'conclusion',
      'disclaimer',
      'annexure_site_photographs'
    ]
    and octet_length(answers::text) <= 1048576
  ),
  attachments jsonb not null default '[]'::jsonb check (
    jsonb_typeof(attachments) = 'array'
    and jsonb_array_length(attachments) <= 100
  ),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  submitted_at timestamptz not null default now()
);

create table if not exists public.industry_assessments (
  id uuid primary key,
  schema_version integer not null check (schema_version = 1),
  questionnaire_version text not null check (questionnaire_version in ('industrial-1.0', 'industrial-1.1')),
  organization_name text not null default '' check (char_length(organization_name) <= 250),
  answers jsonb not null check (
    jsonb_typeof(answers) = 'object'
    and answers ?& array[
      'industry_general_information',
      'industry_operations_occupancy',
      'industry_water_supply_consumption',
      'industry_wastewater_etp_stp',
      'industry_cooling_boilers_utilities',
      'industry_rainwater_groundwater',
      'industry_costs_compliance_management',
      'industry_canteen_sanitation_amenities',
      'industry_ground_research_findings',
      'industry_conclusion',
      'industry_disclaimer',
      'industry_annexure'
    ]
    and octet_length(answers::text) <= 1048576
  ),
  attachments jsonb not null default '[]'::jsonb check (
    jsonb_typeof(attachments) = 'array'
    and jsonb_array_length(attachments) <= 100
  ),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  submitted_at timestamptz not null default now()
);

create table if not exists public.organization_assessments (
  id uuid primary key,
  schema_version integer not null check (schema_version = 1),
  questionnaire_version text not null check (questionnaire_version in ('organization-1.0', 'organization-1.1')),
  organization_name text not null default '' check (char_length(organization_name) <= 250),
  answers jsonb not null check (
    jsonb_typeof(answers) = 'object'
    and answers ?& array[
      'organization_general_information',
      'organization_occupancy_activities',
      'organization_water_supply_consumption',
      'organization_sanitation_wastewater',
      'organization_cooling_utilities',
      'organization_rainwater_groundwater',
      'organization_costs_compliance',
      'organization_cafeteria_cleaning_landscaping',
      'organization_ground_research_findings',
      'organization_conclusion',
      'organization_disclaimer',
      'organization_annexure'
    ]
    and octet_length(answers::text) <= 1048576
  ),
  attachments jsonb not null default '[]'::jsonb check (
    jsonb_typeof(attachments) = 'array'
    and jsonb_array_length(attachments) <= 100
  ),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  submitted_at timestamptz not null default now()
);

alter table public.university_assessments enable row level security;
alter table public.industry_assessments enable row level security;
alter table public.organization_assessments enable row level security;

revoke all on table public.university_assessments from public, anon, authenticated, service_role;
revoke all on table public.industry_assessments from public, anon, authenticated, service_role;
revoke all on table public.organization_assessments from public, anon, authenticated, service_role;
grant insert on table public.university_assessments to service_role;
grant insert on table public.industry_assessments to service_role;
grant insert on table public.organization_assessments to service_role;

drop policy if exists "Public can submit university assessments" on public.university_assessments;

drop policy if exists "Public can submit industry assessments" on public.industry_assessments;

drop policy if exists "Public can submit organization assessments" on public.organization_assessments;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('university-assessment-files', 'university-assessment-files', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('industry-assessment-files', 'industry-assessment-files', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('organization-assessment-files', 'organization-assessment-files', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can upload assessment attachments" on storage.objects;
drop policy if exists "Upload university assessment files" on storage.objects;
create policy "Upload university assessment files"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'university-assessment-files'
    and array_length(storage.foldername(name), 1) = 1
    and (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
  );

drop policy if exists "Upload industry assessment files" on storage.objects;
create policy "Upload industry assessment files"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'industry-assessment-files'
    and array_length(storage.foldername(name), 1) = 1
    and (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
  );

drop policy if exists "Upload organization assessment files" on storage.objects;
create policy "Upload organization assessment files"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'organization-assessment-files'
    and array_length(storage.foldername(name), 1) = 1
    and (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
  );

-- Preserve existing submissions if the previous combined table was created.
do $$
begin
  if to_regclass('public.assessments') is not null then
    execute $migration$
      insert into public.university_assessments
        (id, schema_version, questionnaire_version, organization_name, answers, attachments, metadata, submitted_at)
      select id::uuid, schema_version, questionnaire_version, coalesce(institution_name, ''), answers, coalesce(attachments, '[]'::jsonb), coalesce(metadata, '{}'::jsonb), coalesce(submitted_at, now())
      from public.assessments
      where assessment_type = 'university'
        and answers ?& array[
          'general_information', 'student_staff_population', 'water_supply',
          'sanitation_wastewater', 'cafeteria', 'ground_research_findings',
          'conclusion', 'disclaimer', 'annexure_site_photographs'
        ]
        and octet_length(answers::text) <= 1048576
        and jsonb_array_length(coalesce(attachments, '[]'::jsonb)) <= 100
      on conflict (id) do nothing
    $migration$;

    execute $migration$
      insert into public.industry_assessments
        (id, schema_version, questionnaire_version, organization_name, answers, attachments, metadata, submitted_at)
      select id::uuid, schema_version, questionnaire_version, coalesce(institution_name, ''), answers, coalesce(attachments, '[]'::jsonb), coalesce(metadata, '{}'::jsonb), coalesce(submitted_at, now())
      from public.assessments
      where assessment_type = 'industry'
        and answers ?& array[
          'industry_general_information', 'industry_operations_occupancy',
          'industry_water_supply_consumption', 'industry_wastewater_etp_stp',
          'industry_cooling_boilers_utilities', 'industry_rainwater_groundwater',
          'industry_costs_compliance_management', 'industry_canteen_sanitation_amenities',
          'industry_ground_research_findings', 'industry_conclusion',
          'industry_disclaimer', 'industry_annexure'
        ]
        and octet_length(answers::text) <= 1048576
        and jsonb_array_length(coalesce(attachments, '[]'::jsonb)) <= 100
      on conflict (id) do nothing
    $migration$;

    execute $migration$
      insert into public.organization_assessments
        (id, schema_version, questionnaire_version, organization_name, answers, attachments, metadata, submitted_at)
      select id::uuid, schema_version, questionnaire_version, coalesce(institution_name, ''), answers, coalesce(attachments, '[]'::jsonb), coalesce(metadata, '{}'::jsonb), coalesce(submitted_at, now())
      from public.assessments
      where assessment_type = 'organization'
        and answers ?& array[
          'organization_general_information', 'organization_occupancy_activities',
          'organization_water_supply_consumption', 'organization_sanitation_wastewater',
          'organization_cooling_utilities', 'organization_rainwater_groundwater',
          'organization_costs_compliance', 'organization_cafeteria_cleaning_landscaping',
          'organization_ground_research_findings', 'organization_conclusion',
          'organization_disclaimer', 'organization_annexure'
        ]
        and octet_length(answers::text) <= 1048576
        and jsonb_array_length(coalesce(attachments, '[]'::jsonb)) <= 100
      on conflict (id) do nothing
    $migration$;

    alter table public.assessments enable row level security;
    revoke all on table public.assessments from public, anon, authenticated;
    drop policy if exists "Public can submit assessments" on public.assessments;
  end if;
end
$$;
