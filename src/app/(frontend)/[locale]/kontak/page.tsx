import { notFound } from 'next/navigation'
import { Container, Section } from '@/components/ui/container'
import { Heading, Lead } from '@/components/ui/typography'
import { isLocale } from '@/lib/constants'

/* Placeholder — form kontak lengkap dibangun pada Fase 3 (prd.md §5.10). */
const ContactPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <Section spacing="lg">
      <Container className="max-w-2xl">
        <Heading as="h1" size="lg">
          {locale === 'id' ? 'Kontak' : 'Contact'}
        </Heading>
        <Lead className="mt-4">
          {locale === 'id'
            ? 'Halaman ini akan dibangun pada Fase 3.'
            : 'This page will be built in Phase 3.'}
        </Lead>
      </Container>
    </Section>
  )
}

export default ContactPage
