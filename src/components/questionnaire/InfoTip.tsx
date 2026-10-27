import { Info } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

export type InfoTipTable = {
  /** Column headers, in display order (first column is the row label). */
  columns: string[]
  /** Body rows; every row already includes its label as the first cell. */
  rows: string[][]
}

type InfoTipProps = {
  text?: string
  table?: InfoTipTable
  title?: string
  hint?: string
  notes?: string[]
}

const NOTE_TITLE = 'When to use "~"'

export function InfoTip({ text, table, title = 'Example', hint, notes = [] }: InfoTipProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)

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

  const hasTable = Boolean(table && table.columns.length > 0 && table.rows.length > 0)
  const hasText = Boolean(text && text.trim().length > 0)
  const hasNotes = notes.length > 0
  if (!hasTable && !hasText && !hasNotes) return null

  return (
    <div
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
        onClick={() => setOpen((value) => !value)}
      >
        <Info size={15} aria-hidden="true" />
      </button>
      {open ? (
        <div
          className={`info-tip-panel${hasTable ? ' info-tip-panel--wide' : ''}`}
          role="tooltip"
          id={panelId}
        >
          <div className="info-tip-head">
            <span className="info-tip-label">{title}</span>
            {hint ? <span className="info-tip-hint">{hint}</span> : null}
          </div>
          {hasTable ? (
            <div className="info-tip-table-wrap">
              <table className="info-tip-table">
                <thead>
                  <tr>
                    {table!.columns.map((column, index) => (
                      <th key={index} scope="col">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table!.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) =>
                        cellIndex === 0 ? (
                          <th key={cellIndex} scope="row">
                            {cell}
                          </th>
                        ) : (
                          <td key={cellIndex}>{cell}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : hasText ? (
            <p className="info-tip-body">{text}</p>
          ) : null}
          {hasNotes ? (
            <div className="info-tip-note">
              <span className="info-tip-note-title">{NOTE_TITLE}</span>
              <ul className="info-tip-note-list">
                {notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
