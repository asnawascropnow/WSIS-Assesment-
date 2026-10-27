import type { Questionnaire } from '../../types/questionnaire'

const question = (id: string, label: string, example = '', inputType: 'text' | 'textarea' | 'number' | 'email' | 'url' | 'tel' | 'table' | 'file' = 'textarea') => ({
  id,
  question: label,
  example,
  inputType,
})

const table = (
  id: string,
  label: string,
  columns: string[],
  rows: string[],
  example: string,
) => ({
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

export const industrialQuestionnaire: Questionnaire = {
  title: 'Industrial Water Assessment',
  subtitle: 'Industrial facility water use, wastewater and sustainability assessment',
  sections: [
    {
      id: 'industry_general_information',
      title: 'SECTION 1 - GENERAL INFORMATION',
      questions: [
        question('organisation_name', 'Name of Industrial Organisation', 'Full legal name of the company, including parent company or operating entity, if applicable.', 'text'),
        question('registered_and_site_address', 'Registered Office and Industrial Site Address', 'Provide the registered office address and the exact address of the facility being assessed. Identify the site covered if the company operates multiple locations.'),
        question('maps_url', 'Google Maps Location URL', 'Provide a direct Google Maps pin or search link to the industrial facility.', 'url'),
        question('primary_contact', 'Primary Contact Person and Designation', 'Name and designation of the person coordinating the assessment, such as plant head, facility manager, EHS manager or utilities manager.', 'text'),
        question('official_email', 'Official Email Address', 'Provide the official email address of the coordinating contact.', 'email'),
        question('official_contact_numbers', 'Contact Numbers', 'Primary mobile number with country code and alternate contact number, if available.', 'tel'),
        question('sector_and_products', 'Industry Sector and Main Products', 'Specify the industry category, products manufactured or processed, major production lines and water-intensive processes.'),
        question('ownership_and_facility_type', 'Ownership and Facility Type', 'Private/public-sector/PSU/joint venture/other; standalone factory, industrial campus, warehouse, technology park or multi-unit facility.'),
        question('site_area', 'Total Site Area and Built-up Area', 'Total plot area in acres or square metres and total built-up area.'),
        question('building_rooftop_area', 'Number of Buildings and Rooftop Area', 'Approximate number and type of buildings (production sheds, utilities, offices, warehouses, laboratories, canteen, etc.) and combined roof area in square feet or square metres for rainwater-harvesting calculations.'),
        table('building_rooftop_details', 'Building and rooftop details', ['Building / block type', 'Number of buildings', 'Approx. rooftop area', 'Unit', 'Remarks'], [
          'Production / manufacturing', 'Warehouse / storage', 'Office / administration', 'Utilities / other',
        ], 'Record the number of buildings and the roof area from site drawings or measurements. For example, a production block may have 48,000 sq ft of rooftop area.'),
        question('operating_schedule_capacity', 'Operating Schedule and Production Capacity', 'Shifts per day, operating days per month/year, seasonal shutdowns, installed production capacity and typical/current capacity utilisation.'),
      ],
    },
    {
      id: 'industry_operations_occupancy',
      title: 'SECTION 2 - OPERATIONS, OCCUPANCY & WATER-INTENSIVE ACTIVITIES',
      questions: [
        question('employees_contractors', 'Number of Employees and Contractors', 'Average daily headcount for permanent employees, contract workers, office staff, housekeeping, security and other on-site personnel.'),
        table('workforce_summary', 'Workforce and occupancy summary', ['Category', 'Headcount', 'Basis (official / estimate)', 'Remarks'], [
          'Permanent employees', 'Contract workers', 'Administrative / office staff', 'Housekeeping / security / support', 'Visitors / drivers / vendors (daily average)', 'Total typical daily on-site population',
        ], 'Use HR or contractor attendance records. For example, 180 permanent employees and 65 contract workers on a typical operating day. Check for overlap before calculating the total.'),
        question('shift_working_hours', 'Shift-wise Workforce and Operating Hours', 'Number of shifts, working hours per shift and approximate headcount present in each shift.'),
        table('shift_details', 'Shift details', ['Shift', 'Operating hours', 'Approx. headcount', 'Remarks'], ['Shift 1', 'Shift 2', 'Shift 3 / general'], 'Record actual shift times and headcount, e.g. Shift 1: 06:00–14:00, approximately 110 people. Replace with the facility\'s real schedule.'),
        question('production_process_water_use', 'Production Process and Water Use', 'Describe the main manufacturing/process steps and identify where water is used, including washing, rinsing, processing, formulation, cutting, finishing or cleaning.'),
        table('process_water_use_points', 'Process-wise water use points', ['Process / department', 'How water is used', 'Water quality needed', 'Approx. use (KLD)', 'Metered? / evidence'], [
          'Production process 1', 'Production process 2', 'Cleaning / rinsing', 'Other process',
        ], 'For a component-washing line, note the use (rinsing), required water quality, estimated use (e.g. 12 KLD) and whether the value comes from a meter or calculation.'),
        question('major_water_equipment', 'Major Water-Using Equipment and Utilities', 'List cooling towers, boilers, chillers, scrubbers, humidifiers, washing lines, process tanks, laboratories and RO/DM plants, with capacities where available.'),
        question('canteen_toilets_domestic_use', 'Canteen, Toilets and Domestic Use', 'State whether the facility has a canteen, showers, toilets, worker amenities or residential quarters; estimate users and operating hours.'),
      ],
    },
    {
      id: 'industry_water_supply_consumption',
      title: 'SECTION 3 - WATER SUPPLY & CONSUMPTION',
      questions: [
        question('facility_water_sources', "What are the facility's water sources?", 'Mark YES/NO for each source and identify the primary and backup sources.'),
        table('water_sources_available', 'Water sources available', ['Water source', 'Available? (Yes/No)', 'Primary / secondary', 'Metered?', 'Remarks'], [
          'Own borewell', 'Tanker water', 'Municipal / industrial supply', 'Surface water / other external source', 'Harvested rainwater', 'Treated wastewater reused on site', 'Other source',
        ], 'Mark each source Yes/No and identify its role. For example, borewell = Yes/Primary; tanker = Yes/Backup; harvested rainwater = Yes/Supplementary.'),
        question('daily_quantity_from_sources', 'Daily Quantity from Each Source', 'Provide average and peak daily water volumes in KLD. Separate metered figures from estimates and state the measurement period.'),
        table('source_quantity_cost', 'Water source quantity and cost', ['Source', 'Daily quantity (KLD)', 'Monthly quantity (KL)', 'Cost (₹/KL)', 'Monthly cost (₹)', 'Basis / remarks'], [
          'Borewell', 'Tanker', 'Municipal / industrial supply', 'Rainwater', 'Recycled / reused water', 'Other',
        ], 'If borewell use is 90 KLD, a 30-day month is 2,700 KL. If tanker water is ₹1,500 for a 6 KL tanker, the indicative unit cost is ₹250/KL. Use actual bills and delivery records.'),
        question('tanker_water_details', 'Tanker Water Details', 'Number of tankers per day/week, tanker capacity, seasonal variation, supplier, average cost per tanker and per KL, and availability of invoices/delivery records.'),
        table('tanker_supply_records', 'Tanker supply records', ['Supplier', 'Capacity per tanker (KL)', 'Frequency', 'Cost per tanker (₹)', 'Monthly cost (₹)', 'Invoice / record available?'], ['Supplier 1', 'Supplier 2'], 'A supplier delivering two 6 KL tankers daily at ₹1,500 each would supply 12 KL/day. Calculate monthly cost using actual delivery frequency and invoices.'),
        question('borewell_details', 'Borewell Details', 'Number and location of borewells, applicable permissions/status, pump capacity, operating hours, flow meters, water-level monitoring, pumping cost and available water-quality results.'),
        table('borewell_inventory', 'Borewell inventory', ['Borewell ID / location', 'Pump capacity', 'Operating hours/day', 'Metered quantity (KLD)', 'Water level / quality records', 'Remarks'], ['Borewell 1', 'Borewell 2'], 'Record each borewell\'s location, pump capacity and operating hours. A metered borewell may show 35 KLD; use the meter reading period and water-level log as evidence.'),
        question('municipal_industrial_supply_details', 'Municipal or Industrial Supply Details', 'Supplier, sanctioned quantity, tariff, fixed charges, supply schedule, interruptions and applicable industrial surcharge/restrictions.'),
        question('water_consumption', 'Average Daily, Monthly and Annual Water Consumption', 'Provide fresh water, recycled/reused water, rainwater and total consumption for daily, monthly and annual periods. State the reporting period and data basis.'),
        table('water_consumption_summary', 'Water consumption summary', ['Period', 'Fresh water', 'Recycled / reused water', 'Rainwater', 'Total water use', 'Unit / basis'], ['Daily', 'Monthly', 'Annual'], 'If daily use is 135 KL fresh water, 35 KL recycled water and 5 KL rainwater, total daily use is 175 KL. Monthly values should reflect the actual operating days.'),
        question('process_wise_water_consumption', 'Process-wise Water Consumption', 'Estimate water used by each major process or department and identify where sub-metering is available.'),
        table('department_consumption', 'Department / use-wise consumption', ['Department / use', 'Fresh water (KLD)', 'Recycled water (KLD)', 'Total (KLD)', 'Metered / estimated'], [
          'Production', 'Cooling systems', 'Boilers / utilities', 'Washing / cleaning', 'Domestic / sanitation', 'Landscaping', 'Other',
        ], 'Production may use 60 KLD in total, made up of 45 KLD fresh water and 15 KLD recycled water. Department totals should reconcile with the overall water balance.'),
        question('water_balance', 'Water Balance', 'Describe the water balance from source to end use, wastewater generation, evaporation/drift, product incorporation, sludge/moisture losses, leakage, treatment, reuse and discharge. Attach a water balance diagram if available.'),
        table('preliminary_water_balance', 'Preliminary water balance', ['Flow component', 'Quantity (KLD)', 'Measured / estimated', 'Evidence / remarks'], [
          'Total water input', 'Water incorporated into product', 'Evaporation / drift / process losses', 'Wastewater generated', 'Treated water reused', 'Discharge / off-site transfer', 'Unaccounted losses / difference',
        ], 'Enter source input, product incorporation, evaporation/losses, wastewater, reuse and discharge. Check that the figures reconcile; do not count internal reuse as new incoming water.'),
        question('water_quality_requirements', 'Water Quality Requirements', 'Identify process-specific water quality needs and treatment systems (filtration, softening, RO, DM, ETP polishing, etc.). Include available test results and quality-related production constraints.'),
        question('ro_dm_softener_details', 'RO / DM / Softener Plant Details', 'For each system, provide design capacity, daily feed, treated output, recovery percentage, reject/regeneration waste volume, operating hours, chemical use and how waste is handled.'),
        table('water_treatment_plant_details', 'Water treatment plant details', ['System / plant', 'Design capacity', 'Daily input', 'Treated output', 'Reject / waste', 'Reuse / disposal route'], ['RO plant', 'DM plant', 'Softener / filtration'], 'An RO plant with 40 KLD feed and 30 KLD treated output has 75% recovery; the remaining 10 KLD is reject. Confirm values from flow meters or operating logs.'),
        question('water_reliability_risk', 'Water Supply Reliability and Seasonal Risk', 'Frequency of supply disruption, summer tanker dependence, borewell decline, production interruptions, emergency storage and water-stress concerns.'),
        question('water_storage_capacity', 'Water Storage Capacity', 'List raw-water, treated-water, fire-water, process, overhead and underground tanks with capacities and typical operating levels.'),
        table('water_storage_inventory', 'Water storage inventory', ['Tank / sump ID', 'Water type', 'Capacity (KL)', 'Typical operating level', 'Location / condition'], [
          'Raw-water storage', 'Treated-water storage', 'Process / utility tank', 'Other',
        ], 'Record the name/type and capacity of each tank. A raw-water sump might be 150 KL; state whether capacity is from a nameplate, drawing or estimate.'),
      ],
    },
    {
      id: 'industry_wastewater_etp_stp',
      title: 'SECTION 4 - WASTEWATER, ETP/STP & REUSE',
      questions: [
        question('wastewater_streams', 'Wastewater Streams Generated', 'Identify process effluent, cooling-tower blowdown, boiler blowdown, RO reject, wash water, domestic sewage, laboratory waste and other streams.'),
        table('wastewater_generation', 'Wastewater generation', ['Wastewater stream', 'Source / process', 'Approx. quantity (KLD)', 'Current route', 'Remarks'], [
          'Process effluent', 'Domestic sewage', 'Cooling-tower blowdown', 'Boiler blowdown', 'RO reject / regeneration waste', 'Other',
        ], 'Process effluent from washing may be 55 KLD and sent to the ETP. Record each stream separately and avoid double-counting water routed through multiple treatment stages.'),
        question('etp_details', 'ETP Details', 'Number of ETPs, design capacity, current average inflow, treatment technology, commissioning year and operator/vendor, if known.'),
        table('etp_inventory', 'ETP inventory', ['ETP ID', 'Design capacity (KLD)', 'Current inflow (KLD)', 'Technology', 'Operating status', 'Remarks'], ['ETP 1', 'ETP 2'], 'An ETP may have a design capacity of 100 KLD and receive 55 KLD on an average day. Use the design document and actual inlet-flow records.'),
        question('stp_details', 'STP Details', 'Number of STPs, design capacity, current average inflow, treatment technology and areas served.'),
        table('stp_inventory', 'STP inventory', ['STP ID', 'Design capacity (KLD)', 'Current inflow (KLD)', 'Technology', 'Operating status', 'Remarks'], ['STP 1', 'STP 2'], 'An STP may be designed for 25 KLD and receive 18 KLD. Confirm actual flow and technology from the plant records or site nameboard.'),
        question('treatment_process_equipment', 'Treatment Process and Equipment', 'Describe treatment stages and units (e.g. screening, equalisation, pH correction, physico-chemical treatment, biological treatment, clarifier, filtration, carbon, disinfection, RO/MEE/ZLD where applicable).'),
        table('treatment_units', 'Treatment units verified / reported', ['Unit / stage', 'ETP / STP', 'Capacity / dimensions', 'Condition / status', 'Evidence / remarks'], [
          'Screening / collection', 'Equalisation tank', 'Treatment / reaction tanks', 'Biological / aeration tanks', 'Clarifier / settling', 'Filtration / disinfection', 'Sludge handling', 'Other / advanced treatment',
        ], 'Record the unit observed, whether it belongs to the ETP or STP, displayed capacity/dimensions and operating condition. If no capacity is displayed, write “not displayed” rather than guessing.'),
        question('etp_stp_capacity_utilisation', 'ETP/STP Capacity Utilisation', 'Compare design capacity with actual average and peak inflow. Identify under-utilisation, overload, bypass events, downtime and future capacity constraints.'),
        question('monthly_treatment_cost', 'Monthly Treatment Operating Cost', 'Provide monthly costs for electricity, chemicals, manpower, sludge handling, maintenance, testing, consumables and outsourced operation. Separate ETP and STP costs where possible.'),
        table('etp_stp_operating_costs', 'Monthly ETP / STP operating costs', ['Cost component', 'ETP (₹/month)', 'STP (₹/month)', 'Basis / remarks'], [
          'Electricity', 'Chemicals / consumables', 'Manpower / operator', 'Sludge handling / disposal', 'Maintenance / testing', 'Other', 'Total',
        ], 'Monthly ETP costs might include ₹28,000 electricity, ₹35,000 chemicals and ₹25,000 manpower. Use bills, purchase records and contracts; calculate the total from actual values.'),
        question('treated_water_quality_compliance', 'Treated Water Quality and Compliance', 'Provide latest available test reports for relevant parameters, such as pH, BOD, COD, TSS, TDS, oil and grease, relevant metals and sector-specific parameters. State sampling frequency and whether results meet applicable requirements.'),
        table('treated_water_quality_records', 'Treated water quality records', ['Parameter', 'Latest result', 'Unit', 'Applicable limit / target', 'Test date / lab'], [
          'pH', 'BOD', 'COD', 'TSS', 'TDS', 'Oil and grease / sector-specific',
        ], 'Enter the latest lab result and unit, then compare it with the applicable consent condition or reuse specification. For example, pH 7.2; attach the dated laboratory report.'),
        question('treated_wastewater_reuse', 'Treated Wastewater Reuse', 'List all reuse applications and approximate quantities, including cooling towers, process use after polishing, floor washing, toilet flushing, gardening or other uses.'),
        table('treated_water_reuse', 'Treated-water reuse', ['Reuse application', 'Quantity reused (KLD)', 'Quality / treatment needed', 'Seasonal variation', 'Remarks'], [
          'Cooling towers', 'Process use', 'Toilet flushing', 'Floor washing / cleaning', 'Landscaping', 'Other',
        ], 'If 18 KLD of treated water is reused in cooling towers and 4 KLD for toilet flushing, record each destination separately and verify with meters where possible.'),
        question('discharge_disposal', 'Discharge and Disposal', 'State whether wastewater is discharged to a sewer, CETP, surface drain or another authorised route. Provide daily quantity, destination, applicable authorisation and monitoring arrangements.'),
        question('sludge_reject_management', 'Sludge and Reject Management', 'Describe ETP/STP sludge, RO reject, evaporator concentrate and other residues: quantity, storage, testing, authorised transporter/receiver, disposal route and records.'),
        question('zero_liquid_discharge', 'Zero Liquid Discharge (ZLD)', 'Is ZLD required, installed, planned or not applicable? If installed, describe RO, evaporator, crystalliser or other systems, recovery, reject handling, energy demand and operating cost.'),
        question('etp_stp_maintenance_monitoring', 'ETP/STP Maintenance and Monitoring', 'Availability of flow meters, online monitoring, logbooks, calibration, preventive maintenance, alarms, operator training and emergency response procedures.'),
      ],
    },
    {
      id: 'industry_cooling_boilers_utilities',
      title: 'SECTION 5 - COOLING, BOILERS & OTHER UTILITIES',
      questions: [
        question('cooling_towers', 'Cooling Towers and Cooling Systems', 'Number, design capacity, make-up water, blowdown quantity, cycles of concentration, drift control, chemical dosing and conductivity monitoring.'),
        table('cooling_system_inventory', 'Cooling system inventory', ['System / tower ID', 'Capacity', 'Make-up water (KLD)', 'Blowdown (KLD)', 'Cycles of concentration', 'Remarks'], ['Cooling tower 1', 'Cooling tower 2'], 'A cooling tower may have 25 KLD make-up water and 8 KLD blowdown. Use operating logs or flow meters and record the measurement period.'),
        question('boilers_steam_systems', 'Boilers and Steam Systems', 'Number and capacity of boilers, feedwater requirement, condensate recovery, blowdown quantity, water treatment and percentage of condensate returned.'),
        table('boiler_condensate_details', 'Boiler and condensate details', ['Boiler ID', 'Capacity', 'Feedwater (KLD)', 'Blowdown (KLD)', 'Condensate recovered (KLD)', 'Remarks'], ['Boiler 1', 'Boiler 2'], 'Record boiler capacity and feedwater, blowdown and condensate-return quantities. For instance, a 2 TPH boiler may return 18 KLD condensate; verify against actual logs.'),
        question('chillers_hvac_humidification', 'Chillers, HVAC and Humidification', 'Identify water-cooled chillers, HVAC cooling towers, humidifiers and other systems; estimate make-up water and opportunities to optimise or reuse water.'),
        question('cleaning_washing_rinsing', 'Cleaning, Washing and Rinsing Operations', 'Describe cleaning-in-place (CIP), batch washing, rinsing and floor-cleaning practices; water used per cycle/batch and whether rinse water is recovered.'),
        question('leakage_loss_control', 'Leakage and Loss Control', 'Known leaks, overflow, pipe failures, unmetered connections, cooling losses, steam/condensate losses and current leak detection/repair process.'),
        question('water_efficiency_measures', 'Water Efficiency Measures', 'Existing low-flow fixtures, automatic shut-offs, counter-current rinsing, dry cleaning, process optimisation, condensate recovery, cooling-tower optimisation or other conservation measures.'),
      ],
    },
    {
      id: 'industry_rainwater_groundwater',
      title: 'SECTION 6 - RAINWATER HARVESTING & GROUNDWATER',
      questions: [
        question('rainwater_harvesting_structures', 'Rainwater Harvesting Structures', 'Number, type and location of rooftop harvesting systems, recharge pits, trenches, storage tanks and other structures.'),
        table('rainwater_harvesting_inventory', 'Rainwater harvesting inventory', ['Structure type / ID', 'Number', 'Capacity / dimensions', 'Condition', 'Connected roof / area', 'Remarks'], [
          'Recharge pits', 'Storage tanks', 'Recharge trenches / wells', 'Other',
        ], 'A facility may have eight recharge pits and two 50 KL rainwater tanks. Record actual dimensions, connected roof area and physical condition.'),
        question('rooftop_runoff_potential', 'Rooftop Runoff Potential', 'Provide total effective roof area, roof material, drainage arrangements and any available rainwater collection/yield calculations.'),
        question('rainwater_use_recharge', 'Rainwater Use and Recharge', 'Estimate quantity stored, used in processes/utilities or recharged to ground. Identify overflow routes, maintenance practices and seasonal performance.'),
        table('rainwater_disposition', 'Rainwater disposition', ['Use / destination', 'Estimated quantity (KL/month or KLD)', 'Measurement basis', 'Remarks'], [
          'Stored for use', 'Used in process / utilities', 'Groundwater recharge', 'Overflow / other',
        ], 'Record stored rainwater, quantity used, estimated recharge and overflow. State the basis of each figure; do not label recharge as measured unless it is metered or otherwise reliably quantified.'),
        question('groundwater_recharge_monitoring', 'Groundwater Recharge and Monitoring', 'Location and condition of recharge structures; borewell water-level measurements, monitoring frequency, seasonal trends and available groundwater-quality tests.'),
        question('rainwater_quality_first_flush', 'Rainwater Quality and First-Flush Management', 'Describe roof cleaning, first-flush diversion, filtration, storage protection and testing before reuse.'),
      ],
    },
    {
      id: 'industry_costs_compliance_management',
      title: 'SECTION 7 - COSTS, COMPLIANCE & MANAGEMENT',
      questions: [
        question('monthly_water_procurement_cost', 'Monthly Water Procurement Cost', 'Break down tanker, municipal/industrial supply, borewell pumping and maintenance, water treatment, chemicals, transport and other water-related expenses.'),
        table('monthly_water_costs', 'Monthly water-related costs', ['Cost category', 'Monthly cost (₹)', 'Annual cost (₹)', 'Records available?', 'Remarks'], [
          'Tanker procurement', 'Municipal / industrial water', 'Borewell pumping / maintenance', 'Water treatment / chemicals', 'Wastewater treatment / disposal', 'Sludge / reject handling', 'Other', 'Total',
        ], 'If monthly tanker cost is ₹1,87,500, annual cost would be ₹22,50,000 only if that monthly spend is representative for all 12 months. Account for seasonal variation.'),
        question('water_permits_compliance', 'Water-Related Permits and Compliance', 'List applicable consents, permits, approvals, abstraction permissions where applicable, discharge authorisations and reporting obligations. Provide validity dates and responsible departments.'),
        table('permit_compliance_register', 'Permit and compliance register', ['Permit / consent', 'Issuing authority', 'Reference / status', 'Valid until', 'Responsible person / remarks'], [
          'Consent to Establish / Operate, where applicable', 'Water abstraction permission, where applicable', 'Wastewater discharge / CETP arrangement', 'Other applicable approval',
        ], 'Record the approval/consent name, issuing authority, status and validity date from the actual document. Do not assume an approval applies without checking the facility\'s requirements.'),
        question('audits_reporting', 'Audits and Reporting', 'Has the facility conducted a water audit, environmental audit, energy audit or sustainability assessment? Provide date, findings, baseline year and action status.'),
        question('water_targets_responsibilities', 'Water Targets and Responsibilities', 'Is there a water reduction, recycling, reuse, water-positive or Net Zero Water target? State target, baseline, deadline, responsible team and progress.'),
        table('water_targets_progress', 'Water targets and progress', ['Target / initiative', 'Baseline', 'Target and deadline', 'Current progress', 'Owner / remarks'], [
          'Freshwater reduction', 'Wastewater reuse / recycling', 'Rainwater harvesting / recharge', 'Net Zero Water / other',
        ], 'A freshwater-reduction target might be “reduce baseline use by 20% by 2028.” Mark this as a target only if management has approved it; otherwise state “not set.”'),
        question('records_instrumentation', 'Records and Instrumentation', 'Availability of source meters, department-level meters, online flow meters, water bills, tanker receipts, lab reports, ETP/STP logs, production records and monthly dashboards.'),
        question('business_impact_water_risk', 'Business Impact of Water Risk', 'Describe whether water shortage, quality variation or wastewater constraints have caused downtime, reduced production, increased costs, compliance risk or dependence on emergency supply.'),
      ],
    },
    {
      id: 'industry_canteen_sanitation_amenities',
      title: 'SECTION 8 - CANTEEN, SANITATION & SITE AMENITIES',
      questions: [
        question('canteen_food_preparation', 'Canteen and Food Preparation', 'Is there a canteen or food court? Estimate meals served per day, operating hours, kitchen cleaning demand and wastewater handling.'),
        question('toilets_washrooms_showers', 'Toilets, Washrooms and Showers', 'Approximate number of toilet blocks, WCs, urinals, wash basins, showers and other fixtures. State whether treated water is used for flushing.'),
        table('sanitation_fixtures', 'Sanitation fixtures', ['Facility / fixture type', 'Number', 'Treated-water supply? (Yes/No)', 'Remarks'], [
          'Toilet blocks', 'WCs', 'Urinals', 'Wash basins', 'Showers / other',
        ], 'Record the count of each fixture type and whether treated water is supplied. For instance, 32 WCs and 18 urinals; verify by counting or facility records.'),
        question('landscaping_outdoor_use', 'Landscaping and Outdoor Use', 'Area under landscaping, irrigation method, estimated daily/seasonal water use and whether treated wastewater or harvested rainwater is used.'),
        question('other_water_uses', 'Other Water Uses', 'List vehicle washing, laboratories, fire-system testing, construction, worker facilities, gardening or any other significant water uses.'),
      ],
    },
    {
      id: 'industry_ground_research_findings',
      title: 'GROUND RESEARCH FINDINGS (FIELD SURVEY)',
      questions: [
        question('site_visit_scope_findings', 'Site Visit Scope and Findings', 'Record date, areas inspected, people interviewed and records reviewed. Include source meters, borewell pumps, tanker unloading points, storage tanks, process areas, cooling towers, boilers, ETP/STP, RO/DM plants and discharge points.'),
        table('onsite_verification_log', 'On-site verification log', ['Asset / parameter', 'Observed value / unit', 'Evidence (photo, meter, record, interview)', 'Status (verified / reported / estimated / unavailable)', 'Remarks'], [
          'Water source meter', 'Tanker delivery point / records', 'Storage tanks / sumps', 'Process / utility water meters', 'ETP / STP operation', 'Treated-water reuse route', 'Discharge / disposal point', 'Rainwater structures',
        ], 'A source meter should be logged with its reading, meter ID, date/time and photo. Mark “verified” only when the evidence was checked on site.'),
        question('water_sources_verified', 'Water Sources Verified on Site', 'Record each observed/verified source, meter or pump identification, operating condition, evidence collected and whether quantity could be independently confirmed.'),
        question('storage_reuse_verified', 'Storage and Reuse Verified on Site', 'List each tank/sump, its name-board or measured capacity, current operating level, water type stored and observed destination/use.'),
        table('storage_reuse_confirmed', 'Storage and reuse confirmed on site', ['Tank / sump / reuse point', 'Capacity (KL)', 'Observed water type / level', 'Use / destination', 'Evidence / remarks'], [
          'Raw-water tank / sump', 'Treated-water tank', 'Recycled-water tank', 'Other',
        ], 'A raw-water sump may have a rated capacity of 150 KL and be approximately 70% full. Distinguish the rated capacity from a visual estimate of the current level.'),
        question('etp_stp_units_verified', 'ETP/STP Units Verified on Site', 'List treatment units observed, displayed dimensions/capacities, equipment status, flow direction, operational condition and any mismatch with drawings or records.'),
        question('water_meter_flow_verification', 'Water Meter and Flow Verification', 'Record meter locations, meter IDs, readings, calibration status and gaps in measurement. Distinguish measured values from interview-based estimates.'),
        question('industrial_photographic_evidence', 'Photographic Evidence', 'Attach labelled photographs of water meters, borewell pumps, tanker receipts/unloading points, storage tanks, process-water use, cooling towers, boilers, ETP/STP units, treated-water reuse and discharge points. Avoid confidential process details unless authorised.', 'file'),
        question('key_observations_improvements', 'Key Observations and Improvement Opportunities', 'Summarise source dependency, water balance, reuse, losses, treatment capacity, compliance records, monitoring gaps, rainwater harvesting and practical water-saving opportunities.'),
      ],
    },
    {
      id: 'industry_conclusion',
      title: 'CONCLUSION',
      questions: [
        question('industrial_assessment_summary', 'Assessment Summary', "Write a concise 100–150 word summary of the facility's water profile: total demand, source split, tanker/borewell dependency, wastewater treatment and reuse, major costs, risks, data gaps and priority opportunities for a Net Zero Water roadmap."),
      ],
    },
    {
      id: 'industry_disclaimer',
      title: 'DISCLAIMER',
      questions: [
        question('industrial_data_basis_limitations', 'Data Basis and Limitations', 'Mark approximate values with \'~\'. State whether figures are based on official records, meter readings, invoices, staff interviews, calculations or visual observation. This questionnaire is a preliminary assessment and does not replace statutory audits, laboratory testing, engineering design or regulatory advice. Final recommendations depend on verified records, site conditions and applicable requirements.'),
      ],
    },
    {
      id: 'industry_annexure',
      title: 'ANNEXURE A - SITE PHOTOGRAPHS & SUPPORTING DOCUMENTS',
      questions: [
        question('industrial_site_photographs', 'Site Photographs', 'Attach photographs with captions, dates and locations, subject to facility permission and confidentiality requirements.', 'file'),
        question('industrial_supporting_documents', 'Supporting Documents', 'Where available, attach water bills, tanker invoices, borewell records, meter readings, water-quality reports, ETP/STP logs, consent/permit documents, water audit reports, plant layouts and water-balance diagrams. Redact commercially sensitive information where necessary.', 'file'),
      ],
    },
  ],
}
