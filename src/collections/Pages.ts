import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAuthenticated, superAdminOnly } from '@/access'
import { allBlocks } from '@/blocks'
import { slugField } from '@/fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Halaman', plural: 'Halaman Statis' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Konten',
    description:
      'Halaman bebas yang disusun dari blok — mis. Kebijakan Privasi, K3/HSE, Syarat Penggunaan.',
  },
  access: {
    read: publishedOrAuthenticated,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', label: 'Judul Halaman', localized: true, required: true },
    slugField(),
    {
      name: 'layout',
      type: 'blocks',
      label: 'Susunan Konten',
      labels: { singular: 'Blok', plural: 'Blok' },
      blocks: allBlocks,
    },
  ],
}
