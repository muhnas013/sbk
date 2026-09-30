import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { headers } from 'next/headers'
import { isBuildPhase } from '@/lib/build-phase'
import { DEFAULT_LOCALE, isLocale } from '@/lib/constants'
import { toRelativeMediaUrl } from '@/lib/media-url'
import { getGlobal } from '@/lib/payload'
import type { SeoDefault, SiteSetting } from '@/payload-types'
import './globals.css'

/*
 * Berkas font ikut disimpan di dalam repositori dan dimuat lewat
 * `next/font/local` (prd.md §10.3).
 *
 * `next/font/google` sempat dipakai, tetapi mengunduh font saat build: setiap
 * build pada cache kosong bergantung pada jaringan ke Google, dan gagal di
 * lingkungan dengan egress terbatas seperti `docker build`. Keduanya font
 * variabel, jadi satu berkas melayani seluruh bobot yang dipakai.
 */
const jakarta = localFont({
  src: '../../fonts/plus-jakarta-sans-latin-variable.woff2',
  weight: '200 800',
  style: 'normal',
  variable: '--font-jakarta',
  display: 'swap',
  preload: true,
})

const inter = localFont({
  src: '../../fonts/inter-latin-variable.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const FALLBACK_COMPANY_NAME = 'PT Sabhumi Karya Barito'

export const generateMetadata = async (): Promise<Metadata> => {
  // Halaman error bawaan ikut diprerender saat build, ketika database belum
  // terjangkau. Nilai bawaan dipakai agar build tidak gagal karenanya.
  if (isBuildPhase()) {
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
      title: { default: FALLBACK_COMPANY_NAME, template: `%s | ${FALLBACK_COMPANY_NAME}` },
    }
  }

  const [site, seo] = await Promise.all([
    // depth 1 agar relasi favicon ikut ter-populate.
    getGlobal<SiteSetting>('site-settings', DEFAULT_LOCALE, 1),
    getGlobal<SeoDefault>('seo-defaults', DEFAULT_LOCALE, 0),
  ])

  const companyName = site.companyName || FALLBACK_COMPANY_NAME
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
    // Favicon dari panel admin bila diunggah; bila tidak, `src/app/icon.svg`
    // yang dipakai lewat konvensi berkas Next.js.
    icons:
      site.favicon && typeof site.favicon === 'object' && site.favicon.url
        ? { icon: toRelativeMediaUrl(site.favicon.url) }
        : undefined,
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
