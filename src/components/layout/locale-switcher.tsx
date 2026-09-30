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
          aria-label={LOCALE_LABELS[locale]}
          className={cn(
            'px-2 py-1 text-xs font-medium transition-colors',
            locale === current
              ? 'text-ink underline underline-offset-4'
              : 'text-stone hover:text-ink',
          )}
        >
          {LOCALE_SHORT[locale]}
        </Link>
      ))}
    </div>
  )
}
