import Link from 'next/link'
import { MediaImage } from '@/components/media-image'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

/**
 * Logo perusahaan yang tertaut ke beranda.
 *
 * Bila admin belum mengunggah logo, nama perusahaan ditampilkan sebagai teks —
 * situs tidak boleh tampil tanpa identitas apa pun hanya karena berkasnya
 * belum ada.
 */
export const SiteLogo = ({
  href,
  logo,
  companyName,
  className,
  imageClassName,
}: {
  href: string
  logo?: number | Media | null
  companyName: string
  className?: string
  imageClassName?: string
}) => {
  const hasLogo = logo && typeof logo === 'object' && logo.url

  return (
    <Link
      href={href}
      className={cn('inline-flex items-center', className)}
      aria-label={companyName}
    >
      {hasLogo ? (
        <MediaImage
          media={logo}
          alt={companyName}
          fill={false}
          sizes="200px"
          // Tinggi ditetapkan, lebar mengikuti rasio asli agar logo apa pun
          // bentuknya tidak gepeng.
          className={cn('h-9 w-auto object-contain lg:h-10', imageClassName)}
          priority
        />
      ) : (
        <span className="font-heading text-sm font-extrabold uppercase tracking-tight">
          {companyName}
        </span>
      )}
    </Link>
  )
}
