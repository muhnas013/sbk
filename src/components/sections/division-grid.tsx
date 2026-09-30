import Link from 'next/link'
import { ArrowUpRight, Building2, Map, Ruler, Truck, Wrench } from 'lucide-react'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import type { Division } from '@/payload-types'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/lib/constants'

const ICONS = {
  building: Building2,
  ruler: Ruler,
  truck: Truck,
  wrench: Wrench,
  map: Map,
} as const

export const DivisionGrid = ({
  divisions,
  locale,
  dict,
}: {
  divisions: Division[]
  locale: Locale
  dict: Dictionary
}) => {
  if (divisions.length === 0) return null

  return (
    <Section tone="alt" spacing="lg">
      <Container>
        <Eyebrow>{dict.nav.divisions}</Eyebrow>
        <Heading as="h2" size="lg" className="max-w-2xl">
          {locale === 'id'
            ? 'Empat lini usaha, satu standar mutu'
            : 'Four business lines, one quality standard'}
        </Heading>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {divisions.map((division) => {
            const Icon = ICONS[(division.icon ?? 'building') as keyof typeof ICONS] ?? Building2
            return (
              <Link
                key={division.id}
                href={`/${locale}/divisi/${division.slug}`}
                className="group flex flex-col border border-line bg-paper transition-colors hover:border-ink"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-paper-alt">
                  <MediaImage
                    media={division.coverImage}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 font-heading text-base font-bold leading-snug">
                    {division.name}
                  </h3>
                  {division.summary && (
                    <p className="mt-3 flex-1 text-xs leading-relaxed text-stone">
                      {division.summary}
                    </p>
                  )}
                  <span className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-ink">
                    {dict.common.viewDetail}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
