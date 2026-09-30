import { notFound } from 'next/navigation'
import { Footer, type FooterColumn } from '@/components/layout/footer'
import { Header, type NavItem } from '@/components/layout/header'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { CookieConsent } from '@/components/cookie-consent'
import { OrganizationSchema } from '@/components/structured-data'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, LOCALES } from '@/lib/constants'
import { localizedHref } from '@/lib/links'
import { defaultFooterColumns, defaultHeaderNav } from '@/lib/navigation'
import { getGlobal } from '@/lib/payload'
import type { Navigation as NavigationGlobal, SiteSetting } from '@/payload-types'
import type { Locale } from '@/lib/constants'

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }))

const toNavItems = (items: NavigationGlobal['header'], locale: Locale): NavItem[] | null => {
  if (!items || items.length === 0) return null
  return items.map((item) => ({
    label: item.label,
    href: localizedHref(item.href, locale),
    children: item.children?.map((child) => ({
      label: child.label,
      href: localizedHref(child.href, locale),
    })),
  }))
}

const toFooterColumns = (
  columns: NavigationGlobal['footer'],
  locale: Locale,
): FooterColumn[] | null => {
  if (!columns || columns.length === 0) return null
  return columns.map((column) => ({
    title: column.title,
    items: (column.items ?? []).map((item) => ({
      label: item.label,
      href: localizedHref(item.href, locale),
    })),
  }))
}

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
  const [site, navigation] = await Promise.all([
    getGlobal<SiteSetting>('site-settings', locale, 1),
    getGlobal<NavigationGlobal>('navigation', locale, 0),
  ])

  const companyName = site.companyName || 'PT Sabhumi Karya Barito'

  // Navigasi dari admin dipakai bila sudah diisi; kalau belum, jatuh ke
  // struktur bawaan supaya situs tidak pernah tampil tanpa menu.
  const headerItems = toNavItems(navigation.header, locale) ?? defaultHeaderNav(locale, dict)
  const footerColumns =
    toFooterColumns(navigation.footer, locale) ?? defaultFooterColumns(locale, dict)

  return (
    <>
      <OrganizationSchema site={site} locale={locale} />

      <a href="#main" className="skip-link">
        {dict.nav.skipToContent}
      </a>

      <Header
        locale={locale}
        dict={dict}
        items={headerItems}
        companyName={companyName}
        logo={site.logoLight}
      />

      <main id="main">{children}</main>

      <Footer
        locale={locale}
        dict={dict}
        companyName={companyName}
        tagline={site.shortDescription}
        columns={footerColumns}
        contact={{
          address: site.address,
          phone: site.phone,
          email: site.email,
          socials: site.socials?.map((social) => ({
            platform: social.platform,
            url: social.url,
          })),
        }}
        legalNote={site.footerLegalNote}
        logo={site.logoDark ?? site.logoLight}
      />

      <CookieConsent locale={locale} analyticsId={site.googleAnalyticsId} />

      <WhatsAppButton
        phone={site.whatsapp}
        label={dict.common.whatsapp}
        message={
          locale === 'id'
            ? `Halo ${companyName}, saya ingin bertanya mengenai layanan Anda.`
            : `Hello ${companyName}, I would like to ask about your services.`
        }
      />
    </>
  )
}

export default LocaleLayout
