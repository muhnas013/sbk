import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { MediaImage } from '@/components/media-image'
import type { Homepage } from '@/payload-types'
import type { Locale } from '@/lib/constants'
import { localizedHref } from '@/lib/links'

export const Hero = ({ data, locale }: { data: Homepage; locale: Locale }) => {
  // Tanpa judul, hero hanya akan jadi blok gelap setinggi layar yang kosong —
  // dan `<h1>` kosong juga menyesatkan pembaca layar. Lebih baik tidak
  // dirender sama sekali, seperti section lain yang datanya belum diisi.
  if (!data.heroHeading) return null

  return (
    <section className="tone-dark relative isolate flex min-h-[85vh] items-end overflow-hidden bg-ink text-paper">
      {data.heroImage && (
        <>
          <MediaImage media={data.heroImage} sizes="100vw" priority className="-z-10" />
          {/* Gradien gelap menjaga kontras teks tetap ≥ 4,5:1 di atas foto apa pun. */}
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30"
            aria-hidden="true"
          />
        </>
      )}

      <Container className="py-20 lg:py-28">
        <div className="max-w-3xl">
          {data.heroEyebrow && (
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-[color:var(--accent-text)]">
              {data.heroEyebrow}
            </p>
          )}

          <h1 className="text-3xl lg:text-4xl">{data.heroHeading}</h1>

          {data.heroSubheading && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/80">
              {data.heroSubheading}
            </p>
          )}

          {data.heroButtons && data.heroButtons.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-4">
              {data.heroButtons.map((button, index) => (
                <ButtonLink
                  key={button.id ?? index}
                  href={localizedHref(button.href ?? '/', locale)}
                  size="lg"
                  variant={index === 0 ? 'accent' : 'secondary'}
                  className={
                    index === 0 ? '' : 'border-paper text-paper hover:bg-paper hover:text-ink'
                  }
                >
                  {button.label}
                  {index === 0 && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                </ButtonLink>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
