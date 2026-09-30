import { Quote } from 'lucide-react'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import type { Testimonial } from '@/payload-types'
import type { Locale } from '@/lib/constants'

export const Testimonials = ({
  testimonials,
  locale,
}: {
  testimonials: Testimonial[]
  locale: Locale
}) => {
  if (testimonials.length === 0) return null

  return (
    <Section tone="alt" spacing="lg">
      <Container>
        <Eyebrow>{locale === 'id' ? 'Testimoni' : 'Testimonials'}</Eyebrow>
        <Heading as="h2" size="lg" className="max-w-2xl">
          {locale === 'id' ? 'Apa kata pemberi kerja' : 'What our clients say'}
        </Heading>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.id} className="flex flex-col border border-line bg-paper p-8">
              <Quote className="h-6 w-6 text-[color:var(--accent-text)]" aria-hidden="true" />
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-stone">
                “{item.quote}”
              </blockquote>
              <div className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                {item.photo && (
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-paper-alt">
                    <MediaImage media={item.photo} alt={item.name} sizes="44px" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-ink">{item.name}</p>
                  <p className="text-xs text-stone">
                    {[item.position, item.organization].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
