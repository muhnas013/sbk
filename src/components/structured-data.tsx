import type { Crumb } from '@/components/ui/breadcrumb'
import type { Locale } from '@/lib/constants'
import type { SiteSetting } from '@/payload-types'

const serverUrl = () => process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    type="application/ld+json"
    // Data berasal dari konten yang dikelola admin, bukan input pengunjung.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
)

/** Identitas perusahaan — dipasang sekali di layout agar berlaku sesitus. */
export const OrganizationSchema = ({ site, locale }: { site: SiteSetting; locale: Locale }) => {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${serverUrl()}/#organization`,
    name: site.companyName,
    description: site.shortDescription ?? undefined,
    url: `${serverUrl()}/${locale}`,
    telephone: site.phone ?? undefined,
    email: site.email ?? undefined,
    address: site.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: site.address,
          addressCountry: 'ID',
        }
      : undefined,
    geo:
      typeof site.mapLatitude === 'number' && typeof site.mapLongitude === 'number'
        ? {
            '@type': 'GeoCoordinates',
            latitude: site.mapLatitude,
            longitude: site.mapLongitude,
          }
        : undefined,
    sameAs: site.socials?.map((social) => social.url).filter(Boolean),
    taxID: site.npwp ?? undefined,
  }

  return <JsonLd data={data} />
}

/** Remah jejak untuk halaman dalam. */
export const BreadcrumbSchema = ({ items, locale }: { items: Crumb[]; locale: Locale }) => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: item.href ? `${serverUrl()}${item.href}` : `${serverUrl()}/${locale}`,
      })),
    }}
  />
)

/** Artikel berita. */
export const ArticleSchema = ({
  title,
  description,
  image,
  publishedAt,
  updatedAt,
  authorName,
  url,
  organizationName,
}: {
  title: string
  description?: string | null
  image?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  authorName?: string | null
  url: string
  organizationName: string
}) => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description ?? undefined,
      image: image ? [`${serverUrl()}${image}`] : undefined,
      datePublished: publishedAt ?? undefined,
      dateModified: updatedAt ?? publishedAt ?? undefined,
      author: authorName ? { '@type': 'Person', name: authorName } : undefined,
      publisher: {
        '@type': 'Organization',
        name: organizationName,
        '@id': `${serverUrl()}/#organization`,
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    }}
  />
)
