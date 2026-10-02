/**
 * Mengunduh foto demo dari Wikimedia Commons, menyelaraskan warnanya dengan
 * palet situs, lalu menyimpannya sebagai WebP di `src/scripts/demo-photos/`.
 *
 *   npm run photos              # unduh yang belum ada
 *   npm run photos -- --force   # unduh ulang semuanya
 *
 * `npm run seed` memanggil fungsi yang sama lebih dulu, jadi biasanya script
 * ini tidak perlu dijalankan sendiri. Berkasnya sengaja TIDAK ikut ke dalam
 * repositori (lihat .gitignore) karena ukurannya belasan megabita dan toh akan
 * diganti foto asli perusahaan. Bila pengunduhan gagal — jaringan mati atau
 * Commons sedang menolak — seeding tetap berjalan memakai gambar generatif di
 * `demo-images.ts` sebagai cadangan.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { DEMO_PHOTOS, type DemoPhoto, type DemoPhotoKey } from './demo-photos'

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'demo-photos')

/** Commons menolak permintaan tanpa User-Agent yang bisa dihubungi. */
const USER_AGENT =
  'sbk-website-demo-photos/1.0 (https://sabhumikaryabarito.com; info@sabhumikaryabarito.com)'

/** Sisi panjang berkas yang disimpan. Hero perlu lebih besar karena dipakai lebar penuh. */
const LONG_EDGE = 1600
const LONG_EDGE_WIDE = 2400

const download = async (file: string): Promise<Buffer> => {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=2600`
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
    if (res.ok) return Buffer.from(await res.arrayBuffer())
    // 429 datang saat terlalu banyak permintaan beruntun; sisanya tidak akan
    // membaik dengan menunggu, jadi langsung dilaporkan.
    if (res.status !== 429 && res.status < 500) throw new Error(`${file}: HTTP ${res.status}`)
    await new Promise((resolve) => setTimeout(resolve, attempt * 5000))
  }
  throw new Error(`${file}: gagal setelah beberapa percobaan`)
}

/** Lapisan warna polos untuk menyelaraskan foto dengan palet situs. */
const wash = (hex: string, width: number, height: number, alpha: number) => {
  const value = parseInt(hex.slice(1), 16)
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255, alpha },
    },
  })
    .png()
    .toBuffer()
}

/**
 * Menyelaraskan foto dengan palet situs (prd.md §10): saturasi diturunkan
 * sedikit, kontras dinaikkan tipis, lalu disapu warna `accent-light` pada mode
 * soft-light. Sengaja ringan — foto yang diberi filter tebal terlihat murah dan
 * warnanya justru melawan aksen perunggu, bukan menyatu dengannya.
 */
const grade = async (input: Buffer, wide: boolean): Promise<Buffer> => {
  const longEdge = wide ? LONG_EDGE_WIDE : LONG_EDGE
  const resized = await sharp(input)
    .rotate()
    .resize({ width: longEdge, withoutEnlargement: true })
    .toBuffer()
  const { width = longEdge, height = longEdge } = await sharp(resized).metadata()

  return sharp(resized)
    .modulate({ saturation: 0.78, brightness: 1.03, hue: -4 })
    .linear(1.07, -6)
    .composite([{ input: await wash('#d4a85c', width, height, 0.14), blend: 'soft-light' }])
    .webp({ quality: 74 })
    .toBuffer()
}

const creditsFile = (photos: [string, DemoPhoto][]) => {
  const rows = photos
    .map(
      ([key, photo]) =>
        `| \`${key}\` | [${photo.file.replace(/\.[a-z]+$/i, '')}](${photo.page}) | ${photo.author} | ${photo.license} |`,
    )
    .join('\n')

  return `# Kredit foto demo

Foto di folder ini **bukan** dokumentasi pekerjaan PT Sabhumi Karya Barito.
Semuanya diambil dari Wikimedia Commons sebagai pengisi sementara, dipilih agar
konteks dan komposisi warnanya mendekati tampilan akhir situs, lalu diwarnai
ulang mengikuti palet pada \`src/app/(frontend)/globals.css\`.

Sebelum peluncuran, ganti seluruh berkas ini dengan foto milik perusahaan.
Selama foto demo masih terpasang, lisensinya menuntut dua hal:

- **Atribusi** — sebut pemotret dan lisensinya di halaman tempat foto dipakai,
  atau pada satu halaman kredit yang tertaut dari footer.
- **Berbagi serupa** (khusus lisensi BY-SA) — versi yang sudah diwarnai ulang
  harus dibagikan dengan lisensi yang sama bila disebarkan ulang.

Berkas ini dihasilkan ulang oleh \`npm run photos\`; jangan disunting manual.

| Kunci | Berkas di Commons | Pemotret | Lisensi |
| --- | --- | --- | --- |
${rows}
`
}

/**
 * Memastikan seluruh foto demo tersedia di disk. Mengembalikan jumlah foto yang
 * gagal diunduh — pemanggilnya yang memutuskan apakah itu perlu menghentikan
 * pekerjaan atau cukup diturunkan ke gambar cadangan.
 */
export const ensureDemoPhotos = async ({ force = false } = {}): Promise<{
  downloaded: number
  skipped: number
  failed: string[]
}> => {
  await fs.mkdir(DIR, { recursive: true })

  const photos = Object.entries(DEMO_PHOTOS) as [DemoPhotoKey, DemoPhoto][]
  const failed: string[] = []
  let downloaded = 0
  let skipped = 0

  for (const [key, photo] of photos) {
    const target = path.join(DIR, `${key}.webp`)
    if (!force) {
      const exists = await fs
        .access(target)
        .then(() => true)
        .catch(() => false)
      if (exists) {
        skipped += 1
        continue
      }
    }

    try {
      const graded = await grade(await download(photo.file), photo.wide === true)
      await fs.writeFile(target, graded)
      downloaded += 1
      console.log(`  ${key} — ${Math.round(graded.length / 1024)} kB`)
    } catch (error) {
      failed.push(key)
      console.warn(`  ${key} — gagal: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Jeda singkat supaya tidak dianggap pengerukan massal oleh Commons.
    await new Promise((resolve) => setTimeout(resolve, 400))
  }

  await fs.writeFile(path.join(DIR, 'KREDIT.md'), creditsFile(photos))
  return { downloaded, skipped, failed }
}

const runAsScript =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))

if (runAsScript) {
  const { downloaded, skipped, failed } = await ensureDemoPhotos({
    force: process.argv.includes('--force'),
  })
  console.log(
    `Selesai: ${downloaded} diunduh, ${skipped} sudah ada, ${failed.length} gagal. Kredit diperbarui.`,
  )
  if (failed.length > 0) process.exitCode = 1
}
