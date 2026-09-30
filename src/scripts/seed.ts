/**
 * Mengisi database dengan data contoh agar seluruh halaman dapat diuji
 * sebelum konten asli tersedia.
 *
 * Jalankan: `npm run seed`
 * PERINGATAN: jangan dijalankan di produksi — data contoh harus dihapus
 * sebelum go-live (lihat checklist.md §6.4).
 */
import { getPayload } from 'payload'
import sharp from 'sharp'
import config from '../payload.config'

const PLACEHOLDER_COLORS = ['#2f3e46', '#52796f', '#84a98c', '#354f52', '#1b263b', '#415a77']

/** Lolos-kan karakter yang bermakna khusus di XML agar SVG tetap valid. */
const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      default:
        return '&quot;'
    }
  })

/** Membuat gambar placeholder agar tidak perlu menyiapkan berkas contoh terpisah. */
const placeholderImage = async (label: string, index: number, width = 1600, height = 1200) => {
  const color = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length] ?? '#2f3e46'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="${Math.round(width / 22)}"
      fill="#ffffff" fill-opacity="0.85" text-anchor="middle" dominant-baseline="middle">
      ${escapeXml(label)}
    </text>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
}

/** Membentuk nilai rich text Lexical berisi satu paragraf. */
const lexicalParagraph = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [
          {
            type: 'text',
            text,
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            version: 1,
          },
        ],
      },
    ],
  },
})

const seed = async () => {
  const payload = await getPayload({ config })

  if (process.env.NODE_ENV === 'production') {
    payload.logger.error('Seeding dibatalkan: NODE_ENV=production.')
    process.exit(1)
  }

  payload.logger.info('Mulai seeding data contoh…')

  // Bersihkan data konten lebih dulu agar seed dapat dijalankan berulang.
  // Koleksi `users` sengaja tidak disentuh supaya akun yang sudah dibuat tetap ada.
  const collectionsToReset = [
    'testimonials',
    'clients',
    'team',
    'certifications',
    'job-applications',
    'jobs',
    'posts',
    'post-categories',
    'projects',
    'project-categories',
    'services',
    'divisions',
    'documents',
    'pages',
    'media',
  ] as const

  for (const collection of collectionsToReset) {
    await payload.delete({ collection, where: {}, overrideAccess: true })
  }
  payload.logger.info('Data konten lama dibersihkan.')

  // --- Pengguna -----------------------------------------------------------
  const existingUsers = await payload.count({ collection: 'users' })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Super Admin',
        email: 'admin@sabhumikaryabarito.test',
        password: 'SbkAdmin#2026',
        role: 'super-admin',
        isActive: true,
      },
    })
    payload.logger.info(
      'Pengguna super admin dibuat: admin@sabhumikaryabarito.test / SbkAdmin#2026',
    )
  }

  // --- Media --------------------------------------------------------------
  const uploadImage = async (label: string, index: number, alt: string) =>
    payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: await placeholderImage(label, index),
        mimetype: 'image/jpeg',
        name: `contoh-${index}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`,
        size: 0,
      },
    })

  // --- Divisi -------------------------------------------------------------
  const divisionSeed = [
    { name: 'Konstruksi', nameEn: 'Construction', icon: 'building' as const },
    { name: 'Konsultansi & Perencanaan', nameEn: 'Consulting & Planning', icon: 'ruler' as const },
    { name: 'Pengadaan & Supplier', nameEn: 'Procurement & Supply', icon: 'truck' as const },
    { name: 'Jasa Lainnya', nameEn: 'Other Services', icon: 'wrench' as const },
  ]

  const divisions = []
  for (const [index, item] of divisionSeed.entries()) {
    const cover = await uploadImage(item.name, index, `Ilustrasi divisi ${item.name}`)
    const doc = await payload.create({
      collection: 'divisions',
      locale: 'id',
      data: {
        name: item.name,
        summary: `Layanan ${item.name.toLowerCase()} untuk proyek pemerintah maupun swasta.`,
        icon: item.icon,
        coverImage: cover.id,
        order: index,
        _status: 'published',
      },
    })
    await payload.update({
      collection: 'divisions',
      id: doc.id,
      locale: 'en',
      data: {
        name: item.nameEn,
        summary: `${item.nameEn} services for public and private sector projects.`,
      },
    })
    divisions.push(doc)
  }

  // --- Kategori proyek ----------------------------------------------------
  const categoryNames = ['Gedung', 'Jalan & Jembatan', 'Irigasi', 'Pengadaan']
  const categories = []
  for (const name of categoryNames) {
    categories.push(
      await payload.create({
        collection: 'project-categories',
        locale: 'id',
        data: { name },
      }),
    )
  }

  // --- Proyek -------------------------------------------------------------
  const projectSeed = [
    { title: 'Pembangunan Gedung Kantor Kecamatan', location: 'Kandangan', year: 2024 },
    { title: 'Peningkatan Jalan Poros Desa', location: 'Daha Selatan', year: 2023 },
    { title: 'Rehabilitasi Jaringan Irigasi', location: 'Angkinang', year: 2023 },
    { title: 'Pengadaan Material Konstruksi', location: 'Hulu Sungai Selatan', year: 2025 },
    { title: 'Pembangunan Jembatan Penghubung', location: 'Simpur', year: 2022 },
  ]

  for (const [index, item] of projectSeed.entries()) {
    const cover = await uploadImage(item.title, index + 10, `Foto proyek ${item.title}`)
    await payload.create({
      collection: 'projects',
      locale: 'id',
      data: {
        title: item.title,
        summary: `${item.title} di ${item.location}, diselesaikan pada ${item.year}.`,
        client: 'Pemerintah Kabupaten Hulu Sungai Selatan',
        location: item.location,
        province: 'Kalimantan Selatan',
        yearStarted: item.year,
        yearCompleted: item.year,
        projectStatus: 'completed',
        showContractValue: false,
        coverImage: cover.id,
        division: divisions[index % divisions.length]!.id,
        categories: [categories[index % categories.length]!.id],
        featured: index < 3,
        order: index,
        scope: [
          { text: 'Pekerjaan persiapan' },
          { text: 'Pekerjaan struktur' },
          { text: 'Finishing' },
        ],
        _status: 'published',
      },
    })
  }

  // --- Layanan ------------------------------------------------------------
  const serviceSeed = [
    { title: 'Pembangunan Gedung', division: 0 },
    { title: 'Pekerjaan Jalan & Jembatan', division: 0 },
    { title: 'Perencanaan & Desain', division: 1 },
    { title: 'Pengawasan Proyek', division: 1 },
    { title: 'Pengadaan Material', division: 2 },
    { title: 'Sewa Alat Berat', division: 3 },
  ]

  for (const [index, item] of serviceSeed.entries()) {
    await payload.create({
      collection: 'services',
      locale: 'id',
      data: {
        title: item.title,
        summary: `Layanan ${item.title.toLowerCase()} dengan tim bersertifikasi dan pengendalian mutu terukur.`,
        division: divisions[item.division]!.id,
        featured: index < 3,
        order: index,
        _status: 'published',
      },
    })
  }

  // --- Tim ----------------------------------------------------------------
  const teamSeed = [
    { name: 'Direktur Utama', position: 'Direktur Utama' },
    { name: 'Direktur Operasional', position: 'Direktur Operasional' },
    { name: 'Manajer Teknik', position: 'Manajer Teknik' },
  ]
  for (const [index, item] of teamSeed.entries()) {
    const photo = await uploadImage(item.position, index + 20, `Foto ${item.position}`)
    await payload.create({
      collection: 'team',
      locale: 'id',
      data: {
        name: item.name,
        position: item.position,
        photo: photo.id,
        bio: 'Data contoh — ganti dengan biografi sebenarnya sebelum peluncuran.',
        showOnHomepage: true,
        order: index,
      },
    })
  }

  // --- Klien & testimoni --------------------------------------------------
  for (let index = 0; index < 5; index += 1) {
    const logo = await uploadImage(
      `Klien ${index + 1}`,
      index + 30,
      `Logo klien contoh ${index + 1}`,
    )
    await payload.create({
      collection: 'clients',
      data: {
        name: `Klien Contoh ${index + 1}`,
        logo: logo.id,
        category: index < 2 ? 'government' : 'private',
        isActive: true,
        order: index,
      },
    })
  }

  for (let index = 0; index < 3; index += 1) {
    await payload.create({
      collection: 'testimonials',
      locale: 'id',
      data: {
        quote: 'Pekerjaan diselesaikan tepat waktu dengan mutu yang sesuai spesifikasi.',
        name: `Narasumber ${index + 1}`,
        position: 'Pejabat Pembuat Komitmen',
        organization: `Instansi Contoh ${index + 1}`,
        isActive: true,
        order: index,
      },
    })
  }

  // --- Legalitas ----------------------------------------------------------
  const certSeed = [
    { name: 'Nomor Induk Berusaha (NIB)', issuer: 'OSS RBA' },
    { name: 'Sertifikat Badan Usaha (SBU)', issuer: 'LPJK' },
    { name: 'Akta Pendirian Perusahaan', issuer: 'Notaris' },
  ]
  for (const [index, item] of certSeed.entries()) {
    await payload.create({
      collection: 'certifications',
      locale: 'id',
      data: {
        name: item.name,
        number: `CONTOH-${1000 + index}`,
        issuer: item.issuer,
        isPublic: true,
        requireFormToDownload: true,
        order: index,
      },
    })
  }

  // --- Berita -------------------------------------------------------------
  const postCategory = await payload.create({
    collection: 'post-categories',
    locale: 'id',
    data: { name: 'Kegiatan Perusahaan' },
  })

  for (let index = 0; index < 3; index += 1) {
    const cover = await uploadImage(
      `Berita ${index + 1}`,
      index + 40,
      `Gambar berita contoh ${index + 1}`,
    )
    await payload.create({
      collection: 'posts',
      locale: 'id',
      data: {
        title: `Berita Contoh ${index + 1}`,
        excerpt: 'Ringkasan berita contoh untuk menguji tampilan daftar dan detail artikel.',
        coverImage: cover.id,
        category: postCategory.id,
        content: lexicalParagraph(
          'Isi berita contoh. Ganti dengan konten sebenarnya sebelum peluncuran.',
        ),
        publishedAt: new Date().toISOString(),
        _status: 'published',
      },
    })
  }

  // --- Lowongan -----------------------------------------------------------
  await payload.create({
    collection: 'jobs',
    locale: 'id',
    data: {
      title: 'Pelaksana Lapangan',
      location: 'Hulu Sungai Selatan',
      headcount: 2,
      employmentType: 'full-time',
      division: divisions[0]!.id,
      description: lexicalParagraph(
        'Deskripsi pekerjaan contoh. Ganti dengan uraian tugas sebenarnya.',
      ),
      vacancyStatus: 'open',
      qualifications: [
        { text: 'Pendidikan minimal D3 Teknik Sipil' },
        { text: 'Pengalaman 2 tahun' },
      ],
      _status: 'published',
    },
  })

  // --- Global -------------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'id',
    data: {
      companyName: 'PT Sabhumi Karya Barito',
      tagline: 'Membangun dengan Mutu dan Ketepatan Waktu',
      shortDescription:
        'Perusahaan konstruksi, konsultan perencanaan, dan pengadaan material yang melayani proyek pemerintah maupun swasta di Kalimantan Selatan.',
      address: 'Kabupaten Hulu Sungai Selatan, Kalimantan Selatan',
      phone: '+62 811 0000 0000',
      email: 'info@sabhumikaryabarito.test',
      whatsapp: '628110000000',
      operationalHours: 'Senin–Jumat, 08.00–16.00 WITA',
    },
  })

  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'id',
    data: {
      heroEyebrow: 'Kontraktor & Konsultan',
      heroHeading: 'Membangun Infrastruktur yang Bertahan',
      heroSubheading:
        'Konstruksi, perencanaan, dan pengadaan material dengan pengendalian mutu terukur.',
      heroButtons: [
        { label: 'Lihat Proyek', href: '/proyek' },
        { label: 'Hubungi Kami', href: '/kontak' },
      ],
      stats: [
        { value: 12, suffix: '+', label: 'Tahun Pengalaman' },
        { value: 85, suffix: '+', label: 'Proyek Selesai' },
        { value: 40, suffix: '+', label: 'Klien' },
        { value: 120, suffix: '+', label: 'Tenaga Kerja' },
      ],
      sections: [
        { key: 'hero', enabled: true },
        { key: 'about', enabled: true },
        { key: 'divisions', enabled: true },
        { key: 'stats', enabled: true },
        { key: 'projects', enabled: true },
        { key: 'certifications', enabled: true },
        { key: 'testimonials', enabled: true },
        { key: 'clients', enabled: true },
        { key: 'posts', enabled: true },
        { key: 'cta', enabled: true },
      ],
      _status: 'published',
    },
  })

  payload.logger.info('Seeding selesai.')
  process.exit(0)
}

seed().catch((error: unknown) => {
  const detail = (error as { data?: { errors?: unknown[] } })?.data?.errors
  console.error('Seeding gagal:', error)
  if (detail) console.error('Rincian validasi:', JSON.stringify(detail, null, 2))
  process.exit(1)
})
