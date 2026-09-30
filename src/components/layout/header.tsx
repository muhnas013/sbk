'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LocaleSwitcher } from '@/components/layout/locale-switcher'
import { SiteLogo } from '@/components/layout/site-logo'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/lib/constants'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

export type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export const Header = ({
  locale,
  dict,
  items,
  companyName,
  logo,
}: {
  locale: Locale
  dict: Dictionary
  items: NavItem[]
  companyName: string
  logo?: number | Media | null
}) => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Tutup menu mobile setiap kali pindah halaman. Disesuaikan saat render
  // (bukan di dalam effect) agar tidak memicu render berantai.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  // Kunci scroll badan halaman selama drawer terbuka.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled ? 'border-line bg-paper/95 backdrop-blur-sm' : 'border-transparent bg-paper',
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-6">
        <SiteLogo href={`/${locale}`} logo={logo} companyName={companyName} />

        <nav className="hidden items-center gap-7 lg:flex" aria-label={dict.nav.menu}>
          {items.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'text-xs font-medium transition-colors hover:text-[color:var(--accent-text)]',
                  isActive(item.href) ? 'text-[color:var(--accent-text)]' : 'text-ink',
                )}
              >
                {item.label}
              </Link>

              {item.children && item.children.length > 0 && (
                <div className="invisible absolute left-0 top-full w-64 border border-line bg-paper p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-3 py-2 text-xs text-stone transition-colors hover:bg-paper-alt hover:text-ink"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LocaleSwitcher current={locale} />
          <ButtonLink href={`/${locale}/kontak`} size="sm" variant="primary">
            {dict.common.consultation}
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? dict.nav.close : dict.nav.openMenu}
          className="lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-paper lg:hidden">
        <Container className="flex flex-col gap-1 py-6">
          {items.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-sm font-medium"
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block py-2 pl-4 text-xs text-stone"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <LocaleSwitcher current={locale} />
            <ButtonLink href={`/${locale}/kontak`} size="sm">
              {dict.common.consultation}
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  )
}
