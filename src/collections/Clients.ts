import type { CollectionConfig } from 'payload'
import { anyone, contentEditor, superAdminOnly } from '@/access'
import { orderField } from '@/fields/order'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Klien / Mitra', plural: 'Klien & Mitra' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'isActive', 'order'],
    group: 'Profil Perusahaan',
    description: 'Pastikan ada izin penggunaan logo sebelum menayangkannya.',
  },
  access: {
    read: anyone,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nama Klien / Mitra', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      required: true,
      admin: { description: 'Disarankan SVG atau PNG latar transparan.' },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      required: true,
      defaultValue: 'private',
      options: [
        { label: 'Pemerintah', value: 'government' },
        { label: 'BUMN / BUMD', value: 'soe' },
        { label: 'Swasta', value: 'private' },
      ],
    },
    { name: 'website', type: 'text', label: 'Website' },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Tampilkan',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    orderField,
  ],
}
