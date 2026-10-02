import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import type { DemoPhotoKey } from './demo-photos'

/**
 * Gambar untuk konten demo.
 *
 * Sebagian besar halaman memakai foto sungguhan dari Wikimedia Commons yang
 * diunduh `fetch-demo-photos.ts` — lihat `photograph()` di bawah. Gambar
 * generatif di berkas ini dipakai untuk dua hal yang tidak pantas diisi foto
 * orang lain: dokumen legalitas dan logo, serta sebagai cadangan ketika foto
 * gagal diunduh.
 *
 * Bentuknya sengaja menyerupai fotografi arsitektur dalam hal yang menentukan
 * tampilan halaman: warna bergradien, siluet bangunan, dan kontras yang mirip.
 * Kotak warna polos bertuliskan label membuat halaman terlihat jauh lebih buruk
 * daripada hasil akhirnya, sehingga tidak berguna untuk menilai desain.
 *
 * Seluruh warna mengikuti token pada `src/app/(frontend)/globals.css`: gelap
 * kecokelatan dengan aksen perunggu, bukan biru-abu bawaan.
 */

const PHOTO_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'demo-photos')

/**
 * Memuat foto demo dan memotongnya ke ukuran yang diminta.
 *
 * Mengembalikan `null` bila berkasnya belum diunduh, supaya pemanggil dapat
 * jatuh ke gambar generatif alih-alih menggagalkan seluruh seeding.
 */
export const photograph = async (
  key: DemoPhotoKey,
  width: number,
  height: number,
): Promise<Buffer | null> => {
  try {
    const file = await fs.readFile(path.join(PHOTO_DIR, `${key}.webp`))
    return await sharp(file)
      // `attention` memilih bagian paling menonjol, bukan sekadar tengah —
      // bangunan tidak terpotong sembarangan saat rasio gambar berubah.
      .resize(width, height, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 82 })
      .toBuffer()
  } catch {
    return null
  }
}

type Palette = { from: string; to: string; accent: string }

const PALETTES: Palette[] = [
  { from: '#141414', to: '#4a3a24', accent: '#d4a85c' },
  { from: '#1b1a17', to: '#6f5220', accent: '#f5ecdc' },
  { from: '#22201c', to: '#5a4a33', accent: '#d4a85c' },
  { from: '#2a2a2a', to: '#6b6b6b', accent: '#d4a85c' },
  { from: '#191714', to: '#8a6425', accent: '#f5ecdc' },
  { from: '#242019', to: '#52483a', accent: '#d4a85c' },
]

/** Bilangan acak yang dapat diulang, supaya gambar yang sama selalu identik. */
const seededRandom = (seed: number) => {
  let value = seed * 9301 + 49297
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

/** Siluet bangunan — dipakai pada gambar proyek dan divisi. */
const buildingShapes = (seed: number, width: number, height: number): string => {
  const random = seededRandom(seed)
  const count = 5 + Math.floor(random() * 4)
  const shapes: string[] = []

  for (let i = 0; i < count; i += 1) {
    const w = width * (0.08 + random() * 0.14)
    const h = height * (0.25 + random() * 0.5)
    const x = (width / count) * i + random() * (width / count) * 0.3
    const y = height - h
    const opacity = (0.12 + random() * 0.18).toFixed(2)
    shapes.push(
      `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="#ffffff" fill-opacity="${opacity}"/>`,
    )

    // Deret jendela agar bentuknya terbaca sebagai bangunan, bukan balok polos.
    const rows = Math.floor(h / (height * 0.08))
    for (let r = 1; r < rows; r += 1) {
      shapes.push(
        `<rect x="${(x + w * 0.15).toFixed(0)}" y="${(y + r * (h / rows)).toFixed(0)}" width="${(w * 0.7).toFixed(0)}" height="${(height * 0.012).toFixed(0)}" fill="#ffffff" fill-opacity="${(Number(opacity) * 0.8).toFixed(2)}"/>`,
      )
    }
  }
  return shapes.join('')
}

/** Garis diagonal halus — kesan rangka atau derek. */
const structuralLines = (seed: number, width: number, height: number): string => {
  const random = seededRandom(seed + 77)
  const lines: string[] = []
  for (let i = 0; i < 4; i += 1) {
    const x1 = random() * width
    const y1 = random() * height * 0.6
    const x2 = x1 + (random() - 0.5) * width * 0.8
    const y2 = y1 + random() * height * 0.5
    lines.push(
      `<line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="#ffffff" stroke-opacity="0.10" stroke-width="${(1 + random() * 3).toFixed(1)}"/>`,
    )
  }
  return lines.join('')
}

const gradientDefs = (palette: Palette, seed: number) => `
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.from}"/>
      <stop offset="100%" stop-color="${palette.to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${30 + (seed % 40)}%" cy="25%" r="70%">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>`

/** Gambar bergaya fotografi arsitektur untuk proyek, divisi, dan hero. */
export const architecturalImage = async (seed: number, width = 1600, height = 1200) => {
  const palette = PALETTES[seed % PALETTES.length]!
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    ${gradientDefs(palette, seed)}
    <rect width="100%" height="100%" fill="url(#bg)"/>
    ${buildingShapes(seed, width, height)}
    ${structuralLines(seed, width, height)}
    <rect width="100%" height="100%" fill="url(#glow)"/>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 84 }).toBuffer()
}

/** Latar potret: turunan warna `paper` dan `accent-soft` dari token situs. */
const PORTRAIT_GROUNDS = [
  { from: '#f2f0ec', to: '#ddd6c8' },
  { from: '#f5ecdc', to: '#e3d6bd' },
  { from: '#faf9f7', to: '#e4e1dc' },
  { from: '#efeae1', to: '#d8cfbf' },
]

/**
 * Potret pengganti untuk foto tim dan testimoni.
 *
 * Tetap abstrak, berbeda dari bagian situs lain yang memakai foto sungguhan.
 * Memasang wajah orang yang benar-benar ada di bawah nama pegawai dan kutipan
 * testimoni karangan berarti mengaku-akui orang itu bekerja di sini — keliru,
 * dan pada situs yang dapat diakses umum bisa merugikan yang bersangkutan.
 * Siluetnya jelas terbaca sebagai tempat kosong yang menunggu foto asli.
 */
export const portraitImage = async (seed: number, size = 900) => {
  const ground = PORTRAIT_GROUNDS[seed % PORTRAIT_GROUNDS.length]!
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <linearGradient id="ground" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${ground.from}"/>
        <stop offset="100%" stop-color="${ground.to}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#ground)"/>
    <circle cx="${size / 2}" cy="${size * 0.38}" r="${size * 0.155}" fill="#6b6b6b" fill-opacity="0.38"/>
    <path d="M ${size * 0.2} ${size} Q ${size * 0.5} ${size * 0.57} ${size * 0.8} ${size} Z" fill="#6b6b6b" fill-opacity="0.32"/>
    <rect x="0" y="${size - size * 0.014}" width="100%" height="${size * 0.014}" fill="#8a6425" fill-opacity="0.55"/>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 84 }).toBuffer()
}

/** Logo klien abstrak: bentuk geometris + balok teks, tanpa meniru merek nyata. */
export const clientLogoImage = async (seed: number, width = 480, height = 200) => {
  const random = seededRandom(seed + 31)
  const tone = '#2a2a2a'
  const marks = [
    `<circle cx="70" cy="100" r="34" fill="${tone}" fill-opacity="0.85"/>`,
    `<rect x="36" y="66" width="68" height="68" fill="${tone}" fill-opacity="0.85"/>`,
    `<polygon points="70,60 108,138 32,138" fill="${tone}" fill-opacity="0.85"/>`,
    `<rect x="36" y="66" width="68" height="68" rx="18" fill="${tone}" fill-opacity="0.85"/>`,
  ]
  const mark = marks[seed % marks.length]
  const barWidth = 150 + random() * 120

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    ${mark}
    <rect x="130" y="84" width="${barWidth.toFixed(0)}" height="18" rx="4" fill="${tone}" fill-opacity="0.75"/>
    <rect x="130" y="112" width="${(barWidth * 0.6).toFixed(0)}" height="12" rx="4" fill="${tone}" fill-opacity="0.45"/>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

/** Gambar dokumen untuk sertifikat — menyerupai lembar bertanda tangan. */
export const certificateImage = async (seed: number, width = 900, height = 1200) => {
  const random = seededRandom(seed + 13)
  const lines: string[] = []
  for (let i = 0; i < 9; i += 1) {
    const w = width * (0.35 + random() * 0.4)
    lines.push(
      `<rect x="${width * 0.14}" y="${height * (0.32 + i * 0.055)}" width="${w.toFixed(0)}" height="${(height * 0.016).toFixed(0)}" rx="3" fill="#30343f" fill-opacity="${(0.18 + random() * 0.18).toFixed(2)}"/>`,
    )
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#f4f2ed"/>
    <rect x="${width * 0.06}" y="${height * 0.05}" width="${width * 0.88}" height="${height * 0.9}" fill="none" stroke="#8a6425" stroke-width="6" stroke-opacity="0.5"/>
    <rect x="${width * 0.14}" y="${height * 0.14}" width="${width * 0.52}" height="${height * 0.035}" rx="4" fill="#30343f" fill-opacity="0.55"/>
    <rect x="${width * 0.14}" y="${height * 0.21}" width="${width * 0.34}" height="${height * 0.022}" rx="4" fill="#8a6425" fill-opacity="0.6"/>
    ${lines.join('')}
    <circle cx="${width * 0.74}" cy="${height * 0.82}" r="${width * 0.1}" fill="none" stroke="#8a6425" stroke-width="5" stroke-opacity="0.55"/>
    <text x="${width * 0.5}" y="${height * 0.52}" font-family="sans-serif" font-size="${width * 0.11}"
      fill="#8a6425" fill-opacity="0.16" text-anchor="middle" transform="rotate(-24 ${width * 0.5} ${height * 0.52})">CONTOH</text>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 86 }).toBuffer()
}
