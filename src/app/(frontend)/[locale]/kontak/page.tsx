import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '@/components/forms/contact-form'
import { Container, Section } from '@/components/ui/container'
import { Heading } from '@/components/ui/typography'
import { PageHero } from '@/components/page-hero'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findPublished, getGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Division, SiteSetting } from '@/payload-types'

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
    path: 'kontak',
    title: locale === 'id' ? 'Kontak' : 'Contact',
  })
}

const ContactPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const [site, divisions] = await Promise.all([
    getGlobal<SiteSetting>('site-settings', locale, 0),
    findPublished<Division>('divisions', { locale, limit: 20, sort: 'order', depth: 0 }),
  ])

  const details = [
    { icon: MapPin, label: locale === 'id' ? 'Alamat' : 'Address', value: site.address },
    { icon: Phone, label: dict.form.phone, value: site.phone, href: `tel:${site.phone}` },
    { icon: Mail, label: dict.form.email, value: site.email, href: `mailto:${site.email}` },
    {
      icon: Clock,
      label: locale === 'id' ? 'Jam Operasional' : 'Office Hours',
      value: site.operationalHours,
    },
  ].filter((item) => Boolean(item.value))

  const hasMap = typeof site.mapLatitude === 'number' && typeof site.mapLongitude === 'number'

  return (
    <>
      <PageHero
        eyebrow={dict.nav.contact}
        title={locale === 'id' ? 'Mari bicarakan rencana Anda' : "Let's discuss your plan"}
        description={
          locale === 'id'
            ? 'Kirim pertanyaan atau permintaan penawaran. Tim kami akan menghubungi Anda pada hari kerja berikutnya.'
            : 'Send a question or request a quote. Our team will get back to you on the next working day.'
        }
        breadcrumb={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.contact }]}
      />

      <Section spacing="lg">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Heading as="h2" size="sm">
              {locale === 'id' ? 'Informasi Kontak' : 'Contact Information'}
            </Heading>

            <ul className="mt-8 space-y-6">
              {details.map((detail) => (
                <li key={detail.label} className="flex gap-4">
                  <detail.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone">{detail.label}</p>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="mt-1 block text-sm text-ink hover:text-accent"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <p className="mt-1 whitespace-pre-line text-sm text-ink">{detail.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {hasMap && (
              <div className="mt-10 aspect-4/3 w-full border border-line">
                {/* `loading="lazy"` menjaga peta tidak memblokir LCP halaman. */}
                <iframe
                  title={locale === 'id' ? 'Peta lokasi kantor' : 'Office location map'}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${site.mapLongitude! - 0.01}%2C${site.mapLatitude! - 0.01}%2C${site.mapLongitude! + 0.01}%2C${site.mapLatitude! + 0.01}&layer=mapnik&marker=${site.mapLatitude}%2C${site.mapLongitude}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                />
              </div>
            )}
          </div>

          <div className="border border-line bg-paper p-8 lg:p-10">
            <Heading as="h2" size="sm">
              {locale === 'id' ? 'Kirim Pesan' : 'Send a Message'}
            </Heading>
            <div className="mt-8">
              <ContactForm
                dict={dict}
                divisions={divisions.docs.map((division) => ({
                  id: division.id,
                  name: division.name,
                }))}
                privacyHref={`/${locale}/${locale === 'id' ? 'kebijakan-privasi' : 'privacy-policy'}`}
                privacyLabel={locale === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default ContactPage
