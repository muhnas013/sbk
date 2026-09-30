import { notFound } from 'next/navigation'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, LOCALES } from '@/lib/constants'
import { defaultFooterColumns, defaultHeaderNav } from '@/lib/navigation'

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }))

const LocaleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)

  // TODO(fase-2): ganti sumber data ini dengan global `siteSettings` & `navigation`.
  const companyName = 'Sabhumi Karya Barito'

  return (
    <>
      <a href="#main" className="skip-link">
        {dict.nav.skipToContent}
      </a>

      <Header
        locale={locale}
        dict={dict}
        items={defaultHeaderNav(locale, dict)}
        companyName={companyName}
      />

      <main id="main">{children}</main>

      <Footer
        locale={locale}
        dict={dict}
        companyName={`PT ${companyName}`}
        tagline={
          locale === 'id'
            ? 'Konstruksi, konsultansi perencanaan, dan pengadaan material untuk proyek pemerintah maupun swasta.'
            : 'Construction, planning consultancy, and material procurement for public and private projects.'
        }
        columns={defaultFooterColumns(locale, dict)}
        contact={{}}
      />

      <WhatsAppButton phone={null} label={dict.common.whatsapp} />
    </>
  )
}

export default LocaleLayout
