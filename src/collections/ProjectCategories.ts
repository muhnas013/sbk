import type { CollectionConfig } from 'payload'
import { anyone, contentEditor, superAdminOnly } from '@/access'
import { slugField } from '@/fields/slug'

export const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  labels: { singular: 'Kategori Proyek', plural: 'Kategori Proyek' },
  admin: {
    useAsTitle: 'name',
    group: 'Proyek',
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
