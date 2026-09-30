import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '@/access'

const navItemFields = [
  { name: 'label', type: 'text' as const, label: 'Teks Menu', localized: true, required: true },
  {
    name: 'href',
    type: 'text' as const,
    label: 'Tautan',
    required: true,
    admin: {
      description:
        'Tulis tanpa prefix bahasa, contoh: /proyek. Prefix /id atau /en ditambahkan otomatis.',
    },
  },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigasi',
  admin: { group: 'Pengaturan' },
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      name: 'header',
      type: 'array',
      label: 'Menu Header',
      labels: { singular: 'Menu', plural: 'Menu Header' },
      admin: { description: 'Dikosongkan = memakai struktur menu bawaan.' },
      fields: [
        ...navItemFields,
        {
          name: 'children',
          type: 'array',
          label: 'Submenu',
          labels: { singular: 'Submenu', plural: 'Submenu' },
          fields: navItemFields,
        },
      ],
    },
    {
      name: 'footer',
      type: 'array',
      label: 'Kolom Footer',
      labels: { singular: 'Kolom', plural: 'Kolom Footer' },
      fields: [
        { name: 'title', type: 'text', label: 'Judul Kolom', localized: true, required: true },
        {
          name: 'items',
          type: 'array',
          label: 'Tautan',
          labels: { singular: 'Tautan', plural: 'Tautan' },
          fields: navItemFields,
        },
      ],
    },
  ],
}
