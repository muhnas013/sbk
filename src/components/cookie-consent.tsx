'use client'

import { useSyncExternalStore } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import type { Locale } from '@/lib/constants'

const STORAGE_KEY = 'sbk-cookie-consent'

type Consent = 'granted' | 'denied'
type ConsentState = Consent | null

/*
 * Keputusan cookie disimpan di store kecil level modul dan dibaca lewat
 * `useSyncExternalStore`. Dengan begitu nilai awal tidak perlu diset dari
 * dalam effect — render server selalu menghasilkan penanda 'ssr' sehingga
 * tidak ada ketidakcocokan hidrasi.
 */
let cached: ConsentState | undefined
const listeners = new Set<() => void>()

const readConsent = (): ConsentState => {
  if (cached !== undefined) return cached
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    cached = stored === 'granted' || stored === 'denied' ? stored : null
  } catch {
    // Penyimpanan bisa diblokir peramban; anggap belum ada keputusan.
    cached = null
  }
  return cached
}

const writeConsent = (value: Consent) => {
  cached = value
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Keputusan tetap berlaku untuk sesi ini meski gagal disimpan.
  }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const COPY = {
  id: {
    title: 'Situs ini memakai cookie analitik',
    body: 'Kami memakai Google Analytics untuk memahami halaman mana yang paling berguna bagi pengunjung. Tidak ada iklan dan tidak ada data yang dijual. Cookie analitik baru aktif setelah Anda menyetujuinya.',
    accept: 'Setuju',
    decline: 'Tolak',
    policy: 'Kebijakan Privasi',
    policyHref: '/kebijakan-privasi',
  },
  en: {
    title: 'This site uses analytics cookies',
    body: 'We use Google Analytics to understand which pages are most useful to visitors. No advertising, and no data is sold. Analytics cookies are only enabled after you agree.',
    accept: 'Accept',
    decline: 'Decline',
    policy: 'Privacy Policy',
    policyHref: '/privacy-policy',
  },
} as const

/**
 * Banner persetujuan cookie. Skrip Google Analytics baru dimuat setelah
 * pengunjung menyetujui — sebelum itu tidak ada permintaan ke server Google
 * dan tidak ada cookie yang ditanam.
 */
export const CookieConsent = ({
  locale,
  analyticsId,
}: {
  locale: Locale
  analyticsId?: string | null
}) => {
  const consent = useSyncExternalStore<ConsentState | 'ssr'>(subscribe, readConsent, () => 'ssr')
  const copy = COPY[locale]

  // Tidak ada ID analytics → tidak ada cookie yang perlu disetujui.
  if (!analyticsId) return null

  return (
    <>
      {consent === 'granted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analyticsId}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {consent === null && (
        <div
          role="region"
          aria-label={copy.title}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper shadow-[0_-2px_20px_rgba(0,0,0,0.08)]"
        >
          <Container className="flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-heading text-sm font-bold">{copy.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-stone">
                {copy.body}{' '}
                <Link
                  href={`/${locale}${copy.policyHref}`}
                  className="underline underline-offset-2 hover:text-ink"
                >
                  {copy.policy}
                </Link>
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <Button variant="secondary" size="sm" onClick={() => writeConsent('denied')}>
                {copy.decline}
              </Button>
              <Button size="sm" onClick={() => writeConsent('granted')}>
                {copy.accept}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </>
  )
}
