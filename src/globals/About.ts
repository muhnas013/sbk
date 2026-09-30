import type { GlobalConfig } from 'payload'
import { anyone, contentEditor } from '@/access'
import { richTextField } from '@/fields/richText'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'Tentang Kami',
  admin: {
    group: 'Konten',
    description: 'Profil, sejarah, visi, misi, nilai perusahaan, dan struktur organisasi.',
  },
  access: { read: anyone, update: contentEditor },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profil',
          fields: [
            { name: 'heading', type: 'text', label: 'Judul', localized: true },
            { name: 'intro', type: 'textarea', label: 'Paragraf Pembuka', localized: true },
            richTextField({ name: 'profile', label: 'Profil Perusahaan' }),
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Gambar Pendamping' },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Gambar Kepala Halaman',
            },
          ],
        },
        {
          label: 'Visi & Misi',
          fields: [
            { name: 'vision', type: 'textarea', label: 'Visi', localized: true },
            {
              name: 'mission',
              type: 'array',
              label: 'Misi',
              labels: { singular: 'Butir Misi', plural: 'Misi' },
              localized: true,
              fields: [{ name: 'text', type: 'text', label: 'Butir Misi', required: true }],
            },
          ],
        },
        {
          label: 'Nilai Perusahaan',
          fields: [
            {
              name: 'values',
              type: 'array',
              label: 'Nilai',
              labels: { singular: 'Nilai', plural: 'Nilai' },
              localized: true,
              fields: [
                { name: 'title', type: 'text', label: 'Nama Nilai', required: true },
                { name: 'description', type: 'textarea', label: 'Penjelasan' },
              ],
            },
          ],
        },
        {
          label: 'Sejarah',
          fields: [
            {
              name: 'milestones',
              type: 'array',
              label: 'Tonggak Sejarah',
              labels: { singular: 'Tonggak', plural: 'Tonggak Sejarah' },
              localized: true,
              fields: [
                { name: 'year', type: 'text', label: 'Tahun', required: true },
                { name: 'title', type: 'text', label: 'Judul', required: true },
                { name: 'description', type: 'textarea', label: 'Penjelasan' },
              ],
            },
          ],
        },
        {
          label: 'Struktur Organisasi',
          fields: [
            {
              name: 'orgChart',
              type: 'upload',
              relationTo: 'media',
              label: 'Bagan Struktur Organisasi',
              admin: {
                description: 'Unggah sebagai gambar. Isi alt text agar tetap dapat diakses.',
              },
            },
          ],
        },
      ],
    },
  ],
}
