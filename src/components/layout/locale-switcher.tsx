'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT, type Locale } from '@/lib/constants'
import { cn } from '@/lib/utils'

/** Mengganti bahasa sambil mempertahankan halaman yang sedang dibuka. */
export const LocaleSwitcher = ({ current, className }: { current: Locale; className?: string }) => {
  const pathname = usePathname()

  const pathFor = (locale: Locale) => {
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/') || `/${locale}`
  }

  return (
    <div className={cn('flex items-center gap-1', className)} role="group" aria-label="Bahasa">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={pathFor(locale)}
          hrefLang={locale}
          aria-current={locale === current ? 'true' : undefined}
          className={cn(
            // Tinggi 44px memenuhi anjuran ukuran target sentuh.
            'inline-flex h-11 min-w-11 items-center justify-center px-2 text-xs font-medium transition-colors',
            locale === current
              ? 'text-ink underline underline-offset-4'
              : 'text-stone hover:text-ink',
          )}
        >
          {LOCALE_SHORT[locale]}
          {/* Nama aksesibel diawali teks yang terlihat, lalu diperjelas —
              syarat aturan "label content name mismatch". */}
          <span className="sr-only"> — {LOCALE_LABELS[locale]}</span>
        </Link>
      ))}
    </div>
  )
}
