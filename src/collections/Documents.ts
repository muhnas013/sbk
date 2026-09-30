import { APIError, type CollectionConfig } from 'payload'
import { anyone, contentEditor, superAdminOnly } from '@/access'
import { orderField } from '@/fields/order'
import { ALLOWED_DOC_MIME, UPLOAD_LIMITS } from '@/lib/constants'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Dokumen', plural: 'Pusat Unduhan' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'downloadCount', 'isPublic'],
    group: 'Konten',
    description: 'Company profile, brosur, katalog, dan formulir yang dapat diunduh pengunjung.',
  },
  access: {
    read: anyone,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  upload: {
    staticDir: process.env.PAYLOAD_DOCS_DIR || 'media/documents',
    mimeTypes: ALLOWED_DOC_MIME,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Judul Dokumen', localized: true, required: true },
    { name: 'description', type: 'textarea', label: 'Deskripsi', localized: true },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      defaultValue: 'company-profile',
      options: [
        { label: 'Company Profile', value: 'company-profile' },
        { label: 'Brosur Divisi', value: 'brochure' },
        { label: 'Katalog Produk', value: 'catalog' },
        { label: 'Formulir', value: 'form' },
        { label: 'Legalitas', value: 'legal' },
        { label: 'Lainnya', value: 'other' },
      ],
    },
    {
      name: 'downloadCount',
      type: 'number',
      label: 'Jumlah Unduhan',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      label: 'Tampilkan di Pusat Unduhan',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    orderField,
  ],
  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        const size = req.file?.size
        if (typeof size === 'number' && size > UPLOAD_LIMITS.document) {
          const limitMb = Math.round(UPLOAD_LIMITS.document / (1024 * 1024))
          throw new APIError(`Ukuran berkas melebihi batas ${limitMb} MB.`, 400)
        }
        return data
      },
    ],
  },
}
