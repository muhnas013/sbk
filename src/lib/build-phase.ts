/**
 * Apakah kode ini sedang berjalan pada tahap `next build`?
 *
 * Build berlangsung tanpa akses ke database — baik di CI maupun di dalam
 * `docker build`, keduanya tidak punya koneksi ke Postgres. Rute yang
 * mengambil data saat build karena itu harus punya jalur mundur, dan cukup
 * dibangun saat permintaan pertama datang.
 */
export const isBuildPhase = (): boolean => process.env.NEXT_PHASE === 'phase-production-build'
