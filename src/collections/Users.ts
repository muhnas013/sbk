import { APIError, type CollectionConfig } from 'payload'
import { adminOnly, selfOrSuperAdmin, superAdminFieldAccess, superAdminOnly } from '@/access'
import { fingerprintOf, sendNewDeviceAlert } from '@/lib/login-alert'

/** Panjang minimum kata sandi akun admin (prd.md §6.4). */
const MIN_PASSWORD_LENGTH = 12

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
      name: 'knownDevices',
      type: 'array',
      label: 'Perangkat Dikenal',
      admin: {
        readOnly: true,
        description:
          'Sidik jari perangkat yang pernah dipakai login. Hapus seluruh baris untuk memaksa notifikasi login berikutnya.',
      },
      fields: [
        { name: 'fingerprint', type: 'text', required: true },
        { name: 'firstSeenAt', type: 'date' },
      ],
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
    beforeValidate: [
      ({ data, operation }) => {
        // Payload sendiri hanya mewajibkan 3 karakter. Kebijakan perusahaan
        // (prd.md §6.4) meminta minimal 12 karakter untuk seluruh akun admin.
        const password = (data as { password?: unknown } | undefined)?.password
        if (typeof password === 'string' && password.length > 0) {
          if (password.length < MIN_PASSWORD_LENGTH) {
            throw new APIError(`Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`, 400)
          }
          if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            throw new APIError('Kata sandi harus memuat huruf kecil, huruf besar, dan angka.', 400)
          }
        } else if (operation === 'create' && !password) {
          // Pembuatan tanpa kata sandi ditolak lebih awal dengan pesan yang jelas.
          throw new APIError('Kata sandi wajib diisi.', 400)
        }
        return data
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        const ip =
          req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          req.headers.get('x-real-ip') ||
          'tidak diketahui'
        const userAgent = req.headers.get('user-agent') ?? 'tidak diketahui'
        const fingerprint = fingerprintOf(ip, userAgent)

        const known = (user as { knownDevices?: { fingerprint: string }[] }).knownDevices ?? []
        const isNewDevice = !known.some((device) => device.fingerprint === fingerprint)

        // `req` wajib diteruskan agar update ini ikut transaksi login.
        // Tanpa itu, query berjalan di koneksi terpisah dan menunggu lock
        // baris user yang masih dipegang transaksi login — permintaan menggantung.
        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: {
            lastLoginAt: new Date().toISOString(),
            knownDevices: isNewDevice
              ? [...known, { fingerprint, firstSeenAt: new Date().toISOString() }].slice(-20)
              : known,
          },
          overrideAccess: true,
          req,
          context: { skipAudit: true },
        })

        if (isNewDevice && known.length > 0) {
          // Notifikasi dilewati pada login pertama sebuah akun — saat itu setiap
          // perangkat masih "baru" dan emailnya hanya jadi gangguan.
          // Kegagalan kirim email tidak boleh menggagalkan login itu sendiri.
          try {
            await sendNewDeviceAlert({
              req,
              email: user.email,
              name: (user as { name?: string }).name ?? user.email,
              ip,
              userAgent,
            })
          } catch (error) {
            req.payload.logger.warn(`Gagal mengirim notifikasi login baru: ${String(error)}`)
          }
        }
      },
    ],
  },
  timestamps: true,
}
