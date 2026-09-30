import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { PageHero } from '@/components/page-hero'
import { ProjectCard } from '@/components/project-card'
import { RichText } from '@/components/rich-text'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findPublished, findPublishedBySlug } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Division, Project, Service } from '@/payload-types'

export const revalidate = 300

type Params = { params: Promise<{ locale: string; slug: string }> }

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const division = await findPublishedBySlug<Division>('divisions', slug, locale, 1)
  if (!division) return {}
  return buildMetadata({
    locale,
    path: `divisi/${slug}`,
    title: division.name,
    description: division.summary,
    image: division.coverImage,
  })
}

const DivisionPage = async ({ params }: Params) => {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const division = await findPublishedBySlug<Division>('divisions', slug, locale, 1)
  if (!division) notFound()

  const [services, projects] = await Promise.all([
    findPublished<Service>('services', {
      locale,
      limit: 12,
      sort: 'order',
      where: { division: { equals: division.id } },
      depth: 0,
    }),
    findPublished<Project>('projects', {
      locale,
      limit: 6,
      sort: 'order',
      where: { division: { equals: division.id } },
    }),
  ])

  return (
    <>
      <PageHero
        eyebrow={dict.nav.divisions}
        title={division.name}
        description={division.summary}
        image={division.coverImage}
        breadcrumb={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.services, href: `/${locale}/layanan` },
          { label: division.name },
        ]}
      />

      {division.description && (
        <Section spacing="lg">
          <Container className="max-w-3xl">
            <RichText data={division.description} />
          </Container>
        </Section>
      )}

      {services.docs.length > 0 && (
        <Section tone="alt" spacing="lg">
          <Container>
            <Eyebrow>{dict.nav.services}</Eyebrow>
            <Heading as="h2" size="md">
              {locale === 'id' ? 'Layanan pada divisi ini' : 'Services in this division'}
            </Heading>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.docs.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/${locale}/layanan/${service.slug}`}
                    className="group flex h-full flex-col border border-line bg-paper p-6 transition-colors hover:border-ink"
                  >
                    <h3 className="font-heading text-sm font-bold leading-snug">{service.title}</h3>
                    {service.summary && (
                      <p className="mt-3 flex-1 text-xs leading-relaxed text-stone">
                        {service.summary}
                      </p>
                    )}
                    <ArrowUpRight
                      className="mt-6 h-4 w-4 text-[color:var(--accent-text)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {projects.docs.length > 0 && (
        <Section spacing="lg">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>{dict.nav.projects}</Eyebrow>
                <Heading as="h2" size="md">
                  {locale === 'id' ? 'Proyek pada divisi ini' : 'Projects in this division'}
                </Heading>
              </div>
              <ButtonLink
                href={`/${locale}/proyek?divisi=${division.slug}`}
                variant="secondary"
                size="sm"
              >
                {dict.common.viewAll}
              </ButtonLink>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.docs.map((project) => (
                <ProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section tone="dark" spacing="md">
        <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Heading as="h2" size="md" className="max-w-2xl">
            {locale === 'id'
              ? 'Punya rencana pekerjaan di bidang ini?'
              : 'Planning work in this area?'}
          </Heading>
          <ButtonLink href={`/${locale}/kontak`} variant="accent" size="lg" className="shrink-0">
            {dict.common.consultation}
          </ButtonLink>
        </Container>
      </Section>
    </>
  )
}

export default DivisionPage
