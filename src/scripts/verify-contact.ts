/**
 * Verifikasi jalur penyimpanan pesan kontak tanpa melalui peramban:
 * memastikan bentuk data yang dikirim server action diterima koleksi,
 * dan bahwa publik tetap tidak boleh membuat data secara langsung.
 *
 * Jalankan: `npx tsx --env-file=.env src/scripts/verify-contact.ts`
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const run = async () => {
  const payload = await getPayload({ config })

  const created = await payload.create({
    collection: 'contact-submissions',
    overrideAccess: true,
    data: {
      name: 'Penguji Otomatis',
      email: 'penguji@contoh.test',
      phone: '08123456789',
      company: 'Instansi Uji',
      subject: 'Uji jalur form kontak',
      message: 'Pesan uji untuk memastikan data tersimpan dengan benar.',
      isRead: false,
      ipAddress: '127.0.0.1',
      userAgent: 'verify-script',
    },
  })
  console.log('✓ Pesan tersimpan, id =', created.id)

  try {
    await payload.create({
      collection: 'contact-submissions',
      overrideAccess: false,
      data: { name: 'Bot', email: 'bot@contoh.test', subject: 'x', message: 'y' },
    })
    console.error('✗ GAGAL: publik seharusnya tidak boleh membuat pesan langsung.')
    process.exit(1)
  } catch {
    console.log('✓ Pembuatan langsung oleh publik ditolak, sesuai harapan.')
  }

  await payload.delete({ collection: 'contact-submissions', id: created.id, overrideAccess: true })
  console.log('✓ Data uji dibersihkan.')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
