import type { NavItem } from '@/components/layout/header'
import type { FooterColumn } from '@/components/layout/footer'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/lib/constants'

/**
 * Struktur navigasi bawaan. Dipakai sebagai fallback bila global `navigation`
 * di panel admin belum diisi, sehingga situs tidak pernah tampil tanpa menu.
 */
export const defaultHeaderNav = (locale: Locale, dict: Dictionary): NavItem[] => {
  const base = `/${locale}`
  return [
    { label: dict.nav.about, href: `${base}/tentang-kami` },
    { label: dict.nav.services, href: `${base}/layanan` },
    { label: dict.nav.projects, href: `${base}/proyek` },
    { label: dict.nav.legal, href: `${base}/legalitas` },
    { label: dict.nav.clients, href: `${base}/klien` },
    { label: dict.nav.news, href: `${base}/berita` },
    { label: dict.nav.careers, href: `${base}/karier` },
  ]
}

export const defaultFooterColumns = (locale: Locale, dict: Dictionary): FooterColumn[] => {
  const base = `/${locale}`
  return [
    {
      title: locale === 'id' ? 'Tautan Cepat' : 'Quick Links',
      items: [
        { label: dict.nav.about, href: `${base}/tentang-kami` },
        { label: dict.nav.projects, href: `${base}/proyek` },
        { label: dict.nav.news, href: `${base}/berita` },
        { label: dict.nav.careers, href: `${base}/karier` },
        { label: dict.nav.downloads, href: `${base}/unduhan` },
      ],
    },
    {
      title: dict.nav.divisions,
      items: [
        {
          label: locale === 'id' ? 'Konstruksi' : 'Construction',
          href: `${base}/divisi/konstruksi`,
        },
        {
          label: locale === 'id' ? 'Konsultansi & Perencanaan' : 'Consulting & Planning',
          href: `${base}/divisi/konsultansi`,
        },
        {
          label: locale === 'id' ? 'Pengadaan & Supplier' : 'Procurement & Supply',
          href: `${base}/divisi/supplier`,
        },
        {
          label: locale === 'id' ? 'Jasa Lainnya' : 'Other Services',
          href: `${base}/divisi/jasa-lainnya`,
        },
      ],
    },
  ]
}
