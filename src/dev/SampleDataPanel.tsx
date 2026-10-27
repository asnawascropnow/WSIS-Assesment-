import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { questionnairesByType } from '../data/questionnaires'
import type { AssessmentType } from '../types'
import { buildSampleValues } from './sampleValues'

const CATEGORY_LABELS: Record<AssessmentType, string> = {
  university: 'University / Institution',
  industry: 'Industrial',
  organization: 'Organization / Company',
  apartment: 'Apartment / Villa',
}

type SampleDataPanelProps = {
  assessmentType: AssessmentType
}

/**
 * Testing helper that fills the active questionnaire with realistic sample
 * answers and attaches the files from the repository `testing/` folder, so any
 * category can be exercised end-to-end like a real user submission.
 *
 * Rendered in dev builds and on the `/testing` route (see AssessmentWizard), and
 * code-split so it never loads for a normal production visit.
 */
export default function SampleDataPanel({ assessmentType }: SampleDataPanelProps) {
  const form = useFormContext()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [detail, setDetail] = useState('')
  const [closed, setClosed] = useState(false)

  const categoryLabel = CATEGORY_LABELS[assessmentType]
  const sectionCount = questionnairesByType[assessmentType].sections.length

  const load = async () => {
    if (status === 'loading') return
    setStatus('loading')
    setDetail('Building sample data...')
    try {
      const values = await buildSampleValues(assessmentType, setDetail)
      form.reset(values as never)
      setStatus('done')
      setDetail(
        `Sample data loaded for all ${sectionCount} sections. Review each section, then submit like a normal user.`,
      )
      // Collapse after a successful fill so the panel stops covering the
      // Review & Submit button on the last section.
      window.setTimeout(() => setClosed(true), 1200)
    } catch (error) {
      setStatus('error')
      setDetail(error instanceof Error ? error.message : 'Could not build the sample data.')
    }
  }

  // Once the sample data is loaded the panel is no longer needed and would
  // otherwise sit on top of the Review & Submit button. Close it completely;
  // reloading the page brings it back for another run.
  if (closed) return null

  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 60,
        width: 300,
        padding: 14,
        border: '2px solid #171717',
        background: '#fffefa',
        boxShadow: '4px 4px 0 #171717',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        lineHeight: 1.45,
        color: '#171717',
      }}
    >
      <strong
        style={{
          display: 'block',
          fontSize: 11,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        Testing - {categoryLabel}
      </strong>
      <p style={{ margin: '0 0 10px' }}>
        Fill every section with realistic sample answers and attach the files from the{' '}
        <code>testing/</code> folder.
      </p>
      <button
        type="button"
        onClick={load}
        disabled={status === 'loading'}
        style={{
          width: '100%',
          padding: '8px 10px',
          border: '2px solid #171717',
          background: '#d8ff63',
          color: '#171717',
          fontWeight: 700,
          fontFamily: 'inherit',
          fontSize: 'inherit',
          cursor: status === 'loading' ? 'progress' : 'pointer',
          boxShadow: '2px 2px 0 #171717',
        }}
      >
        {status === 'loading' ? 'Loading sample data...' : 'Fill sample data'}
      </button>
      {detail ? (
        <p
          role="status"
          style={{
            margin: '10px 0 0',
            lineHeight: 1.4,
            color: status === 'error' ? '#7a1111' : '#3d4a46',
          }}
        >
          {detail}
        </p>
      ) : null}
    </div>
  )
}
