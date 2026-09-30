import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, Briefcase, Calendar, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Container, Section } from '@/components/ui/container'
import { PageHero } from '@/components/page-hero'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findPublished } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { isPast } from '@/lib/time'
import { formatDate } from '@/lib/utils'
import type { Job } from '@/payload-types'

export const revalidate = 300

const EMPLOYMENT_LABELS = {
  'full-time': { id: 'Karyawan Tetap', en: 'Full-time' },
  contract: { id: 'Kontrak', en: 'Contract' },
  temporary: { id: 'Harian / Borongan', en: 'Temporary' },
  internship: { id: 'Magang', en: 'Internship' },
} as const

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({
    locale,
    path: 'karier',
    title: locale === 'id' ? 'Karier' : 'Careers',
  })
}

const CareersPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const jobs = await findPublished<Job>('jobs', {
    locale,
    limit: 50,
    sort: '-createdAt',
    where: { vacancyStatus: { equals: 'open' } },
  })

  // Lowongan yang tenggatnya sudah lewat disaring di sini, bukan lewat query,
  // supaya admin tetap melihatnya di panel tanpa harus mengubah status manual.
  const open = jobs.docs.filter((job) => !isPast(job.closingDate))

  return (
    <>
      <PageHero
        eyebrow={dict.nav.careers}
        title={locale === 'id' ? 'Bergabung dengan Tim Kami' : 'Join Our Team'}
        description={
          locale === 'id'
            ? 'Kami membuka kesempatan bagi tenaga profesional yang ingin tumbuh bersama perusahaan.'
            : 'We welcome professionals who want to grow with the company.'
        }
        breadcrumb={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.careers }]}
      />

      <Section spacing="lg">
        <Container className="max-w-4xl">
          {open.length === 0 ? (
            <div className="border border-line bg-paper-alt p-12 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-stone-light" aria-hidden="true" />
              <p className="mt-5 text-sm text-stone">
                {locale === 'id'
                  ? 'Belum ada lowongan yang dibuka saat ini. Silakan periksa kembali secara berkala.'
                  : 'There are no open positions at the moment. Please check back periodically.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {open.map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/${locale}/karier/${job.slug}`}
                    className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h2 className="font-heading text-lg font-bold group-hover:text-accent">
                        {job.title}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-stone">
                        {job.location && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                            {job.location}
                          </span>
                        )}
                        {job.closingDate && (
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                            {locale === 'id' ? 'Ditutup' : 'Closes'}{' '}
                            {formatDate(job.closingDate, locale)}
                          </span>
                        )}
                        <Badge variant="accent">
                          {EMPLOYMENT_LABELS[job.employmentType][locale]}
                        </Badge>
                      </div>
                    </div>

                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  )
}

export default CareersPage
