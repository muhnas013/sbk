import { Share2 } from 'lucide-react'
import type { Locale } from '@/lib/constants'

/**
 * Tautan berbagi biasa — tanpa SDK pihak ketiga, sehingga tidak ada skrip
 * pelacak yang ikut termuat dan tidak perlu persetujuan cookie tambahan.
 */
export const ShareButtons = ({
  url,
  title,
  locale,
}: {
  url: string
  title: string
  locale: Locale
}) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const targets = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ]

  return (
    <div className="flex items-center gap-3">
      <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">
        {locale === 'id' ? 'Bagikan artikel ini' : 'Share this article'}
      </span>
      {targets.map((target) => (
        <a
          key={target.label}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 transition-colors hover:text-ink"
        >
          {target.label}
        </a>
      ))}
    </div>
  )
}
