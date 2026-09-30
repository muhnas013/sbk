import type { CollectionConfig } from 'payload'
import { adminOnly, selfOrSuperAdmin, superAdminFieldAccess, superAdminOnly } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Pengguna', plural: 'Pengguna' },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 jam
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // kunci 15 menit setelah 5 percobaan gagal
    useAPIKey: false,
    cookies: {
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'isActive'],
    group: 'Sistem',
  },
  access: {
    read: selfOrSuperAdmin,
    create: superAdminOnly,
    update: selfOrSuperAdmin,
    delete: superAdminOnly,
    admin: ({ req: { user } }) =>
      Boolean(user && (user as { isActive?: boolean }).isActive !== false),
    unlock: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nama Lengkap',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Peran',
      required: true,
      defaultValue: 'editor',
      access: {
        // Hanya Super Admin yang boleh mengubah peran — mencegah eskalasi hak akses.
        create: superAdminFieldAccess,
        update: superAdminFieldAccess,
      },
      options: [
        { label: 'Super Admin — akses penuh termasuk manajemen pengguna', value: 'super-admin' },
        { label: 'Admin — seluruh konten & pengaturan situs', value: 'admin' },
        { label: 'Editor — kelola konten saja', value: 'editor' },
        { label: 'HR — hanya modul karier & lamaran', value: 'hr' },
        { label: 'Viewer — baca saja', value: 'viewer' },
      ],
      admin: {
        description: 'Menentukan modul apa saja yang dapat diakses pengguna ini.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Akun Aktif',
      defaultValue: true,
      access: {
        create: superAdminFieldAccess,
        update: superAdminFieldAccess,
      },
      admin: {
        position: 'sidebar',
        description: 'Nonaktifkan untuk mencabut akses tanpa menghapus riwayat aktivitas pengguna.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Profil',
      admin: { position: 'sidebar' },
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      label: 'Terakhir Login',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'd MMM yyyy HH:mm' },
      },
    },
  ],
  hooks: {
    afterLogin: [
      async ({ req, user }) => {
        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: { lastLoginAt: new Date().toISOString() },
          overrideAccess: true,
          context: { skipRevalidate: true },
        })
      },
    ],
  },
  timestamps: true,
}
