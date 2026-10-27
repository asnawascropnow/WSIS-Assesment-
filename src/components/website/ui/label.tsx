import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Lightweight label primitive. Intentionally dependency-free (no Radix) so it
 * works with the rest of the vendored ui-layouts components.
 */
const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  ),
)
Label.displayName = 'Label'

export { Label }
