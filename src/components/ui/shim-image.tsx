import type { ImgHTMLAttributes } from 'react'

/**
 * Drop-in replacement for `next/image` used by the ported ui-layouts
 * components. This project is a plain Vite SPA, so images are rendered with
 * the native `<img>` element. `next/image`-only props are stripped so they are
 * not forwarded to the DOM.
 */
/** Shape of static image imports used by some ui-layouts demos. */
export interface StaticImageData {
  src: string
  height: number
  width: number
  blurDataURL?: string
  blurWidth?: number
  blurHeight?: number
}

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {  src: string
  alt?: string
  width?: number | string
  height?: number | string
  fill?: boolean
  priority?: boolean
  quality?: number
  placeholder?: string
  blurDataURL?: string
  loader?: unknown
  unoptimized?: boolean
}

export default function Image({
  src,
  alt = '',
  width,
  height,
  fill,
  priority,
  quality,
  placeholder,
  blurDataURL,
  loader,
  unoptimized,
  style,
  ...rest
}: ImageProps) {
  void priority
  void quality
  void placeholder
  void blurDataURL
  void loader
  void unoptimized

  const fillStyle = fill
    ? { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', ...style }
    : style

  return <img src={src} alt={alt} width={width} height={height} style={fillStyle} {...rest} />
}
