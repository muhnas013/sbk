import type { CollectionConfig } from 'payload'
import { adminFieldAccess, anyone, contentEditor, superAdminOnly } from '@/access'
import { orderField } from '@/fields/order'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  labels: { singular: 'Dokumen Legalitas', plural: 'Legalitas & Sertifikasi' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'number', 'issuer', 'validUntil', 'isPublic'],
    group: 'Profil Perusahaan',
    description:
      'Dokumen legal perusahaan. Tampilkan sebagai gambar ber-watermark; hindari mengunggah PDF asli yang dapat diunduh bebas.',
  },
  access: {
    read: anyone,
    create: contentEditor,
    update: contentEditor,
    // Dokumen legal hanya boleh dihapus permanen oleh Super Admin.
    delete: superAdminOnly,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nama Dokumen', localized: true, required: true },
    {
      type: 'row',
      fields: [
        { name: 'number', type: 'text', label: 'Nomor Dokumen', admin: { width: '50%' } },
        { name: 'issuer', type: 'text', label: 'Penerbit', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'issuedAt',
          type: 'date',
          label: 'Tanggal Terbit',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'validUntil',
          type: 'date',
          label: 'Berlaku Sampai',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly' },
            description: 'Kosongkan bila berlaku seumur perusahaan.',
          },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar Dokumen (ber-watermark)',
      admin: { description: 'Unggah versi gambar yang sudah diberi watermark, bukan scan asli.' },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'documents',
      label: 'Berkas PDF (opsional)',
      admin: {
        description:
          'Isi hanya bila dokumen ini memang boleh diunduh publik. Pertimbangkan mengaktifkan "wajib isi form".',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      label: 'Tampilkan di Situs',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'requireFormToDownload',
      type: 'checkbox',
      label: 'Wajib Isi Form Sebelum Unduh',
      defaultValue: true,
      access: { update: adminFieldAccess },
      admin: {
        position: 'sidebar',
        description: 'Pengunjung harus mengisi identitas sebelum berkas dapat diunduh.',
      },
    },
    orderField,
  ],
}
