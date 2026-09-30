import Image, { type ImageProps } from 'next/image'
import type { Media } from '@/payload-types'
import { toRelativeMediaUrl } from '@/lib/media-url'
import { cn } from '@/lib/utils'

type MediaLike = number | Media | null | undefined

/** Lolos hanya bila relasi media sudah ter-populate (depth ≥ 1). */
const resolve = (media: MediaLike): Media | null =>
  media && typeof media === 'object' ? media : null

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
        src={toRelativeMediaUrl(doc.url)}
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
      src={toRelativeMediaUrl(doc.url)}
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
