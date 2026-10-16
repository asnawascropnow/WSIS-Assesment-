import Image from 'next/image'

export function AlttechLogo({ height = 28 }: { height?: number }) {
  return (
    <span className="logo-plate">
      <Image
        src="/brand/alttech-wordmark.png"
        alt="ALTTECH Foundation"
        width={Math.round(height * 3.63)}
        height={height}
        style={{ height, width: 'auto' }}
        priority
      />
    </span>
  )
}

export function AkashBhumiLogo({ height = 28 }: { height?: number }) {
  return (
    <span className="logo-plate">
      <Image
        src="/brand/akashbhumi-logo.png"
        alt="Akash Bhumi"
        width={Math.round(height * 3.25)}
        height={height}
        style={{ height, width: 'auto' }}
        priority
      />
    </span>
  )
}

export function BrandLockup({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const h = size === 'lg' ? 34 : 24
  return (
    <span className="brand-lockup">
      <AkashBhumiLogo height={h} />
      <span className="brand-lockup__x" aria-hidden="true">
        {'×'}
      </span>
      <AlttechLogo height={h} />
    </span>
  )
}
