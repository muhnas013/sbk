# Dokumentasi Operasional — Website PT Sabhumi Karya Barito

Dokumen untuk administrator teknis: arsitektur, deployment, backup, dan
pemulihan. Untuk panduan mengisi konten, lihat [`panduan-admin.md`](./panduan-admin.md).

---

## 1. Arsitektur

```
Internet
   │ :443
   ▼
┌────────────┐  TLS otomatis (Let's Encrypt), security header,
│   Caddy    │  kompresi, caching aset statis
└─────┬──────┘
      │ :3000
      ▼
┌────────────┐      ┌──────────────┐
│ Next.js +  │─────▶│ PostgreSQL 16│
│ Payload 3  │      └──────────────┘
└─────┬──────┘
      ▼
┌────────────┐
│ volume     │  /app/media — gambar, dokumen, CV pelamar
│ media      │
└────────────┘
```

Aplikasi dan panel admin berada dalam **satu proses Next.js**. Panel admin
disajikan di `/admin`, situs publik di `/id` dan `/en`.

**Tumpukan:** Next.js 16 · Payload CMS 3.90 · PostgreSQL 16 · Tailwind CSS 4 ·
Docker Compose · Caddy 2.

---

## 2. Deployment Pertama Kali

### 2.1 Menyiapkan VPS

Pada VPS Ubuntu 24.04 yang masih bersih, sebagai root:

```bash
git clone <URL-REPO> /opt/sbk
cd /opt/sbk
bash scripts/vps-setup.sh deploy
```

Skrip ini memasang Docker, membuat user `deploy`, menyalakan firewall (hanya
port 22/80/443), mematikan login SSH dengan password dan login root,
mengaktifkan fail2ban, serta menyalakan pembaruan keamanan otomatis.

> Pastikan kunci publik SSH Anda sudah terpasang sebelum menjalankan skrip —
> setelahnya login dengan password tidak lagi mungkin.

### 2.2 Environment

```bash
cp .env.example .env
```

Isi seluruh nilainya. Yang wajib:

| Variabel                 | Keterangan                                             |
| ------------------------ | ------------------------------------------------------ |
| `SITE_DOMAIN`            | Domain tanpa protokol, mis. `sabhumikaryabarito.co.id` |
| `NEXT_PUBLIC_SERVER_URL` | URL lengkap dengan `https://`                          |
| `PAYLOAD_SECRET`         | Buat dengan `openssl rand -base64 32`                  |
| `POSTGRES_PASSWORD`      | Kata sandi database, acak dan panjang                  |
| `ACME_EMAIL`             | Email untuk notifikasi sertifikat Let's Encrypt        |

Yang sangat disarankan:

| Variabel                                                  | Akibat bila kosong                                        |
| --------------------------------------------------------- | --------------------------------------------------------- |
| `SMTP_*`, `EMAIL_FROM_*`                                  | Notifikasi form hanya ditulis ke log, tidak terkirim      |
| `EMAIL_TO_CONTACT`                                        | Pesan kontak tersimpan tapi tidak ada notifikasi          |
| `EMAIL_TO_HR`                                             | Lamaran tersimpan tapi HR tidak diberi tahu               |
| `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | **Form kehilangan proteksi bot.** Wajib diisi di produksi |

### 2.3 Menyalakan

```bash
docker compose up -d --build
docker compose logs -f app     # pantau sampai muncul "Ready"
```

Caddy mengambil sertifikat HTTPS otomatis pada permintaan pertama. Pastikan
DNS domain sudah mengarah ke IP VPS sebelum langkah ini.

### 2.4 Membuat pengguna pertama

Buka `https://<domain>/admin` — Payload meminta pembuatan akun pertama.
Akun ini otomatis menjadi Super Admin.

---

## 3. Deployment Rutin

Push ke branch `main` memicu GitHub Actions yang membangun ulang dan
memuat ulang container `app`, lalu memverifikasi `/health`.

Secrets yang harus diisi di repositori GitHub:

| Secret            | Isi                                     |
| ----------------- | --------------------------------------- |
| `SSH_HOST`        | IP atau hostname VPS                    |
| `SSH_USER`        | User deploy                             |
| `SSH_PORT`        | Port SSH (opsional, bawaan 22)          |
| `SSH_PRIVATE_KEY` | Kunci privat untuk user deploy          |
| `DEPLOY_PATH`     | Path repositori di VPS, mis. `/opt/sbk` |
| `SITE_DOMAIN`     | Domain, untuk verifikasi health check   |

Deploy manual:

```bash
cd /opt/sbk
git pull
docker compose build app
docker compose up -d --no-deps app
```

---

## 4. Migrasi Database

Di pengembangan, Payload menyinkronkan skema otomatis (`push: true`).
**Di produksi `push` dimatikan** — perubahan skema wajib lewat berkas migrasi:

```bash
npm run migrate:create nama_perubahan   # di mesin pengembangan
git commit && git push                  # migrasi ikut ter-deploy
docker compose exec app npm run migrate # di VPS
```

Menjalankan migrasi sebelum backup adalah kesalahan yang mahal. Selalu backup
lebih dulu.

---

## 5. Backup dan Pemulihan

### Yang di-backup

1. **Database** — seluruh konten, pengguna, pesan, lamaran
2. **Volume media** — gambar, dokumen, dan CV pelamar

Keduanya harus dipulihkan bersama. Database tanpa media menghasilkan situs
dengan gambar rusak; sebaliknya juga tidak berguna.

### Backup otomatis

Service `backup` pada docker-compose menjalankan dump harian ke `./backup`
dengan retensi 30 hari.

Backup manual:

```bash
docker compose exec backup /usr/local/bin/backup.sh
```

### Salinan luar server

Backup di VPS yang sama tidak melindungi dari kehilangan VPS. Pasang sinkronisasi
ke object storage:

```bash
# /etc/cron.d/sbk-backup-offsite
30 3 * * * deploy rclone sync /opt/sbk/backup remote:sbk-backup --max-age 30d
```

### Pemulihan

```bash
# 1. Hentikan aplikasi agar tidak ada yang menulis saat restore
docker compose stop app

# 2. Pulihkan database
docker compose exec -T db pg_restore --clean --if-exists --no-owner \
  -U sbk -d sbk < backup/db-YYYYmmdd-HHMMSS.dump

# 3. Pulihkan media
docker compose run --rm -v "$PWD/backup:/backup" \
  --entrypoint sh backup -c 'tar -xzf /backup/media-YYYYmmdd-HHMMSS.tar.gz -C /data'

# 4. Nyalakan kembali
docker compose start app
```

> **Uji pemulihan ke staging minimal sekali sebelum go-live, lalu ulangi setiap
> enam bulan.** Backup yang tidak pernah diuji belum tentu dapat dipulihkan.

---

## 6. Tugas Terjadwal

Pasang di crontab user deploy:

```cron
# Hapus lamaran yang melewati masa retensi (kewajiban UU PDP)
0 3 * * * cd /opt/sbk && docker compose exec -T app npm run purge:applications
```

Masa retensi diatur lewat `APPLICATION_RETENTION_MONTHS` (bawaan 12 bulan).

---

## 7. Pemantauan

| Hal                 | Cara                                                            |
| ------------------- | --------------------------------------------------------------- |
| Ketersediaan        | Pantau `https://<domain>/health` dari Uptime Kuma / UptimeRobot |
| Log aplikasi        | `docker compose logs -f app`                                    |
| Log akses & TLS     | `docker compose logs -f caddy`                                  |
| Ruang disk          | `df -h` dan `docker system df` — volume media akan terus tumbuh |
| Kesehatan container | `docker compose ps`                                             |

---

## 8. Pemeliharaan Berkala

| Kekerapan | Tugas                                                        |
| --------- | ------------------------------------------------------------ |
| Harian    | Pastikan backup berjalan (periksa isi `./backup`)            |
| Mingguan  | Tinjau Log Aktivitas dan pesan masuk                         |
| Bulanan   | Terapkan PR Dependabot, jalankan `npm audit`                 |
| Triwulan  | Tinjau daftar pengguna, nonaktifkan akun yang tidak terpakai |
| Semester  | Uji pemulihan backup ke staging                              |
| Tahunan   | Perbarui dokumen legalitas yang mendekati masa berlaku       |

---

## 9. Membatasi Akses Panel Admin per IP

Isi `ADMIN_IP_ALLOWLIST` pada `.env` dengan daftar IP kantor, dipisah koma.
Mendukung alamat tunggal maupun rentang CIDR:

```
ADMIN_IP_ALLOWLIST=203.0.113.7,10.99.99.0/24
```

Permintaan ke `/admin` dari luar daftar dibalas 403 sebelum halaman login
dirender. Situs publik tidak terpengaruh.

Kosongkan bila akses panel perlu terbuka dari mana saja — mis. ketika admin
bekerja dari lapangan. Ingat bahwa 2FA belum tersedia (lihat catatan di
`checklist.md` §2.5), sehingga daftar IP adalah lapisan pengaman kedua yang
paling kuat saat ini.

> Pembatasan ini membaca header `X-Forwarded-For` dari Caddy. Jangan
> mengekspos port 3000 aplikasi langsung ke internet — header itu bisa
> dipalsukan bila permintaan tidak melewati reverse proxy.

---

## 10. Catatan Keamanan

- `PAYLOAD_SECRET` mengunci seluruh token sesi. Menggantinya akan
  **mengeluarkan semua pengguna** dari panel admin. Jangan diganti tanpa alasan.
- Berkas CV pelamar berada di volume media dan hanya dapat diakses pengguna
  panel yang berwenang. Jangan menyalinnya ke direktori yang disajikan publik.
- Kolom `noIndex` pada **Pengaturan → SEO Bawaan** harus **aktif di staging**
  dan **nonaktif di produksi**. Salah setel membuat situs produksi hilang dari
  mesin pencari.
- Kredensial (VPS, database, SMTP, analytics) diserahkan lewat kanal aman,
  bukan email biasa atau chat.

---

## 11. Pengembangan Lokal

Lihat [`README.md`](../README.md) untuk penyiapan lingkungan pengembangan,
daftar perintah, dan struktur folder.
