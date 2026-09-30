import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Container, Section } from '@/components/ui/container'
import { Heading } from '@/components/ui/typography'
import { JobApplicationForm } from '@/components/forms/job-application-form'
import { PageHero } from '@/components/page-hero'
import { RichText } from '@/components/rich-text'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findPublishedBySlug, getGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { isPast } from '@/lib/time'
import { formatDate } from '@/lib/utils'
import type { Job, SiteSetting } from '@/payload-types'

export const revalidate = 300

type Params = { params: Promise<{ locale: string; slug: string }> }

const EMPLOYMENT = {
  'full-time': { id: 'Karyawan Tetap', en: 'Full-time', schema: 'FULL_TIME' },
  contract: { id: 'Kontrak', en: 'Contract', schema: 'CONTRACTOR' },
  temporary: { id: 'Harian / Borongan', en: 'Temporary', schema: 'TEMPORARY' },
  internship: { id: 'Magang', en: 'Internship', schema: 'INTERN' },
} as const

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const job = await findPublishedBySlug<Job>('jobs', slug, locale, 0)
  if (!job) return {}
  return buildMetadata({ locale, path: `karier/${slug}`, title: job.title })
}

const JobDetailPage = async ({ params }: Params) => {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const [job, site] = await Promise.all([
    findPublishedBySlug<Job>('jobs', slug, locale, 1),
    getGlobal<SiteSetting>('site-settings', locale, 0),
  ])
  if (!job) notFound()

  const closed = job.vacancyStatus === 'closed' || isPast(job.closingDate)

  const lists = [
    { title: locale === 'id' ? 'Tanggung Jawab' : 'Responsibilities', items: job.responsibilities },
    { title: locale === 'id' ? 'Kualifikasi' : 'Qualifications', items: job.qualifications },
    { title: locale === 'id' ? 'Benefit' : 'Benefits', items: job.benefits },
  ].filter((list) => list.items && list.items.length > 0)

  // Structured data JobPosting agar lowongan muncul di Google for Jobs.
  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    datePosted: job.createdAt,
    validThrough: job.closingDate ?? undefined,
    employmentType: EMPLOYMENT[job.employmentType].schema,
    hiringOrganization: {
      '@type': 'Organization',
      name: site.companyName,
      sameAs: process.env.NEXT_PUBLIC_SERVER_URL,
    },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'ID' },
    },
    totalJobOpenings: job.headcount ?? undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />

      <PageHero
        eyebrow={dict.nav.careers}
        title={job.title}
        breadcrumb={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.careers, href: `/${locale}/karier` },
          { label: job.title },
        ]}
      />

      <Section spacing="lg">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-4 border-b border-line pb-6 text-xs text-stone">
              {job.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {job.location}
                </span>
              )}
              {job.headcount && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  {job.headcount} {locale === 'id' ? 'orang' : 'position(s)'}
                </span>
              )}
              {job.closingDate && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDate(job.closingDate, locale)}
                </span>
              )}
              <Badge variant="accent">{EMPLOYMENT[job.employmentType][locale]}</Badge>
            </div>

            <RichText data={job.description} className="mt-8" />

            {lists.map((list) => (
              <div key={list.title} className="mt-12">
                <Heading as="h2" size="sm">
                  {list.title}
                </Heading>
                <ul className="mt-5 space-y-3">
                  {list.items?.map((item, index) => (
                    <li
                      key={item.id ?? index}
                      className="border-l-2 border-accent pl-4 text-xs leading-relaxed text-stone"
                    >
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-paper p-8">
              <Heading as="h2" size="sm">
                {locale === 'id' ? 'Kirim Lamaran' : 'Apply Now'}
              </Heading>

              {closed ? (
                <p className="mt-6 border-l-2 border-danger bg-danger/5 p-4 text-xs text-danger">
                  {locale === 'id'
                    ? 'Lowongan ini sudah ditutup dan tidak lagi menerima lamaran.'
                    : 'This position is closed and no longer accepting applications.'}
                </p>
              ) : (
                <div className="mt-6">
                  <JobApplicationForm
                    dict={dict}
                    jobId={job.id}
                    privacyHref={`/${locale}/${locale === 'id' ? 'kebijakan-privasi' : 'privacy-policy'}`}
                    privacyLabel={locale === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
                  />
                </div>
              )}
            </div>
          </aside>
        </Container>
      </Section>
    </>
  )
}

export default JobDetailPage
