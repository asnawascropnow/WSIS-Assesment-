import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Instrument_Serif, Noto_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const sans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

/** Instrument Sans has no ₹ glyph; Noto Sans supplies it for the project figures. */
const symbol = Noto_Sans({
  subsets: ['latin-ext'],
  weight: '500',
  variable: '--font-symbol',
  display: 'swap',
  preload: false,
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Net-Zero Water Resource Initiative | CropNow × ALTTECH Foundation × Akash Bhumi',
  description:
    'A collaborative initiative connecting water intelligence with practical water solutions. From utility dependence to resource resilience.',
  openGraph: {
    title: 'Net-Zero Water Resource Initiative',
    description: 'From utility dependence to resource resilience. Request a Water Assessment for your site.',
    images: ['/images/hero-water.png'],
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#f3f5f9',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-color-mode="light"
      data-light-theme="light"
      data-dark-theme="dark"
      className={`${sans.variable} ${serif.variable} ${symbol.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pre-hide hero motion targets only when JS runs, so no-JS visitors still see content. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')",
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
