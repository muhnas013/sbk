import { LOCALES, type Locale } from '@/lib/constants'

/**
 * Menambahkan prefix bahasa ke tautan internal.
 * Tautan eksternal, mailto/tel, dan anchor dibiarkan apa adanya.
 */
export const localizedHref = (href: string, locale: Locale): string => {
  if (!href) return `/${locale}`
  if (/^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href) || href.startsWith('#')) {
    return href
  }

  const path = href.startsWith('/') ? href : `/${href}`

  // Hindari prefix ganda bila admin terlanjur menulis "/id/..." atau "/en/...".
  const alreadyPrefixed = LOCALES.some(
    (code) => path === `/${code}` || path.startsWith(`/${code}/`),
  )
  if (alreadyPrefixed) return path

  return `/${locale}${path === '/' ? '' : path}`
}
