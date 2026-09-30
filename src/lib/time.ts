/**
 * Helper waktu untuk Server Component.
 *
 * Dikumpulkan di sini, bukan dipanggil langsung di badan komponen, agar
 * pembacaan waktu berjalan tetap terkumpul di satu tempat dan mudah diganti
 * bila nanti perlu dites dengan waktu palsu.
 */

/** Apakah tanggal ini sudah lewat? Nilai kosong dianggap belum lewat. */
export const isPast = (value?: string | null): boolean => {
  if (!value) return false
  return new Date(value).getTime() < Date.now()
}

/** Apakah tanggal ini masih di masa depan? Nilai kosong dianggap tidak. */
export const isFuture = (value?: string | null): boolean => {
  if (!value) return false
  return new Date(value).getTime() > Date.now()
}

/** Waktu sekarang dalam ISO — dipakai pada klausa `where` query. */
export const nowIso = (): string => new Date().toISOString()
