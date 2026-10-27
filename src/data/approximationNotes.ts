import type { AssessmentType } from '../types'

/**
 * Guidance shown inside the ⓘ tooltip about marking approximate values with
 * the "~" symbol. The first line is shared; the following lines are tailored
 * to each questionnaire's data sources and basis conventions.
 */
export const universalApproximationNote =
  'Use "~" before a value that is not exact — for example ~120 KLD, ~1,560 residents, ~₹1.65 lakh.'

export const approximationNotes: Record<AssessmentType, string[]> = {
  university: [
    'Write published or official figures plainly; use "~" only for derived or approximate numbers.',
    'In the Basis column, label each figure as Published / Official, Derived, or Approximate Estimate.',
    'Round estimates sensibly (e.g. ~240 KLD, ~90 ML/year) instead of giving false precision.',
  ],
  apartment: [
    'Use "~" for figures from the association register, interviews or visual estimates — e.g. ~1,560 residents, ~30 KLD tanker.',
    'Where bills, meter readings or tanker invoices exist, enter the exact value and say so in the basis / remarks column.',
    'Count a swimming pool top-up or backwash, not its full volume, and mark it approximate.',
  ],
  industry: [
    'Use "~" for values from calculations, staff interviews or observation — e.g. ~160 KLD input, ~55 KLD effluent.',
    'Enter exact values where meters, operating logs or invoices exist, and never label an estimate as metered.',
    'Reconcile the water balance and show any difference as an approximate, unaccounted figure.',
  ],
  organization: [
    'Use "~" for shared-building or landlord-reported figures — e.g. ~20 KLD municipal share, ~370 occupants.',
    'Say clearly when a value is the organization allocated share rather than a directly metered quantity.',
    'Use "~" for occupancy-normalised estimates such as ~81 litres per person per day from shared data.',
  ],
}

/** Returns the "~" guidance lines for the given questionnaire. */
export function getApproximationNotes(type: AssessmentType): string[] {
  return [universalApproximationNote, ...(approximationNotes[type] ?? [])]
}
