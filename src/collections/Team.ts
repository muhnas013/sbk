import type { CollectionConfig } from 'payload'
import { anyone, contentEditor, superAdminOnly } from '@/access'
import { orderField } from '@/fields/order'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Anggota Tim', plural: 'Tim Manajemen' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'showOnHomepage', 'order'],
    group: 'Profil Perusahaan',
  },
  access: {
    read: anyone,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nama Lengkap', required: true },
    { name: 'position', type: 'text', label: 'Jabatan', localized: true, required: true },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto', required: true },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biografi Singkat',
      localized: true,
      maxLength: 600,
    },
    {
      type: 'row',
      fields: [
        { name: 'linkedin', type: 'text', label: 'LinkedIn (URL)', admin: { width: '50%' } },
        { name: 'email', type: 'email', label: 'Email', admin: { width: '50%' } },
      ],
    },
    {
      name: 'showOnHomepage',
      type: 'checkbox',
      label: 'Tampilkan di Beranda',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    orderField,
  ],
}
