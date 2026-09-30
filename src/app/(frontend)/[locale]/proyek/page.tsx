import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Where } from 'payload'
import { Container, Section } from '@/components/ui/container'
import { PageHero } from '@/components/page-hero'
import { Pagination } from '@/components/pagination'
import { ProjectCard } from '@/components/project-card'
import { ProjectFilters } from '@/components/project-filters'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findAll, findPublished } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Division, Project, ProjectCategory } from '@/payload-types'

export const revalidate = 300

const PER_PAGE = 9

type Params = {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({
    locale,
    path: 'proyek',
    title: locale === 'id' ? 'Proyek' : 'Projects',
  })
}

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

const ProjectsPage = async ({ params, searchParams }: Params) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const query = await searchParams
  const dict = getDictionary(locale)

  const divisionSlug = first(query.divisi)
  const categorySlug = first(query.kategori)
  const year = first(query.tahun)
  const status = first(query.status)
  const search = first(query.q)
  const page = Math.max(1, Number(first(query.page) ?? 1) || 1)

  const [divisions, categories] = await Promise.all([
    findPublished<Division>('divisions', { locale, limit: 50, sort: 'order', depth: 0 }),
    findAll<ProjectCategory>('project-categories', { locale, limit: 50, depth: 0 }),
  ])

  const division = divisions.docs.find((item) => item.slug === divisionSlug)
  const category = categories.find((item) => item.slug === categorySlug)

  const filters: Where[] = []
  if (division) filters.push({ division: { equals: division.id } })
  if (category) filters.push({ categories: { in: [category.id] } })
  if (year) filters.push({ yearCompleted: { equals: Number(year) } })
  if (status) filters.push({ projectStatus: { equals: status } })
  if (search) {
    filters.push({
      or: [
        { title: { like: search } },
        { summary: { like: search } },
        { location: { like: search } },
        { client: { like: search } },
      ],
    })
  }

  const projects = await findPublished<Project>('projects', {
    locale,
    limit: PER_PAGE,
    page,
    sort: '-yearCompleted',
    where: filters.length > 0 ? { and: filters } : undefined,
  })

  // Daftar tahun dibentuk dari data yang ada, bukan rentang tetap, supaya
  // pilihan filter selalu menghasilkan hasil.
  const allYears = await findPublished<Project>('projects', {
    locale,
    limit: 500,
    depth: 0,
  })
  const years = [
    ...new Set(
      allYears.docs
        .map((project) => project.yearCompleted)
        .filter((value): value is number => typeof value === 'number'),
    ),
  ]
    .sort((a, b) => b - a)
    .map((value) => ({ label: String(value), value: String(value) }))

  const searchParamsForLinks = Object.fromEntries(
    Object.entries(query).map(([key, value]) => [key, first(value)]),
  )

  return (
    <>
      <PageHero
        eyebrow={dict.nav.projects}
        title={locale === 'id' ? 'Portofolio Proyek' : 'Project Portfolio'}
        description={
          locale === 'id'
            ? 'Rekam jejak pekerjaan yang telah dan sedang kami laksanakan.'
            : 'A record of the work we have delivered and are delivering.'
        }
        breadcrumb={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.projects }]}
      />

      <Section spacing="md">
        <Container>
          {/* Heading tingkat dua menjaga urutan heading tetap berurutan
              antara h1 di kepala halaman dan h3 pada kartu proyek. */}
          <h2 className="sr-only">{locale === 'id' ? 'Daftar proyek' : 'Project list'}</h2>

          <ProjectFilters
            dict={dict}
            divisions={divisions.docs.map((item) => ({ label: item.name, value: item.slug ?? '' }))}
            categories={categories.map((item) => ({ label: item.name, value: item.slug ?? '' }))}
            years={years}
          />

          <p className="mt-6 text-xs text-stone">
            {locale === 'id'
              ? `Menampilkan ${projects.docs.length} dari ${projects.totalDocs} proyek`
              : `Showing ${projects.docs.length} of ${projects.totalDocs} projects`}
          </p>

          {projects.docs.length === 0 ? (
            <p className="mt-12 border border-line bg-paper-alt p-10 text-center text-sm text-stone">
              {dict.common.noResults}
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.docs.map((project) => (
                <ProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </div>
          )}

          <Pagination
            page={projects.page}
            totalPages={projects.totalPages}
            basePath={`/${locale}/proyek`}
            searchParams={searchParamsForLinks}
          />
        </Container>
      </Section>
    </>
  )
}

export default ProjectsPage
