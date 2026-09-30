# PRD — Website Company Profile PT Sabhumi Karya Barito

|             |                                                     |
| ----------- | --------------------------------------------------- |
| **Dokumen** | Product Requirements Document (PRD)                 |
| **Produk**  | Website Company Profile + Content Management System |
| **Versi**   | 1.1                                                 |
| **Tanggal** | 30 September 2026                                   |
| **Status**  | Disetujui — dalam pengerjaan                        |

---

## 1. Ringkasan Eksekutif

PT Sabhumi Karya Barito adalah perusahaan multi-lini yang bergerak di bidang **konstruksi, konsultansi perencanaan & arsitektur, pengadaan/supplier material, serta jasa umum lainnya**. Saat ini perusahaan belum memiliki kanal digital resmi.

Proyek ini membangun website company profile dwibahasa (Indonesia & Inggris) yang berfungsi sebagai etalase kredibilitas perusahaan untuk keperluan tender, kemitraan, dan akuisisi klien — dilengkapi **panel admin** agar tim internal dapat memperbarui seluruh konten tanpa bantuan developer.

**Referensi gaya visual:** https://websitedemos.net/architects-04/ — layout grid modern, palet monokrom, fotografi arsitektur full-width, whitespace lapang.

---

## 2. Tujuan & Metrik Keberhasilan

### 2.1 Tujuan Bisnis

| #   | Tujuan                                          | Indikator                                                                     |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| B1  | Meningkatkan kredibilitas saat mengikuti tender | Halaman legalitas & portofolio proyek dapat diakses panitia tender            |
| B2  | Menjadi sumber informasi resmi perusahaan       | Website muncul di halaman 1 Google untuk kata kunci "Sabhumi Karya Barito"    |
| B3  | Membuka kanal masuknya prospek baru             | Minimal 10 pengajuan via form kontak/WhatsApp per bulan setelah 3 bulan rilis |
| B4  | Menarik talenta                                 | Halaman karier menerima lamaran masuk secara terstruktur                      |

### 2.2 Tujuan Produk

| #   | Tujuan                                | Indikator                                                                   |
| --- | ------------------------------------- | --------------------------------------------------------------------------- |
| P1  | Tim internal mandiri mengelola konten | 100% konten publik (kecuali struktur halaman) dapat diubah dari panel admin |
| P2  | Performa & SEO tinggi                 | Lighthouse ≥ 90 (Performance, SEO, Best Practices, Accessibility) di mobile |
| P3  | Keamanan terjaga                      | Tidak ada temuan kritis pada security header scan; backup harian berjalan   |
| P4  | Siap dwibahasa                        | Seluruh konten publik tersedia dalam ID & EN                                |

### 2.3 Di Luar Lingkup (Out of Scope) — Fase 1

- E-commerce / transaksi pembayaran online
- Portal vendor atau sistem e-procurement internal
- Aplikasi mobile native
- Live chat dengan agen manusia (cukup tombol WhatsApp)
- Integrasi ERP/akuntansi

---

## 3. Target Pengguna

| Persona                                  | Kebutuhan Utama                                         | Halaman Kunci                       |
| ---------------------------------------- | ------------------------------------------------------- | ----------------------------------- |
| **Panitia tender / instansi pemerintah** | Verifikasi legalitas, kapasitas, rekam jejak proyek     | Legalitas, Proyek, Tentang Kami     |
| **Calon klien swasta**                   | Memahami layanan, melihat hasil kerja, cara menghubungi | Beranda, Layanan, Proyek, Kontak    |
| **Mitra / subkontraktor / distributor**  | Menilai skala & bidang usaha                            | Tentang Kami, Divisi, Klien & Mitra |
| **Pelamar kerja**                        | Melihat lowongan dan mengirim lamaran                   | Karier                              |
| **Admin/Editor internal**                | Memperbarui konten cepat tanpa coding                   | Panel Admin                         |

---

## 4. Arsitektur Informasi (Sitemap)

```
/                                  Beranda
/tentang-kami                      Profil, visi-misi, nilai, sejarah, tim
/legalitas                         Legalitas & sertifikasi perusahaan
/layanan                           Daftar layanan dikelompokkan per divisi
/layanan/[slug]                    Detail layanan
/divisi/[slug]                     Halaman divisi (Konstruksi / Konsultansi / Supplier / Jasa Lain)
/proyek                            Galeri proyek + filter (divisi, kategori, tahun)
/proyek/[slug]                     Detail proyek
/klien                             Klien & mitra + testimoni
/berita                            Daftar berita/artikel
/berita/[slug]                     Detail berita
/karier                            Daftar lowongan
/karier/[slug]                     Detail lowongan + form lamaran
/unduhan                           Download center (company profile, brosur, katalog)
/kontak                            Form kontak, peta, alamat, telepon, email
/[slug]                            Halaman statis fleksibel (mis. Kebijakan Privasi, K3/HSE)

/admin                             Panel Admin (Payload CMS)
```

**Struktur navigasi header:** Beranda · Tentang Kami · Layanan (dropdown per divisi) · Proyek · Klien · Berita · Karier · Kontak · [Pengalih bahasa ID/EN] · [Tombol CTA "Konsultasi Gratis"]

**Struktur footer:** Logo + deskripsi singkat · Tautan Cepat · Divisi Usaha · Kontak & Sosial Media · Legalitas ringkas (NIB/SBU) · Copyright

---

## 5. Spesifikasi Halaman Publik

### 5.1 Beranda

Susunan section (semua dapat diatur urutannya dari admin via block builder):

| #   | Section                     | Isi                                                                                                                    | Sumber Konten                           |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 1   | **Hero**                    | Gambar/video latar full-screen, tagline kecil, headline utama, subheadline, 2 tombol CTA (Lihat Proyek / Hubungi Kami) | Global `homepage`                       |
| 2   | **Sekilas Perusahaan**      | Paragraf profil singkat, 2–3 poin keunggulan, tombol "Selengkapnya"                                                    | Global `homepage`                       |
| 3   | **Divisi Usaha**            | 4 kartu bergambar (Konstruksi, Konsultansi, Supplier, Jasa Lain) dengan deskripsi singkat → tautan ke halaman divisi   | Collection `divisions`                  |
| 4   | **Statistik**               | Counter animasi: tahun pengalaman, proyek selesai, klien, tenaga kerja                                                 | Global `homepage`                       |
| 5   | **Proyek Terpilih**         | 3–6 proyek unggulan (grid), tombol "Lihat Semua Proyek"                                                                | Collection `projects` (flag _featured_) |
| 6   | **Legalitas & Sertifikasi** | Baris logo/badge sertifikasi (SBU, ISO, dll.)                                                                          | Collection `certifications`             |
| 7   | **Testimoni**               | 3 kutipan klien + nama, jabatan, instansi, foto                                                                        | Collection `testimonials`               |
| 8   | **Klien & Mitra**           | Grid/marquee logo klien                                                                                                | Collection `clients`                    |
| 9   | **Berita Terbaru**          | 3 artikel terkini                                                                                                      | Collection `posts`                      |
| 10  | **CTA Penutup**             | Banner ajakan konsultasi + tombol WhatsApp                                                                             | Global `homepage`                       |

### 5.2 Tentang Kami

Profil perusahaan, sejarah singkat (timeline), Visi, Misi (daftar poin), Nilai Perusahaan (ikon + judul + deskripsi), Struktur Organisasi (gambar atau daftar), Tim Manajemen (foto, nama, jabatan, bio singkat, LinkedIn opsional).

### 5.3 Legalitas & Sertifikasi

Tabel/kartu berisi: nama dokumen, nomor, penerbit, masa berlaku, gambar/scan (opsional, dengan watermark), tombol unduh PDF (opsional per item). Contoh entri: Akta Pendirian, SK Kemenkumham, NIB, NPWP, SBU, SIUJK, ISO 9001, SMK3.

> **Catatan keamanan:** dokumen legal sensitif sebaiknya ditampilkan sebagai gambar ber-watermark, bukan PDF asli yang dapat diunduh bebas. Opsi "wajib isi form sebelum unduh" tersedia per dokumen.

### 5.4 Layanan & Divisi

- `/layanan` — daftar seluruh layanan, dikelompokkan berdasarkan divisi.
- `/divisi/[slug]` — hero divisi, deskripsi, daftar layanan di dalamnya, proyek terkait divisi tersebut, CTA.
- `/layanan/[slug]` — hero, deskripsi lengkap (rich text), lingkup pekerjaan (daftar), alur kerja/proses (langkah bernomor), galeri, FAQ, proyek terkait, CTA.

### 5.5 Proyek

- **Daftar:** grid kartu (gambar sampul, judul, divisi, lokasi, tahun). Filter: divisi, kategori, tahun, status (selesai/berjalan). Pencarian teks. Pagination.
- **Detail:** hero gambar, judul, ringkasan, tabel spesifikasi (klien/pemberi kerja, lokasi, tahun, nilai kontrak*, durasi, status, lingkup pekerjaan), deskripsi rich text, galeri foto (lightbox), proyek terkait, CTA.

  \* Nilai kontrak bersifat opsional dan dapat disembunyikan per proyek dari admin.

### 5.6 Klien & Mitra

Grid logo klien (dikelompokkan: Pemerintah / BUMN / Swasta), ditambah bagian testimoni.

### 5.7 Berita/Artikel

Daftar dengan kategori & pencarian; detail artikel dengan penulis, tanggal, kategori, gambar utama, rich text, tombol berbagi, artikel terkait.

### 5.8 Karier

- **Daftar lowongan:** posisi, divisi, lokasi penempatan, tipe (tetap/kontrak/magang), batas lamaran.
- **Detail:** deskripsi pekerjaan, kualifikasi, tanggung jawab, benefit.
- **Form lamaran:** nama, email, telepon, posisi, unggah CV (PDF/DOC, maks 5 MB), surat lamaran (opsional), persetujuan pemrosesan data pribadi (wajib, sesuai UU PDP). Data masuk ke koleksi `jobApplications` di admin + notifikasi email HR.

### 5.9 Download Center

Daftar dokumen publik: Company Profile PDF, brosur divisi, katalog produk supplier, formulir. Tiap item: judul, deskripsi, tipe berkas, ukuran, jumlah unduhan, tombol unduh.

### 5.10 Kontak

Form (nama, email, telepon, perusahaan, subjek/divisi yang dituju, pesan, reCAPTCHA/Turnstile), informasi kontak lengkap, embed Google Maps, jam operasional, tautan sosial media, tombol WhatsApp.

---

## 6. Panel Admin (CMS)

Akses melalui `/admin`. Dibangun di atas **Payload CMS 3**, berjalan dalam aplikasi Next.js yang sama.

### 6.1 Kemampuan Inti

| Fitur                  | Deskripsi                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Dashboard**          | Ringkasan: jumlah proyek, artikel, pesan masuk belum dibaca, lamaran baru; tautan aksi cepat                    |
| **Editor dwibahasa**   | Setiap field teks punya tab ID/EN. Konten EN yang kosong otomatis fallback ke ID                                |
| **Media Library**      | Unggah gambar/dokumen, alt text dwibahasa, konversi otomatis ke WebP/AVIF + beberapa ukuran responsif, kompresi |
| **Draft & Versioning** | Simpan draft tanpa publikasi, riwayat revisi, rollback ke versi sebelumnya                                      |
| **Live Preview**       | Pratinjau perubahan berdampingan sebelum publikasi                                                              |
| **Block Builder**      | Susun ulang urutan section beranda & halaman statis dengan drag-and-drop                                        |
| **Penjadwalan**        | Atur tanggal publikasi berita/lowongan                                                                          |
| **Pencarian & filter** | Di setiap koleksi                                                                                               |
| **Audit log**          | Catatan siapa mengubah apa dan kapan                                                                            |

### 6.2 Modul yang Dikelola

1. **Proyek** — CRUD, unggulan, urutan tampil, galeri
2. **Layanan** — CRUD, kaitkan ke divisi
3. **Divisi Usaha** — CRUD (4 divisi awal, bisa bertambah)
4. **Tim / Manajemen** — CRUD, urutan tampil
5. **Klien & Mitra** — CRUD logo, kategori
6. **Testimoni** — CRUD, aktif/nonaktif
7. **Legalitas & Sertifikasi** — CRUD, masa berlaku + pengingat kedaluwarsa
8. **Berita/Artikel** — CRUD + kategori
9. **Karier** — CRUD lowongan; lihat, filter, unduh CV pelamar; ubah status (Baru / Ditinjau / Wawancara / Ditolak / Diterima)
10. **Download Center** — CRUD dokumen
11. **Halaman Statis** — CRUD halaman bebas dengan block builder
12. **Pesan Masuk** — daftar pengajuan form kontak, tandai sudah dibaca, ekspor CSV
13. **Pengaturan Situs** — logo, favicon, nama perusahaan, alamat, telepon, email, nomor WhatsApp, sosial media, koordinat peta, ID Google Analytics
14. **Navigasi** — atur item menu header & footer
15. **SEO Global** — meta default, OG image default, `robots.txt`, `sitemap.xml` otomatis
16. **Pengguna & Peran**

### 6.3 Peran & Hak Akses (RBAC)

| Peran           | Hak                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Super Admin** | Akses penuh termasuk manajemen pengguna, pengaturan situs, dan penghapusan permanen                                       |
| **Admin**       | Seluruh konten + pengaturan situs; tidak dapat mengelola pengguna                                                         |
| **Editor**      | Buat/ubah/publikasi konten (proyek, berita, layanan, dll.); tidak dapat mengubah pengaturan situs atau menghapus permanen |
| **HR**          | Hanya modul Karier & Lamaran                                                                                              |
| **Viewer**      | Baca saja (untuk manajemen yang ingin memantau)                                                                           |

### 6.4 Keamanan Panel Admin

> **Revisi 30 September 2026.** Tiga butir di bagian ini diputuskan berbeda dari draf awal
> setelah dibahas bersama pemilik proyek. Perubahan dan alasannya dicatat di bawah.

- Password di-hash dengan **PBKDF2-SHA256, 600.000 iterasi** (bawaan Payload, sesuai
  rekomendasi OWASP terkini). _Draf awal menyebut argon2id; menggantinya berarti menambal
  internal framework dan menanggung risiko regresi pada tiap upgrade Payload._
- Kebijakan kata sandi: minimal 12 karakter, wajib memuat huruf besar, huruf kecil, dan angka
- **2FA tidak dipakai.** Panel memakai login email + kata sandi biasa. _Payload 3.90 tidak
  menyediakan 2FA bawaan maupun titik ekstensi untuk menambah field pada form login-nya;
  menerapkannya menuntut penggantian seluruh halaman login._
- **Pembatasan IP tidak dipakai** — panel dapat diakses dari jaringan mana pun
- Rate limiting pada endpoint login (maks 5 percobaan gagal → akun terkunci 15 menit)
- Session token httpOnly + SameSite=Strict, kedaluwarsa 8 jam
- Notifikasi email saat login dari perangkat baru
- Validasi tipe & ukuran berkas pada semua unggahan; berkas disajikan melalui route terkontrol

---

## 7. Model Konten (Skema Data)

### 7.1 Collections

**`users`** — email, password, nama, peran (enum), avatar, aktif, 2FA secret, terakhir login

**`media`** — file, alt (ID/EN), caption (ID/EN), kredit foto, ukuran turunan (thumbnail 400px, card 768px, hero 1920px), focal point

**`divisions`** — nama (ID/EN), slug, ringkasan (ID/EN), deskripsi rich text (ID/EN), ikon, gambar sampul, urutan, warna aksen, SEO

**`services`** — judul (ID/EN), slug, divisi (relasi), ringkasan, deskripsi rich text, lingkup pekerjaan (array), tahapan proses (array: judul + deskripsi), galeri (relasi media), FAQ (array), unggulan (boolean), urutan, SEO

**`projects`** — judul (ID/EN), slug, divisi (relasi), kategori (relasi), klien/pemberi kerja, lokasi, provinsi, tahun mulai, tahun selesai, status (enum: Selesai / Berjalan / Direncanakan), nilai kontrak (number, opsional), tampilkan nilai kontrak (boolean), durasi, lingkup pekerjaan (array), ringkasan (ID/EN), deskripsi rich text (ID/EN), gambar sampul, galeri, unggulan (boolean), urutan, SEO

**`projectCategories`** — nama (ID/EN), slug

**`team`** — nama, jabatan (ID/EN), foto, bio (ID/EN), LinkedIn, email, urutan, tampilkan di beranda

**`clients`** — nama, logo, kategori (enum: Pemerintah / BUMN / Swasta), website, urutan, aktif

**`testimonials`** — kutipan (ID/EN), nama, jabatan (ID/EN), instansi, foto, proyek terkait (relasi), rating, aktif, urutan

**`certifications`** — nama (ID/EN), nomor, penerbit, tanggal terbit, masa berlaku, gambar/scan, berkas PDF (opsional), publik (boolean), wajib form sebelum unduh (boolean), urutan

**`posts`** — judul (ID/EN), slug, kategori (relasi), penulis (relasi users), tanggal publikasi, gambar utama, ringkasan (ID/EN), konten rich text (ID/EN), tag, status (draft/published), SEO

**`postCategories`** — nama (ID/EN), slug

**`jobs`** — posisi (ID/EN), slug, divisi (relasi), lokasi, tipe (enum), jumlah dibutuhkan, deskripsi (ID/EN), kualifikasi (array), tanggung jawab (array), benefit (array), batas lamaran (date), status (buka/tutup), SEO

**`jobApplications`** — nama, email, telepon, lowongan (relasi), CV (upload), surat lamaran, persetujuan PDP (boolean), status (enum), catatan internal, tanggal masuk — _baca-saja dari publik, tidak dapat diubah dari front-end_

**`documents`** — judul (ID/EN), deskripsi, kategori, berkas, ukuran (otomatis), jumlah unduhan (counter), publik, urutan

**`contactSubmissions`** — nama, email, telepon, perusahaan, divisi tujuan, subjek, pesan, IP, user agent, sudah dibaca (boolean), catatan internal, tanggal masuk

**`pages`** — judul (ID/EN), slug, layout (blocks), SEO

### 7.2 Globals

**`siteSettings`** — nama perusahaan, tagline (ID/EN), logo terang, logo gelap, favicon, alamat (ID/EN), telepon, email, WhatsApp, jam operasional, koordinat peta, sosial media (array: platform + URL), NIB, NPWP, ID Google Analytics, kode verifikasi Search Console

**`navigation`** — menu header (array bertingkat), menu footer (kolom + item)

**`homepage`** — konten hero, sekilas perusahaan, statistik (array: label ID/EN + angka + sufiks), CTA penutup, pemilihan section yang ditampilkan + urutannya

**`seoDefaults`** — judul default, deskripsi default, OG image default, template judul

---

## 8. Kebutuhan Non-Fungsional

### 8.1 Performa

| Metrik                                | Target      |
| ------------------------------------- | ----------- |
| Largest Contentful Paint (mobile, 4G) | < 2,5 detik |
| Cumulative Layout Shift               | < 0,1       |
| Interaction to Next Paint             | < 200 ms    |
| Lighthouse Performance (mobile)       | ≥ 90        |
| Ukuran halaman beranda (terkompresi)  | < 1,5 MB    |

Strategi: Server Components + static generation dengan ISR, `next/image` (AVIF/WebP, lazy load, ukuran responsif), font di-_self-host_ dengan `next/font`, JS bundle minimal, caching HTTP di Caddy.

### 8.2 SEO

- Meta title/description per halaman, dapat diatur dari admin
- Open Graph & Twitter Card
- Structured data JSON-LD: `Organization`, `LocalBusiness`, `BreadcrumbList`, `Article` (berita), `JobPosting` (karier)
- `sitemap.xml` & `robots.txt` otomatis
- URL bersih, slug Bahasa Indonesia
- Tag `hreflang` untuk ID/EN
- Canonical URL
- Redirect 301 yang dapat dikelola dari admin

### 8.3 Keamanan

- HTTPS wajib (Let's Encrypt otomatis via Caddy), HSTS aktif
- Security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Proteksi form: Cloudflare Turnstile + honeypot + rate limiting per IP
- Sanitasi input & output (proteksi XSS), ORM parameterized query (proteksi SQL injection)
- Variabel rahasia hanya di `.env` server, tidak pernah ter-_bundle_ ke klien
- Dependensi dipindai berkala (`npm audit`, Dependabot)
- Backup otomatis harian (database + media), retensi 30 hari, disimpan off-site

### 8.4 Aksesibilitas

Target **WCAG 2.1 Level AA**: kontras minimal 4,5:1, navigasi penuh via keyboard, focus indicator jelas, alt text pada semua gambar bermakna, struktur heading benar, label pada semua field form, `prefers-reduced-motion` dihormati.

### 8.5 Kompatibilitas

Chrome/Edge/Firefox/Safari 2 versi terakhir. Responsif pada breakpoint: 360px, 768px, 1024px, 1440px, 1920px. Pendekatan mobile-first.

### 8.6 Kepatuhan

- Halaman **Kebijakan Privasi** & **Syarat Penggunaan**
- Banner persetujuan cookie (analytics baru aktif setelah disetujui)
- Checkbox persetujuan pemrosesan data pribadi pada form lamaran & kontak, sesuai UU No. 27/2022 (PDP)
- Data pelamar dihapus otomatis setelah 12 bulan (dapat dikonfigurasi)

---

## 9. Arsitektur Teknis

### 9.1 Tumpukan Teknologi

| Lapisan         | Teknologi                                                    |
| --------------- | ------------------------------------------------------------ |
| Framework       | Next.js 15 (App Router, React Server Components), TypeScript |
| CMS & Admin     | Payload CMS 3 (tertanam di Next.js, route `/admin`)          |
| Database        | PostgreSQL 16                                                |
| Styling         | Tailwind CSS + shadcn/ui                                     |
| Animasi         | Framer Motion (ringan, hormati `prefers-reduced-motion`)     |
| Gambar          | `next/image` + Sharp                                         |
| i18n            | Localization bawaan Payload + routing `/id` & `/en`          |
| Email           | SMTP (Nodemailer) atau Resend — notifikasi form & lamaran    |
| Form protection | Cloudflare Turnstile                                         |
| Reverse proxy   | Caddy (HTTPS otomatis)                                       |
| Kontainerisasi  | Docker + Docker Compose                                      |
| Analytics       | Google Analytics 4 + Google Search Console                   |

### 9.2 Topologi Deployment (VPS)

```
Internet
   │  :443
   ▼
┌──────────────┐
│    Caddy     │  TLS otomatis, security headers, cache statis, gzip/brotli
└──────┬───────┘
       │ :3000
       ▼
┌──────────────┐     ┌──────────────┐
│ Next.js +    │────▶│ PostgreSQL 16│
│ Payload CMS  │     │  (volume)    │
└──────┬───────┘     └──────────────┘
       │
       ▼
┌──────────────┐
│ Volume media │  /app/media  (gambar & dokumen)
└──────────────┘
```

**Spesifikasi VPS minimum:** 2 vCPU, 4 GB RAM, 50 GB SSD, Ubuntu 24.04 LTS.

**Layanan Docker Compose:** `caddy`, `app`, `db`, `backup` (cron `pg_dump` + arsip media, unggah ke object storage/off-site).

### 9.3 Alur Kerja Pengembangan

- Repositori Git (GitHub/GitLab), branch `main` (produksi) & `dev`
- Environment: lokal → staging (subdomain `staging.`) → produksi
- Deploy: push ke `main` → GitHub Actions build image → SSH ke VPS → `docker compose up -d`
- Migrasi database otomatis saat startup
- Health check endpoint `/api/health` + monitoring uptime (Uptime Kuma / UptimeRobot)

---

## 10. Panduan Desain

### 10.1 Prinsip

Mengadaptasi gaya referensi: bersih, lapang, fotografi-sentris, tipografi tegas, minim ornamen. Kesan yang dituju: **profesional, kokoh, terpercaya** — bukan ramai atau "korporat generik".

### 10.2 Palet Warna (usulan awal, menunggu konfirmasi brand)

| Token         | Nilai                    | Penggunaan                      |
| ------------- | ------------------------ | ------------------------------- |
| `ink`         | `#141414`                | Teks utama, latar section gelap |
| `paper`       | `#FAF9F7`                | Latar utama                     |
| `stone`       | `#6B6B6B`                | Teks sekunder                   |
| `line`        | `#E4E1DC`                | Garis pemisah, border           |
| `accent`      | `#B8873A` (emas-tembaga) | Tombol, link, aksen             |
| `accent-dark` | `#8E6828`                | Hover                           |

> Jika perusahaan sudah punya panduan warna/logo resmi, palet ini akan disesuaikan.

### 10.3 Tipografi

- Heading: **Plus Jakarta Sans** (bold/extrabold, tracking rapat)
- Body: **Inter** (regular/medium)
- Skala: 14 / 16 / 18 / 24 / 32 / 44 / 60 / 80 px, line-height 1,2 (heading) & 1,7 (body)
- Semua font di-_self-host_ (tanpa permintaan ke Google Fonts, demi privasi & performa)

### 10.4 Lain-lain

- Grid 12 kolom, lebar maksimum konten 1280px, gutter 24px
- Sudut border: 2px (tegas, sesuai karakter konstruksi)
- Bayangan minimal; pemisahan antar elemen mengandalkan garis & spasi
- Rasio gambar: proyek 4:3, hero 16:9 (desktop) / 4:5 (mobile), tim 1:1
- Mode gelap: **tidak** untuk Fase 1

---

## 11. Rencana Pengerjaan

| Fase                        | Lingkup                                                                                                        | Estimasi       |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------- |
| **1. Fondasi**              | Setup repo, Docker, Next.js + Payload + Postgres, CI/CD, domain & HTTPS, design system (token, komponen dasar) | 1 minggu       |
| **2. Model Konten & Admin** | Seluruh collection & global, RBAC, media library, i18n, 2FA, seeding data contoh                               | 1,5 minggu     |
| **3. Halaman Inti**         | Beranda, Tentang Kami, Layanan, Divisi, Proyek (daftar + detail), Kontak                                       | 2 minggu       |
| **4. Modul Tambahan**       | Legalitas, Klien, Berita, Karier + form lamaran, Download Center                                               | 1,5 minggu     |
| **5. Kualitas**             | SEO, structured data, optimasi performa, audit aksesibilitas, security hardening, cookie consent               | 1 minggu       |
| **6. Konten & Peluncuran**  | Pengisian konten asli, penerjemahan EN, UAT, pelatihan admin, backup & monitoring, go-live                     | 1 minggu       |
|                             | **Total**                                                                                                      | **± 8 minggu** |

**Ketergantungan dari pihak perusahaan:**

- Logo (format vektor SVG/AI) & panduan brand jika ada
- Foto proyek berkualitas tinggi (minimal 5 proyek untuk peluncuran)
- Profil & foto tim manajemen
- Teks profil, visi, misi, nilai perusahaan
- Salinan dokumen legalitas yang boleh ditampilkan publik
- Daftar & logo klien (beserta izin penggunaan logo)
- Nama domain & akses DNS

---

## 12. Kriteria Penerimaan (Acceptance Criteria)

| #     | Kriteria                                                                                       | Cara Verifikasi              |
| ----- | ---------------------------------------------------------------------------------------------- | ---------------------------- |
| AC-1  | Seluruh halaman pada sitemap dapat diakses dan tampil benar di mobile & desktop                | Uji manual pada 5 breakpoint |
| AC-2  | Admin dapat membuat, mengubah, dan menghapus konten di 16 modul tanpa bantuan developer        | UAT bersama calon admin      |
| AC-3  | Setiap konten publik tersedia dalam ID & EN, pengalih bahasa berfungsi, `hreflang` benar       | Uji manual + inspeksi HTML   |
| AC-4  | Form kontak & lamaran tersimpan di admin **dan** mengirim notifikasi email                     | Uji end-to-end               |
| AC-5  | Lighthouse mobile ≥ 90 pada keempat kategori di beranda, daftar proyek, dan detail proyek      | Lighthouse CI                |
| AC-6  | Tidak ada temuan "High"/"Critical" pada `npm audit` dan securityheaders.com meraih peringkat A | Pemindaian otomatis          |
| AC-7  | Kebijakan kata sandi & penguncian akun berfungsi; notifikasi login perangkat baru terkirim     | Uji manual                   |
| AC-8  | Backup harian berjalan dan pernah diuji restore ke staging                                     | Bukti log + uji restore      |
| AC-9  | `sitemap.xml` memuat seluruh URL publik dan sudah terdaftar di Search Console                  | Inspeksi manual              |
| AC-10 | Unggahan berkas menolak tipe & ukuran yang tidak diizinkan                                     | Uji negatif                  |
| AC-11 | Seluruh gambar memiliki alt text; navigasi keyboard penuh berfungsi                            | axe DevTools + uji manual    |
| AC-12 | Dokumentasi admin (panduan penggunaan) tersedia dan tim sudah dilatih                          | Serah terima                 |

---

## 13. Risiko & Mitigasi

| Risiko                                         | Dampak                     | Mitigasi                                                                         |
| ---------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| Konten (foto & teks) dari perusahaan terlambat | Peluncuran mundur          | Gunakan konten placeholder sejak Fase 3; tetapkan tenggat konten di akhir Fase 4 |
| Terjemahan EN memakan waktu                    | Fitur dwibahasa tidak siap | Sediakan fallback otomatis ke ID; terjemahkan bertahap setelah go-live           |
| Dokumen legal sensitif bocor                   | Risiko penyalahgunaan      | Watermark, tampilkan sebagai gambar, opsi form-gated                             |
| VPS down / kapasitas kurang                    | Situs tidak dapat diakses  | Monitoring uptime, alert, backup off-site, skala vertikal mudah                  |
| Admin kesulitan memakai CMS                    | Konten jadi stagnan        | Pelatihan + panduan bergambar + struktur field yang berlabel Bahasa Indonesia    |
| Spam pada form                                 | Inbox penuh                | Turnstile + honeypot + rate limit                                                |

---

## 14. Pertanyaan Terbuka

1. Apakah sudah ada logo resmi & panduan brand (warna, font)? Jika belum, apakah perlu dibuatkan?
2. Nama domain yang akan dipakai — sudah dimiliki atau perlu didaftarkan?
3. Berapa proyek yang siap ditampilkan pada peluncuran perdana?
4. Apakah nilai kontrak proyek boleh ditampilkan publik, atau selalu disembunyikan?
5. Siapa saja yang akan mendapat akun admin, dan dengan peran apa?
6. Ke alamat email mana notifikasi form kontak dan lamaran kerja dikirim?
7. Apakah perusahaan sudah punya akun Google Analytics / Search Console?
8. Apakah blog/berita akan benar-benar diisi rutin? (Jika tidak, sebaiknya ditunda ke Fase 2 agar tidak terlihat mati)

---

## 15. Riwayat Revisi

| Versi | Tanggal     | Perubahan                                                                                                                                                                                                                        |
| ----- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0   | 30 Sep 2026 | Draf awal                                                                                                                                                                                                                        |
| 1.1   | 30 Sep 2026 | §6.4 direvisi: hashing memakai PBKDF2-SHA256 600.000 iterasi bawaan Payload (bukan argon2id); 2FA tidak dipakai; pembatasan IP tidak dipakai. AC-7 disesuaikan. Stack memakai Next.js 16 karena Payload 3.90 sudah mendukungnya. |

_Perubahan lingkup berikutnya dicatat pada tabel di atas._
