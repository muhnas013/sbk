import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '@/access'

export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO Bawaan',
  admin: { group: 'Pengaturan' },
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      name: 'defaultTitle',
      type: 'text',
      label: 'Judul Bawaan',
      localized: true,
      admin: { description: 'Dipakai bila halaman tidak punya judul SEO sendiri.' },
    },
    {
      name: 'titleTemplate',
      type: 'text',
      label: 'Template Judul',
      defaultValue: '%s | PT Sabhumi Karya Barito',
      admin: { description: '%s diganti dengan judul halaman.' },
    },
    {
      name: 'defaultDescription',
      type: 'textarea',
      label: 'Deskripsi Bawaan',
      localized: true,
      maxLength: 160,
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar Bagikan Bawaan (OG Image)',
      admin: { description: 'Rasio 1200×630 piksel.' },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Cegah Seluruh Situs Diindeks Mesin Pencari',
      defaultValue: false,
      admin: {
        description:
          'Aktifkan hanya untuk lingkungan staging. Jangan pernah aktif di situs produksi.',
      },
    },
  ],
}
