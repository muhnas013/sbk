import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import { PageHero } from '@/components/page-hero'
import { Testimonials } from '@/components/sections/testimonials'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findAll } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Client, Testimonial } from '@/payload-types'

export const revalidate = 300

const GROUPS = [
  { value: 'government', id: 'Pemerintah', en: 'Government' },
  { value: 'soe', id: 'BUMN / BUMD', en: 'State-Owned Enterprises' },
  { value: 'private', id: 'Swasta', en: 'Private Sector' },
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
    path: 'klien',
    title: locale === 'id' ? 'Klien & Mitra' : 'Clients & Partners',
  })
}

const ClientsPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const [clients, testimonials] = await Promise.all([
    findAll<Client>('clients', {
      locale,
      sort: 'order',
      where: { isActive: { equals: true } },
    }),
    findAll<Testimonial>('testimonials', {
      locale,
      sort: 'order',
      where: { isActive: { equals: true } },
    }),
  ])

  return (
    <>
      <PageHero
        eyebrow={dict.nav.clients}
        title={locale === 'id' ? 'Klien & Mitra Kerja' : 'Clients & Partners'}
        description={
          locale === 'id'
            ? 'Instansi dan perusahaan yang telah mempercayakan pekerjaannya kepada kami.'
            : 'The institutions and companies that have entrusted their work to us.'
        }
        breadcrumb={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.clients }]}
      />

      <Section spacing="lg">
        <Container className="space-y-16">
          {GROUPS.map((group) => {
            const items = clients.filter((client) => client.category === group.value)
            if (items.length === 0) return null

            return (
              <div key={group.value}>
                <Eyebrow>{locale === 'id' ? group.id : group.en}</Eyebrow>
                <ul className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-5">
                  {items.map((client) => (
                    <li
                      key={client.id}
                      className="relative flex h-24 items-center justify-center border border-line bg-paper p-4"
                    >
                      <MediaImage
                        media={client.logo}
                        alt={client.name}
                        sizes="(min-width: 1024px) 240px, 50vw"
                        className="object-contain p-2"
                      />
                      <span className="sr-only">{client.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

          {clients.length === 0 && (
            <p className="border border-line bg-paper-alt p-10 text-center text-sm text-stone">
              {dict.common.noResults}
            </p>
          )}
        </Container>
      </Section>

      <Testimonials testimonials={testimonials} locale={locale} />
    </>
  )
}

export default ClientsPage
