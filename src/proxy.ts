import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/constants'

const PUBLIC_FILE = /\.(.*)$/

/**
 * Arahkan URL tanpa prefix bahasa ke locale yang sesuai.
 * Rute Payload (`/admin`, `/api`) dan berkas statis dilewati.
 *
 * Next.js 16 mengganti konvensi `middleware.ts` menjadi `proxy.ts`.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/media') ||
    pathname === '/health' ||
    pathname.startsWith('/unduh/') ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )

  if (hasLocale) {
    const locale = pathname.split('/')[1] as (typeof LOCALES)[number]
    const headers = new Headers(request.headers)
    // Diteruskan ke root layout agar atribut <html lang> mengikuti locale aktif.
    headers.set('x-locale', locale)
    headers.set('x-pathname', pathname)
    return NextResponse.next({ request: { headers } })
  }

  // Hormati preferensi bahasa peramban, tapi default tetap Bahasa Indonesia.
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const preferred = acceptLanguage.toLowerCase().startsWith('en') ? 'en' : DEFAULT_LOCALE

  const url = request.nextUrl.clone()
  url.pathname = `/${preferred}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
