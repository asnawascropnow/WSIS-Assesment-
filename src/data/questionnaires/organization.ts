import type { Questionnaire } from '../../types/questionnaire'

type OrganizationInputType = 'text' | 'textarea' | 'number' | 'email' | 'url' | 'table' | 'file'

const question = (id: string, label: string, example = '', inputType: OrganizationInputType = 'textarea') => ({
  id,
  question: label,
  example,
  inputType,
})

const table = (id: string, label: string, columns: string[], rows: string[], example: string) => ({
  id,
  question: label,
  example,
  inputType: 'table' as const,
  tableDefinition: {
    id,
    columns,
    rows: rows.map((row, index) => ({ id: `${id}_row_${index + 1}`, label: row })),
  },
})

export const organizationQuestionnaire: Questionnaire = {
  title: 'Organization / Company Water Assessment',
  subtitle: 'Water use, shared facilities and sustainability assessment for organizations and companies',
  sections: [
    {
      id: 'organization_general_information',
      title: 'SECTION 1 - GENERAL INFORMATION',
      questions: [
        question('organization_name', 'Name of Organization / Company', 'Full legal name of the organization, company or operating entity, including parent company if applicable.', 'text'),
        question('organization_type_activities', 'Type of Organization and Main Activities', 'For example, IT/technology company, corporate office, financial services, consulting, retail, hotel, healthcare, shared office, commercial complex or other non-manufacturing organization. Describe the principal activities conducted at the site.'),
        question('registered_site_address', 'Registered Office and Site Address', 'Provide the registered office address and the exact address of the building or campus covered by the assessment. If multiple locations exist, specify the location being assessed.'),
        question('maps_url', 'Google Maps Location URL', 'Provide a direct Google Maps pin or search link to the office, campus or commercial facility.', 'url'),
        question('primary_contact', 'Primary Contact Person and Designation', 'Name and designation of the person coordinating the assessment, such as administration head, facility manager, operations manager, EHS manager or sustainability lead.', 'text'),
        question('official_email_contacts', 'Official Email Address and Contact Numbers', 'Provide the official email address, primary phone number with country code and an alternate contact number, if available.', 'text'),
        question('ownership_occupancy_arrangement', 'Ownership / Occupancy Arrangement', 'State whether the organization owns, leases or manages the building. If leased, identify the landlord, property manager and responsibilities for water bills, treatment plants, meters and maintenance.'),
        question('site_area_built_up_area', 'Total Site Area and Built-up Area', "Provide plot area, total built-up area, number of floors and the area occupied by the organization. If the building is shared, distinguish total building area from the organization's leased/occupied area."),
        table('building_rooftop_details', 'Building and rooftop details', ['Building / block', 'Number of buildings', 'Floors', 'Built-up area', 'Rooftop area', 'Remarks'], [
          'Main office / tower', 'Additional office / block', 'Parking / amenities', 'Other',
        ], 'For example, a main office tower may have 10 floors and 80,000 sq ft built-up area. Use approved plans or facility records and distinguish roof area from total built-up area.'),
        question('operating_schedule', 'Operating Schedule', 'Number of operating days per week, office hours, shifts, weekend occupancy, holidays and any seasonal or hybrid-work variation.'),
        question('shared_facilities', 'Shared Facilities', 'Identify shared amenities such as common washrooms, food courts, parking, landscaped areas, cooling towers, central utility plants or common STP/ETP systems, and state who manages them.'),
      ],
    },
    {
      id: 'organization_occupancy_activities',
      title: 'SECTION 2 - OCCUPANCY & DAILY ACTIVITIES',
      questions: [
        question('employees_occupants', 'Number of Employees and On-site Occupants', 'Provide average daily occupancy rather than only total payroll headcount. Include employees, contractors, housekeeping, security, vendors, visitors and other occupants as applicable.'),
        table('occupancy_summary', 'Occupancy summary', ['Occupant category', 'Typical daily count', 'Peak-day count', 'Basis / record', 'Remarks'], [
          'Employees', 'Contract workers', 'Housekeeping / security', 'Visitors / vendors', 'Canteen / facility staff', 'Total daily occupancy',
        ], 'For example, HR records may show 500 employees, while access-card records show 320 people on a typical day. Use the daily on-site count for water-demand estimates and avoid double-counting outsourced staff.'),
        question('occupancy_pattern', 'Occupancy Pattern by Day and Shift', 'Record occupancy differences across shifts, weekdays, weekends and hybrid-work days. Note any events or seasonal periods that materially change demand.'),
        table('daily_occupancy_pattern', 'Daily occupancy pattern', ['Day / shift', 'Operating hours', 'Approx. occupants', 'Water-demand impact / remarks'], [
          'Weekday / main shift', 'Evening / extended hours', 'Weekend', 'Peak event / other',
        ], 'For example, a site may have 320 occupants on a typical weekday and 80 on Saturday. Use access-control, attendance or facility records where available.'),
        question('water_using_activities', 'Water-Using Activities', 'Describe routine activities that use water, including toilets, handwashing, showers, pantry, canteen, cleaning, cooling towers, HVAC, humidification, laboratories, gym/showers, vehicle washing and landscaping.'),
        table('major_water_use_points', 'Major water-use points', ['Area / activity', 'How water is used', 'Approx. quantity (KLD)', 'Metered? / basis', 'Remarks'], [
          'Washrooms', 'Pantry / canteen', 'Cooling / HVAC', 'Cleaning', 'Landscaping', 'Other',
        ], 'For example, record washroom use as a metered or estimated daily quantity. If a separate meter is unavailable, note the estimation method rather than presenting the value as measured.'),
        question('canteen_pantry_food_services', 'Canteen, Pantry and Food Services', 'State whether there is a full-service canteen, outsourced cafeteria, pantry or vending area; number of meals served per day; operating hours; and who manages kitchen wastewater.'),
        question('other_facilities', 'Other Facilities', 'State whether the site includes a gym, shower facilities, clinic, nursery, guest rooms, accommodation, laboratory, data centre or other activity with material water demand.'),
      ],
    },
    {
      id: 'organization_water_supply_consumption',
      title: 'SECTION 3 - WATER SUPPLY & CONSUMPTION',
      questions: [
        question('water_sources', 'What are the sources of water?', 'Mark each source YES/NO and identify the primary and backup sources: borewell, tanker, municipal supply, industrial estate supply, harvested rainwater, treated wastewater reuse or other source.'),
        table('water_sources_available', 'Water sources available', ['Water source', 'Available? (Yes/No)', 'Primary / secondary', 'Metered?', 'Supplier / remarks'], [
          'Own borewell', 'Tanker water', 'Municipal supply', 'Industrial estate / bulk supply', 'Harvested rainwater', 'Treated wastewater reused', 'Other',
        ], 'For example, municipal supply may be the primary source, tanker water the backup during shortages, and treated STP water a supplementary source for flushing or landscaping.'),
        question('daily_quantity_by_source', 'Daily Quantity from Each Source', 'Provide average and peak daily quantity in KLD, monthly quantity in KL, unit cost and the period covered. Distinguish the organization’s direct consumption from whole-building figures.'),
        table('source_quantity_cost', 'Water source quantity and cost', ['Source', 'Daily quantity (KLD)', 'Monthly quantity (KL)', 'Cost (₹/KL)', 'Monthly cost (₹)', 'Basis / remarks'], [
          'Borewell', 'Tanker', 'Municipal / bulk supply', 'Rainwater', 'Recycled / reused water', 'Other',
        ], 'For example, 10 KL/day of tanker water over 30 days equals 300 KL/month. If the organization receives a shared building bill, explain how its portion is allocated.'),
        question('tanker_water_details', 'Tanker Water Details', 'Number of tankers, tanker capacity, supplier, frequency, cost per tanker and per KL, seasonal changes and whether invoices or delivery records are available.'),
        table('tanker_supply_records', 'Tanker supply records', ['Supplier', 'Capacity per tanker (KL)', 'Frequency', 'Cost per tanker (₹)', 'Monthly cost (₹)', 'Invoice available?'], [
          'Supplier 1', 'Supplier 2',
        ], 'For example, one 6 KL tanker delivered every working day at ₹1,500 per load should be calculated using the actual number of deliveries, not automatically 30 days.'),
        question('borewell_municipal_details', 'Borewell and Municipal / Bulk Supply Details', 'For borewells, record location, pump capacity, operating hours, meter readings and available groundwater monitoring. For municipal/bulk supply, record supplier, sanctioned quantity, tariff, fixed charges and interruptions.'),
        table('supply_infrastructure_details', 'Supply infrastructure details', ['Source / ID', 'Capacity / tariff', 'Operating schedule / quantity', 'Meter / record available?', 'Remarks'], [
          'Borewell 1', 'Borewell 2', 'Municipal / bulk connection', 'Building main meter', 'Tenant / sub-meter',
        ], 'For example, note the reading and meter ID of the building’s main meter, then record whether a sub-meter separately measures the company’s floor or tenancy.'),
        question('water_consumption', 'Average Daily, Monthly and Annual Water Consumption', 'Provide fresh water, recycled/reused water, rainwater and total use. State the reporting period and whether the values represent the entire building or only the organization.'),
        table('water_consumption_summary', 'Water consumption summary', ['Period', 'Fresh water', 'Recycled / reused water', 'Rainwater', 'Total water use', 'Unit / basis'], [
          'Daily', 'Monthly', 'Annual',
        ], 'For example, if daily fresh water use is 20 KL and reused water is 5 KL, total daily water use is 25 KL. Use actual operating days and account for seasonal changes.'),
        question('area_wise_water_consumption', 'Area-wise Water Consumption', 'Where data is available, split consumption between washrooms, pantry/canteen, cooling/HVAC, cleaning, landscaping, showers and other uses. Note where only whole-building figures are available.'),
        table('area_wise_consumption', 'Area-wise consumption', ['Area / use', 'Fresh water (KLD)', 'Reused water (KLD)', 'Total (KLD)', 'Metered / estimated'], [
          'Washrooms / flushing', 'Pantry / canteen', 'Cooling / HVAC', 'Cleaning', 'Landscaping', 'Other',
        ], 'For example, treated water may supply toilet flushing while fresh water supplies pantry drinking-water points. Enter only supported figures and identify estimates.'),
        question('water_storage_capacity', 'Water Storage Capacity', 'List underground sumps, overhead tanks, treated-water tanks and any emergency storage. For shared buildings, state whether the capacities are dedicated or common.'),
        table('water_storage_inventory', 'Water storage inventory', ['Tank / sump ID', 'Water type', 'Capacity (KL)', 'Typical operating level', 'Dedicated / shared', 'Remarks'], [
          'Raw-water sump', 'Overhead tank', 'Treated-water tank', 'Rainwater tank', 'Other',
        ], 'For example, a common underground sump may have a rated capacity of 100 KL. Identify whether this capacity serves the whole building or only the assessed organization.'),
        question('water_quality_filtration', 'Water Quality and Filtration', 'Describe drinking-water dispensers, RO units, central filtration, softeners or other treatment systems. Include feed quantity, treated output, reject water and how reject is reused or disposed of.'),
        table('drinking_water_filtration_systems', 'Drinking-water / filtration systems', ['System / location', 'Capacity', 'Daily input', 'Treated output', 'Reject / waste', 'Reject use / disposal'], [
          'Central RO', 'Pantry RO', 'Water dispensers / filters', 'Other',
        ], 'For example, if an RO unit receives 1,000 litres and produces 600 litres of permeate, approximately 400 litres is reject water. Confirm with records and state whether reject is reused.'),
      ],
    },
    {
      id: 'organization_sanitation_wastewater',
      title: 'SECTION 4 - SANITATION, STP & WASTEWATER',
      questions: [
        question('number_of_stps_etps', 'Number of STPs and ETPs', 'State whether the facility has its own treatment plant or relies on a common building/park STP, ETP or CETP. Provide design capacity, current inflow and the entity responsible for operation.'),
        table('wastewater_treatment_plants', 'Wastewater treatment plant details', ['Plant / ID', 'Dedicated or shared', 'Design capacity (KLD)', 'Current inflow (KLD)', 'Technology', 'Operator / remarks'], [
          'STP 1', 'ETP 1', 'Common / other',
        ], 'For example, a company in a leased office tower may not own an STP; record the common STP capacity and identify the landlord or facility manager as the source of the information.'),
        question('treatment_process', 'Type of STP / ETP and Treatment Process', 'Where information is available, describe the treatment technology and main stages, such as screening, equalisation, biological treatment, clarification, filtration and disinfection.'),
        question('stp_etp_operating_cost', 'Monthly Operating Cost of STP / ETP', 'Record electricity, chemicals, manpower, maintenance, testing, sludge handling and outsourced treatment costs. If these are included in maintenance charges, state that they are not separately available.'),
        table('wastewater_treatment_costs', 'Wastewater treatment operating costs', ['Cost component', 'Monthly cost (₹)', 'Paid by (company / landlord / facility manager)', 'Basis / remarks'], [
          'Electricity', 'Chemicals / consumables', 'Manpower / operator', 'Maintenance / testing', 'Sludge handling', 'Other / total',
        ], 'For example, the company may pay a common-area maintenance fee that includes STP operation. Do not estimate a separate STP cost unless the facility manager provides a defensible allocation.'),
        question('wastewater_generation_destination', 'Wastewater Generation and Destination', 'Describe domestic sewage and any other wastewater streams, where they are treated, and whether any discharge goes to a sewer, common treatment plant or authorised outlet.'),
        table('wastewater_disposal_summary', 'Wastewater and disposal summary', ['Wastewater stream', 'Estimated quantity (KLD)', 'Treatment / destination', 'Measured / estimated', 'Remarks'], [
          'Domestic sewage', 'Pantry / canteen wastewater', 'Cooling / HVAC blowdown', 'Other',
        ], 'For example, domestic sewage may be conveyed to a shared STP. Record the destination and quantity only if metered, reported by the facility manager or estimated using a stated method.'),
        question('treated_wastewater_reuse', 'Treated Wastewater Reuse', 'Identify whether treated water is used for toilet flushing, landscaping, cooling towers, cleaning or other purposes. Record quantities and whether reuse lines are separate and metered.'),
        table('treated_water_reuse', 'Treated-water reuse', ['Reuse application', 'Quantity reused (KLD)', 'Quality / treatment needed', 'Metered?', 'Remarks'], [
          'Toilet flushing', 'Landscaping', 'Cooling towers', 'Cleaning', 'Other',
        ], 'For example, the facility manager may confirm that treated water supplies all landscape irrigation. Record the stated quantity and whether it is metered or an estimate.'),
        question('toilets_washrooms_fixtures', 'Toilets, Washrooms and Fixtures', 'Record the number of washroom blocks, WCs, urinals, wash basins, showers and water-saving fixtures. Note whether treated water supplies flushing.'),
        table('sanitation_fixtures', 'Sanitation fixtures', ['Fixture / facility', 'Number', 'Low-flow / sensor fixture?', 'Treated-water flushing?', 'Remarks'], [
          'Washroom blocks', 'WCs', 'Urinals', 'Wash basins', 'Showers / other',
        ], 'For example, record 24 WCs and 16 urinals based on a floor-by-floor count or facilities register. Mark sensor taps only if confirmed on site.'),
      ],
    },
    {
      id: 'organization_cooling_utilities',
      title: 'SECTION 5 - COOLING, HVAC & BUILDING UTILITIES',
      questions: [
        question('cooling_hvac_systems', 'Cooling Towers and HVAC Systems', 'Identify whether the building has central or tenant-level cooling. If cooling towers are present, record number, capacity, make-up water, blowdown, cycles of concentration and whether the system is shared.'),
        table('cooling_hvac_details', 'Cooling / HVAC details', ['System / ID', 'Dedicated or shared', 'Capacity', 'Make-up water (KLD)', 'Blowdown (KLD)', 'Remarks'], [
          'Cooling tower 1', 'HVAC / other system',
        ], 'For example, in a shared office tower, cooling-tower water may be managed centrally. Obtain values from the building facility manager and mark the system as shared.'),
        question('boilers_humidifiers_utilities', 'Boilers, Humidifiers and Other Utilities', 'Identify boilers, humidifiers, steam systems, laboratories, data-centre cooling or other utility systems that may use water. If absent, mark not applicable.'),
        question('leakage_overflow_losses', 'Leakage, Overflow and Water Losses', 'Record leaking taps, flushing systems, tank overflows, cooling losses, pipe leaks and the process for reporting and repairing them.'),
        question('water_efficiency_measures', 'Water Efficiency Measures', 'Describe sensor taps, dual-flush toilets, low-flow fixtures, leak detection, automated irrigation, condensate recovery, cooling optimisation and other water-saving measures.'),
        table('water_efficiency_measures_table', 'Water efficiency measures', ['Measure / location', 'Existing or proposed', 'Estimated saving (if known)', 'Evidence / calculation', 'Priority / remarks'], [
          'Fixtures', 'Leak control', 'Cooling / HVAC', 'Irrigation / other',
        ], 'For example, record sensor taps as an existing measure and quantify savings only where a baseline and a reasonable calculation or meter data are available.'),
      ],
    },
    {
      id: 'organization_rainwater_groundwater',
      title: 'SECTION 6 - RAINWATER HARVESTING & GROUNDWATER',
      questions: [
        question('rainwater_harvesting_structures', 'Rainwater Harvesting Structures', 'State whether the site/building has rooftop harvesting, recharge pits, trenches, storage tanks or other structures. Identify whether these are maintained by the company, landlord or facility manager.'),
        table('rainwater_harvesting_inventory', 'Rainwater harvesting inventory', ['Structure type / ID', 'Number', 'Capacity / dimensions', 'Condition', 'Connected roof / area', 'Responsible party'], [
          'Recharge pits', 'Storage tanks', 'Recharge trenches / wells', 'Other',
        ], 'For example, the property may have six recharge pits connected to the office roof. Confirm the count, dimensions and condition from site inspection or building drawings.'),
        question('rooftop_runoff_rainwater_use', 'Rooftop Runoff and Rainwater Use', 'Provide effective roof area, collection route, estimated yield, storage volume, use and overflow arrangements. Do not equate recharge-pit capacity with the volume actually recharged.'),
        table('rainwater_use_recharge', 'Rainwater use and recharge', ['Use / destination', 'Quantity (KLD or KL/month)', 'Measurement / estimation basis', 'Seasonal variation', 'Remarks'], [
          'Stored for use', 'Used on site', 'Groundwater recharge', 'Overflow / other',
        ], 'For example, state that rainwater is routed to recharge pits but the recharged volume is not measured. Label any calculated yield as an estimate and describe the method.'),
        question('groundwater_monitoring', 'Groundwater Monitoring', 'If borewells or recharge structures are present, record water-level monitoring, seasonal trends and any available groundwater-quality test results.'),
        question('rainwater_system_maintenance', 'Rainwater System Maintenance', 'Describe roof cleaning, first-flush arrangements, filters, pit cleaning, desilting, inspection frequency and maintenance records.'),
      ],
    },
    {
      id: 'organization_costs_compliance',
      title: 'SECTION 7 - COSTS, COMPLIANCE & MANAGEMENT',
      questions: [
        question('monthly_water_wastewater_costs', 'Monthly Water and Wastewater Costs', 'Include direct water bills, tanker purchases, borewell pumping, filtration/RO, common maintenance charges attributable to water, wastewater treatment and disposal. Separate known costs from shared or unavailable costs.'),
        table('monthly_water_costs', 'Monthly water-related costs', ['Cost category', 'Monthly cost (₹)', 'Annual cost (₹)', 'Paid by', 'Records / remarks'], [
          'Water supply / tanker', 'Borewell / pumping', 'Filtration / treatment', 'Common maintenance charges', 'Wastewater treatment / disposal', 'Other / total',
        ], 'For example, if water is included in a monthly common-area maintenance bill, enter the total charge and mark the water component as not separately itemised rather than inventing a split.'),
        question('water_permits_responsibilities', 'Water-Related Permits and Responsibilities', 'Record applicable permissions and responsibilities for water sourcing, wastewater treatment, discharge and building-level compliance. Applicability depends on the property and operating arrangement.'),
        table('compliance_responsibility_register', 'Compliance and responsibility register', ['Item / approval', 'Applicable? / status', 'Responsible party', 'Validity / review date', 'Evidence / remarks'], [
          'Water supply / abstraction', 'STP / ETP operation', 'Wastewater discharge', 'Other',
        ], 'For example, a tenant may rely on the landlord’s building-level STP records. Record the responsible party and request documentary evidence rather than assuming compliance.'),
        question('audits_reporting', 'Audits and Reporting', 'Has the company or building completed a water audit, sustainability assessment, environmental audit or green-building certification? Record the date, baseline year, findings and actions.'),
        question('water_targets_responsibilities', 'Water Targets and Responsibilities', 'State any approved targets for reducing freshwater use, increasing treated-water reuse, improving fixture efficiency or supporting a Net Zero Water plan. Identify the accountable team.'),
        table('water_targets_progress', 'Water targets and progress', ['Target / initiative', 'Baseline', 'Target and deadline', 'Current progress', 'Owner / remarks'], [
          'Freshwater reduction', 'Treated-water reuse', 'Fixture efficiency', 'Net Zero Water / other',
        ], 'For example, a company may set a target to reduce metered freshwater use per occupant by 15% by 2028. Mark it as a target only if formally agreed and specify the baseline.'),
        question('records_metering', 'Records and Metering', 'Availability of main/sub-meters, water bills, tanker receipts, maintenance records, STP logs, water-quality reports, fixture inventories and monthly occupancy data.'),
        question('business_impact_water_risk', 'Business Impact of Water Risk', 'Describe supply interruptions, tanker dependency, increased costs, occupant complaints, hygiene risks, building-operation disruption or constraints on future occupancy.'),
      ],
    },
    {
      id: 'organization_cafeteria_cleaning_landscaping',
      title: 'SECTION 8 - CAFETERIA, CLEANING & LANDSCAPING',
      questions: [
        question('cafeteria_pantry_usage', 'Cafeteria / Pantry Usage', 'Record number of meals served per day, kitchen or pantry operating hours, cleaning practices and whether kitchen wastewater passes through grease traps before treatment.'),
        table('cafeteria_pantry_details', 'Cafeteria / pantry details', ['Facility type', 'Meals / users per day', 'Operating hours', 'Water source / estimate', 'Wastewater handling / remarks'], [
          'Canteen', 'Outsourced cafeteria', 'Pantry / other',
        ], 'For example, an outsourced canteen may serve 250 meals per day. Identify whether the vendor’s water use is separately metered or included in the building’s total.'),
        question('cleaning_housekeeping', 'Cleaning and Housekeeping', 'Describe floor cleaning, washroom cleaning, facade cleaning and any pressure-washing or other high-water-use tasks. Record frequency and any water reuse.'),
        question('landscaping_outdoor_water_use', 'Landscaping and Outdoor Water Use', 'Provide approximate landscaped area, irrigation method, schedule and water source. State whether drip irrigation, rainwater or treated wastewater is used.'),
        table('landscaping_outdoor_use', 'Landscaping and outdoor use', ['Area / activity', 'Area or frequency', 'Water use (KLD)', 'Source', 'Irrigation / control method'], [
          'Landscaping', 'Outdoor cleaning', 'Other',
        ], 'For example, note that landscaping is irrigated three times per week using treated STP water. Estimate daily-average use over the relevant period and state the basis.'),
      ],
    },
    {
      id: 'organization_ground_research_findings',
      title: 'GROUND RESEARCH FINDINGS (FIELD SURVEY)',
      questions: [
        question('site_visit_scope_findings', 'Site Visit Scope and Findings', 'Record date, areas inspected, people interviewed and documents reviewed. Inspect water meters, tanker receipts, storage tanks, washrooms, pantry, cooling systems, STP, reuse lines, rainwater structures and discharge points as applicable.'),
        table('onsite_verification_log', 'On-site verification log', ['Asset / parameter', 'Observed value / unit', 'Evidence (photo / meter / record / interview)', 'Status (verified / reported / estimated / unavailable)', 'Remarks'], [
          'Main / sub-meter', 'Tanker supply records', 'Storage tanks', 'Washrooms / fixtures', 'Cooling systems', 'STP / reuse lines', 'Rainwater structures', 'Other',
        ], 'For example, record the main meter ID and photographed reading with date/time. Mark a figure as verified only when the evidence has been checked; identify statements obtained only from staff as reported.'),
        question('shared_infrastructure_verification', 'Shared Infrastructure Verification', 'For leased or multi-tenant buildings, document which water systems are shared, who operates them, what data the company can access and how shared consumption is allocated.'),
        table('shared_systems_data_ownership', 'Shared systems and data ownership', ['System / asset', 'Owner / operator', 'Data available to company?', 'Allocation method', 'Follow-up needed'], [
          'Main water meter', 'STP / ETP', 'Cooling / central utilities', 'Common areas', 'Other',
        ], 'For example, the landlord may operate the main meter and STP while the tenant has no sub-meter. Record the current allocation method and recommend sub-metering if consumption cannot be reliably separated.'),
        question('photographic_evidence', 'Photographic Evidence', 'Attach labelled photographs of meters, tanks, washrooms, pantry, cooling systems, STP/reuse lines and rainwater structures, subject to property permission and privacy/security requirements.', 'file'),
        question('key_observations_improvements', 'Key Observations and Improvement Opportunities', 'Summarise source dependency, occupancy-normalised consumption, metering gaps, leakage, reuse, common-area data gaps, fixture efficiency, rainwater harvesting and practical opportunities.'),
      ],
    },
    {
      id: 'organization_conclusion',
      title: 'CONCLUSION',
      questions: [
        question('assessment_summary', 'Assessment Summary', 'Write a concise 100–150 word summary of the organization’s water profile: occupancy, total demand, source split, shared-building dependencies, wastewater treatment and reuse, costs, risks, data gaps and priority opportunities for a Net Zero Water roadmap.'),
      ],
    },
    {
      id: 'organization_disclaimer',
      title: 'DISCLAIMER',
      questions: [
        question('data_basis_limitations', 'Data Basis and Limitations', 'Mark approximate values with "~". State whether figures are based on official records, meter readings, invoices, facility-manager reports, staff interviews, calculations or visual observation. This questionnaire is a preliminary assessment and does not replace statutory audits, laboratory testing, engineering design or regulatory advice. Final recommendations depend on verified records, site conditions and applicable requirements.'),
      ],
    },
    {
      id: 'organization_annexure',
      title: 'ANNEXURE A - SITE PHOTOGRAPHS & SUPPORTING DOCUMENTS',
      questions: [
        question('site_photographs', 'Site Photographs', 'Attach photographs with captions, dates and locations, subject to permission. Avoid capturing people, access credentials, sensitive floor plans or confidential business information without authorisation.', 'file'),
        question('supporting_documents', 'Supporting Documents', 'Where available, attach water bills, tanker invoices, sub-meter readings, occupancy data, common-area maintenance breakdowns, STP reports, water-quality reports, rainwater system drawings, water audits and sustainability reports. Redact confidential information where necessary.', 'file'),
      ],
    },
  ],
}
