import type { CollectionConfig } from 'payload'
import { anyone, contentEditor, superAdminOnly } from '@/access'
import { orderField } from '@/fields/order'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimoni', plural: 'Testimoni' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'organization', 'isActive', 'order'],
    group: 'Profil Perusahaan',
  },
  access: {
    read: anyone,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      label: 'Kutipan',
      localized: true,
      required: true,
      maxLength: 500,
    },
    { name: 'name', type: 'text', label: 'Nama', required: true },
    { name: 'position', type: 'text', label: 'Jabatan', localized: true },
    { name: 'organization', type: 'text', label: 'Instansi / Perusahaan' },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto' },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Proyek Terkait',
      admin: { position: 'sidebar' },
    },
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
