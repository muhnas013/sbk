import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { headers } from 'next/headers'
import { DEFAULT_LOCALE, isLocale } from '@/lib/constants'
import { getGlobal } from '@/lib/payload'
import type { SeoDefault, SiteSetting } from '@/payload-types'
import './globals.css'

/*
 * Font di-*self-host* otomatis oleh `next/font` saat build — tidak ada permintaan
 * ke server Google saat pengunjung membuka situs (prd.md §10.3).
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const generateMetadata = async (): Promise<Metadata> => {
  const [site, seo] = await Promise.all([
    getGlobal<SiteSetting>('site-settings', DEFAULT_LOCALE, 0),
    getGlobal<SeoDefault>('seo-defaults', DEFAULT_LOCALE, 0),
  ])

  const companyName = site.companyName || 'PT Sabhumi Karya Barito'
  const template = seo.titleTemplate?.includes('%s')
    ? seo.titleTemplate.replace('%s', '%s')
    : `%s | ${companyName}`

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: companyName, template },
    description: seo.defaultDescription ?? site.shortDescription ?? undefined,
    // Kode verifikasi Search Console dikelola dari panel admin agar tim
    // tidak perlu menyentuh kode saat memverifikasi ulang domain.
    verification: seo.noIndex ? undefined : { google: site.searchConsoleVerification ?? undefined },
  }
}

export const viewport: Viewport = {
  themeColor: '#141414',
  width: 'device-width',
  initialScale: 1,
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // Locale disuntikkan middleware agar <html lang> benar tanpa memaksa
  // seluruh layout ikut masuk ke dalam segmen [locale].
  const headerList = await headers()
  const headerLocale = headerList.get('x-locale') ?? ''
  const lang = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE

  return (
    <html lang={lang} className={`${jakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
