import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { headers } from 'next/headers'
import { DEFAULT_LOCALE, isLocale } from '@/lib/constants'
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: 'PT Sabhumi Karya Barito',
    template: '%s | PT Sabhumi Karya Barito',
  },
  description:
    'Perusahaan konstruksi, konsultan perencanaan, dan pengadaan material yang melayani proyek pemerintah dan swasta.',
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
