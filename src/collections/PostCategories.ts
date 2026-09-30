import type { CollectionConfig } from 'payload'
import { anyone, contentEditor, superAdminOnly } from '@/access'
import { slugField } from '@/fields/slug'

export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  labels: { singular: 'Kategori Berita', plural: 'Kategori Berita' },
  admin: {
    useAsTitle: 'name',
    group: 'Berita',
  },
  access: {
    read: anyone,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nama Kategori', localized: true, required: true },
    slugField({ from: 'name' }),
  ],
}
