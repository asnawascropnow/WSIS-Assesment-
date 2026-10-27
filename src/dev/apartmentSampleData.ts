/**
 * Dev-only sample data for the Apartment / Villa water assessment.
 *
 * This mirrors what a real community would enter, so the questionnaire can be
 * filled and submitted end-to-end (including attachments) during testing —
 * exactly like a normal user going through the wizard.
 *
 * Attachment files live in the repo `testing/` folder and are served at
 * `/testing/*` by the Vite dev/preview server (see vite.config.ts).
 *
 * Every non-table, non-file question needs a value (either an answer or one of
 * the not-applicable tokens "-", "none", "nil"). Table cell values are listed in
 * row order; each inner array covers the table columns after the label column.
 */

/** Community used across every answer so the figures stay internally consistent. */
export const apartmentSampleTextAnswers: Record<string, string> = {
  // Section 1 - General information
  apartment_community_name: "Green Meadows Residency Owners' Association",
  property_address:
    'Green Meadows Residency, 4th Cross, Varthur Main Road, Whitefield, Bengaluru, Karnataka 560066',
  google_maps_url: 'https://maps.google.com/?q=12.9698,77.7500',
  primary_contact_person: "Ramesh Iyer, President, Green Meadows Owners' Association",
  official_email: 'office@greenmeadows.org.in',
  official_contact_numbers: '+91 98450 12345 / +91 80 4123 6789',
  property_type_management:
    'Gated residential apartment community with 4 towers (240 flats), managed by the owners\' association with a facility-management agency (Facilitate Services Pvt Ltd) for housekeeping and maintenance.',
  total_site_area_built_up_area:
    'Site area about 18,200 m2 (4.5 acres); total built-up area about 36,800 m2 across the four towers and the clubhouse.',
  number_of_residential_units:
    '240 flats in four towers (2 BHK and 3 BHK); 215 occupied, 25 vacant including 6 under renovation.',
  common_facilities_and_amenities:
    'Clubhouse with gym, main swimming pool and kids pool, community hall, two guest rooms, staff quarters, four security cabins, gardens, two car-wash bays and a decorative fountain.',
  operating_and_management_details:
    'The association oversees operations; Facilitate Services Pvt Ltd handles housekeeping, security and the STP. The estate manager maintains water records.',

  // Section 2 - Resident population & water-use activities
  number_of_residents:
    'About 600 residents in 215 occupied flats, based on the association register; includes live-in domestic help and on-site staff.',
  daily_visitors_and_temporary_occupants:
    'About 60-80 visitors, delivery personnel and domestic help on weekdays, rising to about 120 on weekends and 200+ during events.',
  occupancy_variation:
    'Occupancy dips in April-June when families travel and peaks in November-January and during festival periods; about 25-30 units stay vacant.',
  major_water_using_activities:
    'Domestic use in flats, common-area cleaning, landscaped-garden irrigation, swimming-pool make-up and backwash, clubhouse and gym use, vehicle washing and fire-tank top-ups.',
  domestic_water_demand_and_supply_timing:
    'Borewell pumping runs 6:00-11:00 and 16:00-20:00 daily. Overhead tanks are filled twice a day; supply is generally continuous with low pressure on upper floors during peak morning hours.',
  water_complaints_and_shortages:
    'Occasional low pressure on the 9th-12th floors, summer discolouration from borewells and tanker delays in April-May. Complaints are logged at the association office and closed within 24-48 hours.',

  // Section 3 - Water sources, consumption & cost
  community_water_sources:
    'Borewells (primary), municipal Cauvery supply (secondary), tanker water (summer supplement) and treated STP water reused for landscaping and flushing, with rainwater recharge.',
  daily_quantity_from_each_source:
    'Borewells about 120 KLD; municipal supply about 70 KLD; tankers about 30 KLD in summer. Treated water reused about 70 KLD.',
  municipal_water_supply_details:
    'BWSSB Cauvery connection with two bulk connections, supplied on alternate days (about 70 KL per supply day) at domestic tariff; quarterly bills and no arrears.',
  average_daily_monthly_annual_water_consumption:
    'Fresh water about 190 KLD (about 5,700 KL/month, 69,350 KL/year), recycled water about 70 KLD; total use about 260 KLD.',

  // Section 3 - STP / wastewater
  number_of_stps_and_etps:
    'One on-site STP of 300 KLD design capacity serving the whole community. No ETP - not applicable.',
  type_of_stp_and_treatment_process:
    'Moving-bed biofilm reactor (MBBR) with screening, equalisation, aeration, secondary clarification, chlorination and pressure-sand filtration before reuse.',
  stp_capacity_and_performance:
    'Design 300 KLD; average inflow about 220 KLD and treated output about 195 KLD. Occasional odour in the monsoon; one blower overhauled in 2025. No bypass observed.',
  monthly_stp_operating_cost:
    'Total about Rs 78,500 per month, covering electricity, chemicals, operator, maintenance and quarterly water-quality testing, included in maintenance charges.',
  wastewater_discharge_and_compliance:
    'Treated effluent is fully reused within the community for landscaping, flushing and cleaning; no discharge to drains or sewers. Water quality is tested quarterly by an NABL-accredited lab.',
  sludge_and_reject_management:
    'About 4 KL of dewatered sludge per month, stored in a covered holding area and collected twice a month by a KSPCB-authorised vendor. RO reject goes to the STP equalisation tank.',
  stp_maintenance_and_monitoring:
    'Daily operator logbook, monthly preventive maintenance, quarterly flow-meter calibration, quarterly water-quality testing and an STP vendor AMC.',
  sewage_odour_overflow_or_other_issues:
    'Minor odour near the STP during the monsoon and occasional scum accumulation; no overflow or backflow reported in the last 12 months.',

  // Section 5 - Rainwater harvesting & recharge
  rainwater_harvesting_structures:
    'Ten recharge pits and two recharge trenches fed by tower rooftop downpipes, two 10 KL storage tanks and a stormwater drain network, maintained by the FM agency.',
  rooftop_area_and_runoff_potential:
    'Total rooftop area about 3,200 m2; downpipes from about 2,600 m2 are connected to harvesting structures. Concrete roofs with box-drain collection.',
  rainwater_storage_use_and_recharge:
    'Most rooftop runoff goes to recharge pits; 20 KL of storage is used for gardening. Recharge volumes are not metered.',
  groundwater_and_borewell_monitoring:
    'Static water level checked quarterly in three borewells; levels drop 3-5 m in summer. TDS 480-720 mg/L. No continuous recorder installed.',
  maintenance_of_rainwater_systems:
    'Pre-monsoon cleaning of pits and filters, first-flush arrangements on downpipes, desilting twice a year and an annual pre-monsoon inspection.',

  // Section 6 - Landscaping, pools & amenities
  landscaping_and_irrigation:
    'About 4,500 m2 of landscaped area irrigated by sprinklers and drip using treated STP water, in early-morning and evening slots.',
  swimming_pool_and_water_features:
    'One main pool (about 320 KL) and a kids pool, topped up with treated water; weekly sand-filter backwash and refill of about 15 KL/week in summer.',
  vehicle_washing_and_common_area_cleaning:
    'Two car-wash bays using treated water; driveways and common areas washed twice a week with no wash-water recycling.',
  other_amenities:
    'Gym with showers, clubhouse and community hall, two guest rooms, staff quarters and a small clinic; these add modest water demand.',

  // Section 7 - Costs, management & water security
  monthly_water_procurement_and_maintenance_costs:
    'Total water-related cost about Rs 1.97 lakh per month, dominated by borewell pumping, STP operation and summer tanker purchases.',
  water_charges_and_billing_method:
    'Water is included in the monthly maintenance charge, billed per flat on a fixed basis by apartment size; there are no individual water meters.',
  water_related_approvals_and_responsibilities:
    'Borewells are covered by BWSSB NOC records; STP operation and water-quality testing are handled by the FM agency under association oversight.',
  water_audits_and_sustainability_targets:
    'A water audit was conducted in 2024; the association targets a 20% cut in tanker purchases and higher reuse by 2027.',
  water_supply_reliability_and_summer_risk:
    'Supply is reliable except in peak summer when tankers are needed; storage buffer is about 8-10 hours of demand and borewell yields fall in dry years.',
  resident_complaints_and_response:
    'Complaints mainly concern low pressure on upper floors and summer water quality; these are logged and closed within 48 hours by the FM team.',
  records_and_monitoring:
    'BWSSB bills, tanker invoices, pump logs, STP records, quarterly water-quality reports and maintenance accounts are available; individual flat metering records are not.',

  // Section 8 - Ground research findings
  site_visit_scope_and_findings:
    'Site visit on 12 May 2026 covering sumps, overhead tanks, borewells, the STP, reuse lines, gardens, the pool and rainwater structures, with interviews of the estate manager and two association members.',
  meter_and_flow_verification:
    'Main municipal and borewell meters were read and photographed; STP inlet and outlet flows were checked against the operator log. The reuse line has no meter.',
  photographic_evidence:
    'Labelled photographs of meters, sumps, overhead tanks, the STP, reuse lines, gardens, the pool and rainwater structures were collected; some equipment nameplates were not legible.',
  key_observations_and_improvement_opportunities:
    'Fresh-water demand is about 190 KLD against about 70 KLD of reuse. Priority actions are reuse-line metering, lower summer tanker dependence, better borewell recharge and minor leak repairs.',

  // Conclusion + disclaimer
  assessment_summary:
    'Green Meadows Residency (240 flats; about 600 residents) uses about 190 KLD of fresh water from borewells, municipal supply and summer tankers, plus about 70 KLD of treated STP reuse. A 300 KLD MBBR STP treats about 220 KLD and effluent is fully reused for landscaping and flushing. Rainwater is recharged through pits and trenches. Water cost is about Rs 1.97 lakh per month. Key risks are summer tanker dependence, declining borewell levels and unmetered reuse; priorities are reuse metering, leak reduction and demand management.',
  data_basis_and_limitations:
    'Figures are based on association records, BWSSB bills, tanker invoices, pump and STP logs, staff interviews and site observation. Values marked "~" are approximate. This preliminary assessment does not replace statutory audits or laboratory testing.',
}

/**
 * Table cell values in row order. Each inner array covers the table's value
 * columns (everything after the label column). Missing cells default to "-".
 */
export const apartmentSampleTableRows: Record<string, string[][]> = {
  property_and_building_details: [
    ['1 tower, 2 wings', 'G+12 (13 floors)', '60 flats (2 & 3 BHK)', '~8,900 m2', '~800 m2'],
    ['1 tower, 2 wings', 'G+12 (13 floors)', '60 flats (2 & 3 BHK)', '~8,900 m2', '~800 m2'],
    ['None in this community', '-', '-', '-', '-'],
    ['1 clubhouse block', 'G+1', 'Gym, hall, 2 guest rooms', '~1,200 m2', '~450 m2'],
    ['Security cabins, STP and pump rooms', 'G', '4 cabins + STP/pump rooms', '~250 m2', '~120 m2'],
  ],
  residential_unit_occupancy: [
    ['240', '215', '25', 'Association register, May 2026'],
    ['-', '-', '-', 'No villas in this community'],
    ['-', '-', '-', 'No row houses'],
    ['240', '215', '25', 'Includes 6 units under renovation'],
  ],
  common_facilities_inventory: [
    ['Yes', '1 clubhouse, 1 gym', 'Treated water for cleaning; showers', 'FM agency; ~3 KLD'],
    ['Yes', 'Main pool ~320 KL + kids pool ~40 KL', 'Treated water make-up; weekly backwash', 'FM agency; ~15 KL/week summer'],
    ['Yes', '~4,500 m2', 'Treated water; sprinkler and drip', 'FM agency; ~40 KLD'],
    ['Yes', '4 cabins, 12 staff', 'Fresh water; ~1.5 KLD', 'Association + FM agency'],
    ['Yes', '2 wash bays', 'Treated water', 'FM agency; ~3 KLD'],
    ['Yes', '1 decorative fountain', 'Treated water; recirculating', 'FM agency; ~1 KLD'],
  ],
  resident_population_summary: [
    ['430', 'Association register estimate', 'Residents in 215 occupied flats'],
    ['140', 'Estimate from household data', 'Includes ~20 toddlers'],
    ['15', 'Gate/help register', 'Live-in domestic help'],
    ['12', 'FM contract', 'Security and maintenance staff'],
    ['3', 'Estimate', 'Guest-room occupancy'],
    ['600', 'Sum of above', '~2.8 persons per occupied flat'],
  ],
  occupancy_pattern: [
    ['~560 residents + 70 visitors', 'Moderate to high', 'Registers and estimate'],
    ['~600 residents + 120 visitors', 'High', 'Weekend estimate'],
    ['~620 residents + 200 visitors', 'Peak (Oct-Jan festivals)', 'Association observation'],
    ['Up to 300 event attendees', 'Sharp spike on event days', 'Community-hall bookings'],
  ],
  community_water_use_points: [
    ['Domestic use in 215 flats', '~150', 'Fresh (borewell + municipal)', 'Not individually metered; estimated'],
    ['Corridor, lobby and bin-area washing', '~8', 'Treated water', 'Estimated'],
    ['Garden irrigation', '~40', 'Treated water', 'Estimated from pump hours'],
    ['Pool make-up and backwash', '~4', 'Treated water', 'Not metered; estimated'],
    ['Gym showers, hall, guest rooms', '~5', 'Fresh water', 'Estimated'],
    ['Car-wash bays', '~3', 'Treated water', 'Estimated'],
    ['Fire-tank top-up and fountain', '~2', 'Fresh water', 'Estimated'],
  ],
  water_sources_available: [
    ['Yes', 'Primary', 'Yes (main flow meter)', '3 borewells; BWSSB NOC on record'],
    ['Yes', 'Secondary', 'Yes (bulk meter)', 'BWSSB Cauvery supply, alternate days'],
    ['Yes (Apr-May)', 'Seasonal backup', 'No', '3 private tanker suppliers'],
    ['Yes', 'Supplementary', 'No', 'STP treated water (300 KLD plant)'],
    ['Yes', 'Recharge', 'No', '10 pits and 2 trenches'],
    ['No', '-', '-', 'No other bulk source'],
  ],
  water_source_quantity_and_cost: [
    ['120', '3,600', '18', '64,800', 'Pump energy; from pump logs'],
    ['70', '2,100', '25', '52,500', 'BWSSB tariff; quarterly bills'],
    ['30', '900 (Apr-May only)', '250', '75,000 (summer average)', 'Tanker invoices'],
    ['70', '2,100', '0', '0', 'Internal reuse; no purchase cost'],
    ['-', '-', '-', '-', 'Recharge; not metered'],
    ['-', '-', '-', '-', 'No other source'],
    ['~220 fresh', '~6,600 fresh', '-', '~1,92,300', 'Fresh water only; reuse excluded'],
  ],
  tanker_delivery_records: [
    ['6', '2-3 per day (Apr-May)', '1,500', '~90,000', 'Invoices'],
    ['10', '1 per day (peak weeks)', '2,400', '~48,000', 'Invoices'],
    ['6', 'On call', '1,600', '~12,000', 'Occasional; invoices'],
  ],
  borewell_inventory: [
    ['7.5 HP submersible', '6', '45', 'Flow meter; quarterly level check', 'Main supply borewell'],
    ['7.5 HP submersible', '5.5', '40', 'Flow meter; quarterly level check', 'Good yield'],
    ['5 HP submersible', '5', '35', 'Flow meter; quarterly level check', 'Yield drops in summer'],
    ['-', '-', '-', '-', 'No other borewells'],
  ],
  water_consumption_summary: [
    ['~190', '~70', '-', '~260', 'KLD; from logs and estimates'],
    ['~5,700', '~2,100', '-', '~7,800', 'KL/month'],
    ['~69,350', '~25,550', '-', '~94,900', 'KL/year; FY 2025-26'],
  ],
  metering_and_allocation: [
    ['Yes (main)', '~60 KLD', 'Included in maintenance', 'Tower A main meter'],
    ['Yes (main)', '~55 KLD', 'Included in maintenance', 'Tower B main meter'],
    ['-', '-', '-', 'No villas'],
    ['Yes (partial)', '~20 KLD', 'Common maintenance', 'Clubhouse and pool area'],
    ['No', 'Not known', 'Fixed charge by flat size', 'No individual water meters'],
    ['No', '-', '-', 'Towers C and D share the tower B meter'],
  ],
  water_storage_inventory: [
    ['Raw (borewell + municipal)', '200', '70-85%', 'Whole community (pumping)', 'Underground sump, 2 compartments'],
    ['Fresh', '50', '60-80%', 'Tower A (60 flats)', 'Filled twice daily'],
    ['Fresh', '50', '60-80%', 'Towers B, C and D', 'Filled twice daily'],
    ['Treated (STP)', '100', '50-70%', 'Landscaping, flushing, wash bays', 'Pumped from the STP'],
    ['Rainwater', '20', 'Seasonal', 'Gardening', '2 x 10 KL tanks'],
    ['Fresh (dedicated)', '50', 'Full', 'Fire hydrant system', 'No reuse; tested annually'],
    ['-', '-', '-', '-', 'No other storage'],
  ],
  drinking_water_filtration_systems: [
    ['2 KL/h', '~10 KL', '~6 KL', '~4 KL', 'Reject to STP equalisation tank'],
    ['100 L/h', '~0.6 KL', '~0.4 KL', '~0.2 KL', 'To garden drain'],
    ['-', '-', '-', '-', 'Common in flats; details not recorded'],
    ['-', '-', '-', '-', 'No other central system'],
  ],
  stp_etp_inventory: [
    ['300 KLD', '~220 KLD', 'MBBR + filtration + chlorination', 'Operational', 'FM agency; vendor AMC'],
    ['-', '-', '-', '-', 'Only one STP'],
    ['-', '-', '-', '-', 'Not applicable'],
    ['-', '-', '-', '-', 'No ETP; no industrial effluent'],
  ],
  stp_treatment_units: [
    ['Manual + mechanical screen', 'Good', 'Site visit', 'Debris removed daily'],
    ['~80 m3', 'Good', 'Nameboard', 'Level controlled by pump'],
    ['~180 m3 MBBR media', 'Good', 'Site visit', 'Diffused aeration, 2 blowers'],
    ['Tube settler / lamella', 'Fair', 'Site visit', 'Scum removed weekly'],
    ['Pressure sand + chlorination', 'Good', 'Site visit', 'Chlorine dosed daily'],
    ['~20 m3', 'Fair', 'Site visit', 'Dewatered sludge in covered area'],
    ['~100 KL', 'Good', 'Nameboard', 'Feeds reuse pump'],
    ['2 blowers, 3 pumps', 'Good (1 standby)', 'Site visit', 'One blower overhauled in 2025'],
  ],
  monthly_stp_operating_costs: [
    ['28,000', 'Yes (maintenance)', 'Electricity bill'],
    ['6,500', 'Yes', 'Vendor invoice'],
    ['18,000', 'Yes', 'FM payroll'],
    ['9,000', 'Yes', 'AMC contract'],
    ['5,000', 'Yes (quarterly)', 'NABL lab; ~15,000/quarter'],
    ['8,000', 'Yes', 'Vendor bills'],
    ['4,000', 'Yes', 'Consumables'],
    ['78,500', 'Yes (maintenance)', 'Sum of above'],
  ],
  treated_water_reuse: [
    ['40', 'Secondary treatment + filtration', 'No', 'Higher in summer'],
    ['20', 'Secondary treatment + chlorination', 'No', 'Year-round'],
    ['3', 'Secondary treatment', 'No', 'Year-round'],
    ['5', 'Secondary treatment', 'No', 'Year-round'],
    ['2', 'Secondary treatment', 'No', 'Fountain top-up'],
    ['70', '-', 'No', 'Estimated from pump hours; no reuse meter'],
  ],
  rainwater_harvesting_inventory: [
    ['10', '2 x 2 x 2.5 m each', '~2,000 m2 roof', 'Good', 'Desilted pre-monsoon'],
    ['2', '3 x 1.5 x 2 m each', '~600 m2 roof', 'Good', 'Trenches with gravel'],
    ['2', '10 KL each', 'Tower A and B roofs', 'Good', 'Used for gardening'],
    ['Yes, on all 4 towers', '110 mm downpipes', 'Full roof', 'Fair', 'First-flush valves fitted'],
    ['Drain network', '~600 m of drains', 'Site-wide', 'Fair', 'Silt traps at intervals'],
    ['-', '-', '-', '-', 'No other structures'],
  ],
  rainwater_disposition: [
    ['~20 KL/month (monsoon)', 'Calculation', 'Monsoon only', '2 storage tanks'],
    ['~5 KL/month', 'Estimate', 'Monsoon', 'Used opportunistically'],
    ['~15 KL/month', 'Estimate', 'Monsoon', 'Gardening'],
    ['Not measured', 'Estimate', 'Monsoon', 'Major share to pits and trenches'],
    ['Overflow to drains', 'Observation', 'Heavy-rain days', 'No exfiltration trench on one side'],
  ],
  landscaping_water_use: [
    ['~2,500 m2', 'Sprinkler + drip', 'Treated STP water', '~25 KLD (summer)', 'Zoned timers'],
    ['~1,200 m2', 'Drip', 'Treated STP water', '~8 KLD', 'Native species'],
    ['~600 m2', 'Hose + drip', 'Treated STP water', '~5 KLD', 'Lawn and shrubs'],
    ['-', '-', '-', '-', 'No rooftop garden'],
    ['~200 m2 (potted)', 'Hand watering', 'Treated STP water', '~2 KLD', 'Entrance pots'],
  ],
  swimming_pool_water_feature_details: [
    ['320', 'Treated STP water', 'Weekly backwash; daily skimming', '~15 KL/week in summer', 'Sand filter; covers at night'],
    ['40', 'Treated STP water', 'Weekly backwash', '~3 KL/week', 'Shaded; lower loss'],
    ['5', 'Treated STP water', 'Monthly cleaning', '~1 KL/week', 'Recirculating pump'],
    ['-', '-', '-', '-', 'No other water features'],
  ],
  monthly_water_related_costs: [
    ['~25,000 (annual average)', '~3,00,000', 'Yes (maintenance)', 'Higher in summer (~75,000/month)'],
    ['52,500', '6,30,000', 'Yes (maintenance)', 'BWSSB quarterly bills'],
    ['18,000', '2,16,000', 'Yes (maintenance)', 'Pump energy and AMC'],
    ['8,000', '96,000', 'Yes (maintenance)', 'RO maintenance'],
    ['78,500', '9,42,000', 'Yes (maintenance)', 'STP operation'],
    ['8,000', '96,000', 'Yes (maintenance)', 'Sludge vendor'],
    ['2,000', '24,000', 'Yes (maintenance)', 'Pit desilting'],
    ['5,000', '60,000', 'Yes (maintenance)', 'Miscellaneous plumbing'],
    ['~1,97,000', '~23,64,000', 'Yes (maintenance)', 'Approximate annual average'],
  ],
  approvals_and_responsibility_register: [
    ['Applicable - NOC on record', 'Association', 'Review Mar 2027', 'BWSSB NOC copy'],
    ['Yes - 2 bulk connections', 'Association / FM', 'Quarterly bills', 'BWSSB account records'],
    ['Yes - no external discharge', 'FM agency', 'Reviewed annually', 'Operator logbooks'],
    ['Yes - quarterly', 'FM agency', 'Last test Mar 2026', 'NABL lab reports'],
    ['Fire NOC', 'Association', 'Valid to 2027', 'Fire department certificate'],
  ],
  water_saving_targets_and_progress: [
    ['~900 KL/year tanker use', '-20% by Dec 2027', 'On track (~10% so far)', 'FM agency + association'],
    ['70 KLD reused', '90 KLD by 2027', 'Reuse metering proposed', 'FM agency'],
    ['10 pits, 2 trenches', 'Add 4 pits by 2027', 'Design stage', 'Association'],
    ['No reuse meter', 'Install reuse and block meters', 'Quotes received', 'Association'],
    ['Not assessed', 'Baseline study by 2027', 'Not started', 'Association committee'],
  ],
  on_site_verification_log: [
    ['Municipal bulk meter 12,480 m3', 'Photo + reading', 'Verified', 'Read on 12 May 2026'],
    ['3 borewell flow meters', 'Photo + pump log', 'Verified', 'Meters functional'],
    ['~30 KL/day in May', 'Invoices', 'Reported', 'From supplier records'],
    ['Sump 200 KL at 78%', 'Photo + gauge', 'Verified', '2 compartments'],
    ['Inlet ~220, outlet ~195 KLD', 'Operator log', 'Reported', 'Flows cross-checked'],
    ['No meter', 'Site observation', 'Unavailable', 'Reuse quantity estimated'],
    ['10 pits, 2 trenches, 2 tanks', 'Photo + site inspection', 'Verified', 'Good condition'],
    ['Gardens + 320 KL pool', 'Photo + site inspection', 'Verified', 'Pool clear; equipment working'],
    ['Fully reused; no discharge', 'Site observation', 'Verified', 'No tanker disposal observed'],
  ],
  storage_and_reuse_verified_on_site: [
    ['200', 'Raw; ~78% full', 'Pumped to overhead tanks', 'Gauge + photo'],
    ['50 (each)', 'Fresh; 60-80%', 'Flats in each tower', 'Site inspection'],
    ['100', 'Treated; ~60%', 'Landscaping, flushing, wash bays', 'Site inspection'],
    ['-', 'No separate recycled tank', '-', 'Treated tank serves reuse'],
    ['20', 'Rainwater; low (pre-monsoon)', 'Gardening', 'Site inspection'],
    ['50', 'Fresh; fire reserve full', 'Fire system', 'Annual test record'],
  ],
  stp_units_verified_on_site: [
    ['Not displayed', 'Running; clean', 'Site visit', 'Debris tray in place'],
    ['~80 m3', 'Good', 'Nameboard', 'Level normal'],
    ['~180 m3 media', 'Running', 'Site visit', 'Aeration uniform'],
    ['Tube settler', 'Fair', 'Site visit', 'Minor scum accumulation'],
    ['PSF + chlorination', 'Running', 'Site visit', 'Chlorine dosing active'],
    ['Sludge drying beds', 'Fair', 'Site visit', 'Sludge removed twice monthly'],
    ['~100 KL', 'Good', 'Nameplate', 'Feeds reuse pump'],
    ['2 blowers + 3 pumps', 'Running (1 standby)', 'Site visit', 'One blower overhauled in 2025'],
    ['-', '-', '-', 'No other equipment'],
  ],
}

/**
 * Attachments (from the repo `testing/` folder) added to the file questions.
 *
 * The 10 MB per-file upload limit rules out
 * "WELL-Labs_Bengaluru-Urban-Water-Balance-Report.pdf" (13.5 MB) and
 * "Abraham-Silberschatz-Operating-System-Concepts-10th-2018 (1).pdf" (31 MB).
 * Add more names here to attach more of the available test files.
 */
export const apartmentSampleAttachments: Record<string, string[]> = {
  site_photographs: [
    '25.08.2026 at 1.15 PM.png',
    'ChatGPT Image Sep 4, 2026, 05_57_24 PM.png',
  ],
  supporting_documents: ['safyos-safyos-cursor-library-pages-dev-continuous-1790943830734.pdf'],
}
