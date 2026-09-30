import type { CollectionConfig } from 'payload'
import { adminOnly, contentEditor } from '@/access'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Pesan Masuk', plural: 'Pesan Masuk' },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['name', 'subject', 'email', 'isRead', 'createdAt'],
    group: 'Pesan',
    description: 'Pengajuan dari form kontak situs.',
  },
  access: {
    read: contentEditor,
    // Dibuat lewat route handler form (`overrideAccess`), bukan langsung dari publik.
    create: () => false,
    update: contentEditor,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nama', required: true },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'Email', required: true, admin: { width: '50%' } },
        { name: 'phone', type: 'text', label: 'Telepon', admin: { width: '50%' } },
      ],
    },
    { name: 'company', type: 'text', label: 'Perusahaan / Instansi' },
    {
      name: 'division',
      type: 'relationship',
      relationTo: 'divisions',
      label: 'Divisi yang Dituju',
    },
    { name: 'subject', type: 'text', label: 'Subjek', required: true },
    { name: 'message', type: 'textarea', label: 'Pesan', required: true },
    {
      name: 'isRead',
      type: 'checkbox',
      label: 'Sudah Dibaca',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Catatan Internal',
      admin: { position: 'sidebar' },
    },
    {
      type: 'collapsible',
      label: 'Metadata Pengiriman',
      admin: { initCollapsed: true },
      fields: [
        { name: 'ipAddress', type: 'text', label: 'Alamat IP', admin: { readOnly: true } },
        { name: 'userAgent', type: 'text', label: 'User Agent', admin: { readOnly: true } },
      ],
    },
  ],
  hooks: {
    afterDelete: [
      ({ req, doc }) => {
        req.payload.logger.info(`Pesan masuk dihapus: ${doc.id} (${doc.email})`)
      },
    ],
  },
  timestamps: true,
}
