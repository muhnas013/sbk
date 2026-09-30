/**
 * Menghapus lamaran kerja yang lebih tua dari masa retensi.
 *
 * Kewajiban minimalisasi data pada UU No. 27/2022 (PDP): data pelamar tidak
 * boleh disimpan lebih lama dari keperluannya. Dijalankan lewat cron harian.
 *
 * Jalankan: `npx tsx --env-file=.env src/scripts/purge-applications.ts`
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const RETENTION_MONTHS = Number(process.env.APPLICATION_RETENTION_MONTHS || 12)

const run = async () => {
  const payload = await getPayload({ config })

  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS)

  const expired = await payload.find({
    collection: 'job-applications',
    where: { createdAt: { less_than: cutoff.toISOString() } },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  if (expired.totalDocs === 0) {
    payload.logger.info('Tidak ada lamaran yang melewati masa retensi.')
    process.exit(0)
  }

  for (const doc of expired.docs) {
    await payload.delete({
      collection: 'job-applications',
      id: doc.id,
      overrideAccess: true,
    })
  }

  payload.logger.info(
    `${expired.docs.length} lamaran lebih tua dari ${RETENTION_MONTHS} bulan dihapus (termasuk berkas CV-nya).`,
  )
  process.exit(0)
}

run().catch((error) => {
  console.error('Pembersihan lamaran gagal:', error)
  process.exit(1)
})
