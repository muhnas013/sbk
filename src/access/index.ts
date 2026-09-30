import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

export type Role = 'super-admin' | 'admin' | 'editor' | 'hr' | 'viewer'

const roleOf = (user: unknown): Role | null => {
  const role = (user as User | null | undefined)?.role
  return (role as Role) ?? null
}

const hasRole =
  (...roles: Role[]): Access =>
  ({ req: { user } }) => {
    const role = roleOf(user)
    return role !== null && roles.includes(role)
  }

/** Siapa pun, termasuk pengunjung yang belum login. */
export const anyone: Access = () => true

/** Hanya pengguna yang sudah login (peran apa pun). */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Super Admin saja — untuk manajemen pengguna & penghapusan permanen. */
export const superAdminOnly = hasRole('super-admin')

/** Super Admin & Admin — untuk pengaturan situs. */
export const adminOnly = hasRole('super-admin', 'admin')

/** Semua peran yang boleh menyunting konten. */
export const contentEditor = hasRole('super-admin', 'admin', 'editor')

/** Modul karier: HR ikut memiliki akses. */
export const hrAccess = hasRole('super-admin', 'admin', 'hr')

/** Baca konten publik: terbit untuk umum, draft hanya untuk yang login. */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

/** Field-level: hanya Super Admin. */
export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) =>
  roleOf(user) === 'super-admin'

/** Pengguna hanya boleh menyunting dirinya sendiri, kecuali Super Admin. */
export const selfOrSuperAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (roleOf(user) === 'super-admin') return true
  return { id: { equals: user.id } }
}

export { hasRole }
