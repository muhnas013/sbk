import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/components/blocks/render-blocks'
import { PageHero } from '@/components/page-hero'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findPublishedBySlug } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Page } from '@/payload-types'

export const revalidate = 300

type Params = { params: Promise<{ locale: string; slug: string }> }

/*
 * Halaman statis yang disusun admin lewat block builder — mis. Kebijakan
 * Privasi, Syarat Penggunaan, K3/HSE. Rute statis lain (proyek, berita, dsb.)
 * lebih diprioritaskan Next.js, jadi tidak akan tertangkap di sini.
 *
 * Sengaja TANPA `generateStaticParams`. Lapisan data memanggil `draftMode()`
 * untuk mendukung pratinjau, dan itu API dinamis — mendeklarasikan rute ini
 * sebagai statis membuatnya gagal dengan DYNAMIC_SERVER_USAGE saat dijalankan
 * di mode produksi. Seluruh rute lain pun dinamis dengan alasan yang sama;
 * caching ditangani `revalidate` di bawah.
 */

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const page = await findPublishedBySlug<Page>('pages', slug, locale, 0)
  if (!page) return {}
  return buildMetadata({ locale, path: slug, title: page.title })
}

const StaticPage = async ({ params }: Params) => {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const page = await findPublishedBySlug<Page>('pages', slug, locale, 2)
  if (!page) notFound()

  // Blok hero sudah memuat judul halaman; jangan tampilkan kepala halaman ganda.
  const hasHeroBlock = page.layout?.[0]?.blockType === 'hero'

  return (
    <>
      {!hasHeroBlock && (
        <PageHero
          title={page.title}
          breadcrumb={[{ label: dict.nav.home, href: `/${locale}` }, { label: page.title }]}
        />
      )}
      <RenderBlocks blocks={page.layout} locale={locale} />
    </>
  )
}

export default StaticPage
