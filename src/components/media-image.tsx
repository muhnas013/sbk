import Image, { type ImageProps } from 'next/image'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

type MediaLike = number | Media | null | undefined

/** Lolos hanya bila relasi media sudah ter-populate (depth ≥ 1). */
const resolve = (media: MediaLike): Media | null =>
  media && typeof media === 'object' ? media : null

/**
 * Payload mengembalikan URL absolut (serverURL + path). Media selalu disajikan
 * dari origin yang sama dengan situs, jadi URL diubah menjadi relatif supaya
 * `next/image` memperlakukannya sebagai gambar lokal — tanpa perlu
 * `images.remotePatterns` dan tanpa hop jaringan tambahan.
 */
const toRelativeUrl = (url: string): string => {
  if (!url.startsWith('http')) return url
  try {
    const parsed = new URL(url)
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
}

/**
 * Pembungkus `next/image` untuk media Payload: mengambil URL, dimensi, dan
 * alt text dari dokumen media, serta menghormati focal point.
 */
export const MediaImage = ({
  media,
  className,
  sizes = '100vw',
  priority,
  fill = true,
  alt: altOverride,
  ...props
}: {
  media: MediaLike
  className?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
  alt?: string
} & Omit<ImageProps, 'src' | 'alt' | 'fill' | 'sizes'>) => {
  const doc = resolve(media)
  if (!doc?.url) return null

  const alt = altOverride ?? doc.alt ?? ''
  const objectPosition =
    typeof doc.focalX === 'number' && typeof doc.focalY === 'number'
      ? `${doc.focalX}% ${doc.focalY}%`
      : undefined

  if (fill) {
    return (
      <Image
        src={toRelativeUrl(doc.url)}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', className)}
        style={objectPosition ? { objectPosition } : undefined}
        {...props}
      />
    )
  }

  return (
    <Image
      src={toRelativeUrl(doc.url)}
      alt={alt}
      width={doc.width ?? 1600}
      height={doc.height ?? 1200}
      sizes={sizes}
      priority={priority}
      className={className}
      {...props}
    />
  )
}
