import { APIError, type CollectionConfig } from 'payload'
import { hrAccess, superAdminOnly } from '@/access'
import { ALLOWED_CV_MIME, UPLOAD_LIMITS } from '@/lib/constants'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: { singular: 'Lamaran', plural: 'Lamaran Masuk' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'job', 'email', 'status', 'createdAt'],
    group: 'Karier',
    description:
      'Data pelamar. Berisi data pribadi — akses terbatas dan dihapus otomatis setelah 12 bulan.',
  },
  access: {
    read: hrAccess,
    // Dibuat lewat route handler khusus (`overrideAccess`), bukan langsung dari publik.
    create: () => false,
    update: hrAccess,
    delete: superAdminOnly,
  },
  upload: {
    staticDir: process.env.PAYLOAD_CV_DIR || 'media/applications',
    mimeTypes: ALLOWED_CV_MIME,
    // Berkas CV tidak boleh dijangkau tanpa autentikasi.
    disableLocalStorage: false,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nama Pelamar', required: true },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'Email', required: true, admin: { width: '50%' } },
        { name: 'phone', type: 'text', label: 'Telepon', required: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      label: 'Lowongan yang Dilamar',
      required: true,
    },
    { name: 'coverLetter', type: 'textarea', label: 'Surat Lamaran' },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'Menyetujui Pemrosesan Data Pribadi',
      required: true,
      admin: {
        readOnly: true,
        description: 'Persetujuan wajib sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi.',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status Seleksi',
      defaultValue: 'new',
      options: [
        { label: 'Baru', value: 'new' },
        { label: 'Ditinjau', value: 'reviewing' },
        { label: 'Wawancara', value: 'interview' },
        { label: 'Ditolak', value: 'rejected' },
        { label: 'Diterima', value: 'accepted' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Catatan Internal',
      admin: { description: 'Tidak pernah ditampilkan ke pelamar.' },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        const size = req.file?.size
        if (typeof size === 'number' && size > UPLOAD_LIMITS.cv) {
          const limitMb = Math.round(UPLOAD_LIMITS.cv / (1024 * 1024))
          throw new APIError(`Ukuran CV melebihi batas ${limitMb} MB.`, 400)
        }
        return data
      },
    ],
  },
  timestamps: true,
}
