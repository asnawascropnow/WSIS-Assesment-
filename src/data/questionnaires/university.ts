import type { Questionnaire } from '../../types/questionnaire'

export const universityQuestionnaire: Questionnaire = {
  title: 'Water Assessment',
  subtitle: 'Institutional water assessment and campus sustainability review',
  sections: [
    {
      id: 'general_information',
      title: 'SECTION 1 - GENERAL INFORMATION',
      introduction:
        'Capture the institutional profile and campus footprint needed to contextualise the water assessment.',
      questions: [
        {
          id: 'institution_name',
          question: 'Name of Educational Institution',
          example: 'Full legal name of the institution, including the managing trust/society/management body.',
          inputType: 'text',
          placeholder: 'Institution name',
        },
        {
          id: 'campus_address',
          question: 'Campus Address',
          example: 'Complete postal address of the campus (street/area, city, state, PIN code, country).',
          inputType: 'textarea',
          placeholder: 'Campus address',
        },
        {
          id: 'google_maps_url',
          question: 'Google Maps Location URL link',
          example: 'A direct, working Google Maps search or pin link to the campus.',
          inputType: 'url',
          placeholder: 'https://maps.google.com/…',
        },
        {
          id: 'primary_contact_person',
          question: 'Primary Contact Person Name and Designation',
          example: 'Name and official designation of the person coordinating this water assessment on behalf of the institution.',
          inputType: 'text',
          placeholder: 'Name and designation',
        },
        {
          id: 'official_email_address',
          question: 'Official Email Address',
          example: 'Institutional (not personal) email ID of the contact person.',
          inputType: 'email',
          placeholder: 'name@institution.edu',
        },
        {
          id: 'mobile_numbers',
          question: 'Mobile Number and Alternate Contact Number',
          example: 'Primary contact number with country code, plus an alternate number if available.',
          inputType: 'tel',
          placeholder: '+91 98765 43210 / +91 98765 43211',
        },
        {
          id: 'type_of_institution',
          question: 'Type of Institution',
          example:
            'Ownership type (government/private/deemed/state university), the legal act or society under which it was established, accreditation status (e.g. NAAC grade), and the disciplines/schools it offers.',
          inputType: 'textarea',
          placeholder: 'Institution type and accreditation details',
        },
        {
          id: 'total_campus_area_acres',
          question: 'Total Campus Area (Acres)',
          example: 'Total campus land area in acres (and hectares if known), noting whether it is a single integrated campus or spread across multiple sites.',
          inputType: 'number',
          placeholder: '0',
        },
        {
          id: 'buildings_and_rooftop_area',
          question: 'How many buildings and the square feet rooftop area of the buildings?',
          example:
            'Approximate count and type of buildings/blocks (academic, admin, hostel, library, etc.) and the combined rooftop area in square feet -- this feeds directly into rainwater-harvesting potential calculations.',
          inputType: 'textarea',
          placeholder: 'Example: 18 buildings; 1.6 million sq ft roof area',
        },
      ],
    },
    {
      id: 'student_staff_population',
      title: 'SECTION 2 - STUDENT & STAFF POPULATION',
      questions: [
        {
          id: 'day_scholars_count',
          question: 'Number of day scholars?',
          example: 'Count of enrolled students who are non-residential (commute daily).',
          inputType: 'number',
        },
        {
          id: 'residential_students_count',
          question: 'Total Number of residential students?',
          example: 'Count of students living in on-campus hostels/halls of residence.',
          inputType: 'number',
        },
        {
          id: 'girls_hostel_occupants',
          question: 'How many occupants are in the girls\' hostel?',
          example: 'Total occupancy of the girls\'/women\'s hostel block(s).',
          inputType: 'number',
        },
        {
          id: 'boys_hostel_occupants',
          question: 'How many occupants are in the boys\' hostel?',
          example: 'Total occupancy of the boys\'/men\'s hostel block(s).',
          inputType: 'number',
        },
        {
          id: 'teaching_staff_count',
          question: 'Number of Teaching Staff?',
          example: 'Total count of faculty members across all schools/departments.',
          inputType: 'number',
        },
        {
          id: 'non_teaching_staff_count',
          question: 'Number of Non-Teaching Staff?',
          example: 'Total count of administrative, technical, estate, housekeeping and security staff.',
          inputType: 'number',
        },
        {
          id: 'population_summary_table',
          question: 'Population summary table',
          example: 'Consolidate all the population figures above into the summary table below, and note for each row whether the number is a published/official figure, a derived calculation, or an approximate estimate.',
          inputType: 'table',
          tableDefinition: {
            id: 'population_summary_table',
            columns: ['Population Category', 'Count', 'Basis'],
            rows: [
              { id: 'total_students', label: 'Total students' },
              { id: 'day_scholars', label: 'Day scholars' },
              { id: 'residential_students', label: 'Residential students' },
              { id: 'girls_hostel_occupants', label: 'Girls\' hostel occupants' },
              { id: 'boys_hostel_occupants', label: 'Boys\' hostel occupants' },
              { id: 'teaching_staff', label: 'Teaching staff' },
              { id: 'non_teaching_staff', label: 'Non-teaching staff' },
            ],
            basisOptions: ['Published / Official', 'Derived', 'Approximate Estimate'],
          },
        },
      ],
    },
    {
      id: 'water_supply',
      title: 'SECTION 3 - WATER SUPPLY',
      questions: [
        {
          id: 'water_sources',
          question: 'What is the source of water?',
          example:
            'Mark each possible source as [YES]/[NO] -- Own Borewell, Tanker water imported, Municipal grid water -- and identify which is the primary source. Also describe any supplementary internal sources found on the ground (e.g. used-water filtration/reuse, rainwater harvesting) and how they connect to the primary supply.',
          inputType: 'textarea',
        },
        {
          id: 'daily_quantity_by_source',
          question: 'What is the daily quantity from each source?',
          example:
            'Quantify the approximate daily volume (KLD) drawn from or produced by each water source, with a short remark on how it is used or routed.',
          inputType: 'table',
          tableDefinition: {
            id: 'daily_quantity_by_source',
            columns: ['Source', 'Daily Quantity', 'Remarks'],
            rows: [
              { id: 'borewells_fresh_water', label: 'Borewells (fresh water)' },
              { id: 'recycled_treated_water', label: 'Recycled treated water' },
              { id: 'rainwater_harvesting', label: 'Rainwater harvesting' },
              { id: 'tanker_municipal', label: 'Tanker / Municipal' },
            ],
          },
        },
        {
          id: 'water_source_costs',
          question: 'What is the approximate cost of each?',
          example:
            'Approximate cost per KL for each source (borewell pumping + maintenance, STP-recycled water, tanker market rate, municipal tariff if applicable), and, where possible, the resulting monthly cost.',
          inputType: 'textarea',
        },
        {
          id: 'water_consumption_summary',
          question: 'Average Daily, Monthly, and Annual Water Consumption (KL/ML)',
          example:
            'Fresh (borewell/municipal) and recycled water consumption figures for daily, monthly and annual periods, in KL and ML.',
          inputType: 'table',
          tableDefinition: {
            id: 'water_consumption_summary',
            columns: ['Period', 'Fresh (Borewell)', 'Recycled (Reused)'],
            rows: [
              { id: 'daily', label: 'Daily' },
              { id: 'monthly', label: 'Monthly' },
              { id: 'annual', label: 'Annual' },
            ],
          },
        },
        {
          id: 'ro_plant_details',
          question: 'RO Plant Details (Capacity, daily input water, reject water quantity, application of RO reject water)',
          example:
            'Describe the drinking-water RO setup: where units are installed (hostels, academic blocks, etc.), combined capacity/daily input, permeate (drinking) output and recovery %, reject water quantity, and how/where the reject water is reused or disposed of.',
          inputType: 'textarea',
          placeholder: 'Capacity, inflow, recovery, reject-water use',
        },
      ],
    },
    {
      id: 'sanitation_wastewater',
      title: 'SECTION 4 - SANITATION & WASTEWATER',
      questions: [
        {
          id: 'stp_count',
          question: 'How many STPs are there?',
          example: 'Number of STP units/streams, their total capacity (KLD), and the name of the agency that designed/executed the plant, if known.',
          inputType: 'number',
        },
        {
          id: 'stp_type',
          question: 'Type of STP',
          example:
            'Treatment technology used (e.g. SBR, MBBR, ASP) and the full treatment train from primary through tertiary stage (filters, carbon, chlorination), plus how sludge is handled and disposed of.',
          inputType: 'textarea',
        },
        {
          id: 'stp_capacity',
          question: 'STP Capacity in (KLD)',
          example: 'Total design capacity in KLD versus the current average sewage inflow being treated, to show available headroom.',
          inputType: 'number',
        },
        {
          id: 'monthly_stp_operating_cost',
          question: 'Monthly Operational Cost of STP on chemical consumables and electricity of pumps',
          example: 'Approximate monthly operating cost, broken down by major component -- electricity for blowers/pumps, chemical consumables, and manpower.',
          inputType: 'textarea',
        },
        {
          id: 'public_toilets_count',
          question: 'How many public toilets in the campus apart from hostels?',
          example: 'Approximate count of public toilet blocks and total fixture count (W.C. units, urinals) across academic/admin buildings, excluding hostels.',
          inputType: 'textarea',
        },
        {
          id: 'typical_toilet_and_wash_basin_photos',
          question: 'Please upload photos of typical toilet and typical wash basin (Max 10 MB)',
          example: 'Attach or reference photographs of a typical toilet and wash basin here (see Annexure for the full site-photo set).',
          inputType: 'file',
        },
        {
          id: 'treated_water_application',
          question: 'What is the application of the treated waste water? Is it only for Landscape?',
          example:
            'List every use of the treated water (landscaping, agriculture/farm use, toilet flushing, groundwater recharge, etc.) with approximate volumes for each, and, if available, the treated water quality parameters (pH, BOD, COD, TSS, faecal coliform, residual chlorine).',
          inputType: 'textarea',
        },
      ],
    },
    {
      id: 'cafeteria',
      title: 'SECTION 5 - CAFETERIA',
      questions: [
        {
          id: 'cafeteria_usage',
          question: 'Is there a cafeteria and how many eat there appropriately?',
          example:
            'Describe the cafeteria/food court/hostel mess facilities on campus and an approximate daily footfall, since kitchen/dining water use and wastewater feed into the STP load.',
          inputType: 'textarea',
        },
      ],
    },
    {
      id: 'ground_research_findings',
      title: 'GROUND RESEARCH FINDINGS (FIELD SURVEY)',
      questions: [
        {
          id: 'ground_research_summary',
          question: 'Ground research findings',
          example:
            'A short paragraph describing what was physically inspected during the site visit (sumps, STP units, filtration rooms, pump houses, engineering drawings, etc.) and the headline finding from that survey.',
          inputType: 'textarea',
        },
        {
          id: 'used_water_storage_and_reuse',
          question: 'Used-water storage and reuse (as per ground research)',
          example: 'Key storage and reuse figures confirmed on site, sourced from tank name-boards, dosing/flow records and observation.',
          inputType: 'table',
          tableDefinition: {
            id: 'used_water_storage_and_reuse',
            columns: ['Parameter (ground research)', 'Value'],
            rows: [
              { id: 'used_treated_water_storage_on_campus', label: 'Used/treated water storage on campus' },
              { id: 'treated_water_used_for_landscaping', label: 'Treated water used for landscaping' },
              { id: 'treated_water_used_by_agriculture_dept', label: 'Treated water used by the Agriculture Dept.' },
              { id: 'other_reuse', label: 'Other reuse (flushing, nursery, recharge)' },
            ],
          },
        },
        {
          id: 'stp_units_verified',
          question: 'STP units verified on site (from name boards and flow diagrams)',
          example: 'List every civil/mechanical unit of the STP observed on site with its size/volume, as read from name-boards or flow-diagram signage.',
          inputType: 'table',
          tableDefinition: {
            id: 'stp_units_verified',
            columns: ['Unit', 'Size / Details (as displayed)'],
            rows: [
              { id: 'bar_screen_chamber', label: 'Bar screen chamber' },
              { id: 'equalization_tank', label: 'Equalization tank' },
              { id: 'pre_aeration_tanks_1_2', label: 'Pre-aeration tanks 1 & 2' },
              { id: 'aeration_sbr_tanks_1_2', label: 'Aeration (SBR) tanks 1 & 2' },
              { id: 'decant_tank', label: 'Decant tank' },
              { id: 'sludge_holding_tank', label: 'Sludge holding tank' },
              { id: 'treated_water_tank_1_2', label: 'Treated water tank 1 / 2' },
              { id: 'tertiary_train', label: 'Tertiary train (x2 streams)' },
              { id: 'machinery', label: 'Machinery' },
            ],
          },
        },
        {
          id: 'rainwater_harvesting',
          question: 'Rain water harvesting',
          example:
            'Number and distribution of rainwater harvesting structures (pits/tanks), what they collect, and how the harvested water is used and/or recharged.',
          inputType: 'textarea',
        },
        {
          id: 'key_observations',
          question: 'Key observations',
          example:
            'A bullet list of the survey\'s key takeaways -- e.g. how the water cycle closes (source -> use -> treatment -> reuse -> recharge), what share of demand is met by recycling, available headroom/capacity, and any specific improvement observations noted during the visit (e.g. missing maintenance records, absence of flow meters).',
          inputType: 'textarea',
        },
      ],
    },
    {
      id: 'conclusion',
      title: 'CONCLUSION',
      questions: [
        {
          id: 'conclusion_text',
          question: 'Conclusion',
          example:
            'A closing paragraph (100-150 words) tying together the institution\'s overall water self-reliance, the key supporting figures, and the stated purpose of the assessment (e.g. as a baseline for future Net Zero Water planning).',
          inputType: 'textarea',
          placeholder: 'Write a concise 100-150 word conclusion...',
        },
      ],
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      questions: [
        {
          id: 'disclaimer_note',
          question: 'Disclaimer',
          example:
            'Standard note clarifying that tilde-marked (~) figures are approximate estimates derived from published data/calculations/observation, and that final planning should rely on verified institutional records.',
          inputType: 'textarea',
          placeholder: 'Read the disclaimer before submission',
        },
      ],
    },
    {
      id: 'annexure_site_photographs',
      title: 'ANNEXURE A - SITE PHOTOGRAPHS (GROUND SURVEY)',
      questions: [
        {
          id: 'annexure_caption',
          question: 'All photographs were taken by me during the physical survey of the campus water infrastructure.',
          example:
            'Attach the site photographs taken during the ground survey (sumps, STP units, filtration rooms, pump skids, flow-diagram boards, etc.), each with a short caption describing what the photo shows.',
          inputType: 'file',
        },
      ],
    },
  ],
}

export const sectionOrder = universityQuestionnaire.sections.map((section) => section.id)
