import type { CollectionConfig } from 'payload'
import { anyone, contentEditor, superAdminOnly } from '@/access'
import { orderField } from '@/fields/order'
import { richTextField } from '@/fields/richText'
import { slugField } from '@/fields/slug'

export const Divisions: CollectionConfig = {
  slug: 'divisions',
  labels: { singular: 'Divisi Usaha', plural: 'Divisi Usaha' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    group: 'Profil Perusahaan',
    description: 'Lini usaha perusahaan. Layanan dan proyek dikelompokkan berdasarkan divisi.',
  },
  access: {
    read: anyone,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nama Divisi',
      localized: true,
      required: true,
    },
    slugField({ from: 'name' }),
    {
      name: 'summary',
      type: 'textarea',
      label: 'Ringkasan',
      localized: true,
      maxLength: 300,
      admin: { description: 'Satu sampai dua kalimat. Tampil di kartu divisi pada beranda.' },
    },
    richTextField({ name: 'description', label: 'Deskripsi Lengkap', localized: true }),
    {
      name: 'icon',
      type: 'select',
      label: 'Ikon',
      defaultValue: 'building',
      options: [
        { label: 'Gedung (konstruksi)', value: 'building' },
        { label: 'Penggaris (perencanaan)', value: 'ruler' },
        { label: 'Truk (pengadaan)', value: 'truck' },
        { label: 'Perkakas (jasa umum)', value: 'wrench' },
        { label: 'Peta (survei)', value: 'map' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar Sampul',
    },
    orderField,
  ],
}
