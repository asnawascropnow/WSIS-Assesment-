import { z } from 'zod'
import type { QuestionnaireSection } from '../types'
import type { SectionValues } from '../types'

export function createDefaultSectionValues(
  sections: QuestionnaireSection[],
): Record<string, SectionValues> {
  return Object.fromEntries(sections.map((section) => [section.id, {}])) as Record<string, SectionValues>
}

export function makeSectionSchema(section: QuestionnaireSection) {
  const general: Record<string, z.ZodTypeAny> = {
    institution_name: z.string().optional(),
    campus_address: z.string().optional(),
    google_maps_url: z.string().url().optional().or(z.literal('')),
    primary_contact_person: z.string().optional(),
    official_email_address: z.string().email().optional().or(z.literal('')),
    mobile_numbers: z.string().optional(),
    type_of_institution: z.string().optional(),
    total_campus_area_acres: z.coerce.number().nonnegative().optional(),
    buildings_and_rooftop_area: z.string().optional(),
  }

  const population: Record<string, z.ZodTypeAny> = {
    day_scholars_count: z.coerce.number().nonnegative().optional(),
    residential_students_count: z.coerce.number().nonnegative().optional(),
    girls_hostel_occupants: z.coerce.number().nonnegative().optional(),
    boys_hostel_occupants: z.coerce.number().nonnegative().optional(),
    teaching_staff_count: z.coerce.number().nonnegative().optional(),
    non_teaching_staff_count: z.coerce.number().nonnegative().optional(),
    population_summary_table: z.record(z.string(), z.any()).optional(),
  }

  const supply: Record<string, z.ZodTypeAny> = {
    water_sources: z.string().optional(),
    daily_quantity_by_source: z.record(z.string(), z.any()).optional(),
    water_source_costs: z.string().optional(),
    water_consumption_summary: z.record(z.string(), z.any()).optional(),
    ro_plant_details: z.string().optional(),
  }

  const sanitation: Record<string, z.ZodTypeAny> = {
    stp_count: z.coerce.number().nonnegative().optional(),
    stp_type: z.string().optional(),
    stp_capacity: z.coerce.number().nonnegative().optional(),
    monthly_stp_operating_cost: z.string().optional(),
    public_toilets_count: z.string().optional(),
    typical_toilet_and_wash_basin_photos: z.any().optional(),
    treated_water_application: z.string().optional(),
  }

  const cafeteria: Record<string, z.ZodTypeAny> = {
    cafeteria_usage: z.string().optional(),
  }

  const findings: Record<string, z.ZodTypeAny> = {
    ground_research_summary: z.string().optional(),
    used_water_storage_and_reuse: z.record(z.string(), z.any()).optional(),
    stp_units_verified: z.record(z.string(), z.any()).optional(),
    rainwater_harvesting: z.string().optional(),
    key_observations: z.string().optional(),
  }

  const conclusion: Record<string, z.ZodTypeAny> = {
    conclusion_text: z.string().optional(),
  }

  const disclaimer: Record<string, z.ZodTypeAny> = {
    disclaimer_note: z.string().optional(),
  }

  const annexure: Record<string, z.ZodTypeAny> = {
    annexure_caption: z.any().optional(),
  }

  const schemas: Record<string, z.ZodTypeAny> = {
    general_information: z.object(general).passthrough(),
    student_staff_population: z.object(population).passthrough(),
    water_supply: z.object(supply).passthrough(),
    sanitation_wastewater: z.object(sanitation).passthrough(),
    cafeteria: z.object(cafeteria).passthrough(),
    ground_research_findings: z.object(findings).passthrough(),
    conclusion: z.object(conclusion).passthrough(),
    disclaimer: z.object(disclaimer).passthrough(),
    annexure_site_photographs: z.object(annexure).passthrough(),
  }

  if (schemas[section.id]) return schemas[section.id]

  const fields = Object.fromEntries(
    section.questions.map((question) => {
      if (question.inputType === 'table' || question.inputType === 'file') {
        return [question.id, z.any().optional()]
      }

      if (question.inputType === 'number') {
        return [
          question.id,
          z.string().regex(/^\d*\.?\d*$/, 'Enter a non-negative number.').optional().or(z.literal('')),
        ]
      }

      if (question.inputType === 'email') {
        return [question.id, z.string().email('Enter a valid email address.').optional().or(z.literal(''))]
      }

      if (question.inputType === 'url') {
        return [question.id, z.string().url('Enter a valid URL.').optional().or(z.literal(''))]
      }

      return [question.id, z.string().optional()]
    }),
  )

  return z.object(fields).passthrough()
}
