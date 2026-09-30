import { Breadcrumb, type Crumb } from '@/components/ui/breadcrumb'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import type { Media } from '@/payload-types'

/** Kepala halaman dalam. Versi bergambar dipakai pada halaman detail. */
export const PageHero = ({
  eyebrow,
  title,
  description,
  image,
  breadcrumb,
}: {
  eyebrow?: string | null
  title: string
  description?: string | null
  image?: number | Media | null
  breadcrumb?: Crumb[]
}) => {
  if (image) {
    return (
      <section className="relative isolate flex min-h-[55vh] items-end overflow-hidden bg-ink text-paper">
        <MediaImage media={image} sizes="100vw" priority className="-z-10" />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/25"
          aria-hidden="true"
        />
        <Container className="py-16 lg:py-20">
          {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-6 text-paper/70" />}
          {eyebrow && (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-accent">
              {eyebrow}
            </p>
          )}
          <Heading as="h1" size="lg" className="max-w-4xl">
            {title}
          </Heading>
          {description && (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-paper/80">{description}</p>
          )}
        </Container>
      </section>
    )
  }

  return (
    <Section tone="alt" spacing="md" className="border-b border-line">
      <Container>
        {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-6" />}
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading as="h1" size="lg" className="max-w-4xl">
          {title}
        </Heading>
        {description && <Lead className="mt-5 max-w-2xl">{description}</Lead>}
      </Container>
    </Section>
  )
}
