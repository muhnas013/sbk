import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/container'
import { Heading } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import { PageHero } from '@/components/page-hero'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findPublished } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Division, Service } from '@/payload-types'

export const revalidate = 300

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({
    locale,
    path: 'layanan',
    title: locale === 'id' ? 'Layanan' : 'Services',
  })
}

const ServicesPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const [divisions, services] = await Promise.all([
    findPublished<Division>('divisions', { locale, limit: 20, sort: 'order', depth: 0 }),
    findPublished<Service>('services', { locale, limit: 100, sort: 'order', depth: 1 }),
  ])

  const divisionIdOf = (service: Service) =>
    typeof service.division === 'object' ? service.division.id : service.division

  return (
    <>
      <PageHero
        eyebrow={dict.nav.divisions}
        title={dict.nav.services}
        description={
          locale === 'id'
            ? 'Layanan kami dikelompokkan berdasarkan divisi usaha, dari perencanaan hingga pelaksanaan dan pengadaan.'
            : 'Our services are grouped by business division, from planning through execution and procurement.'
        }
        breadcrumb={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.services }]}
      />

      {divisions.docs.map((division, index) => {
        const items = services.docs.filter((service) => divisionIdOf(service) === division.id)
        if (items.length === 0) return null

        return (
          <Section key={division.id} tone={index % 2 === 0 ? 'default' : 'alt'} spacing="lg">
            <Container>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <Heading as="h2" size="md">
                  {division.name}
                </Heading>
                <Link
                  href={`/${locale}/divisi/${division.slug}`}
                  className="text-xs font-medium underline underline-offset-4 hover:text-accent"
                >
                  {dict.common.viewDetail}
                </Link>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((service) => (
                  <Link
                    key={service.id}
                    href={`/${locale}/layanan/${service.slug}`}
                    className="group flex flex-col border border-line bg-paper transition-colors hover:border-ink"
                  >
                    {service.coverImage && (
                      <div className="relative aspect-4/3 overflow-hidden bg-paper-alt">
                        <MediaImage
                          media={service.coverImage}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-heading text-base font-bold leading-snug">
                        {service.title}
                      </h3>
                      {service.summary && (
                        <p className="mt-3 flex-1 text-xs leading-relaxed text-stone">
                          {service.summary}
                        </p>
                      )}
                      <span className="mt-6 inline-flex items-center gap-1 text-xs font-medium">
                        {dict.common.readMore}
                        <ArrowUpRight
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
        )
      })}
    </>
  )
}

export default ServicesPage
