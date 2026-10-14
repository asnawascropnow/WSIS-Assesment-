import type { AnchorHTMLAttributes, ReactNode } from 'react'

/**
 * Drop-in replacement for `next/link` used by the ported ui-layouts
 * components. Renders a plain anchor.
 */
export default function Link({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: ReactNode }) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
