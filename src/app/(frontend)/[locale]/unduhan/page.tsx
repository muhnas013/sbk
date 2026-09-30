import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Download, FileText } from 'lucide-react'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/typography'
import { PageHero } from '@/components/page-hero'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findAll } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { formatFileSize } from '@/lib/utils'
import type { Document } from '@/payload-types'

export const revalidate = 300

const CATEGORIES = [
  { value: 'company-profile', id: 'Company Profile', en: 'Company Profile' },
  { value: 'brochure', id: 'Brosur Divisi', en: 'Division Brochures' },
  { value: 'catalog', id: 'Katalog Produk', en: 'Product Catalogues' },
  { value: 'form', id: 'Formulir', en: 'Forms' },
  { value: 'legal', id: 'Legalitas', en: 'Legal Documents' },
  { value: 'other', id: 'Lainnya', en: 'Others' },
] as const

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({
    locale,
    path: 'unduhan',
    title: locale === 'id' ? 'Pusat Unduhan' : 'Download Centre',
  })
}

const DownloadsPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const documents = await findAll<Document>('documents', {
    locale,
    sort: 'order',
    where: { isPublic: { equals: true } },
  })

  return (
    <>
      <PageHero
        eyebrow={dict.nav.downloads}
        title={locale === 'id' ? 'Pusat Unduhan' : 'Download Centre'}
        description={
          locale === 'id'
            ? 'Company profile, brosur, dan katalog yang dapat Anda unduh.'
            : 'Company profile, brochures, and catalogues available for download.'
        }
        breadcrumb={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.downloads }]}
      />

      <Section spacing="lg">
        <Container className="max-w-4xl space-y-14">
          {documents.length === 0 && (
            <p className="border border-line bg-paper-alt p-10 text-center text-sm text-stone">
              {dict.common.noResults}
            </p>
          )}

          {CATEGORIES.map((category) => {
            const items = documents.filter((document) => document.category === category.value)
            if (items.length === 0) return null

            return (
              <div key={category.value}>
                <Eyebrow>{locale === 'id' ? category.id : category.en}</Eyebrow>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {items.map((document) => (
                    <li
                      key={document.id}
                      className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex gap-4">
                        <FileText
                          className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        <div>
                          <h2 className="font-heading text-sm font-bold">{document.title}</h2>
                          {document.description && (
                            <p className="mt-1 text-xs leading-relaxed text-stone">
                              {document.description}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-stone-light">
                            {document.filename?.split('.').pop()?.toUpperCase()}
                            {document.filesize ? ` · ${formatFileSize(document.filesize)}` : ''}
                            {document.downloadCount
                              ? ` · ${document.downloadCount}× ${locale === 'id' ? 'diunduh' : 'downloaded'}`
                              : ''}
                          </p>
                        </div>
                      </div>

                      <a
                        href={`/unduh/${document.id}`}
                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 border border-ink px-5 text-xs font-medium transition-colors hover:bg-ink hover:text-paper"
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        {dict.common.download}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </Container>
      </Section>
    </>
  )
}

export default DownloadsPage
