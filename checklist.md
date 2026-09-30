# Checklist Pengerjaan — Website PT Sabhumi Karya Barito

> Acuan: [`prd.md`](./prd.md) · Diperbarui terakhir: 30 September 2026
> Tandai `[x]` bila selesai. Item bertanda 🔴 adalah _blocker_ — menahan pekerjaan lain.
> Item bertanda 👤 menunggu input dari pihak perusahaan, bukan developer.

**Progres keseluruhan:** 217 / 273 item

| Fase                    | Status         | Progres |
| ----------------------- | -------------- | ------- |
| 0. Pra-Pengerjaan       | 🟡 Berjalan    | 2/14    |
| 1. Fondasi              | 🟡 Berjalan    | 38/39   |
| 2. Model Konten & Admin | 🟡 Berjalan    | 60/61   |
| 3. Halaman Inti         | 🟡 Berjalan    | 43/44   |
| 4. Modul Tambahan       | 🟡 Berjalan    | 28/30   |
| 5. Kualitas & Hardening | 🟡 Berjalan    | 44/49   |
| 6. Konten & Peluncuran  | 🟡 Berjalan    | 2/30    |
| Pasca-Peluncuran        | ⬜ Belum mulai | 0/6     |

---

## Fase 0 — Pra-Pengerjaan (Keputusan & Aset)

Fase ini harus tuntas sebelum Fase 1 dimulai agar tidak ada rework.

### 0.1 Keputusan yang Menunggu Jawaban

- [ ] 🔴 👤 Konfirmasi nama domain (sudah dimiliki / perlu didaftarkan) + akses DNS
- [x] Logo tidak lagi memblokir: header/footer menampilkan nama perusahaan sebagai teks
      sampai berkas logo diunggah lewat Pengaturan Situs — [ ] 👤 berkas logo menyusul
- [ ] 👤 Panduan brand: warna resmi, font resmi (jika ada). Jika tidak ada → pakai usulan PRD §10.2
- [ ] 👤 Keputusan: nilai kontrak proyek boleh tampil publik atau selalu disembunyikan
- [ ] 👤 Keputusan: dokumen legalitas ditampilkan sebagai gambar watermark / PDF unduh / form-gated
- [ ] 👤 Keputusan: modul Berita/Artikel masuk Fase 1 atau ditunda (akan diisi rutin atau tidak?)
- [ ] 👤 Daftar calon akun admin + perannya masing-masing
- [ ] 👤 Alamat email penerima notifikasi form kontak
- [ ] 👤 Alamat email penerima notifikasi lamaran kerja (HR)
- [ ] 👤 Status akun Google Analytics & Search Console (sudah ada / perlu dibuat)

### 0.2 Pengadaan Infrastruktur

- [x] Server ditetapkan: **server-app2 (10.10.10.21)** — server bersama yang sudah
      menjalankan nginx, sehingga dipakai `docker-compose.app2.yml` (tanpa Caddy)
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
- [x] Verifikasi build image `app` — berhasil, dan seluruh stack diuji dari volume kosong:
      migrasi diterapkan otomatis lalu seluruh rute membalas 200
- [x] Verifikasi `docker compose up` end-to-end (diuji lokal dengan override app2)
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
- [x] Keputusan: tanpa staging — deploy langsung ke server-app2
- [ ] 🔴 Deploy pertama ke server-app2 (prompt siap di `docs/prompt-deploy-app2.md`;
      menunggu sertifikat TLS yang diurus pemilik proyek)

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
- [x] Konfigurasi Live Preview — draft tampil di pratinjau, tetap 404 untuk publik;
      akses pratinjau menuntut sesi admin dan menolak `path` ke domain luar
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
- [x] **Keputusan (30 Sep 2026): 2FA tidak dipakai.** Panel memakai login email + kata sandi
      biasa. Pembatasan IP juga tidak dipakai dan kodenya dihapus — dapat dipulihkan dari
      commit `a27f053` bila suatu saat dibutuhkan. Pengaman yang berlaku: kata sandi 12
      karakter, penguncian akun 5×/15 menit, sesi 8 jam, dan notifikasi login perangkat baru.
- [x] Notifikasi email saat login dari perangkat/IP baru — sidik jari perangkat disimpan
      sebagai hash, bukan IP/user agent mentah; login pertama sebuah akun tidak memicu notifikasi
- [x] **Keputusan (30 Sep 2026): hashing memakai bawaan Payload** — PBKDF2-SHA256 dengan
      600.000 iterasi, sesuai rekomendasi OWASP terkini. PRD semula menyebut argon2id;
      menggantinya berarti menambal internal framework dan menanggung risiko tiap upgrade.

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

- [x] Section Hero (gambar latar + gradien penjaga kontras teks)
- [x] Section Sekilas Perusahaan
- [x] Section Divisi Usaha (4 kartu)
- [x] Section Statistik (counter animasi, menghormati `prefers-reduced-motion`)
- [x] Section Proyek Terpilih
- [x] Section Legalitas & Sertifikasi
- [x] Section Testimoni
- [x] Section Klien & Mitra
- [x] Section Berita Terbaru
- [x] Section CTA Penutup
- [x] Urutan & visibilitas section dapat diatur dari admin (global `homepage`)

### 3.2 Tentang Kami

- [x] Hero + profil perusahaan
- [x] Timeline sejarah singkat
- [x] Visi & Misi
- [x] Nilai perusahaan
- [x] Struktur organisasi (gambar, dapat digeser horizontal di layar kecil)
- [x] Tim manajemen (grid foto + bio)

> Tambahan di luar model Fase 2: global `about` dibuat untuk menampung profil,
> visi, misi, nilai, sejarah, dan struktur organisasi — bidang ini belum ada di
> model konten awal padahal diminta prd.md §5.2.

### 3.3 Layanan & Divisi

- [x] `/layanan` — daftar dikelompokkan per divisi
- [x] `/divisi/[slug]` — hero, deskripsi, layanan terkait, proyek terkait, CTA
- [x] `/layanan/[slug]` — deskripsi, lingkup pekerjaan, alur proses, galeri, FAQ, proyek terkait

### 3.4 Proyek

- [x] `/proyek` — grid kartu + pagination berbasis tautan (berfungsi tanpa JavaScript)
- [x] Filter: divisi, kategori, tahun, status — seluruh state di query string
- [x] Pencarian teks (judul, ringkasan, lokasi, pemberi kerja)
- [x] `/proyek/[slug]` — hero, tabel spesifikasi, deskripsi, lingkup pekerjaan
- [x] Galeri dengan lightbox: fokus terkunci, navigasi panah, Esc menutup
- [x] Section proyek terkait
- [x] Nilai kontrak hanya tampil bila admin mengaktifkannya per proyek

### 3.5 Kontak

- [x] Form kontak (nama, email, telepon, perusahaan, divisi tujuan, subjek, pesan)
- [x] Validasi sisi klien & server (Zod di server action)
- [x] Cloudflare Turnstile + honeypot + rate limit 5 kiriman / 15 menit per IP
- [x] Simpan ke `contact-submissions` + kirim notifikasi email
- [x] State sukses & penanganan error di dalam form
- [x] Blok informasi kontak + jam operasional
- [x] Embed peta (lazy load, tidak memblokir render)

> Peta memakai OpenStreetMap, bukan Google Maps: tidak butuh API key berbayar,
> tidak menanam cookie pihak ketiga, dan lolos cookie consent tanpa syarat.
> Bisa diganti ke Google Maps bila perusahaan menginginkannya.

### 3.6 Internasionalisasi

- [x] Routing `/id` & `/en` berfungsi di semua halaman
- [x] Pengalih bahasa mempertahankan halaman yang sedang dibuka
- [x] Fallback otomatis ke ID bila konten EN kosong
- [x] Terjemahan string UI statis (tipe kamus diturunkan dari versi ID — kunci yang terlewat gagal saat typecheck)
- [x] Tag `hreflang` + canonical benar

### 3.7 Verifikasi Fase 3

- [x] Seluruh rute membalas 200; halaman tidak dikenal membalas 404
- [x] Filter & pagination proyek bekerja lewat query string
- [x] Gambar Payload dilayani sebagai path relatif — dioptimasi `next/image` tanpa `remotePatterns`
- [x] Jalur penyimpanan pesan kontak diverifikasi; pembuatan langsung oleh publik ditolak
- [ ] Uji kirim form kontak dari peramban sungguhan (termasuk Turnstile) — perlu dilakukan di staging

## Fase 4 — Modul Tambahan (± 1,5 minggu)

### 4.1 Legalitas & Sertifikasi

- [x] Halaman `/legalitas` — kartu dokumen dengan nomor, penerbit, dan masa berlaku
- [x] Menampilkan gambar dokumen (diunggah admin dalam versi ber-watermark)
- [x] Indikator masa berlaku: badge "Berlaku" / "Masa berlaku habis"
- [ ] Alur form-gated download — field `requireFormToDownload` sudah ada di model,
      alurnya belum dibangun. Menunggu keputusan §0.1 soal cara menampilkan dokumen legal.

### 4.2 Klien & Mitra

- [x] Halaman `/klien` — grid logo dikelompokkan (Pemerintah / BUMN-BUMD / Swasta)
- [x] Section testimoni

### 4.3 Berita/Artikel

- [x] `/berita` — daftar + filter kategori + pagination
- [x] `/berita/[slug]` — artikel, penulis, tanggal, tombol berbagi
- [x] Artikel terkait (berdasarkan kategori)
- [x] Penjadwalan publikasi: artikel bertanggal mendatang tidak muncul di daftar maupun detail
- [ ] RSS feed (opsional, belum dikerjakan)

> Tombol berbagi memakai tautan share biasa, bukan SDK Facebook/LinkedIn —
> tidak ada skrip pelacak pihak ketiga yang ikut termuat.

### 4.4 Karier

- [x] `/karier` — daftar lowongan aktif
- [x] `/karier/[slug]` — detail lowongan (deskripsi, tanggung jawab, kualifikasi, benefit)
- [x] Form lamaran + unggah CV (PDF/DOC/DOCX, maks 5 MB, tipe & ukuran divalidasi di server)
- [x] Checkbox persetujuan pemrosesan data pribadi (wajib, UU No. 27/2022)
- [x] Simpan ke `job-applications` + notifikasi email ke HR + rate limit 3 lamaran/jam per IP
- [x] Panel admin: filter pelamar, ubah status, unduh CV, catatan internal
- [x] Lowongan yang lewat tenggat otomatis tidak menerima lamaran — ditolak juga di sisi server,
      bukan hanya disembunyikan dari tampilan
- [x] Structured data `JobPosting`

### 4.5 Download Center

- [x] Halaman `/unduhan` — daftar dokumen per kategori
- [x] Menampilkan tipe berkas & ukuran otomatis
- [x] Counter unduhan bertambah saat berkas diunduh
- [x] Berkas disajikan lewat route terkontrol `/unduh/[id]`, bukan tautan langsung —
      dokumen non-publik tidak bisa diambil dengan menebak nama berkas

### 4.6 Halaman Statis & Legal

- [x] Halaman Kebijakan Privasi
- [x] Halaman Syarat Penggunaan
- [x] Sistem halaman statis via block builder berfungsi — 10 jenis blok ter-render

### 4.7 Verifikasi Fase 4

- [x] Seluruh rute Fase 4 membalas 200 di ID dan EN
- [x] Structured data `JobPosting` ter-render di halaman lowongan
- [x] Konten blok tersimpan terpisah per bahasa dan tampil benar di keduanya
- [x] `/unduh/[id]` membalas 404 untuk dokumen yang tidak ada atau tidak publik

## Fase 5 — Kualitas & Hardening (± 1 minggu)

### 5.1 SEO

- [x] Meta title & description per halaman, dengan fallback bertingkat ke `seo-defaults` lalu `site-settings`
- [x] Open Graph + Twitter Card, termasuk OG image bawaan
- [x] JSON-LD `LocalBusiness` (mencakup `Organization`) di seluruh halaman
- [x] JSON-LD `BreadcrumbList` pada halaman detail proyek, layanan, dan berita
- [x] JSON-LD `Article` pada berita
- [x] JSON-LD `JobPosting` pada lowongan
- [x] `sitemap.xml` otomatis — 62 URL, setiap entri membawa alternate `hreflang` ID & EN
- [x] `robots.txt` — menutup `/admin`, `/api/`, `/unduh/`; ikut sakelar `noIndex` untuk staging
- [x] Sistem redirect 301 dikelola dari admin
- [x] Slug Bahasa Indonesia & URL bersih di seluruh rute
- [x] Kode verifikasi Search Console dikelola dari panel admin

### 5.2 Performa

- [x] Seluruh gambar melalui `next/image` dengan `sizes` yang tepat
- [x] Prioritas LCP image di hero (`priority`)
- [x] Static generation + ISR (`revalidate = 300`) pada halaman konten
- [x] Caching header di Caddy untuk aset statis, media, dan font
- [x] Lighthouse mobile ≥ 90 di beranda — **98 / 100 / 100 / 100**
- [x] Lighthouse mobile ≥ 90 di daftar proyek — **98 / 100 / 100 / 100**
- [x] Lighthouse mobile ≥ 90 di detail proyek — **98 / 100 / 100 / 100**
- [x] Juga diuji: `/en`, `/id/tentang-kami`, `/id/berita`, `/id/karier`, `/id/kontak` — terendah 95
- [x] Ukuran beranda terkompresi < 1,5 MB — **287 KB**
- [x] Core Web Vitals beranda: LCP 2,3 s · CLS 0 · TBT 80 ms

### 5.3 Keamanan

- [x] Security headers lengkap di `Caddyfile`: HSTS, X-Frame-Options, X-Content-Type-Options,
      Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy
- [ ] Verifikasi peringkat A di securityheaders.com — perlu domain publik (setelah deploy)
- [x] `npm audit` bersih dari temuan High/Critical
- [x] Aktifkan Dependabot (npm dengan grup, Docker, GitHub Actions)
- [x] Uji negatif unggahan berkas: tipe & ukuran terlarang ditolak dengan pesan Bahasa Indonesia
- [x] Rate limiting form: kontak 5/15 menit per IP, lamaran 3/jam per IP
- [x] Tidak ada variabel rahasia yang bocor ke bundle klien (hanya `NEXT_PUBLIC_*` yang terekspos)
- [x] GraphQL playground dimatikan di produksi
- [x] Skrip penyiapan VPS: firewall ufw (22/80/443 saja), SSH tanpa password & tanpa root,
      fail2ban, pembaruan keamanan otomatis
- [ ] Jalankan `scripts/vps-setup.sh` di VPS — menunggu akses VPS

> Catatan: hashing memakai PBKDF2-SHA256 600.000 iterasi bawaan Payload — keputusan
> tercatat di §2.5.

### 5.4 Aksesibilitas

- [x] Audit aksesibilitas Lighthouse **100** di seluruh halaman yang diuji
- [x] Kontras warna ≥ 4,5:1 terverifikasi — aksen disetel ke `#8A6425` agar lolos juga
      di atas latar `paper-alt`, dan `#D4A85C` untuk teks pada latar gelap
- [x] Navigasi penuh via keyboard + focus indicator jelas
- [x] Struktur heading berurutan (satu `h1` per halaman, tanpa lompatan tingkat)
- [x] Semua gambar bermakna punya alt text (alt wajib diisi di koleksi media)
- [x] Semua field form punya label terkait
- [x] `prefers-reduced-motion` dihormati oleh seluruh animasi
- [x] Skip-to-content link
- [x] Ukuran target sentuh minimal 44px pada tombol dan pengalih bahasa
- [x] Nama aksesibel memuat teks yang terlihat (pengalih bahasa)

### 5.5 Kepatuhan & Analytics

- [x] Banner persetujuan cookie
- [x] Google Analytics 4 hanya dimuat setelah persetujuan — terverifikasi tidak ada
      permintaan ke googletagmanager sebelum pengunjung menyetujui
- [x] Kolom verifikasi Google Search Console tersedia di panel admin
- [x] Kebijakan retensi data pelamar: skrip `npm run purge:applications` + entri cron

### 5.6 Pengujian Lintas Perangkat

- [x] Diuji dengan Chromium headless (Lighthouse emulasi Moto G Power, 4G ter-throttle)
- [ ] Uji manual Chrome, Firefox, Safari, Edge — perlu dilakukan di staging
- [ ] Uji breakpoint 360 / 768 / 1024 / 1440 / 1920 px secara manual
- [ ] Uji pada perangkat Android & iOS fisik

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

- [x] Panduan penggunaan panel admin — `docs/panduan-admin.md`
- [ ] Sesi pelatihan admin & editor
- [x] Dokumentasi teknis: arsitektur, deploy, backup, restore — `docs/operasional.md`
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

| Tanggal     | Perubahan                                                              |
| ----------- | ---------------------------------------------------------------------- |
| 30 Sep 2026 | Checklist awal dibuat berdasarkan `prd.md` v1.0                        |
| 30 Sep 2026 | Fase 1–5 dikerjakan; keputusan 2FA, pembatasan IP, dan hashing dicatat |
