import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Container, Section } from '@/components/ui/container'
import { MediaImage } from '@/components/media-image'
import { PageHero } from '@/components/page-hero'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findAll } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { isPast } from '@/lib/time'
import { formatDate } from '@/lib/utils'
import type { Certification } from '@/payload-types'

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
    path: 'legalitas',
    title: locale === 'id' ? 'Legalitas & Sertifikasi' : 'Legal & Certifications',
  })
}

const LegalPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const certifications = await findAll<Certification>('certifications', {
    locale,
    sort: 'order',
    where: { isPublic: { equals: true } },
  })

  return (
    <>
      <PageHero
        eyebrow={dict.nav.legal}
        title={locale === 'id' ? 'Legalitas & Sertifikasi' : 'Legal & Certifications'}
        description={
          locale === 'id'
            ? 'Dokumen perizinan dan sertifikasi yang menjadi dasar kami mengikuti tender dan melaksanakan pekerjaan.'
            : 'The permits and certifications that underpin our tender eligibility and project delivery.'
        }
        breadcrumb={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.legal }]}
      />

      <Section spacing="lg">
        <Container>
          {certifications.length === 0 ? (
            <p className="border border-line bg-paper-alt p-10 text-center text-sm text-stone">
              {dict.common.noResults}
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => {
                const expired = isPast(cert.validUntil)
                return (
                  <li key={cert.id} className="flex flex-col border border-line bg-paper">
                    {cert.image && (
                      <div className="relative aspect-3/4 overflow-hidden bg-paper-alt">
                        <MediaImage
                          media={cert.image}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-contain p-4"
                        />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6">
                      <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
                      <h2 className="mt-4 font-heading text-base font-bold leading-snug">
                        {cert.name}
                      </h2>

                      <dl className="mt-4 space-y-2 text-xs text-stone">
                        {cert.number && (
                          <div className="flex gap-2">
                            <dt className="shrink-0">{locale === 'id' ? 'Nomor' : 'Number'}:</dt>
                            <dd className="font-medium text-ink">{cert.number}</dd>
                          </div>
                        )}
                        {cert.issuer && (
                          <div className="flex gap-2">
                            <dt className="shrink-0">{locale === 'id' ? 'Penerbit' : 'Issuer'}:</dt>
                            <dd className="font-medium text-ink">{cert.issuer}</dd>
                          </div>
                        )}
                        {cert.validUntil && (
                          <div className="flex gap-2">
                            <dt className="shrink-0">
                              {locale === 'id' ? 'Berlaku sampai' : 'Valid until'}:
                            </dt>
                            <dd className="font-medium text-ink">
                              {formatDate(cert.validUntil, locale)}
                            </dd>
                          </div>
                        )}
                      </dl>

                      <div className="mt-auto pt-5">
                        {expired ? (
                          <Badge variant="outline" className="text-danger">
                            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                            {locale === 'id' ? 'Masa berlaku habis' : 'Expired'}
                          </Badge>
                        ) : (
                          <Badge variant="success">{locale === 'id' ? 'Berlaku' : 'Valid'}</Badge>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <p className="mt-10 border-l-2 border-accent bg-paper-alt p-5 text-xs leading-relaxed text-stone">
            {locale === 'id'
              ? 'Dokumen ditampilkan sebagai gambar ber-watermark. Salinan resmi untuk keperluan tender dapat diminta melalui halaman kontak dan akan dikirim langsung ke panitia.'
              : 'Documents are shown as watermarked images. Official copies for tender purposes can be requested via the contact page and will be sent directly to the committee.'}
          </p>
        </Container>
      </Section>
    </>
  )
}

export default LegalPage
