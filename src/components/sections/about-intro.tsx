import { ButtonLink } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import { RichText } from '@/components/rich-text'
import type { Homepage } from '@/payload-types'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/lib/constants'

export const AboutIntro = ({
  data,
  locale,
  dict,
}: {
  data: Homepage
  locale: Locale
  dict: Dictionary
}) => {
  if (!data.aboutHeading && !data.aboutContent) return null

  return (
    <Section spacing="lg">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          {data.aboutEyebrow && <Eyebrow>{data.aboutEyebrow}</Eyebrow>}
          {data.aboutHeading && (
            <Heading as="h2" size="lg">
              {data.aboutHeading}
            </Heading>
          )}
          <RichText data={data.aboutContent} className="mt-6" />
          <ButtonLink href={`/${locale}/tentang-kami`} variant="secondary" className="mt-8">
            {dict.common.aboutCta}
          </ButtonLink>
        </div>

        {data.aboutImage && (
          <div className="relative aspect-4/3 w-full">
            <MediaImage media={data.aboutImage} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        )}
      </Container>
    </Section>
  )
}
