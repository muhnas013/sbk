/**
 * Mengisi database dengan konten demo yang menyerupai isi sebenarnya, agar
 * tampilan situs dapat dinilai sebelum konten asli tersedia.
 *
 * Pengembangan : `npm run seed`
 * Server       : `ALLOW_DEMO_SEED=yes npm run seed`
 *
 * Di produksi script menolak berjalan kecuali `ALLOW_DEMO_SEED=yes` diberikan
 * secara eksplisit, dan ketika berjalan ia MENGAKTIFKAN sakelar `noIndex`
 * supaya konten demo tidak terlanjur diindeks mesin pencari. Matikan kembali
 * sakelar itu lewat Pengaturan → SEO Bawaan setelah konten asli masuk.
 */
import { getPayload } from 'payload'
import config from '../payload.config'
import {
  architecturalImage,
  certificateImage,
  clientLogoImage,
  photograph,
  portraitImage,
} from './demo-images'
import { DEMO_PHOTOS, type DemoPhotoKey } from './demo-photos'
import { ensureDemoPhotos } from './fetch-demo-photos'
import {
  CERTIFICATIONS,
  CLIENTS,
  DIVISIONS,
  JOBS,
  POSTS,
  PROJECTS,
  SERVICES,
  TEAM,
  TESTIMONIALS,
} from './demo-content'

/** Membentuk nilai rich text Lexical dari beberapa paragraf. */
const lexical = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      children: [
        { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
      ],
    })),
  },
})

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** PDF minimal yang sah, agar Pusat Unduhan punya berkas sungguhan. */
const demoPdf = (title: string): Buffer => {
  const content = `BT /F1 20 Tf 60 760 Td (${title.replace(/[()\\]/g, '')}) Tj ET\nBT /F1 11 Tf 60 730 Td (Dokumen contoh - ganti dengan berkas resmi perusahaan.) Tj ET`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((body, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  return Buffer.from(pdf, 'latin1')
}

const seed = async () => {
  const payload = await getPayload({ config })
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction && process.env.ALLOW_DEMO_SEED !== 'yes') {
    payload.logger.error(
      'Menolak mengisi konten demo di produksi. Jalankan ulang dengan ALLOW_DEMO_SEED=yes bila memang disengaja.',
    )
    process.exit(1)
  }

  payload.logger.info('Menyiapkan foto demo…')
  const { downloaded, failed } = await ensureDemoPhotos()
  if (downloaded > 0) payload.logger.info(`${downloaded} foto demo diunduh.`)
  if (failed.length > 0) {
    payload.logger.warn(
      `${failed.length} foto gagal diunduh; bagian itu memakai gambar cadangan. Ulangi dengan \`npm run photos\` setelah jaringan pulih.`,
    )
  }

  payload.logger.info('Mengisi konten demo…')

  // Bersihkan konten lama supaya script dapat dijalankan berulang.
  // Koleksi `users` sengaja tidak disentuh agar akun yang sudah ada tetap aman.
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

  const upload = async (
    name: string,
    alt: string,
    data: Buffer,
    mimetype = 'image/jpeg',
    ext = 'jpg',
    credit?: string,
  ) =>
    payload.create({
      collection: 'media',
      data: { alt, credit },
      file: { data, mimetype, name: `${name}.${ext}`, size: data.length },
    })

  // Dipakai bila foto gagal diunduh: gambar generatif berganti-ganti rupa
  // supaya halaman tidak dipenuhi satu gambar yang sama persis.
  let fallbackSeed = 0

  /**
   * Mengunggah foto demo beserta kreditnya. Lisensi Commons menuntut nama
   * pemotret ikut tercatat, jadi kreditnya disimpan di field `credit` media —
   * bukan sekadar di berkas KREDIT.md yang mudah tertinggal saat foto dipakai
   * ulang dari pustaka media.
   */
  const uploadPhoto = async (
    name: string,
    alt: string,
    key: DemoPhotoKey,
    width = 1600,
    height = 1200,
  ) => {
    const photo = await photograph(key, width, height)
    if (!photo) {
      fallbackSeed += 1
      return upload(name, alt, await architecturalImage(fallbackSeed, width, height))
    }
    const { author, license } = DEMO_PHOTOS[key]
    return upload(
      name,
      alt,
      photo,
      'image/jpeg',
      'jpg',
      `${author} — ${license}, via Wikimedia Commons (foto contoh)`,
    )
  }

  // --- Divisi -------------------------------------------------------------
  const divisions = []
  for (const [index, item] of DIVISIONS.entries()) {
    const cover = await uploadPhoto(
      `divisi-${slugify(item.name)}`,
      `Ilustrasi pekerjaan divisi ${item.name}`,
      item.photo,
    )
    const doc = await payload.create({
      collection: 'divisions',
      locale: 'id',
      data: {
        name: item.name,
        slug: slugify(item.name),
        summary: item.summary,
        description: lexical(item.description),
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
      data: { name: item.nameEn, summary: item.summaryEn },
    })
    divisions.push(doc)
  }

  // --- Kategori proyek ----------------------------------------------------
  const categoryNames = ['Gedung', 'Jalan & Jembatan', 'Bangunan Air', 'Pengadaan']
  const categories = []
  for (const name of categoryNames) {
    categories.push(
      await payload.create({
        collection: 'project-categories',
        locale: 'id',
        data: { name, slug: slugify(name) },
      }),
    )
  }

  // --- Layanan ------------------------------------------------------------
  for (const [index, item] of SERVICES.entries()) {
    const cover = await uploadPhoto(
      `layanan-${slugify(item.title)}`,
      `Ilustrasi layanan ${item.title}`,
      item.photo,
    )
    const doc = await payload.create({
      collection: 'services',
      locale: 'id',
      data: {
        title: item.title,
        slug: slugify(item.title),
        summary: item.summary,
        description: lexical(
          item.summary,
          'Lingkup pekerjaan disesuaikan dengan kebutuhan dan kondisi lapangan. Penawaran disusun setelah peninjauan lokasi agar perkiraan biaya mendekati kenyataan.',
        ),
        division: divisions[item.division]!.id,
        coverImage: cover.id,
        scope: item.scope.map((text) => ({ text })),
        process: item.process,
        faq: item.faq,
        featured: index < 3,
        order: index,
        _status: 'published',
      },
    })
    await payload.update({
      collection: 'services',
      id: doc.id,
      locale: 'en',
      data: { title: item.titleEn },
    })
  }

  // --- Proyek -------------------------------------------------------------
  for (const [index, item] of PROJECTS.entries()) {
    const cover = await uploadPhoto(
      `proyek-${slugify(item.title)}`,
      `Dokumentasi ${item.title}`,
      item.photo,
    )
    const gallery = []
    for (const [g, key] of item.gallery.entries()) {
      const photo = await uploadPhoto(
        `proyek-${slugify(item.title)}-${g + 1}`,
        `Dokumentasi ${item.title}, foto ${g + 1}`,
        key,
      )
      gallery.push({ image: photo.id, caption: `Dokumentasi pelaksanaan tahap ${g + 1}` })
    }

    await payload.create({
      collection: 'projects',
      locale: 'id',
      data: {
        title: item.title,
        slug: slugify(item.title),
        summary: item.summary,
        description: lexical(
          item.summary,
          'Pekerjaan dilaksanakan dengan pengawasan harian dan dokumentasi progres mingguan. Setiap tahap diperiksa bersama pengawas sebelum dilanjutkan ke tahap berikutnya.',
        ),
        client: 'Pemerintah Kabupaten Hulu Sungai Selatan',
        location: item.location,
        province: 'Kalimantan Selatan',
        yearStarted: item.year,
        yearCompleted: item.year,
        duration: '180 hari kalender',
        projectStatus: item.status as 'completed' | 'ongoing' | 'planned',
        showContractValue: false,
        coverImage: cover.id,
        gallery,
        division: divisions[item.division]!.id,
        categories: [categories[item.category]!.id],
        scope: item.scope.map((text) => ({ text })),
        featured: index < 6,
        order: index,
        _status: 'published',
      },
    })
  }

  // --- Tim ----------------------------------------------------------------
  for (const [index, item] of TEAM.entries()) {
    const photo = await upload(
      `tim-${slugify(item.name)}`,
      `Foto ${item.name}, ${item.position}`,
      await portraitImage(index + 3),
    )
    const doc = await payload.create({
      collection: 'team',
      locale: 'id',
      data: {
        name: item.name,
        position: item.position,
        photo: photo.id,
        bio: item.bio,
        showOnHomepage: index < 3,
        order: index,
      },
    })
    await payload.update({
      collection: 'team',
      id: doc.id,
      locale: 'en',
      data: { position: item.positionEn },
    })
  }

  // --- Klien --------------------------------------------------------------
  for (const [index, item] of CLIENTS.entries()) {
    const logo = await upload(
      `klien-${slugify(item.name)}`,
      `Logo ${item.name}`,
      await clientLogoImage(index),
      'image/png',
      'png',
    )
    await payload.create({
      collection: 'clients',
      data: {
        name: item.name,
        logo: logo.id,
        category: item.category,
        isActive: true,
        order: index,
      },
    })
  }

  // --- Testimoni ----------------------------------------------------------
  for (const [index, item] of TESTIMONIALS.entries()) {
    const photo = await upload(
      `testimoni-${index}`,
      `Foto ${item.name}`,
      await portraitImage(index + 11, 400),
    )
    await payload.create({
      collection: 'testimonials',
      locale: 'id',
      data: {
        quote: item.quote,
        name: item.name,
        position: item.position,
        organization: item.organization,
        photo: photo.id,
        isActive: true,
        order: index,
      },
    })
  }

  // --- Legalitas ----------------------------------------------------------
  for (const [index, item] of CERTIFICATIONS.entries()) {
    const image = await upload(
      `legalitas-${slugify(item.name)}`,
      `Dokumen ${item.name}`,
      await certificateImage(index),
    )
    await payload.create({
      collection: 'certifications',
      locale: 'id',
      data: {
        name: item.name,
        number: item.number,
        issuer: item.issuer,
        issuedAt: new Date(2024, index % 12, 10).toISOString(),
        validUntil: index < 4 ? new Date(2028, index % 12, 10).toISOString() : undefined,
        image: image.id,
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
    data: { name: 'Kegiatan Perusahaan', slug: 'kegiatan-perusahaan' },
  })
  const projectCategoryPost = await payload.create({
    collection: 'post-categories',
    locale: 'id',
    data: { name: 'Progres Proyek', slug: 'progres-proyek' },
  })

  for (const [index, item] of POSTS.entries()) {
    const cover = await uploadPhoto(
      `berita-${slugify(item.title).slice(0, 40)}`,
      `Gambar untuk artikel: ${item.title}`,
      item.photo,
      1600,
      900,
    )
    const published = new Date()
    published.setDate(published.getDate() - index * 11 - 3)

    await payload.create({
      collection: 'posts',
      locale: 'id',
      data: {
        title: item.title,
        slug: slugify(item.title).slice(0, 60),
        excerpt: item.excerpt,
        coverImage: cover.id,
        category: index % 2 === 0 ? postCategory.id : projectCategoryPost.id,
        content: lexical(
          item.body,
          'Informasi lebih lanjut dapat diperoleh melalui halaman Kontak.',
        ),
        publishedAt: published.toISOString(),
        _status: 'published',
      },
    })
  }

  // --- Lowongan -----------------------------------------------------------
  for (const [index, item] of JOBS.entries()) {
    const closing = new Date()
    closing.setDate(closing.getDate() + 30 + index * 10)
    await payload.create({
      collection: 'jobs',
      locale: 'id',
      data: {
        title: item.title,
        slug: slugify(item.title),
        location: item.location,
        headcount: item.headcount,
        employmentType: item.type,
        division: divisions[item.division]!.id,
        description: lexical(item.description),
        responsibilities: item.responsibilities.map((text) => ({ text })),
        qualifications: item.qualifications.map((text) => ({ text })),
        benefits: item.benefits.map((text) => ({ text })),
        closingDate: closing.toISOString(),
        vacancyStatus: 'open',
        _status: 'published',
      },
    })
  }

  // --- Pusat unduhan ------------------------------------------------------
  const documents = [
    {
      title: 'Company Profile PT Sabhumi Karya Barito',
      category: 'company-profile' as const,
      description: 'Profil perusahaan, bidang usaha, dan rekam jejak pekerjaan.',
    },
    {
      title: 'Brosur Divisi Konstruksi',
      category: 'brochure' as const,
      description: 'Ringkasan layanan dan kapasitas divisi konstruksi.',
    },
    {
      title: 'Katalog Material Konstruksi',
      category: 'catalog' as const,
      description: 'Daftar material yang tersedia beserta spesifikasinya.',
    },
  ]
  for (const [index, item] of documents.entries()) {
    const data = demoPdf(item.title)
    await payload.create({
      collection: 'documents',
      locale: 'id',
      data: {
        title: item.title,
        description: item.description,
        category: item.category,
        isPublic: true,
        order: index,
      },
      file: {
        data,
        mimetype: 'application/pdf',
        name: `${slugify(item.title)}.pdf`,
        size: data.length,
      },
    })
  }

  // --- Halaman statis -----------------------------------------------------
  const staticPages = [
    {
      slug: 'kebijakan-privasi',
      id: 'Kebijakan Privasi',
      en: 'Privacy Policy',
      bodyId:
        'Halaman ini menjelaskan bagaimana perusahaan mengumpulkan, memakai, menyimpan, dan melindungi data pribadi pengunjung sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. Data yang dikirim melalui form kontak dan form lamaran hanya dipakai untuk menindaklanjuti permintaan yang bersangkutan, dan tidak dibagikan kepada pihak lain. Data pelamar dihapus otomatis setelah dua belas bulan. Ganti teks contoh ini dengan kebijakan resmi perusahaan sebelum peluncuran.',
      bodyEn:
        'This page explains how the company collects, uses, stores, and protects visitors’ personal data in line with Indonesian Law No. 27 of 2022 on Personal Data Protection. Replace this placeholder with the official policy before launch.',
    },
    {
      slug: 'syarat-penggunaan',
      id: 'Syarat Penggunaan',
      en: 'Terms of Use',
      bodyId:
        'Dengan mengakses situs ini, pengunjung menyetujui syarat penggunaan yang berlaku. Seluruh isi situs, termasuk teks dan gambar, merupakan milik perusahaan kecuali dinyatakan lain. Informasi proyek yang ditampilkan bersifat umum dan bukan merupakan penawaran yang mengikat. Ganti teks contoh ini dengan syarat resmi perusahaan sebelum peluncuran.',
      bodyEn:
        'By accessing this site, visitors agree to the applicable terms of use. Replace this placeholder with the official terms before launch.',
    },
  ]

  for (const page of staticPages) {
    const doc = await payload.create({
      collection: 'pages',
      locale: 'id',
      data: {
        title: page.id,
        slug: page.slug,
        layout: [{ blockType: 'richText', content: lexical(page.bodyId) }],
        _status: 'published',
      },
    })
    // Field ter-localize di dalam blocks menempel pada baris blok. Bila blok
    // dikirim ulang tanpa `id` aslinya, Payload membangun ulang array dan
    // konten locale sebelumnya ikut hilang — jadi id-nya dipakai kembali.
    const blockId = doc.layout?.[0]?.id
    await payload.update({
      collection: 'pages',
      id: doc.id,
      locale: 'en',
      data: {
        title: page.en,
        layout: [{ id: blockId, blockType: 'richText', content: lexical(page.bodyEn) }],
      },
    })
  }

  // --- Global -------------------------------------------------------------
  const logo = await upload(
    'logo-sementara',
    'Logo PT Sabhumi Karya Barito',
    await clientLogoImage(9, 560, 180),
    'image/png',
    'png',
  )
  const heroImage = await uploadPhoto(
    'beranda-hero',
    'Jembatan beton hasil pekerjaan infrastruktur di Kalimantan Selatan',
    'beranda-hero',
    2400,
    1400,
  )
  const aboutImage = await uploadPhoto(
    'tentang-kami',
    'Juru ukur mengambil data lapangan sebelum pekerjaan dimulai',
    'tentang-kami',
  )
  const aboutHero = await uploadPhoto(
    'tentang-kami-hero',
    'Bangunan kantor pemerintah di Kalimantan Selatan',
    'tentang-hero',
    2400,
    1200,
  )

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'id',
    data: {
      companyName: 'PT Sabhumi Karya Barito',
      tagline: 'Membangun dengan Mutu dan Ketepatan Waktu',
      shortDescription:
        'Perusahaan konstruksi, konsultan perencanaan, dan pengadaan material yang melayani proyek pemerintah maupun swasta di Kalimantan Selatan.',
      logoLight: logo.id,
      address:
        'Jl. Jenderal Sudirman No. 00, Kandangan,\nKabupaten Hulu Sungai Selatan,\nKalimantan Selatan 71211',
      phone: '+62 811 0000 0000',
      email: 'info@sabhumikaryabarito.com',
      whatsapp: '628110000000',
      operationalHours: 'Senin–Jumat, 08.00–16.00 WITA',
      mapLatitude: -2.7906,
      mapLongitude: 115.2621,
      socials: [
        { platform: 'instagram', url: 'https://instagram.com/' },
        { platform: 'facebook', url: 'https://facebook.com/' },
        { platform: 'linkedin', url: 'https://linkedin.com/' },
      ],
      nib: '08120100xxxxx',
      npwp: 'xx.xxx.xxx.x-xxx.xxx',
      footerLegalNote:
        'NIB 08120100xxxxx · SBU Konstruksi · Terdaftar LPSE Kab. Hulu Sungai Selatan',
    },
  })

  await payload.updateGlobal({
    slug: 'about',
    locale: 'id',
    data: {
      heading: 'Tentang PT Sabhumi Karya Barito',
      intro:
        'Perusahaan multi-lini yang bergerak di bidang konstruksi, konsultansi perencanaan, pengadaan material, dan jasa pendukung lainnya di Kalimantan Selatan.',
      profile: lexical(
        'PT Sabhumi Karya Barito berdiri pada 2014 di Kabupaten Hulu Sungai Selatan. Berawal dari pekerjaan konstruksi berskala kecil, perusahaan kini menangani paket pekerjaan gedung, jalan, jembatan, dan bangunan air, serta melayani perencanaan teknis dan pengadaan material.',
        'Seluruh pekerjaan dijalankan dengan prinsip yang sama sejak awal: mutu sesuai spesifikasi, jadwal yang ditepati, dan dokumentasi yang rapi. Tiga hal itulah yang membuat pemberi kerja kembali mempercayakan pekerjaan berikutnya kepada kami.',
      ),
      image: aboutImage.id,
      heroImage: aboutHero.id,
      vision:
        'Menjadi mitra pembangunan daerah yang dipercaya karena mutu pekerjaan dan ketepatan waktu penyelesaian.',
      mission: [
        {
          text: 'Melaksanakan setiap pekerjaan sesuai spesifikasi teknis dan jadwal yang disepakati.',
        },
        {
          text: 'Menerapkan sistem manajemen keselamatan konstruksi pada seluruh lokasi pekerjaan.',
        },
        { text: 'Mengembangkan kompetensi tenaga kerja lokal melalui pelatihan dan pendampingan.' },
        { text: 'Menjaga keterbukaan administrasi dan pelaporan kepada pemberi kerja.' },
      ],
      values: [
        {
          title: 'Mutu',
          description:
            'Pengendalian mutu dilakukan pada setiap tahap, bukan hanya saat serah terima.',
        },
        {
          title: 'Ketepatan Waktu',
          description: 'Jadwal yang direncanakan adalah komitmen, bukan perkiraan.',
        },
        {
          title: 'Keselamatan',
          description: 'Tidak ada target pekerjaan yang sepadan dengan risiko cedera pekerja.',
        },
        {
          title: 'Keterbukaan',
          description: 'Progres dan kendala disampaikan apa adanya, tanpa menunggu ditanyakan.',
        },
        {
          title: 'Kemitraan Lokal',
          description:
            'Tenaga kerja dan pemasok daerah dilibatkan sejauh kapasitasnya memungkinkan.',
        },
        {
          title: 'Kepatuhan',
          description: 'Seluruh pekerjaan dijalankan sesuai ketentuan dan dokumen kontrak.',
        },
      ],
      milestones: [
        {
          year: '2014',
          title: 'Perusahaan didirikan',
          description:
            'Memulai dengan pekerjaan konstruksi berskala kecil di Kabupaten Hulu Sungai Selatan.',
        },
        {
          year: '2017',
          title: 'Kualifikasi badan usaha naik',
          description: 'Mulai menangani paket pekerjaan gedung dan jalan bernilai lebih besar.',
        },
        {
          year: '2019',
          title: 'Perluasan lini usaha',
          description: 'Menambah layanan konsultansi perencanaan dan pengadaan material.',
        },
        {
          year: '2022',
          title: 'Penerapan SMKK',
          description:
            'Sistem manajemen keselamatan konstruksi diterapkan di seluruh lokasi pekerjaan.',
        },
        {
          year: '2025',
          title: 'Lebih dari 80 paket pekerjaan',
          description: 'Rekam jejak pekerjaan tersebar di seluruh kecamatan dalam kabupaten.',
        },
      ],
      _status: 'published',
    },
  })

  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'id',
    data: {
      heroEyebrow: 'Kontraktor · Konsultan · Pengadaan',
      heroHeading: 'Membangun Infrastruktur yang Bertahan',
      heroSubheading:
        'Konstruksi, perencanaan teknis, dan pengadaan material untuk proyek pemerintah maupun swasta di Kalimantan Selatan.',
      heroImage: heroImage.id,
      heroButtons: [
        { label: 'Lihat Proyek', href: '/proyek' },
        { label: 'Hubungi Kami', href: '/kontak' },
      ],
      aboutEyebrow: 'Sekilas Perusahaan',
      aboutHeading: 'Mitra pembangunan daerah sejak 2014',
      aboutContent: lexical(
        'PT Sabhumi Karya Barito menangani pekerjaan konstruksi, perencanaan teknis, dan pengadaan material dengan tim bersertifikasi serta pengendalian mutu yang terukur di setiap tahap.',
        'Lebih dari delapan puluh paket pekerjaan telah diselesaikan, tersebar di seluruh kecamatan dalam Kabupaten Hulu Sungai Selatan.',
      ),
      aboutImage: aboutImage.id,
      stats: [
        { value: 12, suffix: '+', label: 'Tahun Pengalaman' },
        { value: 85, suffix: '+', label: 'Paket Pekerjaan Selesai' },
        { value: 40, suffix: '+', label: 'Pemberi Kerja' },
        { value: 120, suffix: '+', label: 'Tenaga Kerja' },
      ],
      ctaHeading: 'Siap membahas rencana pekerjaan Anda?',
      ctaDescription:
        'Sampaikan kebutuhan Anda, tim kami akan meninjau lokasi dan menyiapkan penawaran beserta jadwal pelaksanaan.',
      ctaButton: { label: 'Hubungi Kami', href: '/kontak' },
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

  if (isProduction) {
    // Konten demo tidak boleh terlanjur diindeks mesin pencari.
    await payload.updateGlobal({ slug: 'seo-defaults', locale: 'id', data: { noIndex: true } })
    payload.logger.warn(
      'Sakelar noIndex DIAKTIFKAN. Matikan lewat Pengaturan → SEO Bawaan setelah konten asli masuk.',
    )
  }

  payload.logger.info('Konten demo selesai diisi.')
  process.exit(0)
}

seed().catch((error: unknown) => {
  const detail = (error as { data?: { errors?: unknown[] } })?.data?.errors
  console.error('Pengisian konten demo gagal:', error)
  if (detail) console.error('Rincian validasi:', JSON.stringify(detail, null, 2))
  process.exit(1)
})
