import { CheckCircle2 } from 'lucide-react'

type SuccessViewProps = {
  onRestart: () => void
}

export function SuccessView({ onRestart }: SuccessViewProps) {
  return (
    <section className="welcome-screen">
      <div className="welcome-card success-card">
        <div className="welcome-badge success-badge">
          <CheckCircle2 size={18} />
          Assessment submitted
        </div>
        <h1>Submission confirmed</h1>
        <p className="welcome-copy">
          Your assessment has been accepted and stored securely. You can start
          another assessment whenever you’re ready.
        </p>
        <button type="button" className="primary-button large-button" onClick={onRestart}>
          Start a new assessment
        </button>
      </div>
    </section>
  )
}
