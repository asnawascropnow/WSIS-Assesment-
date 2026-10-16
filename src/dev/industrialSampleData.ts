/**
 * Dev-only sample data for the Industrial water assessment.
 *
 * Attachment files live in the repo `testing/` folder and are served at
 * `/testing/*` by the Vite dev/preview server (see vite.config.ts).
 *
 * Table cell values are listed in row order; each inner array covers the table
 * columns after the label column. Missing values fall back to "-" in the loader,
 * so the data always satisfies the "every cell answered" rule.
 */

export const industrialSampleTextAnswers: Record<string, string> = {
  // Section 1 - General information
  organisation_name: 'Bharat Precision Components Pvt Ltd',
  registered_and_site_address:
    'Registered office: Plot 14, Peenya Industrial Area, Phase II, Bengaluru 560058. Assessed site: the same manufacturing unit, covering the production sheds, utilities block, ETP/STP, warehouse and administrative offices.',
  maps_url: 'https://maps.google.com/?q=13.0287,77.5130',
  primary_contact: 'Suresh Menon, Plant Head',
  official_email: 'ehs@bharatprecision.in',
  official_contact_numbers: '+91 99001 45678 / +91 80 4712 9900',
  sector_and_products:
    'Automotive and industrial precision components (machined and surface-treated parts). Water-intensive steps are metal washing and degreasing, surface treatment/phosphating, component cooling and floor/equipment cleaning.',
  ownership_and_facility_type:
    'Private limited company. Standalone factory within an industrial estate with production sheds, a utilities block, warehouse and administrative offices.',
  site_area: 'Plot area ~3.2 acres; total built-up area ~93,000 sq ft across four blocks.',
  building_rooftop_area:
    'Four buildings in total (two production sheds, one warehouse, one admin/utilities block) with a combined rooftop area of ~93,000 sq ft available for rainwater harvesting.',
  operating_schedule_capacity:
    'Two production shifts plus a general shift, 26 operating days per month and about 310 days per year. Installed capacity ~2.4 million components per year at ~72% utilisation. A 10-day monsoon shutdown is taken in June.',

  // Section 2 - Operations, occupancy & water-intensive activities
  employees_contractors:
    'Average daily on-site population ~335: 180 permanent employees, 65 contract workers, 40 administrative staff, 28 housekeeping/security/canteen staff and about 22 drivers, vendors and visitors.',
  shift_working_hours:
    'Two eight-hour production shifts (06:00-14:00 and 14:00-22:00) with ~150 and ~120 people respectively, plus a 09:00-18:00 general shift for office, EHS and utilities covering ~65 people.',
  production_process_water_use:
    'Water is used for washing and degreasing machined parts, surface treatment/phosphating baths and rinses, closed-loop component cooling make-up, and floor and equipment cleaning. Potable/soft water is used for rinsing, DM water for phosphating and treated water for cleaning.',
  major_water_equipment:
    'Two cooling towers (250 TR and 120 TR), two boilers (2 TPH and 1 TPH), a 15 KLD RO plant, an 8 KLD DM plant, a 20 KLD softener/filtration train, parts-washing and phosphating lines, and an RO polishing unit on the ETP.',
  canteen_toilets_domestic_use:
    'One canteen serving about 700 meals a day across two shifts, 8 toilet blocks, washrooms and 12 showers near the utility block; there are no residential quarters on site.',

  // Section 3 - Water supply & consumption
  facility_water_sources:
    'Two own borewells (primary), industrial estate bulk supply (secondary), tanker water (summer backup), harvested rainwater (supplementary) and treated STP/ETP water reused on site (supplementary).',
  daily_quantity_from_sources:
    'Average ~135 KLD from borewells and estate supply combined, rising to ~170 KLD in peak summer when tankers add ~22 KLD. Metered borewell and estate meters are read daily; tanker volumes come from supplier invoices.',
  tanker_water_details:
    'In April and May, 3-4 tankers per day of 6 KL are delivered at about Rs 1,450 each, plus occasional 10 KL loads at about Rs 2,300. Tankers are not used in the monsoon. Invoices and delivery challans are available.',
  borewell_details:
    'Two borewells: Borewell 1 (north yard) with a 10 HP submersible pump drawing ~55 KLD over 8 hours; Borewell 2 (utility block) with a 7.5 HP pump drawing ~40 KLD over 6 hours. Both are metered, water levels are logged quarterly and quality is tested annually.',
  municipal_industrial_supply_details:
    'Industrial estate bulk supply of ~40 KLD under a sanctioned quota of 45 KLD, tariff about Rs 38/KL plus fixed charges. Supply is continuous except for occasional estate maintenance shutdowns, with industrial restrictions imposed in peak summer.',
  water_consumption:
    'Average daily use is ~178 KL (135 KL fresh, 35 KL recycled, ~8 KL rainwater). Monthly use is ~5,220 KL and annual use ~62,300 KL based on 26 operating days per month and 310 days per year.',
  process_wise_water_consumption:
    'Production (washing, phosphating and cooling) uses ~60 KLD, cooling systems ~30 KLD, boilers/utilities ~22 KLD, washing and cleaning ~15 KLD, domestic/sanitation ~17 KLD, landscaping ~4 KLD and other uses ~2 KLD.',
  water_balance:
    'Of ~178 KLD input, ~3 KLD is incorporated into product, ~24 KLD is lost to evaporation/drift and process losses, ~118 KLD becomes wastewater (80 process effluent + 38 sewage), ~35 KLD of treated water is reused, and ~33 KLD of treated effluent goes to the estate drain within consent limits; the balance closes within about 1%.',
  water_quality_requirements:
    'Rinsing needs low-hardness soft water, phosphating needs DM water below 10 micro-S/cm conductivity, cooling make-up needs hardness control, and treated effluent must meet State Pollution Control Board consent limits before reuse or discharge.',
  ro_dm_softener_details:
    'RO plant 15 KLD design, ~12 KLD feed and ~9 KLD output (~75% recovery) with ~3 KLD reject to ETP equalisation. DM plant 8 KLD design, ~6 KLD feed and ~5 KLD output with ~1 KLD neutralised regeneration waste. Softener/filtration 20 KLD with ~0.5 KLD backwash returned to the raw-water sump.',
  water_reliability_risk:
    'Borewell yields decline by 15-20% in summer and estate supply is occasionally curtailed, forcing tanker purchases that add Rs 50,000-90,000/month. Supply disruptions have not stopped production but have increased costs and groundwater stress.',
  water_storage_capacity:
    'A 150 KL raw-water sump, an 80 KL treated-water tank, a 40 KL process/utility tank and a 100 KL dedicated fire-water tank, typically held at 55-85% operating levels.',

  // Section 4 - Wastewater, ETP/STP & reuse
  wastewater_streams:
    'Process effluent from washing/surface treatment, domestic sewage, cooling-tower blowdown, boiler blowdown, RO reject and DM regeneration waste, and laboratory/floor wash water.',
  etp_details:
    'One ETP of 100 KLD design capacity receiving ~82 KLD average inflow, using physico-chemical treatment with an MBBR biological stage, commissioned in 2018 and operated under a vendor O&M contract.',
  stp_details:
    'One STP of 40 KLD design capacity receiving ~38 KLD average inflow, using MBBR with chlorination, serving the toilet blocks and canteen.',
  treatment_process_equipment:
    'The ETP uses screening, equalisation, pH correction and physico-chemical treatment followed by MBBR biological treatment, clarification, pressure-sand and activated-carbon filtration, chlorination and an RO polishing stage for reuse. The STP uses screening, MBBR aeration, clarification, filtration and chlorination.',
  etp_stp_capacity_utilisation:
    'The ETP runs at ~82% of design capacity and the STP at ~95%, with peaks reaching design limits in the monsoon. There have been no bypass events; both plants were operational throughout the year.',
  monthly_treatment_cost:
    'Monthly ETP cost ~Rs 1.72 lakh and STP cost ~Rs 56,000, covering electricity, chemicals, manpower, sludge handling, maintenance and laboratory testing under an O&M contract.',
  treated_water_quality_compliance:
    'Treated water is tested monthly by an NABL laboratory and meets State Pollution Control Board consent limits for pH, BOD, COD, TSS and oil and grease; results are within the reuse guideline for TDS.',
  treated_wastewater_reuse:
    'About 35 KLD of treated water is reused: 18 KLD in cooling towers, 6 KLD as RO-polished process water, 5 KLD for toilet flushing, and 6 KLD for floor cleaning and landscaping.',
  discharge_disposal:
    'Surplus treated effluent of about 33 KLD is discharged to the industrial estate common drain under a valid consent; there is no discharge to a municipal sewer and all quantities are monitored by flow meter.',
  sludge_reject_management:
    'ETP/STP sludge of about 4 tonnes per month is dewatered on drying beds and sent to an authorised TSDF through a licensed transporter; RO reject and DM regeneration waste are neutralised and recycled into the ETP, with records maintained.',
  zero_liquid_discharge:
    'ZLD is not currently required for this sector and is not installed. An evaporator is planned as part of the 2027 upgrade to reduce the residual discharge further.',
  etp_stp_maintenance_monitoring:
    'The reuse line has a calibrated flow meter, the ETP has manual flow measurement and daily operator logs, and the O&M contract covers preventive maintenance, calibration and operator training. There is no online continuous monitoring system.',

  // Section 5 - Cooling, boilers & other utilities
  cooling_towers:
    'Two induced-draft cooling towers: a 250 TR process tower with ~25 KLD make-up and ~8 KLD blowdown at 4 cycles of concentration, and a 120 TR utilities tower with ~11 KLD make-up and ~3 KLD blowdown at 4.5 cycles. Both use chemical dosing and conductivity-based blowdown control.',
  boilers_steam_systems:
    'One 2 TPH operational boiler and one 1 TPH standby boiler with a total feedwater demand of ~20 KLD and blowdown of ~2.3 KLD. Condensate recovery is about 70% of feedwater.',
  chillers_hvac_humidification:
    'Water-cooled chillers and HVAC cooling towers in the admin and office areas, plus humidification in the surface-treatment area. Make-up water is estimated at ~2 KLD with opportunities to use treated water.',
  cleaning_washing_rinsing:
    'Cleaning-in-place and batch washing are used on the parts lines; floor cleaning uses treated water. Rinse water from the final rinse stage is partly recovered to the first rinse, reducing freshwater use.',
  leakage_loss_control:
    'Minor leaks in old piping near the utility block and occasional tank overflow were observed during the site visit. A monthly leak walk-through is followed with a maintenance register.',
  water_efficiency_measures:
    'Existing measures include counter-current rinsing, condensate recovery, conductivity-based cooling-tower blowdown control, treated-water reuse for cleaning and flushing, and low-flow fixtures in newer blocks.',

  // Section 6 - Rainwater harvesting & groundwater
  rainwater_harvesting_structures:
    'Eight recharge pits connected to about 1,800 m2 of roof, two 50 KL storage tanks for cleaning use, three recharge trenches connected to about 700 m2 of roof, and 12 silt traps along site drains.',
  rooftop_runoff_potential:
    'Combined rooftop area of ~93,000 sq ft (about 8,640 m2) with concrete and metal roofs and a connected drainage network leading to recharge structures; annual harvestable potential is estimated at ~500 KL of the monsoon runoff.',
  rainwater_use_recharge:
    'Rainwater is stored in two 50 KL tanks for cleaning and utility use (~100 KL/month in the monsoon) and the major share is routed to recharge pits and trenches; recharged volumes are not metered.',
  groundwater_recharge_monitoring:
    'Borewell water levels are logged quarterly and show a 2-3 m summer decline that recovers each monsoon. Recharge pits are desilted before the monsoon and no groundwater-quality tests are currently done.',
  rainwater_quality_first_flush:
    'First-flush diverters are fitted on the roof outlets, silt traps and gravel filters precede the recharge pits, and storage tanks are covered. Rainwater used for cleaning is not tested.',

  // Section 7 - Costs, compliance & management
  monthly_water_procurement_cost:
    'Monthly water spend is about Rs 2.24 lakh: tanker procurement ~Rs 86,000 (annual average), estate supply ~Rs 45,600, borewell pumping and maintenance ~Rs 38,000, treatment chemicals ~Rs 22,000, wastewater treatment ~Rs 19,000, sludge/reject handling ~Rs 7,000 and other ~Rs 6,000.',
  water_permits_compliance:
    'The unit holds a valid Consent to Establish and Consent to Operate from the State Pollution Control Board (valid to March 2028), a fire NOC, and has applied for a groundwater abstraction NOC. Discharge is within consent limits and EHS maintains all records.',
  audits_reporting:
    'A water audit was conducted in 2024 establishing a FY 2023-24 baseline of ~52,000 KL/year fresh water; findings included unmetered department lines and cooling-tower optimisation. An energy audit was done in 2023 and most water-audit actions are in progress.',
  water_targets_responsibilities:
    'Management has approved a target to reduce freshwater use by 20% by December 2028 from the FY 2023-24 baseline and to raise reuse to 35%. The utilities manager and EHS team are accountable, with quarterly progress reviews.',
  records_instrumentation:
    'Source meters on both borewells and the estate connection, a reuse-line flow meter, monthly water bills, tanker invoices, quarterly NABL lab reports, daily ETP/STP logs and production records are available. Department-level sub-metering is incomplete.',
  business_impact_water_risk:
    'Summer water stress and borewell decline have increased costs by Rs 50,000-90,000/month and carry a compliance risk if abstraction permission is delayed. No production downtime has occurred, but emergency storage is limited to about one day of demand.',

  // Section 8 - Canteen, sanitation & site amenities
  canteen_food_preparation:
    'A canteen serves about 700 meals a day across two shifts (07:00-21:00). Kitchen cleaning uses fresh water and the kitchen outlet passes through a grease trap before the STP.',
  toilets_washrooms_showers:
    'Eight toilet blocks with 48 WCs, 26 urinals, 52 wash basins and 12 showers. Treated water supplies flushing in the newer blocks; handwashing uses fresh water.',
  landscaping_outdoor_use:
    'About 1.5 acres of landscaping irrigated by sprinklers and hand hoses using treated water, roughly 4 KLD averaged over the year and higher in summer.',
  other_water_uses:
    'Vehicle washing for the plant fleet, laboratory use, periodic fire-system testing and small construction/utility use, together around 2 KLD.',

  // Ground research findings
  site_visit_scope_findings:
    'Site visit on 12 May 2026 covering borewells and meters, tanker unloading, all storage tanks, the process lines, cooling towers, boilers, RO/DM plants, ETP/STP, the reuse line and rainwater structures. Interviews were held with the plant head, utilities manager and ETP operator.',
  water_sources_verified:
    'Both borewells with functional flow meters were verified (B1 reading 12,480 m3), the estate supply meter was verified, and tanker deliveries were confirmed from supplier invoices and the gate register. Rainwater structures were inspected and found in good condition.',
  storage_reuse_verified:
    'The 150 KL raw-water sump was ~75% full, the 80 KL treated-water tank ~60% full and the 40 KL recycled-water tank ~55% full. The reuse pump and meter feeding cooling towers and flushing were verified on site.',
  etp_stp_units_verified:
    'All ETP units (screening, equalisation, reaction, MBBR, clarifier, filtration, chlorination and RO polishing) and STP units (MBBR, clarifier, filtration, chlorination) were observed in operational condition with capacities matching the records.',
  water_meter_flow_verification:
    'Borewell, estate and reuse meters are functional and were read on site. Process-line sub-meters are partly installed and department-level data is estimated. Tanker quantities are based on supplier records rather than metering.',
  key_observations_improvements:
    'Borewell and estate dependency, rising summer tanker costs, cooling-tower optimisation at higher cycles of concentration, department-level sub-metering, RO reject reduction, expanded rainwater storage and higher treated-water reuse for cooling are the priority opportunities.',

  // Conclusion + disclaimer
  industrial_assessment_summary:
    'Bharat Precision Components uses about 178 KLD of water (135 KLD fresh) drawn mainly from two borewells and an industrial estate supply, with tanker backup in summer. A 100 KLD ETP and a 40 KLD STP treat effluent and sewage, and about 35 KLD of treated water is reused in cooling, flushing and cleaning. Monthly water and treatment costs are about Rs 2.24 lakh. Key risks are summer scarcity, rising tanker costs and incomplete sub-metering. Priority actions are cooling-tower optimisation, department sub-metering, higher reuse and expanded rainwater harvesting.',
  industrial_data_basis_limitations:
    'Values marked "~" are approximate, based on meter readings, invoices, operator logs, staff interviews and calculations. This is a preliminary assessment and does not replace statutory audits, laboratory testing, engineering design or regulatory advice. Final recommendations depend on verified records, site conditions and applicable requirements.',

  // Annexure
  industrial_site_photographs:
    'Photographs were taken during the site visit on 12 May 2026, with captions for meters, borewells, storage tanks, the ETP/STP, cooling towers and the reuse line, subject to facility permission.',
  industrial_supporting_documents:
    'Attached documents include water bills, tanker invoices, NABL lab reports, ETP/STP logs, the water-balance sheet and consent copies, with commercially sensitive figures redacted.',
}

export const industrialSampleTableRows: Record<string, string[][]> = {
  building_rooftop_details: [
    ['2', '~48,000', 'sq ft', 'Two production sheds'],
    ['1', '~22,000', 'sq ft', 'Finished-goods warehouse'],
    ['1', '~14,000', 'sq ft', 'Admin and engineering offices'],
    ['3', '~9,000', 'sq ft', 'Utilities, ETP, canteen and security'],
  ],
  workforce_summary: [
    ['180', 'HR records', 'Permanent employees'],
    ['65', 'Contractor attendance', 'Production and housekeeping support'],
    ['40', 'HR records', 'Administrative and office staff'],
    ['28', 'Contractor records', 'Housekeeping, security and canteen'],
    ['22', 'Gate register', 'Drivers, vendors and visitors (daily average)'],
    ['335', 'Derived from above', 'Typical operating day'],
  ],
  shift_details: [
    ['Shift 1 (06:00-14:00)', '8 hours', '~150', 'Main production shift'],
    ['Shift 2 (14:00-22:00)', '8 hours', '~120', 'Second production shift'],
    ['Shift 3 / general (09:00-18:00)', '8 hours', '~65', 'Office, EHS and utilities'],
  ],
  process_water_use_points: [
    ['Metal washing and degreasing', 'Rinsing after degreasing', 'Potable / soft water', '18', 'Flow meter on the rinse line'],
    ['Surface treatment / phosphating', 'Process baths and rinses', 'DM water', '22', 'Metered; tank make-up logged'],
    ['Component cooling', 'Closed-loop cooling make-up', 'Soft water', '9', 'Estimated from make-up records'],
    ['Floor and equipment cleaning', 'Hosing and cleaning-in-place', 'Treated water', '6', 'Estimated'],
  ],
  water_sources_available: [
    ['Yes', 'Primary', 'Yes', 'Two borewells with flow meters'],
    ['Yes', 'Backup (summer)', 'No', 'Tanker suppliers; invoices available'],
    ['Yes', 'Secondary', 'Yes', 'Industrial estate bulk supply'],
    ['No', '-', '-', 'No surface water source'],
    ['Yes', 'Supplementary', 'No', 'Rooftop harvesting routed to recharge pits'],
    ['Yes', 'Supplementary', 'Yes', 'STP/ETP treated water reused on site'],
    ['No', '-', '-', 'No other source'],
  ],
  source_quantity_cost: [
    ['95', '2,850', '16', '45,600', 'Borewell pumping energy; from pump logs'],
    ['22', '660 (summer only)', '240', '52,800', 'Tanker invoices; Apr-May average'],
    ['40', '1,200', '38', '45,600', 'Industrial estate tariff; monthly bill'],
    ['~8', '~240', '0', '0', 'Harvested rainwater; no purchase cost'],
    ['35', '1,050', '0', '0', 'Internal reuse; no purchase cost'],
    ['-', '-', '-', '-', 'No other source'],
  ],
  tanker_supply_records: [
    ['Sri Balaji Water Suppliers', '6', '3-4 per day (Apr-May)', '1,450', '~63,000', 'Invoices available'],
    ['Nandi Tankers', '10', '1 per day (peak weeks)', '2,300', '~23,000', 'Invoices available'],
  ],
  borewell_inventory: [
    ['Borewell 1 (north yard)', '10 HP submersible', '8', '55', 'Quarterly water-level log; annual quality test', 'Primary source'],
    ['Borewell 2 (utility block)', '7.5 HP submersible', '6', '40', 'Quarterly water-level log', 'Yield falls in summer'],
  ],
  water_consumption_summary: [
    ['135', '35', '~8', '178', 'KL/day; FY 2025-26 average'],
    ['4,050', '1,050', '~120', '5,220', 'KL/month; 30 operating days'],
    ['48,600', '12,600', '~1,100', '62,300', 'KL/year; based on monthly logs'],
  ],
  department_consumption: [
    ['45', '15', '60', 'Metered at process main'],
    ['22', '8', '30', 'Estimated from make-up logs'],
    ['18', '4', '22', 'Partially metered'],
    ['10', '5', '15', 'Estimated'],
    ['14', '3', '17', 'Estimated from occupancy'],
    ['4', '0', '4', 'Estimated'],
    ['2', '0', '2', 'Estimated'],
  ],
  preliminary_water_balance: [
    ['178', 'Measured + estimated', 'Sources: borewell, estate supply, tanker'],
    ['3', 'Estimated', 'Water retained in product and packaging'],
    ['24', 'Estimated', 'Cooling evaporation/drift and process losses'],
    ['118', 'Measured at ETP/STP inlet', 'Process effluent 80 + domestic sewage 38'],
    ['35', 'Metered on reuse line', 'Sent to cooling towers, flushing and cleaning'],
    ['33', 'Measured', 'Treated effluent to estate drain within consent limits'],
    ['0', 'Reconciled', 'Balance closes within ~1%'],
  ],
  water_treatment_plant_details: [
    ['RO plant', '15 KLD', '~12 KLD', '~9 KLD', '~3 KLD reject', 'Reject to ETP equalisation'],
    ['DM plant', '8 KLD', '~6 KLD', '~5 KLD', '~1 KLD regeneration waste', 'Neutralised, then to ETP'],
    ['Softener / filtration', '20 KLD', '~16 KLD', '~15.5 KLD', '~0.5 KLD backwash', 'Backwash to raw-water sump'],
  ],
  water_storage_inventory: [
    ['Raw-water sump', 'Fresh', '150', '70-85%', 'Underground, north yard; good condition'],
    ['Treated-water tank', 'Treated (STP/ETP)', '80', '55-75%', 'Near ETP; feeds the reuse pump'],
    ['Process / utility tank', 'Soft / DM water', '40', '50-70%', 'Utility block roof'],
    ['Fire-water tank', 'Fresh (dedicated)', '100', 'Full', 'Near admin block; tested annually'],
  ],
  wastewater_generation: [
    ['Process effluent', 'Washing, surface treatment, cooling blowdown', '80', 'To ETP', 'Metered at ETP inlet'],
    ['Domestic sewage', 'Toilets, canteen and washrooms', '38', 'To STP', 'Estimated from occupancy'],
    ['Cooling-tower blowdown', 'Cooling system', '8', 'To ETP', 'Estimated from cycles of concentration'],
    ['Boiler blowdown', 'Boiler house', '4', 'To ETP', 'Estimated from feedwater logs'],
    ['RO reject / regeneration waste', 'RO and DM plants', '4', 'To ETP equalisation', 'Metered'],
    ['Other', 'Laboratory and floor wash', '2', 'To ETP', 'Estimated'],
  ],
  etp_inventory: [
    ['ETP 1', '100', '~82', 'Physico-chemical + biological (MBBR)', 'Operational', 'Vendor O&M contract'],
    ['ETP 2', '-', '-', 'Not applicable', 'Not applicable', 'Single ETP only'],
  ],
  stp_inventory: [
    ['STP 1', '40', '~38', 'MBBR + chlorination', 'Operational', 'Serves toilets and canteen'],
    ['STP 2', '-', '-', 'Not applicable', 'Not applicable', 'Single STP only'],
  ],
  treatment_units: [
    ['Screening / collection', 'ETP', 'Bar screen + collection sump 15 m3', 'Good', 'Debris removed daily'],
    ['Equalisation tank', 'ETP', '~60 m3', 'Good', 'Level controlled'],
    ['Treatment / reaction tanks', 'ETP', '2 x 25 m3 with dosing', 'Good', 'pH and coagulant dosing'],
    ['Biological / aeration tanks', 'ETP + STP', 'ETP MBBR 45 m3; STP MBBR 30 m3', 'Good', 'Diffused aeration'],
    ['Clarifier / settling', 'ETP + STP', 'Tube settler + secondary clarifier', 'Fair', 'Scum removed weekly'],
    ['Filtration / disinfection', 'ETP + STP', 'PSF + activated carbon + chlorination', 'Good', 'Chlorine dosing daily'],
    ['Sludge handling', 'ETP + STP', 'Sludge drying beds ~40 m2', 'Fair', 'Dewatered sludge to TSDF'],
    ['Other / advanced treatment', 'ETP', 'RO polishing 20 KLD for reuse', 'Good', 'Reject to evaporator (planned)'],
  ],
  etp_stp_operating_costs: [
    ['42,000', '18,000', 'Electricity bills'],
    ['58,000', '6,500', 'Chemical purchase records'],
    ['45,000', '20,000', 'Operator and helper payroll'],
    ['12,000', '5,000', 'Sludge handling and TSDF charges'],
    ['9,000', '4,000', 'Maintenance and laboratory testing'],
    ['6,000', '2,500', 'Consumables and other'],
    ['1,72,000', '56,000', 'Sum of above'],
  ],
  treated_water_quality_records: [
    ['7.2', 'pH', '6.5-8.5', '18 Apr 2026 / NABL lab'],
    ['22', 'mg/L', '<=30 (consent)', '18 Apr 2026 / NABL lab'],
    ['148', 'mg/L', '<=250 (consent)', '18 Apr 2026 / NABL lab'],
    ['34', 'mg/L', '<=100 (consent)', '18 Apr 2026 / NABL lab'],
    ['1,180', 'mg/L', '<=2,100 (reuse guideline)', '18 Apr 2026 / NABL lab'],
    ['6', 'mg/L', '<=10 (consent)', '18 Apr 2026 / NABL lab'],
  ],
  treated_water_reuse: [
    ['Cooling towers', '18', 'Tertiary treated water', 'Lower in monsoon', 'Metered on the reuse line'],
    ['Process use', '6', 'RO-polished water', 'Steady', 'Metered'],
    ['Toilet flushing', '5', 'Secondary treated + chlorinated', 'Steady', 'Estimated from occupancy'],
    ['Floor washing / cleaning', '3', 'Secondary treated', 'Steady', 'Estimated'],
    ['Landscaping', '3', 'Secondary treated', 'Higher in summer', 'Estimated'],
    ['Other', '-', '-', '-', 'No other reuse'],
  ],
  cooling_system_inventory: [
    ['Cooling tower 1 (process)', '250 TR', '25', '8', '4', 'Make-up metered'],
    ['Cooling tower 2 (utilities)', '120 TR', '11', '3', '4.5', 'Estimated from make-up logs'],
  ],
  boiler_condensate_details: [
    ['Boiler 1', '2 TPH', '14', '1.5', '11', 'Condensate recovered; metered'],
    ['Boiler 2', '1 TPH', '6', '0.8', '4.5', 'Standby boiler'],
  ],
  rainwater_harvesting_inventory: [
    ['Recharge pits', '8', '2 x 2 x 2.5 m each', 'Good', '~1,800 m2 roof', 'Desilted pre-monsoon'],
    ['Storage tanks', '2', '50 KL each', 'Good', 'Production sheds', 'Used for cleaning'],
    ['Recharge trenches / wells', '3', '3 x 1.5 x 2 m each', 'Fair', '~700 m2 roof', 'Gravel media'],
    ['Other', 'Silt traps - 12', 'Along site drains', 'Fair', 'Site-wide', 'Cleaned twice a year'],
  ],
  rainwater_disposition: [
    ['~100 KL/month (monsoon)', 'Calculation from roof area and rainfall', 'Two 50 KL tanks'],
    ['~30 KL/month', 'Estimate', 'Cleaning and utility make-up'],
    ['Not measured', 'Estimate', 'Major share to recharge pits'],
    ['Overflow to stormwater drain', 'Observation', 'Heavy-rain days'],
  ],
  monthly_water_costs: [
    ['~86,000 (annual average)', '~10,32,000', 'Yes - invoices', 'Higher in summer'],
    ['45,600', '5,47,200', 'Yes - bills', 'Industrial estate supply'],
    ['38,000', '4,56,000', 'Yes - pump logs', 'Borewell pumping energy and AMC'],
    ['~22,000', '~2,64,000', 'Yes - records', 'Water treatment chemicals and RO'],
    ['~19,000', '~2,28,000', 'Yes - records', 'ETP/STP power, chemicals and sludge'],
    ['~7,000', '~84,000', 'Yes - records', 'Sludge and reject handling'],
    ['~6,000', '~72,000', 'Yes - records', 'Miscellaneous and rainwater maintenance'],
    ['~2,23,600', '~26,83,200', 'Yes - records', 'Approximate annual average'],
  ],
  permit_compliance_register: [
    ['Consent to Establish / Operate', 'State Pollution Control Board', 'Valid - CTE and CTO on record', '31 Mar 2028', 'EHS manager'],
    ['Water abstraction permission', 'Groundwater authority', 'Applied - NOC pending', 'Under review', 'Plant head'],
    ['Wastewater discharge / CETP arrangement', 'State Pollution Control Board', 'Meets consent limits', '31 Mar 2028', 'ETP operator'],
    ['Other applicable approval', 'Fire department', 'Valid fire NOC', '31 Dec 2027', 'Safety officer'],
  ],
  water_targets_progress: [
    ['~48,600 KL/year fresh water', '20% reduction by Dec 2028', 'On track (~8% so far)', 'Utilities and EHS team'],
    ['12,600 KL/year reuse', '35% reuse by 2028', 'RO polishing commissioned', 'ETP vendor and EHS'],
    ['8 pits, 3 trenches, 100 KL storage', 'Add 4 pits by 2027', 'Design stage', 'Estate team'],
    ['Not assessed', 'Baseline study by 2027', 'Not started', 'EHS committee'],
  ],
  sanitation_fixtures: [
    ['8', 'Yes', 'Across production and admin blocks'],
    ['48', 'Yes', 'Treated-water flushing in newer blocks'],
    ['26', 'Yes', 'Toilet blocks and utility areas'],
    ['52', 'No', 'Fresh water for handwashing'],
    ['12', 'No', 'Showers near the utility block'],
  ],
  onsite_verification_log: [
    ['Borewell and estate supply meters', 'B1 - 12,480 m3', 'Photo + reading', 'Verified', 'Read on 12 May 2026'],
    ['Tanker delivery point / records', '~3 tankers/day in May', 'Invoices + gate register', 'Reported', 'From supplier records'],
    ['Storage tanks / sumps', 'Raw sump ~75% full', 'Photo + gauge', 'Verified', '150 KL rated'],
    ['Process / utility water meters', 'Process main 45 KLD', 'Meter reading', 'Verified', 'Meter functional'],
    ['ETP / STP operation', 'ETP inlet ~82 KLD', 'Operator log', 'Reported', 'No online flow meter'],
    ['Treated-water reuse route', 'Reuse line 35 KLD', 'Meter on reuse pump', 'Verified', 'Meter calibrated'],
    ['Discharge / disposal point', 'Discharge within consent limits', 'Site observation', 'Verified', 'Treated water largely reused'],
    ['Rainwater structures', '8 pits, 2 tanks', 'Photo + inspection', 'Verified', 'Good condition'],
  ],
  storage_reuse_confirmed: [
    ['Raw-water sump', '150', 'Fresh; ~75% full', 'Production and utilities', 'Nameplate + gauge reading'],
    ['Treated-water tank', '80', 'Treated; ~60% full', 'Reuse to cooling and flushing', 'Nameplate + site inspection'],
    ['Recycled-water tank', '40', 'RO-polished; ~55% full', 'Process feed', 'Site inspection'],
    ['Other', '-', '-', '-', 'No other tank observed'],
  ],
}

/** Attachments (from the repo `testing/` folder) added to the file questions. */
export const industrialSampleAttachments: Record<string, string[]> = {
  industrial_photographic_evidence: [
    '25.08.2026 at 1.15 PM.png',
    'Gemini_Generated_Image_ucu1dyucu1dyucu1.png',
    'safyos-open-design-ai-1790835903381.png',
  ],
  industrial_site_photographs: [
    'ChatGPT Image Sep 4, 2026, 05_57_24 PM.png',
    'screencapture-open-design-ai-pricing-2026-10-01-11_55_58.png',
  ],
  industrial_supporting_documents: [
    'safyos-safyos-cursor-library-pages-dev-continuous-1790943830734.pdf',
  ],
}
