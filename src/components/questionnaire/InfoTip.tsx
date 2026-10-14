import { Info } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

type InfoTipProps = {
  text: string
  title?: string
}

export function InfoTip({ text, title = 'Example' }: InfoTipProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapperRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

  return (
    <span
      className="info-tip"
      ref={wrapperRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="info-tip-trigger"
        aria-label="Show example"
        aria-expanded={open}
        aria-describedby={open ? panelId : undefined}
        onClick={() => setOpen(true)}
      >
        <Info size={15} aria-hidden="true" />
      </button>
      {open ? (
        <span className="info-tip-panel" role="tooltip" id={panelId}>
          <span className="info-tip-label">{title}</span>
          <span className="info-tip-body">{text}</span>
        </span>
      ) : null}
    </span>
  )
}
