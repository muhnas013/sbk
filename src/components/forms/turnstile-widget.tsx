'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string
      reset: (id?: string) => void
    }
  }
}

/**
 * Widget Cloudflare Turnstile. Tidak dirender bila site key belum diisi,
 * sehingga form tetap dapat dipakai saat pengembangan lokal.
 */
export const TurnstileWidget = ({ onToken }: { onToken: (token: string) => void }) => {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!siteKey || !loaded || !containerRef.current || !window.turnstile) return
    window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onToken,
      theme: 'light',
    })
  }, [siteKey, loaded, onToken])

  if (!siteKey) return null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onLoad={() => setLoaded(true)}
        strategy="lazyOnload"
      />
      <div ref={containerRef} />
    </>
  )
}
