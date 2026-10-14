import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Dependency-free hover card. Provides the same surface the vendored demos
 * expect (`HoverCard`, `HoverCardTrigger`, `HoverCardContent`) without pulling
 * in another Radix package.
 */
interface HoverCardContextValue {
  open: boolean
  show: () => void
  hide: () => void
}

const HoverCardContext = React.createContext<HoverCardContextValue>({
  open: false,
  show: () => {},
  hide: () => {},
})

export function HoverCard({
  children,
  openDelay = 100,
  closeDelay = 100,
  className,
}: {
  children: React.ReactNode
  openDelay?: number
  closeDelay?: number
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const schedule = React.useCallback((next: boolean, delay: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(next), delay)
  }, [])

  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <HoverCardContext.Provider
      value={{
        open,
        show: () => schedule(true, openDelay),
        hide: () => schedule(false, closeDelay),
      }}
    >
      <span
        className={cn('relative inline-flex', className)}
        onMouseEnter={() => schedule(true, openDelay)}
        onMouseLeave={() => schedule(false, closeDelay)}
        onFocus={() => schedule(true, openDelay)}
        onBlur={() => schedule(false, closeDelay)}
      >
        {children}
      </span>
    </HoverCardContext.Provider>
  )
}

export function HoverCardTrigger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <span className={cn('inline-flex', className)}>{children}</span>
}

export function HoverCardContent({
  children,
  className,
  align = 'center',
}: {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
}) {
  const { open } = React.useContext(HoverCardContext)
  if (!open) return null
  return (
    <span
      role='tooltip'
      className={cn(
        'absolute bottom-full z-50 mb-2 block w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
        align === 'start' && 'left-0',
        align === 'center' && 'left-1/2 -translate-x-1/2',
        align === 'end' && 'right-0',
        className,
      )}
    >
      {children}
    </span>
  )
}
