/**
 * Membuat (atau mengatur ulang) akun Super Admin tanpa melewati halaman
 * pendaftaran pengguna pertama di `/admin/create-first-user`.
 *
 * Halaman itu terbuka bagi siapa pun selama tabel pengguna masih kosong —
 * pada situs yang sudah dapat diakses publik, itu berarti orang pertama yang
 * menemukannya bisa mengambil alih panel. Menjalankan script ini segera
 * setelah deploy menutup celah tersebut.
 *
 * Halaman itu sendiri bekerja — pilihan Peran ikut ditampilkan, dan Payload
 * membuat penggunanya dengan `overrideAccess`, jadi Super Admin bisa dipilih
 * di sana. Masalahnya murni soal siapa yang sempat mengisinya lebih dulu.
 *
 * Pengembangan : ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run create:admin
 * Server       : docker compose --profile tools run --rm create-admin
 *
 * Bila akunnya sudah ada, kata sandinya diperbarui — jadi script ini sekaligus
 * jalan pemulihan ketika Super Admin kehilangan akses.
 */
import { getPayload } from 'payload'
import config from '../payload.config'

/** Sejalan dengan kebijakan di `src/collections/Users.ts`. */
const MIN_PASSWORD_LENGTH = 12

/**
 * Memeriksa lebih dahulu supaya kesalahan pengisian terlihat jelas tanpa perlu
 * menyentuh database. Koleksi Users menegakkan aturan yang sama saat menyimpan.
 */
const periksaMasukan = (email?: string, password?: string): string | null => {
  if (!email) return 'ADMIN_EMAIL wajib diisi.'
  if (!password) return 'ADMIN_PASSWORD wajib diisi.'
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `ADMIN_PASSWORD minimal ${MIN_PASSWORD_LENGTH} karakter.`
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'ADMIN_PASSWORD harus memuat huruf kecil, huruf besar, dan angka.'
  }
  return null
}

const run = async () => {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || 'Administrator'

  const masalah = periksaMasukan(email, password)
  if (masalah || !email || !password) {
    console.error(`Gagal: ${masalah}`)
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  const [pengguna] = existing.docs

  if (pengguna) {
    await payload.update({
      collection: 'users',
      id: pengguna.id,
      data: { password, role: 'super-admin', isActive: true },
      overrideAccess: true,
    })
    console.log(`Kata sandi ${email} diperbarui, peran dipastikan Super Admin.`)
  } else {
    await payload.create({
      collection: 'users',
      data: { name, email, password, role: 'super-admin', isActive: true },
      overrideAccess: true,
    })
    console.log(`Akun Super Admin ${email} dibuat.`)
  }

  const total = await payload.count({ collection: 'users', overrideAccess: true })
  console.log(`Jumlah pengguna sekarang: ${total.totalDocs}.`)
  console.log('Halaman /admin/create-first-user tidak lagi dapat diakses.')

  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
