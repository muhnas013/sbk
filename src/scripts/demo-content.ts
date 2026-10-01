/** Teks konten demo, dipisah dari logika seeding agar mudah ditinjau. */

export const DIVISIONS = [
  {
    name: 'Konstruksi',
    nameEn: 'Construction',
    icon: 'building' as const,
    summary:
      'Pelaksanaan pekerjaan gedung, jalan, jembatan, dan bangunan air dengan pengendalian mutu di setiap tahap.',
    summaryEn:
      'Execution of building, road, bridge, and water infrastructure works with quality control at every stage.',
    description:
      'Divisi Konstruksi menangani pekerjaan sipil mulai dari persiapan lahan hingga serah terima akhir. Setiap paket pekerjaan dikawal pelaksana lapangan bersertifikat, dengan pengujian material dan dokumentasi progres mingguan yang dapat diperiksa pemberi kerja kapan saja.',
  },
  {
    name: 'Konsultansi & Perencanaan',
    nameEn: 'Consulting & Planning',
    icon: 'ruler' as const,
    summary:
      'Studi kelayakan, perencanaan teknis, penyusunan RAB, dan pengawasan pelaksanaan pekerjaan.',
    summaryEn:
      'Feasibility studies, technical planning, cost estimation, and construction supervision.',
    description:
      'Divisi Konsultansi menyiapkan dasar teknis sebelum pekerjaan dimulai: survei kondisi lapangan, perhitungan struktur, gambar kerja, dan rencana anggaran biaya yang dapat dipertanggungjawabkan. Pada tahap pelaksanaan, tim pengawas memastikan hasil kerja sesuai gambar dan spesifikasi.',
  },
  {
    name: 'Pengadaan & Supplier',
    nameEn: 'Procurement & Supply',
    icon: 'truck' as const,
    summary:
      'Penyediaan material konstruksi, peralatan, dan perlengkapan kantor untuk kebutuhan proyek maupun instansi.',
    summaryEn:
      'Supply of construction materials, equipment, and office supplies for projects and institutions.',
    description:
      'Divisi Pengadaan menyediakan material dan peralatan dengan jalur pasok yang jelas serta dokumen asal barang yang lengkap. Pengiriman dijadwalkan mengikuti tahapan pekerjaan di lapangan, sehingga material tidak menumpuk dan tidak pula menghambat pelaksanaan.',
  },
  {
    name: 'Jasa Lainnya',
    nameEn: 'Other Services',
    icon: 'wrench' as const,
    summary:
      'Sewa alat berat, pemeliharaan bangunan, dan jasa pendukung lain yang menunjang kelancaran proyek.',
    summaryEn:
      'Heavy equipment rental, building maintenance, and other services supporting project delivery.',
    description:
      'Di luar tiga lini utama, perusahaan menyediakan jasa pendukung yang sering dibutuhkan bersamaan dengan pekerjaan konstruksi: penyewaan alat berat beserta operatornya, pemeliharaan berkala bangunan, serta pekerjaan perbaikan berskala kecil.',
  },
]

export const SERVICES = [
  {
    division: 0,
    title: 'Pembangunan Gedung',
    titleEn: 'Building Construction',
    summary:
      'Gedung kantor, sekolah, fasilitas kesehatan, dan bangunan publik lainnya, dari pondasi hingga finishing.',
    scope: [
      'Pekerjaan persiapan dan pembersihan lahan',
      'Pekerjaan pondasi dan struktur beton',
      'Pekerjaan arsitektur dan finishing',
      'Instalasi mekanikal, elektrikal, dan plumbing',
      'Pekerjaan lanskap dan fasilitas penunjang',
    ],
    process: [
      {
        title: 'Peninjauan lapangan',
        description: 'Pengukuran ulang, pemeriksaan kondisi tanah, dan identifikasi kendala akses.',
      },
      {
        title: 'Penyusunan jadwal dan metode kerja',
        description: 'Rencana pelaksanaan beserta kebutuhan tenaga, alat, dan material per tahap.',
      },
      {
        title: 'Pelaksanaan bertahap',
        description:
          'Pekerjaan dijalankan per paket dengan pengujian mutu pada setiap titik serah.',
      },
      {
        title: 'Serah terima',
        description:
          'Pemeriksaan bersama, perbaikan temuan, lalu penyerahan beserta dokumen as-built.',
      },
    ],
    faq: [
      {
        question: 'Berapa lama penyusunan penawaran?',
        answer:
          'Tiga sampai lima hari kerja setelah dokumen lelang dan gambar rencana kami terima lengkap.',
      },
      {
        question: 'Apakah menerima pekerjaan di luar kabupaten?',
        answer:
          'Ya, terutama dalam wilayah Kalimantan Selatan dan sekitarnya. Untuk lokasi yang lebih jauh, biaya mobilisasi dihitung terpisah dan disampaikan di muka.',
      },
    ],
  },
  {
    division: 0,
    title: 'Pekerjaan Jalan & Jembatan',
    titleEn: 'Roads & Bridges',
    summary:
      'Peningkatan jalan, pengerasan, pengaspalan, serta pembangunan dan rehabilitasi jembatan.',
    scope: [
      'Pekerjaan tanah dan badan jalan',
      'Lapis pondasi agregat',
      'Pengaspalan hotmix dan penetrasi',
      'Struktur jembatan beton dan baja',
      'Drainase dan bangunan pelengkap',
    ],
    process: [
      {
        title: 'Survei trase',
        description:
          'Pengukuran panjang efektif, kondisi eksisting, dan titik kritis sepanjang ruas.',
      },
      {
        title: 'Rekayasa lapangan',
        description: 'Penyesuaian volume terhadap kondisi nyata, disepakati bersama pengawas.',
      },
      {
        title: 'Pelaksanaan per segmen',
        description: 'Pekerjaan dibagi per segmen agar akses warga tetap terjaga.',
      },
      {
        title: 'Pengujian dan serah terima',
        description: 'Uji kepadatan dan ketebalan lapis sebelum penyerahan.',
      },
    ],
    faq: [],
  },
  {
    division: 0,
    title: 'Bangunan Air & Irigasi',
    titleEn: 'Water & Irrigation Works',
    summary:
      'Rehabilitasi jaringan irigasi, normalisasi saluran, bendung sederhana, dan bangunan pengendali banjir.',
    scope: [
      'Normalisasi dan pengerukan saluran',
      'Pasangan batu dan beton saluran',
      'Pintu air dan bangunan bagi',
      'Tanggul dan perkuatan tebing',
    ],
    process: [],
    faq: [],
  },
  {
    division: 1,
    title: 'Perencanaan & Desain Teknis',
    titleEn: 'Technical Planning & Design',
    summary: 'Gambar kerja, perhitungan struktur, spesifikasi teknis, dan rencana anggaran biaya.',
    scope: [
      'Survei dan investigasi lapangan',
      'Perhitungan struktur dan analisis beban',
      'Gambar kerja dan detail pelaksanaan',
      'Penyusunan RAB dan spesifikasi teknis',
    ],
    process: [
      {
        title: 'Pengumpulan data',
        description: 'Survei topografi, penyelidikan tanah, dan inventarisasi kondisi eksisting.',
      },
      {
        title: 'Konsep perencanaan',
        description: 'Alternatif rancangan beserta implikasi biaya, dibahas bersama pemberi kerja.',
      },
      {
        title: 'Perencanaan rinci',
        description: 'Gambar kerja, perhitungan, dan dokumen pengadaan yang siap dilelangkan.',
      },
    ],
    faq: [],
  },
  {
    division: 1,
    title: 'Pengawasan Pelaksanaan',
    titleEn: 'Construction Supervision',
    summary:
      'Pengawasan harian mutu dan volume pekerjaan, pelaporan berkala, serta pendampingan serah terima.',
    scope: [
      'Pengawasan mutu material dan pekerjaan',
      'Pemeriksaan volume dan progres',
      'Laporan harian, mingguan, dan bulanan',
      'Pendampingan pemeriksaan dan serah terima',
    ],
    process: [],
    faq: [],
  },
  {
    division: 1,
    title: 'Studi Kelayakan',
    titleEn: 'Feasibility Studies',
    summary:
      'Kajian teknis, ekonomi, dan lingkungan sebelum keputusan investasi pembangunan diambil.',
    scope: [
      'Analisis kebutuhan dan manfaat',
      'Kajian teknis dan alternatif lokasi',
      'Perkiraan biaya investasi',
      'Rekomendasi kelayakan',
    ],
    process: [],
    faq: [],
  },
  {
    division: 2,
    title: 'Pengadaan Material Konstruksi',
    titleEn: 'Construction Material Supply',
    summary:
      'Semen, besi, agregat, kayu, dan material bangunan lain dengan dokumen asal barang yang lengkap.',
    scope: [
      'Semen, besi beton, dan baja struktur',
      'Agregat, pasir, dan batu pecah',
      'Material finishing dan sanitasi',
      'Pengiriman terjadwal ke lokasi proyek',
    ],
    process: [],
    faq: [
      {
        question: 'Apakah melayani pengadaan skala kecil?',
        answer: 'Ya. Tidak ada nilai minimum untuk pengadaan dalam wilayah Hulu Sungai Selatan.',
      },
    ],
  },
  {
    division: 3,
    title: 'Sewa Alat Berat',
    titleEn: 'Heavy Equipment Rental',
    summary:
      'Excavator, vibro roller, dump truck, dan concrete mixer beserta operator berpengalaman.',
    scope: [
      'Excavator dan backhoe',
      'Vibro roller dan compactor',
      'Dump truck dan angkutan material',
      'Concrete mixer dan pompa beton',
    ],
    process: [],
    faq: [],
  },
]

export const PROJECTS = [
  {
    title: 'Pembangunan Gedung Kantor Kecamatan Kandangan',
    location: 'Kandangan',
    division: 0,
    category: 0,
    year: 2025,
    status: 'completed',
    scope: [
      'Pekerjaan persiapan',
      'Struktur beton bertulang dua lantai',
      'Arsitektur dan finishing',
      'Instalasi listrik dan sanitasi',
    ],
    summary:
      'Gedung kantor dua lantai dengan luas bangunan 840 m², diselesaikan dalam 180 hari kalender.',
  },
  {
    title: 'Peningkatan Jalan Poros Desa Angkinang',
    location: 'Angkinang',
    division: 0,
    category: 1,
    year: 2025,
    status: 'completed',
    scope: [
      'Pekerjaan tanah dan badan jalan',
      'Lapis pondasi agregat kelas A',
      'Pengaspalan hotmix',
      'Pekerjaan drainase',
    ],
    summary: 'Peningkatan ruas jalan sepanjang 3,2 km, dari jalan tanah menjadi perkerasan aspal.',
  },
  {
    title: 'Rehabilitasi Jaringan Irigasi Daha Selatan',
    location: 'Daha Selatan',
    division: 0,
    category: 2,
    year: 2024,
    status: 'completed',
    scope: ['Normalisasi saluran primer', 'Pasangan batu saluran sekunder', 'Perbaikan pintu air'],
    summary: 'Rehabilitasi jaringan irigasi yang melayani area persawahan seluas 420 hektare.',
  },
  {
    title: 'Pembangunan Jembatan Penghubung Simpur',
    location: 'Simpur',
    division: 0,
    category: 1,
    year: 2024,
    status: 'completed',
    scope: [
      'Pekerjaan pondasi sumuran',
      'Abutment dan pilar beton',
      'Gelagar baja komposit',
      'Lantai jembatan dan sandaran',
    ],
    summary:
      'Jembatan bentang 24 meter yang menghubungkan dua desa, menggantikan jembatan kayu lama.',
  },
  {
    title: 'Perencanaan Teknis Gedung Puskesmas Sungai Raya',
    location: 'Sungai Raya',
    division: 1,
    category: 0,
    year: 2025,
    status: 'completed',
    scope: [
      'Survei dan penyelidikan tanah',
      'Perhitungan struktur',
      'Gambar kerja lengkap',
      'Rencana anggaran biaya',
    ],
    summary:
      'Perencanaan teknis puskesmas rawat inap, termasuk gambar kerja dan dokumen pengadaan.',
  },
  {
    title: 'Pengawasan Pembangunan Gedung Sekolah Telaga Langsat',
    location: 'Telaga Langsat',
    division: 1,
    category: 0,
    year: 2025,
    status: 'ongoing',
    scope: ['Pengawasan mutu pekerjaan', 'Pemeriksaan volume', 'Pelaporan berkala'],
    summary:
      'Pengawasan pelaksanaan pembangunan enam ruang kelas baru beserta fasilitas penunjang.',
  },
  {
    title: 'Pengadaan Material Konstruksi Paket Infrastruktur Desa',
    location: 'Hulu Sungai Selatan',
    division: 2,
    category: 3,
    year: 2025,
    status: 'completed',
    scope: ['Semen dan besi beton', 'Agregat dan pasir', 'Pengiriman bertahap ke 12 titik lokasi'],
    summary: 'Penyediaan material untuk program pembangunan infrastruktur di dua belas desa.',
  },
  {
    title: 'Normalisasi Saluran Drainase Kota Kandangan',
    location: 'Kandangan',
    division: 0,
    category: 2,
    year: 2026,
    status: 'ongoing',
    scope: ['Pengerukan sedimen', 'Pasangan batu dinding saluran', 'Perbaikan gorong-gorong'],
    summary:
      'Normalisasi saluran drainase sepanjang 1,8 km untuk mengurangi genangan di kawasan pasar.',
  },
  {
    title: 'Pembangunan Pasar Desa Loksado',
    location: 'Loksado',
    division: 0,
    category: 0,
    year: 2026,
    status: 'planned',
    scope: ['Pekerjaan struktur los pasar', 'Atap baja ringan', 'Sanitasi dan pengelolaan sampah'],
    summary: 'Pembangunan los pasar desa beserta fasilitas sanitasi dan pengelolaan sampah.',
  },
]

export const TEAM = [
  {
    name: 'H. Abdul Rahman',
    position: 'Direktur Utama',
    positionEn: 'President Director',
    bio: 'Memimpin perusahaan sejak didirikan, dengan latar belakang teknik sipil dan pengalaman lebih dari dua puluh tahun di pekerjaan infrastruktur daerah.',
  },
  {
    name: 'Hendra Setiawan, S.T.',
    position: 'Direktur Operasional',
    positionEn: 'Operations Director',
    bio: 'Mengawasi pelaksanaan seluruh paket pekerjaan di lapangan, termasuk penjadwalan sumber daya dan pengendalian mutu.',
  },
  {
    name: 'Ir. Siti Maryam',
    position: 'Manajer Teknik',
    positionEn: 'Technical Manager',
    bio: 'Bertanggung jawab atas perencanaan teknis, perhitungan struktur, dan penyusunan dokumen penawaran.',
  },
  {
    name: 'Ahmad Fauzi, S.T.',
    position: 'Manajer Proyek',
    positionEn: 'Project Manager',
    bio: 'Memimpin tim pelaksana lapangan dan menjadi penghubung utama dengan pengawas serta pemberi kerja.',
  },
  {
    name: 'Dewi Lestari, S.E.',
    position: 'Manajer Keuangan & Administrasi',
    positionEn: 'Finance & Administration Manager',
    bio: 'Menangani administrasi kontrak, penagihan, perpajakan, dan kelengkapan dokumen legalitas perusahaan.',
  },
]

export const CERTIFICATIONS = [
  { name: 'Nomor Induk Berusaha (NIB)', issuer: 'Lembaga OSS', number: '08120100xxxxx' },
  { name: 'Sertifikat Badan Usaha (SBU) Konstruksi', issuer: 'LPJK', number: 'SBU-0-xxxxxx' },
  {
    name: 'Sertifikat Standar Usaha Jasa Konsultansi',
    issuer: 'Lembaga OSS',
    number: 'SS-JK-xxxxx',
  },
  { name: 'Akta Pendirian Perusahaan', issuer: 'Notaris & PPAT', number: 'No. 14 / 2014' },
  {
    name: 'Nomor Pokok Wajib Pajak (NPWP)',
    issuer: 'Direktorat Jenderal Pajak',
    number: 'xx.xxx.xxx.x-xxx.xxx',
  },
  {
    name: 'Sertifikat Sistem Manajemen Keselamatan Konstruksi',
    issuer: 'Lembaga Sertifikasi',
    number: 'SMKK-xxxx',
  },
]

export const CLIENTS = [
  { name: 'Pemerintah Kabupaten Hulu Sungai Selatan', category: 'government' as const },
  { name: 'Dinas Pekerjaan Umum dan Penataan Ruang', category: 'government' as const },
  { name: 'Dinas Pendidikan Kabupaten', category: 'government' as const },
  { name: 'Dinas Kesehatan Kabupaten', category: 'government' as const },
  { name: 'Perumda Air Minum', category: 'soe' as const },
  { name: 'PT Mitra Bangun Sejahtera', category: 'private' as const },
  { name: 'CV Karya Mandiri Utama', category: 'private' as const },
  { name: 'PT Sumber Rezeki Kalimantan', category: 'private' as const },
]

export const TESTIMONIALS = [
  {
    quote:
      'Pekerjaan diselesaikan sebelum batas waktu kontrak dengan mutu yang sesuai spesifikasi. Komunikasi di lapangan juga berjalan baik, setiap kendala segera disampaikan tanpa menunggu rapat.',
    name: 'Muhammad Ridwan, S.T.',
    position: 'Pejabat Pembuat Komitmen',
    organization: 'Dinas Pekerjaan Umum',
  },
  {
    quote:
      'Dokumen administrasi lengkap dan rapi sejak awal. Ini sangat membantu proses pemeriksaan dan pencairan termin, yang biasanya menjadi bagian paling memakan waktu.',
    name: 'Hj. Norhasanah, S.E.',
    position: 'Kepala Bagian Pengadaan',
    organization: 'Sekretariat Daerah',
  },
  {
    quote:
      'Tim pengawasnya teliti. Beberapa temuan kecil di lapangan diperbaiki sebelum kami sempat menyampaikannya secara resmi.',
    name: 'Ir. Bambang Sucipto',
    position: 'Konsultan Manajemen Konstruksi',
    organization: 'Proyek Gedung Sekolah',
  },
  {
    quote:
      'Pengiriman material mengikuti tahapan pekerjaan, jadi tidak ada penumpukan di lokasi yang terbatas. Hal kecil, tapi berpengaruh besar di lapangan.',
    name: 'Yusuf Hidayat',
    position: 'Pelaksana Lapangan',
    organization: 'Program Infrastruktur Desa',
  },
]

export const POSTS = [
  {
    title: 'Penyelesaian Pembangunan Gedung Kantor Kecamatan Kandangan',
    excerpt:
      'Pekerjaan diselesaikan dalam 180 hari kalender dan telah diserahterimakan kepada pemberi kerja.',
    body: 'Pembangunan gedung kantor kecamatan dua lantai dengan luas bangunan 840 m² telah selesai dan diserahterimakan. Pekerjaan mencakup struktur beton bertulang, pekerjaan arsitektur, serta instalasi listrik dan sanitasi. Seluruh tahapan diselesaikan sesuai jadwal tanpa perpanjangan waktu.',
  },
  {
    title: 'Penerapan Sistem Manajemen Keselamatan Konstruksi di Seluruh Paket Pekerjaan',
    excerpt:
      'Seluruh pekerja lapangan kini wajib mengikuti pengarahan keselamatan sebelum memulai pekerjaan harian.',
    body: 'Perusahaan menerapkan prosedur keselamatan yang seragam di seluruh paket pekerjaan, mencakup pengarahan harian, penggunaan alat pelindung diri, dan pencatatan insiden. Penerapan ini menjadi syarat internal sebelum pekerjaan di suatu lokasi dapat dimulai.',
  },
  {
    title: 'Peningkatan Jalan Poros Desa Angkinang Rampung Lebih Cepat',
    excerpt:
      'Ruas jalan sepanjang 3,2 km kini sudah dapat dilalui kendaraan roda empat sepanjang tahun.',
    body: 'Pekerjaan peningkatan jalan poros desa sepanjang 3,2 km telah rampung. Ruas yang sebelumnya berupa jalan tanah dan sulit dilalui pada musim hujan kini berlapis aspal hotmix dengan saluran drainase di kedua sisi.',
  },
  {
    title: 'Kerja Sama Pengadaan Material untuk Program Infrastruktur Desa',
    excerpt:
      'Pengiriman material dijadwalkan bertahap ke dua belas titik lokasi mengikuti progres pekerjaan.',
    body: 'Perusahaan dipercaya menyediakan material konstruksi untuk program pembangunan infrastruktur di dua belas desa. Pengiriman dijadwalkan bertahap mengikuti progres pekerjaan di masing-masing lokasi agar material tidak menumpuk.',
  },
  {
    title: 'Pembukaan Lowongan Pelaksana Lapangan dan Juru Ukur',
    excerpt:
      'Perusahaan membuka kesempatan bagi tenaga teknis untuk bergabung pada paket pekerjaan tahun ini.',
    body: 'Seiring bertambahnya paket pekerjaan tahun ini, perusahaan membuka lowongan untuk posisi pelaksana lapangan dan juru ukur. Berkas lamaran dapat dikirim melalui halaman Karier di situs ini.',
  },
]

export const JOBS = [
  {
    title: 'Pelaksana Lapangan',
    division: 0,
    location: 'Hulu Sungai Selatan',
    type: 'full-time' as const,
    headcount: 2,
    description:
      'Memimpin pelaksanaan pekerjaan harian di lokasi proyek, mengatur tenaga kerja dan material, serta melaporkan progres kepada manajer proyek.',
    responsibilities: [
      'Mengatur pelaksanaan pekerjaan harian di lapangan',
      'Memeriksa mutu dan volume pekerjaan',
      'Menyusun laporan harian dan mingguan',
      'Berkoordinasi dengan pengawas dan pemberi kerja',
    ],
    qualifications: [
      'Pendidikan minimal D3 Teknik Sipil',
      'Pengalaman minimal 2 tahun pada pekerjaan sejenis',
      'Menguasai pembacaan gambar kerja',
      'Bersedia ditempatkan di lokasi proyek',
    ],
    benefits: [
      'Gaji sesuai pengalaman',
      'Tunjangan lapangan dan transportasi',
      'BPJS Ketenagakerjaan dan Kesehatan',
    ],
  },
  {
    title: 'Juru Ukur (Surveyor)',
    division: 1,
    location: 'Hulu Sungai Selatan',
    type: 'full-time' as const,
    headcount: 1,
    description:
      'Melakukan pengukuran lapangan, pematokan, dan penyajian data ukur untuk keperluan perencanaan maupun pelaksanaan pekerjaan.',
    responsibilities: [
      'Melakukan pengukuran topografi dan pematokan',
      'Mengolah data ukur menjadi gambar situasi',
      'Memeriksa kesesuaian hasil pekerjaan terhadap gambar',
    ],
    qualifications: [
      'Pendidikan minimal SMK Bangunan atau D3 Teknik Sipil/Geodesi',
      'Menguasai penggunaan total station dan waterpass',
      'Menguasai AutoCAD',
    ],
    benefits: [
      'Gaji sesuai pengalaman',
      'Tunjangan lapangan',
      'BPJS Ketenagakerjaan dan Kesehatan',
    ],
  },
  {
    title: 'Staf Administrasi Proyek',
    division: 0,
    location: 'Kandangan',
    type: 'contract' as const,
    headcount: 1,
    description:
      'Mengelola dokumen administrasi proyek, mulai dari kontrak, berita acara, hingga kelengkapan berkas penagihan.',
    responsibilities: [
      'Menyusun dan merapikan dokumen proyek',
      'Menyiapkan berkas penagihan termin',
      'Mengarsipkan korespondensi dengan pemberi kerja',
    ],
    qualifications: [
      'Pendidikan minimal D3 segala jurusan',
      'Teliti dan terbiasa bekerja dengan dokumen',
      'Menguasai Microsoft Office',
    ],
    benefits: ['Gaji sesuai pengalaman', 'BPJS Ketenagakerjaan dan Kesehatan'],
  },
]
