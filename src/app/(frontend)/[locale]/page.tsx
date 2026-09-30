import { notFound } from 'next/navigation'
import { ButtonLink } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'

/*
 * Beranda sementara. Seluruh section beranda (prd.md §5.1) dibangun pada Fase 3
 * dan datanya berasal dari global `homepage`.
 */
const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)

  return (
    <Section spacing="lg">
      <Container className="max-w-3xl">
        <Eyebrow>{locale === 'id' ? 'Sedang dibangun' : 'Under construction'}</Eyebrow>
        <Heading as="h1" size="xl">
          PT Sabhumi Karya Barito
        </Heading>
        <Lead className="mt-6">
          {locale === 'id'
            ? 'Fondasi aplikasi sudah berjalan. Konten beranda akan dibangun pada Fase 3 dan dikelola sepenuhnya melalui panel admin.'
            : 'The application foundation is running. Homepage content will be built in Phase 3 and managed entirely from the admin panel.'}
        </Lead>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href={`/${locale}/kontak`}>{dict.common.consultation}</ButtonLink>
          <ButtonLink href="/admin" variant="secondary">
            {locale === 'id' ? 'Panel Admin' : 'Admin Panel'}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}

export default HomePage
