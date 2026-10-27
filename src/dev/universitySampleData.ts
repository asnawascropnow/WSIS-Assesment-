/**
 * Dev-only sample data for the University / Institution water assessment.
 *
 * Attachment files live in the repo `testing/` folder and are served at
 * `/testing/*` by the Vite dev/preview server (see vite.config.ts).
 *
 * Table cell values are listed in row order; each inner array covers the table
 * columns after the label column. Missing values fall back to "-" in the loader,
 * so the data always satisfies the "every cell answered" rule.
 */

export const universitySampleTextAnswers: Record<string, string> = {
  // Section 1 - General information
  institution_name: 'Sri Venkateswara Institute of Technology',
  campus_address:
    'Sri Venkateswara Institute of Technology, 21st KM Kanakapura Main Road, Uttarahalli, Bengaluru, Karnataka 560082',
  google_maps_url: 'https://maps.google.com/?q=12.8951,77.5560',
  primary_contact_person: 'Dr. Anitha Rao, Estate and Sustainability Officer',
  official_email_address: 'estate@svit.edu.in',
  mobile_numbers: '+91 98801 22334 / +91 80 2846 7788',
  type_of_institution:
    'Private, self-financing engineering institution established under a registered education trust; NAAC A grade and AICTE approved, offering engineering, management and applied-science programmes across seven schools.',
  total_campus_area_acres: '42',
  buildings_and_rooftop_area:
    '18 buildings across academic, administrative, hostel, library and utility blocks with a combined rooftop area of about 1.6 million sq ft.',

  // Section 2 - Student & staff population
  day_scholars_count: '3120',
  residential_students_count: '1180',
  girls_hostel_occupants: '640',
  boys_hostel_occupants: '540',
  teaching_staff_count: '268',
  non_teaching_staff_count: '192',

  // Section 3 - Water supply
  water_sources:
    'Own borewells (primary, three numbers), tanker water imported in summer (backup), municipal grid water (secondary) plus internal sources: STP-treated water reused for flushing and landscaping and rooftop rainwater harvesting routed to recharge pits.',
  water_source_costs:
    'Borewell pumping and maintenance about Rs 16/KL; STP-recycled water about Rs 8/KL (power and chemicals); tanker water about Rs 240/KL; municipal tariff about Rs 32/KL. Total water cost is roughly Rs 8.2 lakh per month in summer and lower in the monsoon.',
  ro_plant_details:
    'Central RO plants in the boys and girls hostels plus pantry RO units in academic blocks. Combined capacity about 6 KL/h, daily input about 22 KL, permeate output about 14 KL (recovery ~64%). Reject of about 8 KL/day is routed to the STP equalisation tank for reuse in flushing and landscaping.',

  // Section 4 - Sanitation & wastewater
  stp_count: '2',
  stp_type:
    'Two MBBR-based STPs with screening, equalisation, aeration, secondary clarification, pressure-sand filtration and chlorination. Dewatered sludge is dried on beds and handed to an authorised vendor twice a year.',
  stp_capacity: '320',
  monthly_stp_operating_cost:
    'About Rs 1.12 lakh per month: electricity about Rs 46,000 for blowers and pumps, chemicals about Rs 18,000, operator and manpower about Rs 32,000, and maintenance and quarterly laboratory testing about Rs 16,000.',
  public_toilets_count:
    '22 public toilet blocks across academic and administrative buildings excluding hostels, with about 210 WC units and 140 urinals in total.',
  treated_water_application:
    'Treated water is used for landscaping (about 60 KLD), toilet flushing in academic blocks (about 18 KLD) and vehicle washing and construction (about 7 KLD). Treated-water quality is typically pH 7.1, BOD 12 mg/L, COD 42 mg/L, TSS 18 mg/L and faecal coliform under 100 MPN/100 mL, monitored quarterly.',

  // Section 5 - Cafeteria
  cafeteria_usage:
    'Two cafeterias and four hostel messes serve about 4,200 meals a day combined. Kitchen and dining water use feeds the STP load and grease traps are installed on all kitchen outlets.',

  // Ground research findings
  ground_research_summary:
    'Site visit on 12 May 2026 covering sumps, overhead tanks, borewells, both STPs, filtration rooms, pump houses, treated-water reuse lines and rainwater structures. Headline finding: the campus meets about 26% of demand through treated-water reuse and harvesting, with headroom in the existing STP capacity.',
  rainwater_harvesting:
    'Rooftop runoff from about 1.1 million sq ft is routed through first-flush diverters to 24 recharge pits and 6 recharge trenches; two 20 KL tanks store water for gardening. Recharged volumes are not metered.',
  key_observations:
    'The water cycle closes from borewell and municipal source to use, treatment and reuse. About 85 KLD of the roughly 330 KLD demand is met by recycled water. Flow meters exist on the main source and STP but the reuse line and hostel sub-lines are unmetered, and maintenance logbooks are inconsistent across blocks.',

  // Conclusion + disclaimer
  conclusion_text:
    'Sri Venkateswara Institute of Technology supports about 4,300 students, 1,180 of them residential, using roughly 245 KLD of fresh water from borewells and municipal supply with about 85 KLD of treated-water reuse. A 320 KLD MBBR STP treats the campus sewage and effluent is reused for landscaping and flushing. Rainwater is recharged through pits and trenches. Reuse covers about a quarter of demand, and metering, leak control and higher reuse are the priority actions for a Net Zero Water roadmap.',
  disclaimer_note:
    'Figures marked "~" are approximate estimates derived from published data, calculations and site observation. Final planning should rely on verified institutional records, laboratory testing and engineering design.',

  // Annexure
  annexure_caption:
    'All photographs were taken during the physical survey of the campus water infrastructure, with captions describing sumps, STP units, filtration rooms and pump skids.',
}

/** Table cell values in row order (columns after the label column). */
export const universitySampleTableRows: Record<string, string[][]> = {
  population_summary_table: [
    ['4300', 'Derived'],
    ['3120', 'Published / Official'],
    ['1180', 'Published / Official'],
    ['640', 'Published / Official'],
    ['540', 'Published / Official'],
    ['268', 'Published / Official'],
    ['192', 'Published / Official'],
  ],
  daily_quantity_by_source: [
    ['210', 'Own borewells; primary source'],
    ['85', 'STP treated water for flushing and landscaping'],
    ['12', 'Monsoon only; routed to recharge pits'],
    ['35', 'Tanker backup during summer'],
  ],
  water_consumption_summary: [
    ['245', '85'],
    ['7350', '2550'],
    ['88200', '30600'],
  ],
  used_water_storage_and_reuse: [
    ['~120 KL of treated-water storage on campus'],
    ['~60 KLD used for landscaping'],
    ['~18 KLD used by the Agriculture Dept. nursery'],
    ['~7 KLD for toilet flushing and vehicle washing'],
  ],
  stp_units_verified: [
    ['Bar screen chamber - 1.2 m wide, manual plus mechanical'],
    ['Equalization tank - ~90 m3'],
    ['Pre-aeration tanks 1 & 2 - ~70 m3 each'],
    ['Aeration (SBR) tanks 1 & 2 - ~110 m3 each'],
    ['Decant tank - ~45 m3'],
    ['Sludge holding tank - ~30 m3'],
    ['Treated water tank 1 / 2 - ~60 KL each'],
    ['Tertiary train (x2 streams) - PSF, activated carbon and chlorination'],
    ['Machinery - 3 blowers, 4 pumps, 2 decanters'],
  ],
}

/** Attachments (from the repo `testing/` folder) added to the file questions. */
export const universitySampleAttachments: Record<string, string[]> = {
  typical_toilet_and_wash_basin_photos: [
    '25.08.2026 at 1.15 PM.png',
    'Gemini_Generated_Image_ucu1dyucu1dyucu1.png',
  ],
  annexure_caption: [
    'safyos-open-design-ai-1790835903381.png',
    'ChatGPT Image Sep 4, 2026, 05_57_24 PM.png',
    'safyos-safyos-cursor-library-pages-dev-continuous-1790943830734.pdf',
  ],
}
