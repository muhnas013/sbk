import Link from 'next/link'
import { headers } from 'next/headers'
import { Container, Section } from '@/components/ui/container'
import { Heading, Lead } from '@/components/ui/typography'
import { buttonVariants } from '@/components/ui/button'
import { getDictionary } from '@/i18n/dictionaries'
import { DEFAULT_LOCALE, isLocale } from '@/lib/constants'

const NotFound = async () => {
  const headerList = await headers()
  const headerLocale = headerList.get('x-locale') ?? ''
  const locale = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE
  const dict = getDictionary(locale)

  return (
    <Section spacing="lg">
      <Container className="max-w-2xl text-center">
        <p className="font-heading text-4xl text-line">404</p>
        <Heading as="h1" size="lg" className="mt-4">
          {dict.error.notFoundTitle}
        </Heading>
        <Lead className="mt-4">{dict.error.notFoundBody}</Lead>
        <Link href={`/${locale}`} className={`${buttonVariants()} mt-10`}>
          {dict.error.backHome}
        </Link>
      </Container>
    </Section>
  )
}

export default NotFound
