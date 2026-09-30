import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ButtonLink } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { GalleryLightbox, type GalleryItem } from '@/components/gallery-lightbox'
import { PageHero } from '@/components/page-hero'
import { ProjectCard } from '@/components/project-card'
import { RichText } from '@/components/rich-text'
import { BreadcrumbSchema } from '@/components/structured-data'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findPublished, findPublishedBySlug } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { formatRupiah } from '@/lib/utils'
import type { Media, Project } from '@/payload-types'

export const revalidate = 300

type Params = { params: Promise<{ locale: string; slug: string }> }

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const project = await findPublishedBySlug<Project>('projects', slug, locale, 1)
  if (!project) return {}
  return buildMetadata({
    locale,
    path: `proyek/${slug}`,
    title: project.title,
    description: project.summary,
    image: project.coverImage,
  })
}

const ProjectDetailPage = async ({ params }: Params) => {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const project = await findPublishedBySlug<Project>('projects', slug, locale, 2)
  if (!project) notFound()

  const divisionId = typeof project.division === 'object' ? project.division.id : project.division
  const divisionName = typeof project.division === 'object' ? project.division.name : null

  const related = await findPublished<Project>('projects', {
    locale,
    limit: 4,
    sort: 'order',
    where: { division: { equals: divisionId } },
  })

  const statusLabel = {
    completed: dict.project.statusCompleted,
    ongoing: dict.project.statusOngoing,
    planned: dict.project.statusPlanned,
  }[project.projectStatus]

  // Nilai kontrak hanya tampil bila admin secara eksplisit mengizinkannya.
  const showValue = project.showContractValue && typeof project.contractValue === 'number'

  const specs = [
    { label: dict.project.client, value: project.client },
    {
      label: dict.project.location,
      value: [project.location, project.province].filter(Boolean).join(', ') || null,
    },
    {
      label: dict.project.year,
      value:
        project.yearStarted &&
        project.yearCompleted &&
        project.yearStarted !== project.yearCompleted
          ? `${project.yearStarted}–${project.yearCompleted}`
          : ((project.yearCompleted ?? project.yearStarted)?.toString() ?? null),
    },
    { label: dict.project.duration, value: project.duration },
    { label: dict.project.status, value: statusLabel },
    {
      label: dict.project.value,
      value: showValue ? formatRupiah(project.contractValue as number) : null,
    },
  ].filter((spec) => Boolean(spec.value))

  const gallery: GalleryItem[] = (project.gallery ?? [])
    .map((item): GalleryItem | null => {
      const image = item.image as Media | number
      if (typeof image !== 'object' || !image.url) return null
      return {
        url: image.url.startsWith('http') ? new URL(image.url).pathname : image.url,
        alt: image.alt ?? project.title,
        caption: item.caption,
      }
    })
    .filter((item): item is GalleryItem => item !== null)

  const breadcrumb = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.projects, href: `/${locale}/proyek` },
    { label: project.title },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumb} locale={locale} />

      <PageHero
        eyebrow={divisionName}
        title={project.title}
        description={project.summary}
        image={project.coverImage}
        breadcrumb={breadcrumb}
      />

      <Section spacing="lg">
        <Container className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
          <div>
            <RichText data={project.description} />

            {project.scope && project.scope.length > 0 && (
              <div className="mt-12">
                <Heading as="h2" size="sm">
                  {dict.project.scope}
                </Heading>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {project.scope.map((item, index) => (
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
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <dl className="divide-y divide-line border border-line bg-paper-alt">
              {specs.map((spec) => (
                <div key={spec.label} className="px-6 py-4">
                  <dt className="text-xs uppercase tracking-wider text-stone">{spec.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <ButtonLink href={`/${locale}/kontak`} className="mt-6 w-full">
              {dict.common.consultation}
            </ButtonLink>
          </aside>
        </Container>
      </Section>

      {gallery.length > 0 && (
        <Section tone="alt" spacing="lg">
          <Container>
            <Eyebrow>{locale === 'id' ? 'Dokumentasi Proyek' : 'Project Gallery'}</Eyebrow>
            <div className="mt-8">
              <GalleryLightbox items={gallery} closeLabel={dict.nav.close} />
            </div>
          </Container>
        </Section>
      )}

      {related.docs.filter((item) => item.id !== project.id).length > 0 && (
        <Section spacing="lg">
          <Container>
            <Eyebrow>{dict.project.related}</Eyebrow>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.docs
                .filter((item) => item.id !== project.id)
                .slice(0, 3)
                .map((item) => (
                  <ProjectCard key={item.id} project={item} locale={locale} />
                ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}

export default ProjectDetailPage
