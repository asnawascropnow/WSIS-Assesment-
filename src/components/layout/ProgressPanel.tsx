type ProgressPanelProps = {
  completed: number
  total: number
}

export function ProgressPanel({ completed, total }: ProgressPanelProps) {
  return (
    <div className="progress-panel">
      <div className="progress-head">
        <span>Progress</span>
        <strong>
          {completed}/{total}
        </strong>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${(completed / total) * 100}%` }} />
      </div>
    </div>
  )
}
