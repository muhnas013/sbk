import type { CollectionConfig } from 'payload'
import { hrAccess, publishedOrAuthenticated, superAdminOnly } from '@/access'
import { bulletListField } from '@/fields/listItems'
import { richTextField } from '@/fields/richText'
import { slugField } from '@/fields/slug'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Lowongan', plural: 'Lowongan Kerja' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'division', 'location', 'closingDate', 'vacancyStatus'],
    group: 'Karier',
  },
  access: {
    read: publishedOrAuthenticated,
    create: hrAccess,
    update: hrAccess,
    delete: superAdminOnly,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', label: 'Nama Posisi', localized: true, required: true },
    slugField(),
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', label: 'Lokasi Penempatan', admin: { width: '50%' } },
        {
          name: 'headcount',
          type: 'number',
          label: 'Jumlah Dibutuhkan',
          defaultValue: 1,
          min: 1,
          admin: { width: '50%', step: 1 },
        },
      ],
    },
    {
      name: 'employmentType',
      type: 'select',
      label: 'Tipe Pekerjaan',
      required: true,
      defaultValue: 'full-time',
      options: [
        { label: 'Karyawan Tetap', value: 'full-time' },
        { label: 'Kontrak', value: 'contract' },
        { label: 'Harian / Borongan', value: 'temporary' },
        { label: 'Magang', value: 'internship' },
      ],
    },
    richTextField({ name: 'description', label: 'Deskripsi Pekerjaan', required: true }),
    bulletListField({
      name: 'responsibilities',
      label: 'Tanggung Jawab',
      itemLabel: 'Tanggung jawab',
    }),
    bulletListField({ name: 'qualifications', label: 'Kualifikasi', itemLabel: 'Kualifikasi' }),
    bulletListField({ name: 'benefits', label: 'Benefit', itemLabel: 'Benefit' }),
    {
      name: 'division',
      type: 'relationship',
      relationTo: 'divisions',
      label: 'Divisi',
      admin: { position: 'sidebar' },
    },
    {
      name: 'closingDate',
      type: 'date',
      label: 'Batas Lamaran',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'Lowongan otomatis tidak menerima lamaran setelah tanggal ini.',
      },
    },
    {
      // Dinamai `vacancyStatus` agar tidak bentrok dengan enum `_status`
      // bawaan fitur draft Payload.
      name: 'vacancyStatus',
      type: 'select',
      label: 'Status Lowongan',
      defaultValue: 'open',
      options: [
        { label: 'Dibuka', value: 'open' },
        { label: 'Ditutup', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
