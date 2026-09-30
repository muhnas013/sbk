import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAuthenticated, superAdminOnly } from '@/access'
import { richTextField } from '@/fields/richText'
import { slugField } from '@/fields/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Berita', plural: 'Berita & Artikel' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Berita',
  },
  access: {
    read: publishedOrAuthenticated,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', label: 'Judul', localized: true, required: true },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Ringkasan',
      localized: true,
      maxLength: 300,
      admin: { description: 'Tampil di daftar berita dan pratinjau saat dibagikan.' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar Utama',
      required: true,
    },
    richTextField({ name: 'content', label: 'Isi Artikel', required: true }),
    slugField(),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'post-categories',
      label: 'Kategori',
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Penulis',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Tanggal Publikasi',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'd MMM yyyy HH:mm' },
        description: 'Boleh diisi tanggal mendatang untuk menjadwalkan publikasi.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tag',
      labels: { singular: 'Tag', plural: 'Tag' },
      admin: { position: 'sidebar' },
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Isi otomatis penulis dan tanggal terbit agar editor tidak perlu mengisinya manual.
        if (operation === 'create' && !data.author && req.user) {
          data.author = req.user.id
        }
        if (data._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
