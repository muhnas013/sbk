import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { ButtonLink } from '@/components/ui/button'
import { MediaImage } from '@/components/media-image'
import { PageHero } from '@/components/page-hero'
import { ProjectCard } from '@/components/project-card'
import { RichText } from '@/components/rich-text'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findPublished, findPublishedBySlug } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Project, Service } from '@/payload-types'

export const revalidate = 300

type Params = { params: Promise<{ locale: string; slug: string }> }

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const service = await findPublishedBySlug<Service>('services', slug, locale, 1)
  if (!service) return {}
  return buildMetadata({
    locale,
    path: `layanan/${slug}`,
    title: service.title,
    description: service.summary,
    image: service.coverImage,
  })
}

const ServiceDetailPage = async ({ params }: Params) => {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const service = await findPublishedBySlug<Service>('services', slug, locale, 2)
  if (!service) notFound()

  const divisionId = typeof service.division === 'object' ? service.division.id : service.division
  const divisionName = typeof service.division === 'object' ? service.division.name : null

  const relatedProjects = await findPublished<Project>('projects', {
    locale,
    limit: 3,
    sort: 'order',
    where: { division: { equals: divisionId } },
  })

  return (
    <>
      <PageHero
        eyebrow={divisionName}
        title={service.title}
        description={service.summary}
        image={service.coverImage}
        breadcrumb={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.services, href: `/${locale}/layanan` },
          { label: service.title },
        ]}
      />

      <Section spacing="lg">
        <Container className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
          <div>
            <RichText data={service.description} />

            {service.process && service.process.length > 0 && (
              <div className="mt-14">
                <Heading as="h2" size="sm">
                  {locale === 'id' ? 'Alur Kerja' : 'How We Work'}
                </Heading>
                <ol className="mt-8 space-y-8">
                  {service.process.map((step, index) => (
                    <li key={step.id ?? index} className="flex gap-6">
                      <span className="shrink-0 font-heading text-lg font-extrabold text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-heading text-sm font-bold">{step.title}</h3>
                        {step.description && (
                          <p className="mt-2 text-xs leading-relaxed text-stone">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {service.faq && service.faq.length > 0 && (
              <div className="mt-14">
                <Heading as="h2" size="sm">
                  {locale === 'id' ? 'Tanya Jawab' : 'FAQ'}
                </Heading>
                <dl className="mt-8 divide-y divide-line border-y border-line">
                  {service.faq.map((item, index) => (
                    <details key={item.id ?? index} className="group py-5">
                      <summary className="cursor-pointer list-none font-heading text-sm font-bold marker:hidden">
                        {item.question}
                      </summary>
                      <p className="mt-3 text-xs leading-relaxed text-stone">{item.answer}</p>
                    </details>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            {service.scope && service.scope.length > 0 && (
              <div className="border border-line bg-paper-alt p-8">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider">
                  {dict.project.scope}
                </h2>
                <ul className="mt-5 space-y-3">
                  {service.scope.map((item, index) => (
                    <li
                      key={item.id ?? index}
                      className="border-l-2 border-accent pl-4 text-xs leading-relaxed text-stone"
                    >
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ButtonLink href={`/${locale}/kontak`} className="mt-6 w-full">
              {dict.common.consultation}
            </ButtonLink>
          </aside>
        </Container>
      </Section>

      {service.gallery && service.gallery.length > 0 && (
        <Section tone="alt" spacing="lg">
          <Container>
            <Eyebrow>{locale === 'id' ? 'Dokumentasi' : 'Gallery'}</Eyebrow>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.gallery.map((item, index) => (
                <li key={item.id ?? index} className="relative aspect-4/3 overflow-hidden">
                  <MediaImage
                    media={item.image}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {relatedProjects.docs.length > 0 && (
        <Section spacing="lg">
          <Container>
            <Eyebrow>{dict.project.related}</Eyebrow>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.docs.map((project) => (
                <ProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}

export default ServiceDetailPage
