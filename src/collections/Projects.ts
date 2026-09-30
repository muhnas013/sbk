import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAuthenticated, superAdminOnly } from '@/access'
import { bulletListField } from '@/fields/listItems'
import { orderField } from '@/fields/order'
import { richTextField } from '@/fields/richText'
import { slugField } from '@/fields/slug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Proyek', plural: 'Proyek' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'division', 'location', 'yearCompleted', 'projectStatus', 'featured'],
    group: 'Proyek',
    description: 'Portofolio pekerjaan perusahaan.',
  },
  access: {
    read: publishedOrAuthenticated,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Konten',
          fields: [
            { name: 'title', type: 'text', label: 'Nama Proyek', localized: true, required: true },
            {
              name: 'summary',
              type: 'textarea',
              label: 'Ringkasan',
              localized: true,
              maxLength: 400,
              admin: { description: 'Tampil pada kartu di daftar proyek dan hasil pencarian.' },
            },
            richTextField({ name: 'description', label: 'Deskripsi Proyek' }),
            bulletListField({ name: 'scope', label: 'Lingkup Pekerjaan', itemLabel: 'Pekerjaan' }),
          ],
        },
        {
          label: 'Data Proyek',
          fields: [
            {
              name: 'client',
              type: 'text',
              label: 'Pemberi Kerja / Klien',
              admin: { description: 'Nama instansi atau perusahaan pemberi pekerjaan.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'location', type: 'text', label: 'Lokasi', admin: { width: '50%' } },
                { name: 'province', type: 'text', label: 'Provinsi', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'yearStarted',
                  type: 'number',
                  label: 'Tahun Mulai',
                  min: 1980,
                  max: 2100,
                  admin: { width: '50%', step: 1 },
                },
                {
                  name: 'yearCompleted',
                  type: 'number',
                  label: 'Tahun Selesai',
                  min: 1980,
                  max: 2100,
                  admin: { width: '50%', step: 1 },
                },
              ],
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Durasi Pelaksanaan',
              localized: true,
              admin: { description: 'Contoh: 180 hari kalender.' },
            },
            {
              // Dinamai `projectStatus`, bukan `status`, agar enum-nya tidak bentrok
              // dengan enum `_status` bawaan fitur draft Payload.
              name: 'projectStatus',
              type: 'select',
              label: 'Status Pelaksanaan',
              required: true,
              defaultValue: 'completed',
              options: [
                { label: 'Selesai', value: 'completed' },
                { label: 'Berjalan', value: 'ongoing' },
                { label: 'Direncanakan', value: 'planned' },
              ],
            },
            {
              name: 'contractValue',
              type: 'number',
              label: 'Nilai Kontrak (Rupiah)',
              min: 0,
              admin: {
                step: 1000000,
                description: 'Isi angka tanpa titik. Kosongkan bila tidak ingin dicatat.',
              },
            },
            {
              name: 'showContractValue',
              type: 'checkbox',
              label: 'Tampilkan nilai kontrak di situs publik',
              defaultValue: false,
              admin: {
                description:
                  'Nilai kontrak disembunyikan secara bawaan. Aktifkan hanya bila memang boleh dipublikasikan.',
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Gambar Sampul',
              required: true,
              admin: { description: 'Rasio 4:3 disarankan. Dipakai di kartu daftar proyek.' },
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Galeri Foto',
              labels: { singular: 'Foto', plural: 'Galeri Foto' },
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
      name: 'categories',
      type: 'relationship',
      relationTo: 'project-categories',
      hasMany: true,
      label: 'Kategori',
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
