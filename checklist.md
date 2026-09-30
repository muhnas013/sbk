# Checklist Pengerjaan — Website PT Sabhumi Karya Barito

> Acuan: [`prd.md`](./prd.md) · Diperbarui terakhir: 30 September 2026
> Tandai `[x]` bila selesai. Item bertanda 🔴 adalah _blocker_ — menahan pekerjaan lain.
> Item bertanda 👤 menunggu input dari pihak perusahaan, bukan developer.

**Progres keseluruhan:** 91 / 260 item

| Fase                    | Status         | Progres |
| ----------------------- | -------------- | ------- |
| 0. Pra-Pengerjaan       | ⬜ Belum mulai | 0/14    |
| 1. Fondasi              | 🟡 Berjalan    | 35/39   |
| 2. Model Konten & Admin | 🟡 Berjalan    | 56/61   |
| 3. Halaman Inti         | ⬜ Belum mulai | 0/39    |
| 4. Modul Tambahan       | ⬜ Belum mulai | 0/26    |
| 5. Kualitas & Hardening | ⬜ Belum mulai | 0/45    |
| 6. Konten & Peluncuran  | ⬜ Belum mulai | 0/30    |
| Pasca-Peluncuran        | ⬜ Belum mulai | 0/6     |

---

## Fase 0 — Pra-Pengerjaan (Keputusan & Aset)

Fase ini harus tuntas sebelum Fase 1 dimulai agar tidak ada rework.

### 0.1 Keputusan yang Menunggu Jawaban

- [ ] 🔴 👤 Konfirmasi nama domain (sudah dimiliki / perlu didaftarkan) + akses DNS
- [ ] 🔴 👤 Logo resmi format vektor (SVG/AI/EPS) — versi terang & gelap
- [ ] 👤 Panduan brand: warna resmi, font resmi (jika ada). Jika tidak ada → pakai usulan PRD §10.2
- [ ] 👤 Keputusan: nilai kontrak proyek boleh tampil publik atau selalu disembunyikan
- [ ] 👤 Keputusan: dokumen legalitas ditampilkan sebagai gambar watermark / PDF unduh / form-gated
- [ ] 👤 Keputusan: modul Berita/Artikel masuk Fase 1 atau ditunda (akan diisi rutin atau tidak?)
- [ ] 👤 Daftar calon akun admin + perannya masing-masing
- [ ] 👤 Alamat email penerima notifikasi form kontak
- [ ] 👤 Alamat email penerima notifikasi lamaran kerja (HR)
- [ ] 👤 Status akun Google Analytics & Search Console (sudah ada / perlu dibuat)

### 0.2 Pengadaan Infrastruktur

- [ ] 🔴 VPS disiapkan (min. 2 vCPU / 4 GB RAM / 50 GB SSD, Ubuntu 24.04 LTS)
- [ ] Akses SSH ke VPS + user non-root dengan sudo
- [ ] Akun object storage untuk backup off-site (S3-compatible: Wasabi/Backblaze/IDCloudHost)
- [ ] Akun layanan email transaksional (SMTP/Resend) untuk notifikasi form

---

## Fase 1 — Fondasi (± 1 minggu)

> Stack final: **Next.js 16.3.7 + Payload CMS 3.90.2 + PostgreSQL 16 + Tailwind CSS 4**.
> PRD menulis Next.js 15; Payload 3.90 sudah mendukung Next 16 sehingga dipakai versi
> terbaru agar masa dukungan lebih panjang.

### 1.1 Repositori & Tooling

- [x] Inisialisasi repositori Git, branch `main` & `dev`
- [x] Setup Next.js 16 (App Router) + TypeScript (strict mode, `noUncheckedIndexedAccess`)
- [x] Integrasi Payload CMS 3 ke dalam aplikasi Next.js (route group `(payload)`)
- [x] Konfigurasi adapter PostgreSQL untuk Payload
- [x] Setup Tailwind CSS v4 + komponen dasar berbasis CVA (pola shadcn, tanpa CLI-nya — Radix baru ditarik saat benar-benar dibutuhkan)
- [x] Konfigurasi ESLint + Prettier + `lint-staged` + Husky pre-commit hook
- [x] Buat `.env.example` berisi seluruh variabel yang dibutuhkan (tanpa nilai rahasia)
- [x] Tambahkan `.gitignore` (node_modules, .env, /media, .next)
- [x] Buat `README.md`: cara setup lokal, perintah penting, struktur folder

### 1.2 Kontainerisasi & Lingkungan Lokal

- [x] `Dockerfile` multi-stage untuk aplikasi Next.js (build → runner, non-root user)
- [x] `docker-compose.yml`: service `app`, `db` (Postgres 16), `caddy`, `backup`
- [x] Volume persisten untuk data Postgres dan folder media
- [x] `Caddyfile`: reverse proxy, HTTPS otomatis, security headers, kompresi brotli/gzip
- [x] Verifikasi `docker compose config` valid (seluruh variabel & dependensi service terbaca)
- [ ] Verifikasi build image `app` — belum bisa diuji di mesin ini: proses `docker build` tidak punya akses jaringan sehingga `npm ci` gagal. Diuji di VPS/CI.
- [ ] 🔴 Verifikasi `docker compose up` end-to-end di VPS (menunggu VPS & domain)
- [x] Endpoint health check `/health`

### 1.3 Design System

- [x] Definisikan design token (warna, spasi, radius) di `@theme` Tailwind
- [x] Self-host font Plus Jakarta Sans & Inter via `next/font`
- [x] Skala tipografi + komponen `Heading` / `Eyebrow` / `Lead`
- [x] Komponen dasar: Button, ButtonLink, Badge, Card, Input, Textarea, Select, Checkbox, Field
- [x] Komponen layout: Container, Section
- [x] Komponen navigasi: Header (sticky, dropdown divisi, drawer mobile), Footer
- [x] Komponen pengalih bahasa ID/EN (mempertahankan halaman aktif)
- [x] Komponen Breadcrumb
- [x] Tombol WhatsApp melayang
- [x] Halaman error kustom: 404 dan error boundary
- [x] Skip-to-content link + focus ring + dukungan `prefers-reduced-motion`

### 1.4 CI/CD & Staging

- [x] GitHub Actions: lint + format check + typecheck + build pada setiap push
- [x] GitHub Actions: `npm audit --audit-level=high` sebagai job terpisah
- [x] Workflow deploy otomatis ke VPS saat push ke `main` (+ verifikasi health check)
- [ ] 🔴 Subdomain staging (`staging.<domain>`) aktif dengan HTTPS (menunggu domain)
- [ ] 🔴 Deploy pertama ke staging berhasil (menunggu VPS & domain)

### 1.5 Verifikasi Fase 1

- [x] `npm run lint` bersih
- [x] `npm run typecheck` bersih
- [x] `npm run build` berhasil
- [x] Routing bahasa berfungsi: `/` → `/id`, `/id` dan `/en` membalas 200
- [x] Panel admin `/admin` dapat diakses & skema database ter-push otomatis
- [x] Tabel `*_locales` terbentuk — localization Payload aktif

## Fase 2 — Model Konten & Panel Admin (± 1,5 minggu)

### 2.1 Konfigurasi Inti Payload

- [x] Aktifkan localization (locale `id` sebagai default, `en` fallback ke `id`)
- [x] Konfigurasi upload: batas ukuran per koleksi, whitelist MIME, penyimpanan di volume
- [x] Konfigurasi image resizing (Sharp): thumbnail 400px, card 768px, hero 1920px + WebP
- [x] Aktifkan versioning + draft pada koleksi yang relevan
- [ ] Konfigurasi Live Preview (menunggu rute front-end Fase 3)
- [x] Lokalkan label panel admin ke Bahasa Indonesia (`@payloadcms/translations`, Inggris tetap tersedia)
- [ ] 🔴 Kustomisasi branding panel admin (logo & ikon perusahaan) — menunggu logo vektor

### 2.2 Collections

- [x] `users` — auth, peran, avatar, status aktif, catatan login terakhir
- [x] `media` — alt & caption dwibahasa, focal point, kredit foto
- [x] `divisions` — 4 divisi awal (Konstruksi, Konsultansi, Supplier, Jasa Lain)
- [x] `services`
- [x] `project-categories`
- [x] `projects` — termasuk toggle tampil/sembunyikan nilai kontrak (bawaan: sembunyi)
- [x] `team`
- [x] `clients`
- [x] `testimonials`
- [x] `certifications` — termasuk masa berlaku & opsi form-gated download
- [x] `post-categories`
- [x] `posts` — penulis & tanggal terbit terisi otomatis
- [x] `jobs`
- [x] `job-applications` — tidak dapat dibuat langsung dari publik, hanya lewat route handler
- [x] `documents` — dengan counter unduhan
- [x] `contact-submissions` — dengan flag sudah dibaca + metadata IP/user agent
- [x] `pages` — dengan block builder
- [x] `redirects` — via `@payloadcms/plugin-redirects`, hanya Admin ke atas
- [x] `activity-logs` — tambahan di luar PRD, menopang kebutuhan audit log §6.1

### 2.3 Globals

- [x] `site-settings` — identitas, kontak, sosmed, koordinat peta, legalitas ringkas, ID analytics
- [x] `navigation` — menu header (bertingkat) & footer (multi-kolom)
- [x] `homepage` — hero, sekilas perusahaan, statistik, CTA, pemilihan & urutan section
- [x] `seo-defaults` — judul/deskripsi/OG bawaan + sakelar noindex untuk staging

### 2.4 Block Builder

- [x] Block: Hero
- [x] Block: Rich Text
- [x] Block: Teks + Gambar (2 kolom, bisa dibalik)
- [x] Block: Grid Kartu
- [x] Block: Statistik/Counter
- [x] Block: Galeri
- [x] Block: CTA Banner
- [x] Block: FAQ (accordion)
- [x] Block: Daftar Konten Dinamis (tarik proyek/berita/layanan/divisi terbaru)
- [x] Block tambahan: Daftar Poin (feature list)

> Definisi blok selesai; komponen yang me-render blok dibangun pada Fase 3.

### 2.5 Hak Akses & Keamanan Admin

- [x] RBAC: Super Admin, Admin, Editor, HR, Viewer — access control per koleksi
- [x] Field-level access: hanya Super Admin yang dapat mengubah peran & status akun (anti eskalasi hak akses)
- [x] Kebijakan kata sandi: minimal 12 karakter + wajib huruf besar/kecil/angka
- [x] Rate limiting login: 5 percobaan gagal → akun terkunci 15 menit
- [x] Sesi: httpOnly, SameSite=Strict, Secure di produksi, kedaluwarsa 8 jam
- [x] Audit log perubahan konten (siapa, apa, kapan) — otomatis untuk seluruh koleksi
- [x] Validasi tipe & ukuran berkas pada seluruh unggahan, dengan pesan galat berbahasa Indonesia
- [x] Proteksi CSRF aktif — permintaan tulis berbasis cookie tanpa Origin yang sah ditolak
- [ ] 2FA (TOTP) wajib untuk Super Admin & Admin — **belum dikerjakan**, butuh strategi auth kustom Payload
- [ ] Notifikasi email saat login dari perangkat/IP baru — menunggu adapter email (Fase 4)
- [ ] 👤 **Keputusan diperlukan:** PRD meminta argon2id. Payload 3.90 memakai PBKDF2-SHA256 600.000 iterasi
      (sesuai rekomendasi OWASP terkini). Mengganti ke argon2id berarti menambal internal framework
      dan menanggung risiko saat upgrade. Rekomendasi: tetap pakai bawaan Payload.

### 2.6 Dashboard & Data Awal

- [x] Widget dashboard: jumlah proyek, berita, pesan belum dibaca, lamaran baru
- [x] Widget: peringatan sertifikasi yang akan kedaluwarsa (< 90 hari)
- [x] Script seeding data contoh (`npm run seed`) — idempoten, menolak jalan di produksi
- [x] Uji end-to-end lewat REST API: buat/baca dokumen, audit log tercatat, hak akses ditegakkan

### 2.7 Verifikasi Fase 2

- [x] Skema database ter-push bersih: 163 tabel, tanpa galat
- [x] Konten ID & EN tersimpan terpisah dan terbaca lewat `?locale=`
- [x] Koleksi privat (`users`, `contact-submissions`, `job-applications`) membalas 403 untuk publik
- [x] Audit log mencatat aksi beserta pelakunya
- [x] Widget dashboard ter-render di `/admin`
- [x] `npm run lint`, `typecheck`, dan `build` bersih

## Fase 3 — Halaman Inti (± 2 minggu)

### 3.1 Beranda

- [ ] Section Hero
- [ ] Section Sekilas Perusahaan
- [ ] Section Divisi Usaha (4 kartu)
- [ ] Section Statistik (counter animasi)
- [ ] Section Proyek Terpilih
- [ ] Section Legalitas & Sertifikasi
- [ ] Section Testimoni (carousel)
- [ ] Section Klien & Mitra (marquee logo)
- [ ] Section Berita Terbaru
- [ ] Section CTA Penutup
- [ ] Urutan & visibilitas section dapat diatur dari admin

### 3.2 Tentang Kami

- [ ] Hero + profil perusahaan
- [ ] Timeline sejarah singkat
- [ ] Visi & Misi
- [ ] Nilai perusahaan (ikon + judul + deskripsi)
- [ ] Struktur organisasi
- [ ] Tim manajemen (grid foto + bio)

### 3.3 Layanan & Divisi

- [ ] `/layanan` — daftar dikelompokkan per divisi
- [ ] `/divisi/[slug]` — hero, deskripsi, layanan terkait, proyek terkait, CTA
- [ ] `/layanan/[slug]` — deskripsi, lingkup pekerjaan, alur proses, galeri, FAQ, proyek terkait

### 3.4 Proyek

- [ ] `/proyek` — grid kartu + pagination
- [ ] Filter: divisi, kategori, tahun, status (state tersimpan di URL query)
- [ ] Pencarian teks
- [ ] `/proyek/[slug]` — hero, tabel spesifikasi, deskripsi, galeri
- [ ] Galeri dengan lightbox (navigasi keyboard, tombol tutup, swipe di mobile)
- [ ] Section proyek terkait
- [ ] Logika sembunyikan nilai kontrak sesuai toggle admin

### 3.5 Kontak

- [ ] Form kontak (nama, email, telepon, perusahaan, divisi tujuan, subjek, pesan)
- [ ] Validasi sisi klien & server (Zod)
- [ ] Integrasi Cloudflare Turnstile + honeypot + rate limit per IP
- [ ] Simpan ke `contactSubmissions` + kirim notifikasi email
- [ ] Halaman/state sukses & penanganan error
- [ ] Blok informasi kontak + jam operasional
- [ ] Embed Google Maps (lazy load, tidak memblokir render)

### 3.6 Internasionalisasi

- [ ] Routing `/id` & `/en` berfungsi di semua halaman
- [ ] Pengalih bahasa mempertahankan halaman yang sedang dibuka
- [ ] Fallback otomatis ke ID bila konten EN kosong
- [ ] Terjemahan string UI statis (tombol, label, pesan error)
- [ ] Tag `hreflang` + canonical benar

---

## Fase 4 — Modul Tambahan (± 1,5 minggu)

### 4.1 Legalitas & Sertifikasi

- [ ] Halaman `/legalitas` — kartu/tabel dokumen
- [ ] Tampilan gambar ber-watermark otomatis
- [ ] Logika form-gated download (bila diaktifkan per dokumen)
- [ ] Indikator masa berlaku

### 4.2 Klien & Mitra

- [ ] Halaman `/klien` — grid logo dikelompokkan (Pemerintah / BUMN / Swasta)
- [ ] Section testimoni

### 4.3 Berita/Artikel

- [ ] `/berita` — daftar + filter kategori + pencarian + pagination
- [ ] `/berita/[slug]` — artikel, penulis, tanggal, tombol berbagi
- [ ] Artikel terkait
- [ ] Penjadwalan publikasi berfungsi
- [ ] RSS feed (opsional)

### 4.4 Karier

- [ ] `/karier` — daftar lowongan aktif
- [ ] `/karier/[slug]` — detail lowongan
- [ ] Form lamaran + unggah CV (PDF/DOC, maks 5 MB)
- [ ] Checkbox persetujuan pemrosesan data pribadi (wajib, UU PDP)
- [ ] Simpan ke `jobApplications` + notifikasi email ke HR
- [ ] Panel admin: filter pelamar, ubah status, unduh CV, catatan internal
- [ ] Lowongan yang lewat batas waktu otomatis tertutup
- [ ] Structured data `JobPosting`

### 4.5 Download Center

- [ ] Halaman `/unduhan` — daftar dokumen per kategori
- [ ] Tampilkan tipe berkas & ukuran otomatis
- [ ] Counter unduhan bertambah saat file diunduh
- [ ] Berkas disajikan lewat route terkontrol (tidak langsung dari path publik)

### 4.6 Halaman Statis & Legal

- [ ] Halaman Kebijakan Privasi
- [ ] Halaman Syarat Penggunaan
- [ ] Sistem halaman statis via block builder berfungsi untuk halaman baru

---

## Fase 5 — Kualitas & Hardening (± 1 minggu)

### 5.1 SEO

- [ ] Meta title & description per halaman, dapat diatur dari admin
- [ ] Open Graph + Twitter Card, termasuk OG image default
- [ ] JSON-LD `Organization` & `LocalBusiness`
- [ ] JSON-LD `BreadcrumbList`
- [ ] JSON-LD `Article` pada berita
- [ ] JSON-LD `JobPosting` pada lowongan
- [ ] `sitemap.xml` otomatis (mencakup kedua bahasa)
- [ ] `robots.txt`
- [ ] Sistem redirect 301 berfungsi
- [ ] Slug Bahasa Indonesia & URL bersih di seluruh rute

### 5.2 Performa

- [ ] Seluruh gambar melalui `next/image` dengan `sizes` yang tepat
- [ ] Prioritas LCP image di hero (`priority`)
- [ ] Audit bundle JS, hapus dependensi tak terpakai
- [ ] Static generation + ISR pada halaman konten
- [ ] Caching header di Caddy untuk aset statis
- [ ] Lighthouse mobile ≥ 90 di beranda
- [ ] Lighthouse mobile ≥ 90 di daftar proyek
- [ ] Lighthouse mobile ≥ 90 di detail proyek
- [ ] Ukuran beranda terkompresi < 1,5 MB

### 5.3 Keamanan

- [ ] Security headers lengkap: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [ ] Peringkat A di securityheaders.com
- [ ] `npm audit` bersih dari temuan High/Critical
- [ ] Aktifkan Dependabot / Renovate
- [ ] Uji negatif unggahan berkas (tipe & ukuran terlarang ditolak)
- [ ] Uji rate limiting pada form & login
- [ ] Pastikan tidak ada variabel rahasia yang bocor ke bundle klien
- [ ] Nonaktifkan directory listing & endpoint debug di produksi
- [ ] Firewall VPS (ufw): hanya port 22, 80, 443
- [ ] SSH: nonaktifkan login password & login root, hanya kunci

### 5.4 Aksesibilitas

- [ ] Audit axe DevTools bersih di seluruh halaman utama
- [ ] Kontras warna minimal 4,5:1 terverifikasi
- [ ] Navigasi penuh via keyboard + focus indicator jelas
- [ ] Struktur heading benar (satu `h1` per halaman)
- [ ] Semua gambar bermakna punya alt text
- [ ] Semua field form punya label terkait
- [ ] `prefers-reduced-motion` dihormati oleh seluruh animasi
- [ ] Skip-to-content link

### 5.5 Kepatuhan & Analytics

- [ ] Banner persetujuan cookie
- [ ] Google Analytics 4 hanya aktif setelah persetujuan
- [ ] Verifikasi Google Search Console
- [ ] Kebijakan retensi data pelamar (auto-hapus 12 bulan) terimplementasi

### 5.6 Pengujian Lintas Perangkat

- [ ] Uji Chrome, Firefox, Safari, Edge (2 versi terakhir)
- [ ] Uji breakpoint 360 / 768 / 1024 / 1440 / 1920 px
- [ ] Uji pada perangkat Android & iOS fisik
- [ ] Uji pada koneksi lambat (throttle 4G)

---

## Fase 6 — Konten & Peluncuran (± 1 minggu)

### 6.1 Pengisian Konten

- [ ] 👤 Teks profil, sejarah, visi, misi, nilai perusahaan
- [ ] 👤 Foto & bio tim manajemen
- [ ] 👤 Minimal 5 proyek lengkap dengan foto berkualitas
- [ ] 👤 Deskripsi seluruh layanan per divisi
- [ ] 👤 Dokumen legalitas yang boleh ditampilkan publik
- [ ] 👤 Logo klien + izin penggunaan logo
- [ ] 👤 Testimoni klien (minimal 3)
- [ ] 👤 Company profile PDF untuk Download Center
- [ ] Terjemahan EN untuk seluruh konten publik
- [ ] Optimasi & kompresi seluruh gambar sebelum unggah
- [ ] Isi seluruh meta SEO per halaman

### 6.2 Infrastruktur Produksi

- [ ] Pointing DNS domain ke VPS
- [ ] Sertifikat HTTPS produksi aktif & auto-renew terverifikasi
- [ ] Redirect `www` → non-www (atau sebaliknya) konsisten
- [ ] Script backup harian: `pg_dump` + arsip media
- [ ] Unggah backup ke object storage off-site, retensi 30 hari
- [ ] 🔴 Uji restore backup ke staging — wajib berhasil sebelum go-live
- [ ] Monitoring uptime + alert (Uptime Kuma / UptimeRobot)
- [ ] Log rotation terkonfigurasi
- [ ] Konfigurasi SMTP produksi + SPF/DKIM agar email tidak masuk spam

### 6.3 Serah Terima

- [ ] Panduan penggunaan panel admin (bergambar, Bahasa Indonesia)
- [ ] Sesi pelatihan admin & editor
- [ ] Dokumentasi teknis: arsitektur, cara deploy, cara restore backup
- [ ] Serah terima kredensial (VPS, domain, database, SMTP, analytics) via kanal aman
- [ ] Buat akun untuk seluruh admin/editor yang ditunjuk

### 6.4 Go-Live

- [ ] UAT bersama perusahaan — seluruh 12 kriteria penerimaan PRD §12 terpenuhi
- [ ] Hapus seluruh data dummy/seeding dari produksi
- [ ] Submit `sitemap.xml` ke Google Search Console
- [ ] Verifikasi ulang seluruh form dari sisi publik di produksi
- [ ] 🚀 Peluncuran

---

## Pasca-Peluncuran (Rutin)

- [ ] Pantau Search Console minggu pertama (error indexing, coverage)
- [ ] Pantau Analytics: halaman populer, bounce rate, sumber trafik
- [ ] Verifikasi backup harian berjalan (cek log minggu pertama)
- [ ] Update dependensi rutin (bulanan)
- [ ] Review pesan masuk & lamaran (harian oleh admin/HR)
- [ ] Evaluasi metrik bisnis PRD §2.1 pada bulan ke-3

---

## Riwayat Revisi

| Tanggal     | Perubahan                                       |
| ----------- | ----------------------------------------------- |
| 30 Sep 2026 | Checklist awal dibuat berdasarkan `prd.md` v1.0 |
