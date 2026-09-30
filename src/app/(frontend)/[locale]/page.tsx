import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AboutIntro } from '@/components/sections/about-intro'
import { CertificationStrip } from '@/components/sections/certification-strip'
import { ClientLogos } from '@/components/sections/client-logos'
import { CtaBanner } from '@/components/sections/cta-banner'
import { DivisionGrid } from '@/components/sections/division-grid'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { Hero } from '@/components/sections/hero'
import { LatestPosts } from '@/components/sections/latest-posts'
import { Stats } from '@/components/sections/stats'
import { Testimonials } from '@/components/sections/testimonials'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findAll, findPublished, getGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type {
  Certification,
  Client,
  Division,
  Homepage as HomepageGlobal,
  Post,
  Project,
  Testimonial,
} from '@/payload-types'

/** Urutan bawaan bila admin belum menyusun sendiri di global `homepage`. */
const DEFAULT_SECTIONS = [
  'hero',
  'about',
  'divisions',
  'stats',
  'projects',
  'certifications',
  'testimonials',
  'clients',
  'posts',
  'cta',
] as const

export const revalidate = 300

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({ locale, path: '' })
}

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)

  const [homepage, divisions, projects, certifications, testimonials, clients, posts] =
    await Promise.all([
      getGlobal<HomepageGlobal>('homepage', locale, 1),
      findPublished<Division>('divisions', { locale, limit: 4, sort: 'order' }),
      findPublished<Project>('projects', {
        locale,
        limit: 6,
        sort: 'order',
        where: { featured: { equals: true } },
      }),
      findAll<Certification>('certifications', {
        locale,
        limit: 6,
        sort: 'order',
        where: { isPublic: { equals: true } },
      }),
      findAll<Testimonial>('testimonials', {
        locale,
        limit: 3,
        sort: 'order',
        where: { isActive: { equals: true } },
      }),
      findAll<Client>('clients', {
        locale,
        limit: 10,
        sort: 'order',
        where: { isActive: { equals: true } },
      }),
      findPublished<Post>('posts', { locale, limit: 3, sort: '-publishedAt' }),
    ])

  const configured = homepage.sections?.filter((section) => section.enabled) ?? []
  const order =
    configured.length > 0 ? configured.map((section) => section.key) : [...DEFAULT_SECTIONS]

  const renderers: Record<string, React.ReactNode> = {
    hero: <Hero data={homepage} locale={locale} />,
    about: <AboutIntro data={homepage} locale={locale} dict={dict} />,
    divisions: <DivisionGrid divisions={divisions.docs} locale={locale} dict={dict} />,
    stats: <Stats stats={homepage.stats} />,
    projects: <FeaturedProjects projects={projects.docs} locale={locale} dict={dict} />,
    certifications: (
      <CertificationStrip certifications={certifications} locale={locale} dict={dict} />
    ),
    testimonials: <Testimonials testimonials={testimonials} locale={locale} />,
    clients: <ClientLogos clients={clients} dict={dict} />,
    posts: <LatestPosts posts={posts.docs} locale={locale} dict={dict} />,
    cta: <CtaBanner data={homepage} locale={locale} />,
  }

  return (
    <>
      {order.map((key) => (
        <div key={key}>{renderers[key]}</div>
      ))}
    </>
  )
}

export default HomePage
