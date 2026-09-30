import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading } from '@/components/ui/typography'
import type { Certification } from '@/payload-types'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/lib/constants'

export const CertificationStrip = ({
  certifications,
  locale,
  dict,
}: {
  certifications: Certification[]
  locale: Locale
  dict: Dictionary
}) => {
  if (certifications.length === 0) return null

  return (
    <Section tone="alt" spacing="md">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{dict.nav.legal}</Eyebrow>
            <Heading as="h2" size="md">
              {locale === 'id' ? 'Legalitas yang dapat diverifikasi' : 'Verifiable legal standing'}
            </Heading>
          </div>
          <Link
            href={`/${locale}/legalitas`}
            className="text-xs font-medium underline underline-offset-4 hover:text-accent"
          >
            {dict.common.viewAll}
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <li key={cert.id} className="flex items-start gap-4 border border-line bg-paper p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-ink">{cert.name}</p>
                {cert.issuer && <p className="mt-1 text-xs text-stone">{cert.issuer}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
