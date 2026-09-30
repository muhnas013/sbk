import type { CollectionConfig } from 'payload'
import { adminOnly, superAdminOnly } from '@/access'

export const ActivityLogs: CollectionConfig = {
  slug: 'activity-logs',
  labels: { singular: 'Log Aktivitas', plural: 'Log Aktivitas' },
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'action', 'collectionLabel', 'user', 'createdAt'],
    group: 'Sistem',
    description: 'Catatan perubahan konten. Hanya dapat dibaca — tidak dapat disunting.',
  },
  access: {
    read: adminOnly,
    // Ditulis hanya oleh hook internal; tidak ada jalur pembuatan manual.
    create: () => false,
    update: () => false,
    delete: superAdminOnly,
  },
  fields: [
    { name: 'summary', type: 'text', label: 'Ringkasan', admin: { readOnly: true } },
    {
      name: 'action',
      type: 'select',
      label: 'Aksi',
      admin: { readOnly: true },
      options: [
        { label: 'Dibuat', value: 'create' },
        { label: 'Diubah', value: 'update' },
        { label: 'Dihapus', value: 'delete' },
      ],
    },
    { name: 'collectionLabel', type: 'text', label: 'Koleksi', admin: { readOnly: true } },
    { name: 'documentId', type: 'text', label: 'ID Dokumen', admin: { readOnly: true } },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Pengguna',
      admin: { readOnly: true },
    },
    { name: 'userEmail', type: 'text', label: 'Email Pengguna', admin: { readOnly: true } },
  ],
  timestamps: true,
}
