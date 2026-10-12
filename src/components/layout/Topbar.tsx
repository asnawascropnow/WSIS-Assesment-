import { CheckCircle2, CircleDashed } from 'lucide-react'
import type { SaveStatus } from '../../types'

type TopbarProps = {
  title: string
  saveStatus: SaveStatus
}

export function Topbar({ title, saveStatus }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Assessment form</p>
        <h2>{title}</h2>
      </div>
      <div className="save-indicator">
        {saveStatus === 'saving' ? <CircleDashed size={16} /> : <CheckCircle2 size={16} />}
        <span>{saveStatus === 'saving' ? 'Saving progress…' : 'Saved locally'}</span>
      </div>
    </header>
  )
}
