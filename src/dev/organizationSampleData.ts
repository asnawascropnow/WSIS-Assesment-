/**
 * Dev-only sample data for the Organization / Company water assessment.
 *
 * Attachment files live in the repo `testing/` folder and are served at
 * `/testing/*` by the Vite dev/preview server (see vite.config.ts).
 *
 * Table cell values are listed in row order; each inner array covers the table
 * columns after the label column. Missing values fall back to "-" in the loader,
 * so the data always satisfies the "every cell answered" rule.
 */

export const organizationSampleTextAnswers: Record<string, string> = {
  // Section 1 - General information
  organization_name: 'NovaFin Technologies Pvt Ltd',
  organization_type_activities:
    'IT/technology company operating a corporate office and software delivery centre providing consulting, application development and managed services.',
  registered_site_address:
    'Registered office: Unit 601, NovaFin House, Salarpuria Tech Park, Outer Ring Road, Bengaluru 560103. Assessed site: the same 7-floor tenancy within the shared office tower.',
  maps_url: 'https://maps.google.com/?q=12.9345,77.6902',
  primary_contact: 'Priya Nair, Facilities and Sustainability Manager',
  official_email: 'facilities@novafin.in',
  official_contact_numbers: '+91 98452 77123 / +91 80 6688 4400',
  ownership_occupancy_arrangement:
    'The company leases 7 floors in a shared office tower managed by a facility-management operator on behalf of the landlord. The landlord and FM operate the main meter, common STP and central cooling; the company pays a common-area maintenance (CAM) charge that includes water.',
  site_area_built_up_area:
    'Total building built-up area ~1.26 lakh sq ft across 6 blocks; the company occupies ~85,000 sq ft over 7 floors. The rooftop area is shared as ~17,700 sq ft.',
  operating_schedule:
    'Five operating days a week with office hours of 09:00-18:30, extended hours to 21:00 for support teams, limited weekend occupancy and a hybrid-work model in which about 20% of staff work remotely on an average day.',
  shared_facilities:
    'Common washrooms on some floors, a shared canteen/food court, parking, landscaped areas, central cooling towers and a common building STP are all managed by the building FM/landlord.',

  // Section 2 - Occupancy & daily activities
  employees_occupants:
    'Average daily on-site occupancy is ~790 people: 620 employees, 65 contract workers, 48 housekeeping/security, 35 visitors/vendors and 22 canteen/facility staff, peaking at ~915 on event days.',
  occupancy_pattern:
    'Occupancy is highest on weekday main shifts (~790), drops to ~90 in extended hours and ~70 on weekends, and rises to ~1,100 during town halls and audits. Hybrid work reduces mid-week occupancy by about 20%.',
  water_using_activities:
    'Routine water use is in washrooms (flushing, handwashing, urinals), pantry and canteen (drinking, cooking, dishwashing), cleaning, central cooling make-up, landscaping and a small gym.',
  canteen_pantry_food_services:
    'An outsourced canteen serves about 850 meals a day, supported by per-floor pantries for about 400 users. Kitchen wastewater passes through grease traps before entering the building STP.',
  other_facilities:
    'A small gym with showers on the podium, a first-aid clinic, a guest lounge and a small server room; no residential or laboratory facilities.',

  // Section 3 - Water supply & consumption
  water_sources:
    'The building is fully municipal-supply dependent (primary) with a bulk industrial-estate supply (secondary), tanker water as summer backup, harvested rainwater (supplementary) and treated STP water reused for flushing and landscaping (supplementary). There is no borewell.',
  daily_quantity_by_source:
    'Average total use of ~46 KLD: ~36 KLD municipal/bulk fresh water, ~9 KLD reused treated water and ~1 KLD rainwater, rising with tanker backup in April-May. The company share is allocated from building meter readings.',
  tanker_water_details:
    'During April-May, 1-2 tankers of 6 KL are delivered most days at about Rs 1,500 each, with occasional 12 KL loads at about Rs 2,800. Tankers are not used in the monsoon and invoices are available.',
  borewell_municipal_details:
    'There is no borewell. The building has a municipal bulk connection under a domestic-plus-bulk tariff and an industrial-estate bulk supply; supply is continuous apart from occasional municipal cuts. The company has its own floor sub-meters for allocation.',
  water_consumption:
    'Average daily use is ~46 KL (~36 KL fresh, ~9 KL reused, ~1 KL rainwater). Monthly use is ~1,380 KL and annual use ~16,560 KL, based on monthly building bills allocated to the company.',
  area_wise_water_consumption:
    'Washrooms use ~22 KLD (13 fresh, 9 reused), pantry/canteen ~3 KLD, cooling/HVAC ~6 KLD, cleaning ~2 KLD, landscaping ~2 KLD and other ~1 KLD; washroom and cooling figures are allocated from building data.',
  water_storage_capacity:
    'A shared 100 KL raw-water sump, a shared 40 KL overhead tank, a shared 25 KL treated-water tank, a shared 10 KL rainwater tank and a 60 KL dedicated fire reserve, all managed by the building FM.',
  water_quality_filtration:
    'Drinking water is supplied through a central RO unit in the pantry and per-floor pantry RO/dispenser units. The central RO receives ~0.8 KLD and produces ~0.5 KLD permeate with ~0.3 KLD reject routed to the STP sump.',

  // Section 4 - Sanitation, STP & wastewater
  number_of_stps_etps:
    'There is no company-owned plant; the building has a shared 150 KLD STP operated by the facility manager. There is no ETP as the operations are office-based with no industrial effluent.',
  treatment_process:
    'The shared building STP uses screening, equalisation, MBBR biological treatment, secondary clarification, pressure-sand filtration and chlorination, with dewatered sludge handled by the operator.',
  stp_etp_operating_cost:
    'STP costs are included in the CAM charge and are not separately itemised by the landlord; the company\'s allocated share is estimated at ~Rs 9,300 per month.',
  wastewater_generation_destination:
    'Domestic sewage of about ~22 KLD goes to the shared building STP and is fully reused for flushing and landscaping; pantry/canteen wastewater passes through grease traps to the STP and there is no external discharge.',
  treated_wastewater_reuse:
    'Treated STP water is reused for toilet flushing (~9 KLD), landscaping (~2 KLD) and cleaning (~0.5 KLD); reuse lines are shared, not separately metered for the company.',
  toilets_washrooms_fixtures:
    'Washrooms are distributed across the 7 occupied floors with about 96 WCs, 54 urinals, 88 wash basins and 6 gym showers; most fixtures are dual-flush or sensor-operated and flushing uses treated water.',

  // Section 5 - Cooling, HVAC & building utilities
  cooling_hvac_systems:
    'The building has a shared central cooling system with a 350 TR cooling tower managed centrally by the FM, plus condensate recovery on some floors. Make-up water is estimated at ~6 KLD with ~2 KLD blowdown.',
  boilers_humidifiers_utilities:
    'There are no boilers or humidifiers; the small server room uses split cooling. Utility water use is limited to the central cooling system and pantry equipment.',
  leakage_overflow_losses:
    'Occasional leaking taps and one continuously running urinal flush were noted. Leaks are reported through the FM helpdesk and repaired within about 48 hours; tank overflows are not observed.',
  water_efficiency_measures:
    'Existing measures include sensor taps on most floors, dual-flush WCs, sensor-flush urinals, treated-water flushing, drip irrigation with timers and monthly leak walk-throughs. A cooling-tower optimisation study is proposed.',

  // Section 6 - Rainwater harvesting & groundwater
  rainwater_harvesting_structures:
    'Six recharge pits connected to about 2,000 m2 of roof, one 10 KL storage tank on the podium roof, and two recharge trenches connected to about 800 m2 of roof, all maintained by the building FM.',
  rooftop_runoff_rainwater_use:
    'Effective roof area of about 17,700 sq ft (about 1,645 m2) with a connected drainage route to recharge pits and the podium tank. Annual harvestable potential is estimated at ~90 KL of monsoon runoff; recharged volumes are not measured.',
  groundwater_monitoring:
    'There are no borewells on site, so no groundwater-level monitoring is done. Recharge-pit performance is inferred from the absence of waterlogging rather than measurement.',
  rainwater_system_maintenance:
    'Roofs are cleaned before the monsoon, first-flush diverters and silt traps are checked twice a year, the podium tank is cleaned annually and pits are desilted before the monsoon.',

  // Section 7 - Costs, compliance & management
  monthly_water_wastewater_costs:
    'Direct municipal/bulk water cost is about Rs 17,280/month plus seasonal tanker spend (~Rs 90,000 in April-May), RO/softener AMC ~Rs 22,000, CAM water share ~Rs 28,000 and allocated STP operation ~Rs 9,300, plus ~Rs 4,600 miscellaneous.',
  water_permits_responsibilities:
    'Water sourcing, STP operation and discharge compliance are the landlord/building FM\'s responsibility under the building-level permissions. The company\'s responsibility is limited to its tenancy, sub-metering and paying CAM charges; fire NOC is valid to 2027.',
  audits_reporting:
    'The company completed an internal water and sustainability review in 2025 establishing a FY 2024-25 baseline of ~16,560 KL/year. The building is pursuing green-building re-certification. Findings included sub-metering gaps and cooling-water sharing.',
  water_targets_responsibilities:
    'Management has approved a target to reduce freshwater use per occupant by 15% by 2028 and to raise treated-water reuse to 25%, with the facilities and sustainability team accountable and quarterly reviews.',
  records_metering:
    'Floor sub-meters, monthly building water bills, tanker invoices, CAM statements, quarterly STP summary reports from the FM and occupancy records are available. Cooling and common-area water are not separately metered for the company.',
  business_impact_water_risk:
    'Municipal supply interruptions or rising tanker dependence increase operating costs and can disrupt washroom and canteen services. There has been no business downtime, but reliance on shared building infrastructure is a data and continuity risk.',

  // Section 8 - Cafeteria, cleaning & landscaping
  cafeteria_pantry_usage:
    'An outsourced canteen serves about 850 meals a day and per-floor pantries serve about 400 users. Kitchen wastewater passes through grease traps before entering the building STP; the vendor\'s water use is included in the building total.',
  cleaning_housekeeping:
    'Floors are mopped daily with treated water, washrooms are cleaned twice daily and the facade is cleaned twice a year with pressure washing. Cleaning uses about 2 KLD, with treated water where feasible.',
  landscaping_outdoor_water_use:
    'About 1,800 m2 of landscaped area is drip-irrigated three times a week with treated STP water, using about 2 KLD on average and more in summer; timers and moisture checks control the schedule.',

  // Ground research findings
  site_visit_scope_findings:
    'Site visit on 12 May 2026 covering floor sub-meters, the building main meter, storage tanks, washrooms, pantries, the shared cooling system, the building STP and reuse lines, and rainwater structures. Interviews were held with the facilities manager and the FM operator.',
  shared_infrastructure_verification:
    'The main water meter, STP and central cooling are owned and operated by the landlord/FM, and the company receives only summary data. Floor sub-meters give reliable washroom data, but cooling and common-area use are allocated rather than measured.',
  key_observations_improvements:
    'The company is fully municipal dependent with shared building infrastructure, limiting direct control over supply, STP and cooling. Priority opportunities are completing sub-metering, requesting cooling and STP data, extending treated-water flushing, reducing leaks and formalising rainwater recharge measurement.',

  // Conclusion + disclaimer
  assessment_summary:
    'NovaFin Technologies occupies 7 floors of a shared office tower with an average daily occupancy of about 790 people and total water use of about 46 KLD (36 KLD fresh). The building is municipal dependent, with tanker backup in summer. A shared 150 KLD STP treats and reuses about 9 KLD for flushing and landscaping. Monthly water-related costs are about Rs 76,000 plus seasonal tanker spend. Key risks are shared-infrastructure data gaps and summer supply dependence. Priority actions are sub-metering, cooling and STP data access, higher reuse and leak control.',
  data_basis_limitations:
    'Values marked "~" are approximate, based on building bills, FM statements, interviews and calculations. Because water systems are shared, some quantities are allocated rather than measured. This is a preliminary assessment and does not replace statutory audits, laboratory testing or engineering design.',

  // Annexure
  site_photographs:
    'Photographs were taken during the site visit on 12 May 2026, with captions for meters, tanks, washrooms, pantries, cooling systems, the STP/reuse lines and rainwater structures, avoiding people and confidential areas.',
  supporting_documents:
    'Attached documents include water bills, tanker invoices, sub-meter readings, CAM statements, STP summary reports and occupancy records, with confidential information redacted.',
}

export const organizationSampleTableRows: Record<string, string[][]> = {
  building_rooftop_details: [
    ['1', '10', '~82,000 sq ft', '~9,500 sq ft', 'Main HQ tower, floors 3-9 leased'],
    ['1', '4', '~18,000 sq ft', '~5,200 sq ft', 'Annexe block, fully occupied'],
    ['1', '3 (podium)', '~26,000 sq ft', '~3,000 sq ft', 'Parking and amenities'],
    ['-', '-', '-', '-', 'No other buildings'],
  ],
  occupancy_summary: [
    ['620', '700', 'HR + access control', 'Permanent employees'],
    ['65', '80', 'Vendor records', 'Contract and housekeeping staff'],
    ['48', '52', 'Facility register', 'Housekeeping and security'],
    ['35', '60', 'Visitor log', 'Visitors and vendors'],
    ['22', '24', 'Canteen vendor', 'Canteen and facility staff'],
    ['790', '916', 'Derived from above', 'Typical and peak daily occupancy'],
  ],
  daily_occupancy_pattern: [
    ['Weekday / main shift', '09:00-18:30', '~790', 'Highest washroom and pantry use'],
    ['Evening / extended hours', '18:30-21:00', '~90', 'Support and BPO teams'],
    ['Weekend', '10:00-16:00', '~70', 'Maintenance and critical teams'],
    ['Peak event / other', 'As scheduled', '~1,100', 'Town halls and audits'],
  ],
  major_water_use_points: [
    ['Washrooms', 'Flushing, handwashing and urinals', '~13', 'Metered (floor sub-meters)', 'Treated water for flushing in the tower'],
    ['Pantry / canteen', 'Drinking, cooking and dishwashing', '~3', 'Estimated', 'Canteen vendor; shared building'],
    ['Cooling / HVAC', 'Cooling-tower make-up', '~6', 'Estimated by building FM', 'Shared with the tower'],
    ['Cleaning', 'Floor and facade cleaning', '~2', 'Estimated', 'Weekly deep clean'],
    ['Landscaping', 'Garden irrigation', '~2', 'Estimated', 'Treated STP water; drip'],
    ['Other', 'Gym showers and miscellaneous', '~1', 'Estimated', 'Small gym on the podium'],
  ],
  water_sources_available: [
    ['No', '-', '-', 'No borewell; fully municipal dependent'],
    ['Yes', 'Backup (summer)', 'No', 'Two tanker suppliers; invoices available'],
    ['Yes', 'Primary', 'Yes', 'Municipal water board bulk connection'],
    ['Yes', 'Secondary', 'Yes', 'Industrial-estate / park bulk supply'],
    ['Yes', 'Supplementary', 'No', 'Rooftop harvesting to recharge pits'],
    ['Yes', 'Supplementary', 'Yes', 'Treated STP water for flushing and landscaping'],
    ['No', '-', '-', 'No other source'],
  ],
  source_quantity_cost: [
    ['-', '-', '-', '-', 'No borewell on site'],
    ['12', '360 (summer only)', '250', '90,000', 'Tanker invoices; Apr-May average'],
    ['18', '540', '32', '17,280', 'Municipal bulk bill (allocated share)'],
    ['5', '150', '28', '4,200', 'IT-park bulk supply, allocated'],
    ['~1', '~30', '0', '0', 'Harvested rainwater; no cost'],
    ['9', '270', '0', '0', 'Treated STP reuse; internal'],
  ],
  tanker_supply_records: [
    ['Aqua Pure Tankers', '6', '1-2 per day (Apr-May)', '1,500', '~67,500', 'Invoices available'],
    ['City Water Carriers', '12', 'On call', '2,800', '~28,000', 'Invoices available'],
  ],
  supply_infrastructure_details: [
    ['Borewell 1', '-', '-', 'No', 'Not applicable - no borewell'],
    ['Borewell 2', '-', '-', 'No', 'Not applicable - no borewell'],
    ['Municipal / bulk connection', 'Bulk tariff; 2 connections', 'Continuous, with occasional cuts', 'Yes', 'Building main meter; monthly bill'],
    ['Building main meter', 'Domestic + bulk mix', 'Read monthly', 'Yes', 'Meter ID BW-4482; FM operated'],
    ['Tenant / sub-meter', 'Floor sub-meters (floors 3-9)', 'Daily readings logged', 'Yes', 'Allocated to NovaFin'],
  ],
  water_consumption_summary: [
    ['~36', '~9', '~1', '~46', 'KL/day; FY 2025-26 average'],
    ['~1,080', '~270', '~30', '~1,380', 'KL/month; 30 days'],
    ['~12,960', '~3,240', '~360', '~16,560', 'KL/year; based on monthly bills'],
  ],
  area_wise_consumption: [
    ['~13', '9', '~22', 'Metered (floor sub-meters)'],
    ['~3', '0', '~3', 'Estimated'],
    ['~6', '0', '~6', 'Estimated by building FM'],
    ['~1', '1', '~2', 'Estimated'],
    ['0', '2', '~2', 'Estimated'],
    ['~1', '0', '~1', 'Estimated'],
  ],
  water_storage_inventory: [
    ['Raw-water sump', 'Fresh', '100', '60-80%', 'Shared', 'Common building sump'],
    ['Overhead tank', 'Fresh', '40', '50-70%', 'Shared', 'Serves the tower'],
    ['Treated-water tank', 'Treated (STP)', '25', '40-60%', 'Shared', 'Feeds flushing and landscaping'],
    ['Rainwater tank', 'Rainwater', '10', 'Seasonal', 'Shared', 'Used for gardening'],
    ['Other', 'Fire water', '60', 'Full', 'Shared', 'Dedicated fire reserve'],
  ],
  drinking_water_filtration_systems: [
    ['Central RO (pantry)', '100 L/h', '~0.8 KL', '~0.5 KL', '~0.3 KL', 'Reject to STP sump'],
    ['Pantry RO units', '25 L/h each', '~0.3 KL', '~0.18 KL', '~0.12 KL', 'To building drain'],
    ['Water dispensers / filters', '50 L/h', '~0.2 KL', '~0.2 KL', '-', 'No reject; UV + carbon'],
    ['Other', '-', '-', '-', '-', 'No other central system'],
  ],
  wastewater_treatment_plants: [
    ['STP 1', 'Shared (building)', '150', '~95', 'MBBR + chlorination', 'Building FM / landlord operates'],
    ['ETP 1', '-', '-', '-', 'Not applicable', 'No industrial effluent; office use only'],
    ['Common / other', 'Shared (park)', '-', '-', 'Park-level STP', 'Park facility team operates'],
  ],
  wastewater_treatment_costs: [
    ['~4,000 (allocated)', 'Landlord / facility manager', 'Included in common-area maintenance'],
    ['~1,200 (allocated)', 'Landlord / facility manager', 'Included in common-area maintenance'],
    ['~2,500 (allocated)', 'Landlord / facility manager', 'Included in common-area maintenance'],
    ['~1,000 (allocated)', 'Landlord / facility manager', 'Part of the AMC'],
    ['~600 (allocated)', 'Landlord / facility manager', 'Annual sludge handling'],
    ['~9,300 (allocated share)', 'Landlord / facility manager', 'Not separately invoiced'],
  ],
  wastewater_disposal_summary: [
    ['~22', 'Shared building STP; fully reused', 'Estimated', 'Flushing and landscaping'],
    ['~3', 'Grease trap, then STP', 'Estimated', 'Canteen and pantry'],
    ['~2', 'Building STP', 'Estimated', 'Cooling blowdown'],
    ['~1', 'Building STP', 'Estimated', 'Gym and miscellaneous'],
  ],
  treated_water_reuse: [
    ['Toilet flushing', '~9', 'Secondary treated + chlorinated', 'No', 'Tower flushing line; shared'],
    ['Landscaping', '~2', 'Secondary treated', 'No', 'Drip irrigation; estimated'],
    ['Cooling towers', '-', '-', '-', 'Shared system uses fresh water'],
    ['Cleaning', '~0.5', 'Secondary treated', 'No', 'Estimated'],
    ['Other', '-', '-', '-', 'No other reuse'],
  ],
  sanitation_fixtures: [
    ['18', 'Yes', 'Yes', 'Across 7 occupied floors'],
    ['96', 'Yes', 'Yes', 'Majority dual-flush'],
    ['54', 'Yes', 'Yes', 'Sensor-flush urinals'],
    ['88', 'Yes', 'No', 'Sensor taps on most floors'],
    ['6', 'Yes', 'No', 'Gym and wellness area'],
  ],
  cooling_hvac_details: [
    ['Cooling tower 1 (building)', 'Shared', '350 TR', '~6', '~2', 'Landlord/FM operated; shared'],
    ['HVAC / other system', 'Shared', 'Chiller + AHUs', '~1', '-', 'Condensate recovered on some floors'],
  ],
  water_efficiency_measures_table: [
    ['Fixtures', 'Existing', '~15% of washroom use', 'Sensor taps and dual-flush retrofits', 'High priority'],
    ['Leak control', 'Existing', '~2 KLD', 'Monthly leak walk-throughs', 'Medium priority'],
    ['Cooling / HVAC', 'Proposed', '~1.5 KLD', 'Higher cycles-of-concentration study', 'Medium priority'],
    ['Irrigation / other', 'Existing', '~0.5 KLD', 'Drip plus treated-water irrigation', 'Low priority'],
  ],
  rainwater_harvesting_inventory: [
    ['Recharge pits', '6', '2 x 2 x 2 m each', 'Good', '~2,000 m2 roof', 'Building FM'],
    ['Storage tanks', '1', '10 KL', 'Good', 'Podium roof', 'Company and FM'],
    ['Recharge trenches / wells', '2', '3 x 1.5 x 2 m each', 'Fair', '~800 m2 roof', 'Building FM'],
    ['Other', '-', '-', '-', '-', 'No other structures'],
  ],
  rainwater_use_recharge: [
    ['~15 KL/month (monsoon)', 'Estimate', 'Monsoon only', 'Podium tank for gardening'],
    ['~5 KL/month', 'Estimate', 'Monsoon', 'Cleaning and miscellaneous use'],
    ['Not measured', 'Estimate', 'Monsoon', 'Major share to recharge pits'],
    ['Overflow to stormwater drain', 'Observation', 'Heavy-rain days', 'Silt traps cleaned twice a year'],
  ],
  monthly_water_costs: [
    ['~17,280 + tanker (summer)', '~2,07,360 + seasonal', 'Company + landlord', 'Municipal bill; tanker invoices'],
    ['-', '-', '-', 'No borewell on site'],
    ['~22,000 (allocated)', '~2,64,000', 'Landlord / FM', 'RO and softener maintenance/AMC'],
    ['~28,000 (allocated)', '~3,36,000', 'Company', 'CAM charge including water'],
    ['~9,300 (allocated)', '~1,11,600', 'Landlord / FM', 'STP operation and disposal'],
    ['~4,600', '~55,200', 'Company', 'Miscellaneous and rainwater maintenance'],
  ],
  compliance_responsibility_register: [
    ['Water supply / abstraction', 'Applicable - municipal connection', 'Landlord / building FM', 'Reviewed annually', 'Municipal bill and connection records'],
    ['STP / ETP operation', 'Applicable - shared building STP', 'Landlord / building FM', 'Reviewed annually', 'FM reports shared periodically'],
    ['Wastewater discharge', 'Not applicable - no external discharge', 'Landlord / building FM', 'As per STP records', 'Treated water reused on site'],
    ['Other', 'Fire NOC', 'Landlord / building FM', 'Valid to 2027', 'Fire compliance certificate'],
  ],
  water_targets_progress: [
    ['~12,960 KL/year fresh water', '15% reduction per occupant by 2028', 'On track (~6% so far)', 'Facilities and sustainability team'],
    ['~3,240 KL/year reuse', '25% reuse by 2028', 'Flushing conversion complete', 'Facilities team'],
    ['Sensor taps and dual-flush', '100% washrooms by 2027', '~70% complete', 'Facilities team'],
    ['Not assessed', 'Water audit baseline by 2027', 'Vendor shortlisted', 'Sustainability lead'],
  ],
  cafeteria_pantry_details: [
    ['Outsourced canteen', '~850 meals/day', '08:00-20:00', '~3 KLD (estimated)', 'Grease trap; wastewater to STP'],
    ['Pantry (per floor)', '~400 users', '09:00-18:30', '~1 KLD (estimated)', 'To building drain and STP'],
    ['Vending / other', '~200 users', '24x7', '~0.5 KLD (estimated)', 'Minimal wastewater'],
  ],
  landscaping_outdoor_use: [
    ['~1,800 m2 landscaped area', 'Daily in summer; 3x/week otherwise', '~2 KLD (average)', 'Treated STP water', 'Drip irrigation with timers'],
    ['Podium and parking cleaning', 'Weekly', '~0.5 KLD', 'Treated STP water', 'Manual with low-flow hoses'],
    ['Other', 'Occasional', '~0.2 KLD', 'Fresh water', 'Facade cleaning twice a year'],
  ],
  onsite_verification_log: [
    ['Main / sub-meter', 'Floor sub-meter 3F: 412 m3', 'Photo + reading', 'Verified', 'Read on 12 May 2026'],
    ['Tanker supply records', '~1 tanker/day in May', 'Invoices', 'Reported', 'From FM records'],
    ['Storage tanks', 'Sump ~72% full', 'Photo + gauge', 'Verified', '100 KL rated; shared'],
    ['Washrooms / fixtures', 'Sensors on 5 of 7 floors', 'Site inspection', 'Verified', 'Dual-flush in most WCs'],
    ['Cooling systems', 'Shared tower make-up ~6 KLD', 'FM statement', 'Reported', 'Not independently metered'],
    ['STP / reuse lines', 'STP inlet ~95 KLD', 'FM log', 'Reported', 'Shared building STP'],
    ['Rainwater structures', '6 pits, 1 tank', 'Photo + inspection', 'Verified', 'Good condition'],
    ['Other', 'Grease trap present', 'Site inspection', 'Verified', 'Cleaned monthly'],
  ],
  shared_systems_data_ownership: [
    ['Main water meter', 'Landlord / building FM', 'Yes - monthly bill', 'Pro-rata by occupied floor area', 'Request sub-meter data quarterly'],
    ['STP / ETP', 'Landlord / building FM', 'Partial - summary reports', 'Pro-rata by occupancy', 'Request monthly STP report'],
    ['Cooling / central utilities', 'Landlord / building FM', 'Limited', 'Included in CAM charges', 'Request cooling make-up split'],
    ['Common areas', 'Landlord / building FM', 'Yes - CAM bill', 'Pro-rata by area', 'Review CAM statement'],
    ['Other', '-', '-', '-', 'No other shared system'],
  ],
}

/** Attachments (from the repo `testing/` folder) added to the file questions. */
export const organizationSampleAttachments: Record<string, string[]> = {
  photographic_evidence: [
    'ChatGPT Image Sep 4, 2026, 05_57_24 PM.png',
    'screencapture-open-design-ai-pricing-2026-10-01-11_55_58.png',
    'Gemini_Generated_Image_ucu1dyucu1dyucu1.png',
  ],
  site_photographs: [
    '25.08.2026 at 1.15 PM.png',
    'safyos-open-design-ai-1790835903381.png',
  ],
  supporting_documents: [
    'safyos-safyos-cursor-library-pages-dev-continuous-1790943830734.pdf',
  ],
}
