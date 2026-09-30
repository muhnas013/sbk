# Panduan Panel Admin — Website PT Sabhumi Karya Barito

Panduan ini untuk tim internal yang mengelola isi website. Tidak perlu
pengetahuan teknis: semua yang dijelaskan di sini dikerjakan lewat peramban.

---

## 1. Masuk ke Panel Admin

1. Buka `https://<domain-perusahaan>/admin`
2. Masukkan email dan kata sandi yang diberikan administrator
3. Klik **Login**

**Ketentuan kata sandi:** minimal 12 karakter, wajib memuat huruf besar, huruf
kecil, dan angka.

**Bila salah kata sandi 5 kali,** akun terkunci otomatis selama 15 menit. Ini
melindungi dari percobaan tebak kata sandi. Hubungi Super Admin bila perlu
dibuka lebih cepat.

**Sesi berakhir otomatis setelah 8 jam.** Anda akan diminta login lagi.

---

## 2. Mengenal Tampilan Panel

Setelah login Anda masuk ke **Dasbor**, yang menampilkan:

- Jumlah proyek dan berita
- Jumlah pesan masuk yang belum dibaca
- Jumlah lamaran kerja baru
- Peringatan bila ada dokumen legalitas yang akan kedaluwarsa dalam 90 hari

Menu di sisi kiri dikelompokkan menjadi:

| Kelompok              | Isi                                                             |
| --------------------- | --------------------------------------------------------------- |
| **Konten**            | Beranda, Tentang Kami, Halaman Statis, Pusat Unduhan            |
| **Profil Perusahaan** | Divisi Usaha, Layanan, Tim, Klien & Mitra, Testimoni, Legalitas |
| **Proyek**            | Proyek, Kategori Proyek                                         |
| **Berita**            | Berita & Artikel, Kategori Berita                               |
| **Karier**            | Lowongan Kerja, Lamaran Masuk                                   |
| **Pesan**             | Pesan Masuk dari form kontak                                    |
| **Pengaturan**        | Pengaturan Situs, Navigasi, SEO Bawaan, Redirect                |
| **Sistem**            | Media, Pengguna, Log Aktivitas                                  |

---

## 3. Mengisi Konten Dua Bahasa

Website ini tersedia dalam **Bahasa Indonesia** dan **English**.

Di pojok kanan atas setiap halaman edit ada pemilih bahasa. Cara kerjanya:

1. Isi dulu seluruh konten dalam **Bahasa Indonesia**, lalu simpan
2. Ganti ke **English**, terjemahkan, lalu simpan lagi

> **Bagian yang belum diterjemahkan otomatis menampilkan versi Indonesia.**
> Jadi website tidak akan pernah tampil dengan bagian kosong meskipun
> terjemahan Inggris belum selesai. Anda bisa menerjemahkan bertahap.

Perhatikan: **slug (URL) tidak ikut diterjemahkan.** Satu halaman memakai satu
alamat untuk kedua bahasa, supaya tautan yang sudah tersebar tidak berubah.

---

## 4. Alur Kerja Draf dan Terbit

Sebagian besar konten punya dua status:

- **Draf** — tersimpan, tetapi belum tampil di website
- **Terbit** — tampil untuk umum

Tombol **Save Draft** menyimpan tanpa menayangkan. Tombol **Publish**
menayangkan. Selama masih draf, konten hanya bisa dilihat dari panel admin.

### Pratinjau sebelum menayangkan

Klik tab **Live Preview** di halaman edit untuk melihat tampilan sebenarnya
berdampingan dengan editor. Tersedia pilihan ukuran layar: Ponsel, Tablet,
Laptop. Pratinjau ini hanya bisa dibuka oleh pengguna yang sudah login.

### Membatalkan perubahan

Setiap penyimpanan tercatat sebagai versi. Buka tab **Versions** untuk melihat
riwayat, membandingkan, dan mengembalikan versi lama bila terjadi salah edit.

---

## 5. Tugas yang Paling Sering Dilakukan

### Menambah proyek baru

1. **Proyek → Create New**
2. Tab **Konten**: isi nama proyek, ringkasan, deskripsi, dan lingkup pekerjaan
3. Tab **Data Proyek**: isi pemberi kerja, lokasi, tahun, status, durasi
4. Tab **Media**: unggah gambar sampul (wajib) dan foto galeri
5. Panel kanan: pilih **Divisi** (wajib) dan **Kategori**
6. Centang **Tampilkan di Beranda** bila proyek ini ingin ditonjolkan
7. **Publish**

> **Nilai kontrak tidak ditampilkan ke publik** kecuali Anda mencentang
> "Tampilkan nilai kontrak di situs publik" pada proyek tersebut. Bawaannya
> tersembunyi. Pertimbangkan baik-baik sebelum menayangkan angka kontrak.

### Menambah berita

1. **Berita & Artikel → Create New**
2. Isi judul, ringkasan, gambar utama, dan isi artikel
3. Pilih kategori di panel kanan
4. **Tanggal Publikasi** boleh diisi tanggal mendatang — artikel akan muncul
   sendiri pada tanggal itu, tidak sebelumnya
5. **Publish**

Penulis dan tanggal terisi otomatis bila dikosongkan.

### Membuka lowongan kerja

1. **Lowongan Kerja → Create New**
2. Isi posisi, lokasi, tipe pekerjaan, deskripsi, kualifikasi, dan benefit
3. Isi **Batas Lamaran** — setelah tanggal ini, form lamaran otomatis tertutup
4. **Publish**

Lamaran yang masuk muncul di **Lamaran Masuk**. Di sana Anda dapat mengunduh
CV, mengubah status seleksi, dan menulis catatan internal.

> Data pelamar dihapus otomatis setelah 12 bulan sesuai kewajiban UU
> Pelindungan Data Pribadi. Simpan berkas yang masih dibutuhkan sebelum
> tenggat itu.

### Mengubah isi beranda

Buka **Konten → Beranda**. Isinya terbagi dalam beberapa tab:

- **Hero** — judul besar, subjudul, gambar latar, dan tombol
- **Sekilas Perusahaan** — paragraf pengantar dan gambar pendamping
- **Statistik** — angka pengalaman, proyek, klien, tenaga kerja
- **CTA Penutup** — ajakan di bagian bawah halaman
- **Susunan Section** — atur urutan dan sembunyikan bagian yang tidak dipakai

Pada tab **Susunan Section**, geser baris untuk mengubah urutan. Hapus centang
**Tampilkan** untuk menyembunyikan satu bagian tanpa kehilangan isinya.

### Mengganti logo perusahaan

**Pengaturan → Pengaturan Situs → tab Identitas**. Tersedia tiga berkas:

| Field                   | Dipakai di mana                      | Saran                                                                |
| ----------------------- | ------------------------------------ | -------------------------------------------------------------------- |
| **Logo (latar terang)** | Header di bagian atas setiap halaman | Versi berwarna atau gelap, latar transparan                          |
| **Logo (latar gelap)**  | Footer, yang berlatar hitam          | Versi putih/terang. Bila dikosongkan, logo latar terang yang dipakai |
| **Favicon**             | Ikon kecil di tab peramban           | Bentuk persegi, minimal 512×512 piksel                               |

Unggah dalam format **SVG** bila ada — hasilnya tetap tajam di layar mana pun.
Bila tidak, pakai PNG dengan latar transparan, tinggi minimal 200 piksel.

Logo ditampilkan dengan tinggi tetap dan lebar mengikuti rasio aslinya, jadi
logo memanjang maupun persegi sama-sama tampil utuh tanpa gepeng.

> Selama logo belum diunggah, header dan footer menampilkan **nama perusahaan
> sebagai teks**. Situs tetap tampil wajar, jadi tidak perlu menunggu berkas
> logo siap sebelum menayangkan halaman lain.

### Mengganti nomor telepon, alamat, atau media sosial

**Pengaturan → Pengaturan Situs**. Nilai di sini dipakai di footer, halaman
kontak, dan data mesin pencari sekaligus — cukup ubah di satu tempat.

### Mengatur menu navigasi

**Pengaturan → Navigasi**. Bila dikosongkan, website memakai struktur menu
bawaan. Tulis tautan tanpa awalan bahasa, contoh `/proyek` — bukan
`/id/proyek`. Awalan bahasa ditambahkan otomatis.

---

## 6. Mengelola Gambar

Semua gambar masuk ke **Sistem → Media**.

**Teks Alternatif (alt) wajib diisi.** Teks ini dibacakan kepada pengunjung
tunanetra dan dipakai mesin pencari untuk memahami isi gambar. Tulis deskripsi
singkat yang sebenarnya, misalnya "Pekerja memasang bekisting kolom gedung
kantor kecamatan" — bukan "gambar1" atau "foto proyek".

**Ketentuan berkas:**

|                 |                           |
| --------------- | ------------------------- |
| Format          | JPG, PNG, WebP, AVIF, SVG |
| Ukuran maksimal | 8 MB                      |
| Rasio proyek    | 4:3                       |
| Rasio berita    | 16:9                      |
| Rasio foto tim  | 1:1 (persegi)             |

Sistem otomatis membuat versi kecil, sedang, dan besar serta mengubahnya ke
format WebP agar halaman tetap ringan. Anda cukup mengunggah satu berkas
berkualitas baik.

**Focal point:** bila bagian penting gambar terpotong saat ditampilkan, buka
gambar tersebut di Media dan geser titik fokusnya.

---

## 7. Dokumen Legalitas

**Profil Perusahaan → Legalitas & Sertifikasi**.

> **Penting:** unggah dokumen legal sebagai **gambar yang sudah diberi
> watermark**, bukan hasil pindai asli. Scan NIB, SBU, atau akta yang bersih
> dapat disalahgunakan pihak lain untuk memalsukan dokumen atas nama
> perusahaan. Salinan resmi untuk panitia tender sebaiknya dikirim langsung,
> bukan diunduh bebas dari website.

Isi **Berlaku Sampai** agar sistem mengingatkan Anda 90 hari sebelum masa
berlaku habis. Pengingat muncul di Dasbor.

---

## 8. Pesan Masuk dan Lamaran

- **Pesan → Pesan Masuk** — pengajuan dari form kontak. Centang "Sudah Dibaca"
  setelah ditindaklanjuti agar hitungan di Dasbor akurat.
- **Karier → Lamaran Masuk** — berisi data pribadi pelamar. Hanya peran HR,
  Admin, dan Super Admin yang dapat membukanya.

Keduanya juga dikirim ke email yang dikonfigurasi administrator.

---

## 9. Peran Pengguna

| Peran           | Yang dapat dilakukan                                              |
| --------------- | ----------------------------------------------------------------- |
| **Super Admin** | Semuanya, termasuk mengelola pengguna dan menghapus permanen      |
| **Admin**       | Semua konten dan pengaturan situs; tidak dapat mengelola pengguna |
| **Editor**      | Membuat, mengubah, dan menerbitkan konten                         |
| **HR**          | Hanya modul Karier dan Lamaran Masuk                              |
| **Viewer**      | Hanya membaca                                                     |

Hanya Super Admin yang dapat mengubah peran dan mengaktifkan/menonaktifkan
akun. Pembatasan ini mencegah pengguna menaikkan hak aksesnya sendiri.

Untuk mencabut akses seseorang, **jangan hapus akunnya** — hapus centang
**Akun Aktif**. Dengan begitu riwayat aktivitasnya tetap terbaca di Log
Aktivitas.

---

## 10. Log Aktivitas

**Sistem → Log Aktivitas** mencatat setiap perubahan konten: siapa, apa, dan
kapan. Berguna untuk menelusuri bila ada isi yang berubah tanpa diketahui.
Log bersifat baca-saja dan hanya dapat dilihat Admin ke atas.

---

## 11. Bila Terjadi Masalah

| Gejala                            | Yang harus dilakukan                                                      |
| --------------------------------- | ------------------------------------------------------------------------- |
| Lupa kata sandi                   | Hubungi Super Admin untuk menyetel ulang                                  |
| Akun terkunci                     | Tunggu 15 menit, atau minta Super Admin membukanya                        |
| Perubahan tidak muncul di website | Halaman disimpan selama 5 menit. Tunggu sebentar lalu muat ulang          |
| Salah menghapus konten            | Buka tab **Versions** pada dokumen tersebut dan pulihkan versi sebelumnya |
| Gambar gagal diunggah             | Periksa format dan pastikan ukurannya di bawah 8 MB                       |
| Website tidak dapat dibuka        | Hubungi administrator teknis — lihat `docs/operasional.md`                |

---

_Panduan ini mengikuti versi website saat ini. Bila ada menu yang tidak sesuai
dengan yang dijelaskan di sini, hubungi administrator teknis._
