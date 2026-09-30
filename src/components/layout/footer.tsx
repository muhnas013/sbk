import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { SiteLogo } from '@/components/layout/site-logo'
import { Container } from '@/components/ui/container'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/lib/constants'
import type { Media } from '@/payload-types'

export type FooterColumn = {
  title: string
  items: { label: string; href: string }[]
}

export type FooterContact = {
  address?: string | null
  phone?: string | null
  email?: string | null
  socials?: { platform: string; url: string }[]
}

export const Footer = ({
  locale,
  dict,
  companyName,
  tagline,
  columns,
  contact,
  legalNote,
  logo,
}: {
  locale: Locale
  dict: Dictionary
  companyName: string
  tagline?: string | null
  columns: FooterColumn[]
  contact: FooterContact
  legalNote?: string | null
  logo?: number | Media | null
}) => (
  <footer className="tone-dark bg-ink text-paper">
    <Container className="grid gap-12 py-16 lg:grid-cols-4 lg:py-20">
      <div className="lg:col-span-1">
        <SiteLogo href={`/${locale}`} logo={logo} companyName={companyName} />
        {tagline && <p className="mt-4 text-xs leading-relaxed text-stone-light">{tagline}</p>}
        {legalNote && <p className="mt-6 text-xs text-stone-light">{legalNote}</p>}
      </div>

      {columns.map((column) => (
        <nav key={column.title} aria-label={column.title}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--accent-text)]">
            {column.title}
          </h2>
          <ul className="mt-5 space-y-3">
            {column.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs text-stone-light transition-colors hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--accent-text)]">
          {dict.nav.contact}
        </h2>
        <ul className="mt-5 space-y-4 text-xs text-stone-light">
          {contact.address && (
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="leading-relaxed">{contact.address}</span>
            </li>
          )}
          {contact.phone && (
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-paper">
                {contact.phone}
              </a>
            </li>
          )}
          {contact.email && (
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="hover:text-paper">
                {contact.email}
              </a>
            </li>
          )}
        </ul>

        {contact.socials && contact.socials.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-4">
            {contact.socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-wide text-stone-light transition-colors hover:text-paper"
                >
                  {social.platform}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>

    <div className="border-t border-white/10">
      <Container className="flex flex-col gap-3 py-6 text-xs text-stone-light sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {companyName}.{' '}
          {locale === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.'}
        </p>
        <div className="flex gap-6">
          <Link href={`/${locale}/kebijakan-privasi`} className="hover:text-paper">
            {locale === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
          </Link>
          <Link href={`/${locale}/syarat-penggunaan`} className="hover:text-paper">
            {locale === 'id' ? 'Syarat Penggunaan' : 'Terms of Use'}
          </Link>
        </div>
      </Container>
    </div>
  </footer>
)
