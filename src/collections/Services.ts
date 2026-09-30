import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAuthenticated, superAdminOnly } from '@/access'
import { bulletListField, faqField, stepListField } from '@/fields/listItems'
import { orderField } from '@/fields/order'
import { richTextField } from '@/fields/richText'
import { slugField } from '@/fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Layanan', plural: 'Layanan' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'division', 'featured', 'order'],
    group: 'Profil Perusahaan',
  },
  access: {
    read: publishedOrAuthenticated,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  versions: { drafts: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Konten',
          fields: [
            { name: 'title', type: 'text', label: 'Nama Layanan', localized: true, required: true },
            {
              name: 'summary',
              type: 'textarea',
              label: 'Ringkasan',
              localized: true,
              maxLength: 300,
            },
            richTextField({ name: 'description', label: 'Deskripsi Lengkap' }),
            bulletListField({ name: 'scope', label: 'Lingkup Pekerjaan', itemLabel: 'Pekerjaan' }),
            stepListField({ name: 'process', label: 'Alur Kerja' }),
            faqField,
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Gambar Sampul' },
            {
              name: 'gallery',
              type: 'array',
              label: 'Galeri',
              labels: { singular: 'Foto', plural: 'Galeri' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text', label: 'Keterangan', localized: true },
              ],
            },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'division',
      type: 'relationship',
      relationTo: 'divisions',
      label: 'Divisi',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Tampilkan di Beranda',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    orderField,
  ],
}
