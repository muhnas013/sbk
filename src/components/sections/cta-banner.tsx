import { ButtonLink } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Heading } from '@/components/ui/typography'
import type { Homepage } from '@/payload-types'
import type { Locale } from '@/lib/constants'
import { localizedHref } from '@/lib/links'

export const CtaBanner = ({ data, locale }: { data: Homepage; locale: Locale }) => {
  if (!data.ctaHeading) return null

  return (
    <Section tone="dark" spacing="lg">
      <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <Heading as="h2" size="lg">
            {data.ctaHeading}
          </Heading>
          {data.ctaDescription && (
            <p className="mt-4 text-sm leading-relaxed text-stone-light">{data.ctaDescription}</p>
          )}
        </div>

        {data.ctaButton?.label && (
          <ButtonLink
            href={localizedHref(data.ctaButton.href ?? '/kontak', locale)}
            variant="accent"
            size="lg"
            className="shrink-0"
          >
            {data.ctaButton.label}
          </ButtonLink>
        )}
      </Container>
    </Section>
  )
}
