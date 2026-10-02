# Website PT Sabhumi Karya Barito

Website company profile dwibahasa (ID/EN) dengan panel admin, dibangun dengan
**Next.js 16 + Payload CMS 3 + PostgreSQL 16**.

| Dokumen                                            | Untuk siapa                                   |
| -------------------------------------------------- | --------------------------------------------- |
| [`prd.md`](./prd.md)                               | Acuan lingkup dan spesifikasi                 |
| [`checklist.md`](./checklist.md)                   | Progres pengerjaan                            |
| [`docs/panduan-admin.md`](./docs/panduan-admin.md) | Tim yang mengisi konten                       |
| [`docs/operasional.md`](./docs/operasional.md)     | Administrator teknis: deploy, backup, restore |

---

## Prasyarat

| Kebutuhan               | Versi                                 |
| ----------------------- | ------------------------------------- |
| Node.js                 | ≥ 20.9 (disarankan 22 LTS)            |
| npm                     | ≥ 10                                  |
| Docker & Docker Compose | untuk PostgreSQL lokal dan deployment |

## Menjalankan di Lokal

```bash
# 1. Pasang dependensi
npm install

# 2. Siapkan environment
cp .env.example .env
#    Isi PAYLOAD_SECRET — buat dengan: openssl rand -base64 32

# 3. Jalankan PostgreSQL
docker run -d --name sbk-postgres-dev \
  -e POSTGRES_USER=sbk -e POSTGRES_PASSWORD=sbk_local_dev -e POSTGRES_DB=sbk \
  -p 55432:5432 postgres:16-alpine
#    Sesuaikan DATABASE_URI di .env dengan port di atas.

# 4. Hasilkan import map Payload (sekali, dan setiap menambah komponen admin kustom)
npm run generate:importmap

# 5. Jalankan
npm run dev
```

Buka http://localhost:3000 untuk situs, dan http://localhost:3000/admin untuk panel
admin. Pengguna pertama dibuat lewat halaman `/admin/create-first-user`.

## Perintah Penting

| Perintah                     | Kegunaan                                                 |
| ---------------------------- | -------------------------------------------------------- |
| `npm run dev`                | Jalankan server pengembangan                             |
| `npm run build`              | Build produksi                                           |
| `npm run lint`               | Periksa ESLint                                           |
| `npm run typecheck`          | Periksa TypeScript tanpa emit                            |
| `npm run format`             | Rapikan format kode dengan Prettier                      |
| `npm run generate:types`     | Hasilkan ulang `src/payload-types.ts` dari skema Payload |
| `npm run generate:importmap` | Hasilkan ulang import map panel admin                    |
| `npm run migrate:create`     | Buat berkas migrasi database baru                        |
| `npm run migrate`            | Terapkan migrasi database                                |
| `npm run seed`               | Isi konten demo (menghapus konten yang ada lebih dulu)   |
| `npm run photos`             | Unduh ulang foto demo dari Wikimedia Commons             |

> Di mode pengembangan Payload memakai `push: true` — skema disinkronkan otomatis.
> Di produksi `push` dimatikan; perubahan skema **wajib** lewat berkas migrasi.

### Konten demo

`npm run seed` mengisi database dengan konten contoh agar tampilan situs dapat
dinilai sebelum konten asli tersedia. Perintah ini **menghapus** seluruh konten
yang ada (akun pengguna tidak disentuh), dan di produksi menolak berjalan
kecuali diberi `ALLOW_DEMO_SEED=yes`.

Foto demonya ada di `src/scripts/demo-photos/` dan **ikut tersimpan di
repositori**, sehingga seeding tidak memerlukan koneksi internet sama sekali —
syarat mutlak di server, karena jaringan compose `internal: true` memang tidak
memberi container akses keluar. Berkasnya dihasilkan `npm run photos`, yang
mengunduh dari Wikimedia Commons lalu menyelaraskan warnanya; jalankan itu
hanya bila daftar fotonya berubah.

Foto-foto itu berlisensi Creative Commons: **pemotretnya wajib disebut** selama
foto masih terpasang. Nama pemotret ikut tersimpan di field Kredit setiap media,
dan daftar lengkapnya ada di `src/scripts/demo-photos/KREDIT.md`. Ganti seluruh
foto demo dengan dokumentasi milik perusahaan sebelum peluncuran. Foto tim dan
testimoni sengaja dibiarkan berupa siluet, bukan wajah orang sungguhan.

## Struktur Folder

```
src/
├── access/          Aturan hak akses (RBAC) yang dipakai lintas koleksi
├── app/
│   ├── (frontend)/  Situs publik — punya root layout sendiri
│   │   └── [locale]/  Rute berprefix bahasa (/id, /en)
│   ├── (payload)/   Panel admin & REST/GraphQL API Payload
│   └── health/      Endpoint health check untuk monitoring
├── blocks/          Block builder untuk halaman statis & beranda
├── collections/     Definisi koleksi Payload
├── components/
│   ├── layout/      Header, footer, pengalih bahasa, tombol WhatsApp
│   └── ui/          Komponen dasar design system
├── fields/          Field Payload yang dipakai berulang (slug, urutan, …)
├── globals/         Definisi global Payload (pengaturan situs, navigasi, …)
├── hooks/           Hook Payload
├── i18n/            Kamus string antarmuka statis
├── lib/             Utilitas & konstanta
└── proxy.ts         Routing bahasa (konvensi `middleware` Next.js 16)
```

## Deployment (VPS)

```bash
# Di VPS, dalam direktori repositori
cp .env.example .env     # isi seluruh nilai produksi, termasuk SITE_DOMAIN
docker compose up -d --build
```

Layanan yang dijalankan: `caddy` (HTTPS otomatis) → `app` (Next.js + Payload) →
`db` (PostgreSQL), ditambah `backup` untuk dump harian.

**Backup & restore**

```bash
docker compose exec backup /usr/local/bin/backup.sh   # backup manual
./scripts/restore.sh backup/db-YYYYmmdd-HHMMSS.dump   # restore (menimpa database)
```

## Catatan Teknis

- **Bahasa konten** dikelola Payload (`localization`), dengan `id` sebagai default
  dan fallback — bagian yang belum diterjemahkan tetap tampil dalam Bahasa Indonesia.
- **Bahasa antarmuka statis** ada di `src/i18n/dictionaries.ts`. Tipe `Dictionary`
  diturunkan dari kamus Indonesia, jadi kunci yang terlewat akan gagal saat typecheck.
- **Font** di-_self-host_ otomatis oleh `next/font` saat build — tidak ada permintaan
  ke server Google saat pengunjung membuka situs.
- **Security header** diatur di `Caddyfile`, bukan di aplikasi, agar berlaku juga
  untuk aset statis.
