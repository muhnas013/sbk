import type { Metadata } from 'next'
import { getGlobal } from '@/lib/payload'
import { LOCALES, type Locale } from '@/lib/constants'
import type { Media, SeoDefault, SiteSetting } from '@/payload-types'

const serverUrl = () => process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const mediaUrl = (media: unknown): string | undefined => {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as Media).url ?? undefined
  }
  return undefined
}

/**
 * Menyusun metadata halaman dari nilai per-halaman, dengan fallback bertingkat
 * ke `seo-defaults` lalu `site-settings`. Selalu memasang canonical dan
 * alternate `hreflang` untuk kedua bahasa.
 */
export const buildMetadata = async ({
  locale,
  path,
  title,
  description,
  image,
  noIndex,
}: {
  locale: Locale
  /** Path tanpa prefix bahasa, contoh: `proyek/gedung-kantor`. Kosong untuk beranda. */
  path: string
  title?: string | null
  description?: string | null
  image?: unknown
  noIndex?: boolean
}): Promise<Metadata> => {
  const [defaults, site] = await Promise.all([
    getGlobal<SeoDefault>('seo-defaults', locale, 1),
    getGlobal<SiteSetting>('site-settings', locale, 1),
  ])

  const suffix = path ? `/${path}` : ''
  const canonical = `${serverUrl()}/${locale}${suffix}`

  const resolvedTitle = title ?? defaults.defaultTitle ?? site.companyName
  const resolvedDescription =
    description ?? defaults.defaultDescription ?? site.shortDescription ?? undefined
  const resolvedImage = mediaUrl(image) ?? mediaUrl(defaults.defaultOgImage)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        LOCALES.map((code) => [code, `${serverUrl()}/${code}${suffix}`]),
      ),
    },
    // `noIndex` global dipakai untuk menutup lingkungan staging dari mesin pencari.
    robots: noIndex || defaults.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      url: canonical,
      siteName: site.companyName,
      title: resolvedTitle ?? undefined,
      description: resolvedDescription,
      images: resolvedImage ? [{ url: resolvedImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle ?? undefined,
      description: resolvedDescription,
      images: resolvedImage ? [resolvedImage] : undefined,
    },
  }
}
