# Prompt Deploy — Website PT Sabhumi Karya Barito ke server-app2

> Salin seluruh isi blok di bawah ini dan tempelkan ke AI/agen yang punya akses
> SSH ke `server-app2`. Prompt ini sudah memuat seluruh konteks, batasan, dan
> langkah verifikasinya.

---

```
Kamu akan men-deploy sebuah website ke server yang SUDAH MELAYANI SITUS LAIN.
Baca seluruh instruksi ini sampai habis sebelum menjalankan perintah apa pun.

## Konteks

- Repositori : https://github.com/muhnas013/sbk (publik, clone via HTTPS)
- Aplikasi   : Next.js 16 + Payload CMS 3 + PostgreSQL 16, dijalankan via Docker Compose
- Server     : server-app2, 10.10.10.21, Ubuntu, dijangkau lewat WireGuard
- Domain     : sabhumikaryabarito.com (DNS dikelola di Cloudflare)
- Situs ini dwibahasa (ID/EN) dan punya panel admin di /admin

## BATASAN KERAS — langgar satu pun, situs lain di server ini akan mati

1. JANGAN menjalankan `scripts/vps-setup.sh`. Skrip itu menyetel ulang firewall
   (`ufw --force reset`) dan mengubah konfigurasi SSH. Aman pada VPS baru yang
   kosong, MERUSAK pada server bersama seperti ini.
2. JANGAN menjalankan `docker compose up` tanpa berkas override
   `docker-compose.app2.yml`. Konfigurasi bawaan menjalankan Caddy yang akan
   merebut port 80 dan 443 dari nginx yang sudah ada.
3. JANGAN mengubah, menimpa, atau memuat ulang konfigurasi nginx yang sudah ada
   selain MENAMBAH satu berkas vhost baru.
4. JANGAN menyentuh container, volume, atau database Docker milik aplikasi lain
   di server ini. Semua perintah compose WAJIB memakai `-p sbk`.
5. Sebelum `systemctl reload nginx`, WAJIB jalankan `nginx -t` lebih dulu. Kalau
   gagal, perbaiki dulu — jangan pernah reload dengan konfigurasi yang invalid.

## Langkah

### 1. Periksa kondisi awal dan catat sebagai patokan

    nginx -v && systemctl is-active nginx
    ls /etc/nginx/sites-enabled/
    docker ps --format '{{.Names}}\t{{.Ports}}'
    ss -ltnp | grep -E ':(80|443|3100)'

Catat situs apa saja yang sedang dilayani. Di akhir nanti, semuanya harus tetap
hidup. Pastikan port 3100 belum terpakai; kalau sudah, pilih port lain yang bebas
dan pakai nilai itu secara konsisten di `.env` (APP_PORT) dan di vhost nginx.

### 2. Clone repositori

    sudo mkdir -p /opt/sbk && sudo chown "$USER" /opt/sbk
    git clone https://github.com/muhnas013/sbk.git /opt/sbk
    cd /opt/sbk

### 3. Siapkan environment

    cp .env.example .env

Edit `.env` dan isi:

    NODE_ENV=production
    NEXT_PUBLIC_SERVER_URL=https://sabhumikaryabarito.com
    SITE_DOMAIN=sabhumikaryabarito.com
    APP_PORT=3100

    POSTGRES_USER=sbk
    POSTGRES_DB=sbk
    POSTGRES_PASSWORD=<hasil: openssl rand -base64 24>
    DATABASE_URI=postgres://sbk:<POSTGRES_PASSWORD yang sama>@db:5432/sbk

    PAYLOAD_SECRET=<hasil: openssl rand -base64 32>

Catatan penting soal DATABASE_URI: host-nya `db` (nama service di dalam jaringan
Docker), BUKAN localhost. Kata sandinya harus sama persis dengan
POSTGRES_PASSWORD; kalau berbeda, aplikasi gagal terhubung ke database.

Kosongkan dulu yang berikut — pemilik proyek akan mengisinya nanti:
SMTP_*, EMAIL_TO_CONTACT, EMAIL_TO_HR, TURNSTILE_*, NEXT_PUBLIC_GA_ID.
Aplikasi tetap berjalan tanpa itu; email hanya ditulis ke log, dan form belum
terlindungi proteksi bot.

Amankan berkasnya:

    chmod 600 .env

### 4. Jalankan stack

    docker compose -p sbk -f docker-compose.yml -f docker-compose.app2.yml up -d --build

Ini menjalankan empat service: `db` (PostgreSQL), `migrate` (menerapkan skema
database lalu berhenti), `app` (Next.js, terikat HANYA ke 127.0.0.1:3100), dan
`backup` (dump harian). Caddy sengaja tidak dijalankan.

Build pertama memakan waktu beberapa menit. Pastikan migrasi sukses:

    docker compose -p sbk logs migrate

Harus muncul `Migrated: ...initial` dan `Done.` Kalau migrasi gagal, JANGAN
lanjut — aplikasi tidak akan berfungsi tanpa skema database.

### 5. Verifikasi aplikasi sebelum menyentuh nginx

    curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3100/health
    curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3100/id
    curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3100/admin

Ketiganya harus 200. Kalau belum, periksa `docker compose -p sbk logs app` dan
selesaikan dulu di tahap ini — jangan lanjut ke nginx.

Pastikan juga port hanya terbuka ke loopback, bukan ke jaringan:

    ss -ltnp | grep 3100

Harus tertulis `127.0.0.1:3100`, bukan `0.0.0.0:3100`.

### 6. Pasang vhost nginx

Berkasnya sudah tersedia di repo: `deploy/nginx/sabhumikaryabarito.conf`.

    sudo cp deploy/nginx/sabhumikaryabarito.conf /etc/nginx/sites-available/
    sudo ln -s /etc/nginx/sites-available/sabhumikaryabarito.conf /etc/nginx/sites-enabled/

SESUAIKAN DULU path sertifikat di dalam berkas itu dengan cara penerbitan yang
dipakai server ini. Lihat bagaimana vhost lain di `/etc/nginx/sites-enabled/`
menuliskannya dan ikuti pola yang sama.

Kalau sertifikat untuk domain ini BELUM ada: jangan tebak-tebak. Hentikan di
sini, laporkan bahwa vhost sudah siap tetapi menunggu sertifikat, dan sebutkan
path persis yang perlu diisi. Pemilik proyek sudah menyatakan akan mengurus
sertifikat sendiri.

Kalau sertifikat sudah ada:

    sudo nginx -t
    sudo systemctl reload nginx

### 7. Verifikasi menyeluruh

    curl -sI https://sabhumikaryabarito.com | head -1
    curl -s -o /dev/null -w '%{http_code}\n' https://sabhumikaryabarito.com/id
    curl -s -o /dev/null -w '%{http_code}\n' https://sabhumikaryabarito.com/en
    curl -s -o /dev/null -w '%{http_code}\n' https://sabhumikaryabarito.com/admin
    curl -s https://sabhumikaryabarito.com/robots.txt

Lalu PASTIKAN situs lain di server ini masih hidup — bandingkan dengan catatan
dari langkah 1. Ini bagian yang paling penting.

### 7b. (Opsional) Isi konten demo

Bila pemilik proyek meminta konten demo lebih dulu agar tampilan dapat dinilai
sebelum konten asli tersedia:

    docker compose -p sbk -f docker-compose.yml -f docker-compose.app2.yml \
      --profile tools run --rm -e ALLOW_DEMO_SEED=yes seed

Perintah ini MENGHAPUS seluruh konten yang ada sebelum mengisi ulang; akun
pengguna tidak disentuh. Jangan menjalankannya lagi setelah tim mulai
memasukkan konten asli.

Script juga menyalakan sakelar `noIndex` secara otomatis agar konten demo tidak
diindeks mesin pencari. Sampaikan ke pemilik proyek bahwa sakelar itu harus
dimatikan lewat Pengaturan → SEO Bawaan setelah konten asli masuk.

### 8. Buat akun admin pertama

Buka https://sabhumikaryabarito.com/admin di peramban. Payload akan meminta
pembuatan pengguna pertama, yang otomatis menjadi Super Admin.

Kata sandi wajib minimal 12 karakter dan memuat huruf besar, huruf kecil, serta
angka. JANGAN membuat akun ini sendiri dan jangan mengarang kredensial —
serahkan langkah ini kepada pemilik proyek.

### 9. Jadwalkan pembersihan data pelamar

Kewajiban UU No. 27/2022 tentang Pelindungan Data Pribadi: data pelamar kerja
tidak boleh disimpan lebih lama dari keperluannya.

    (crontab -l 2>/dev/null; echo "0 3 * * * cd /opt/sbk && docker compose -p sbk -f docker-compose.yml -f docker-compose.app2.yml exec -T app npm run purge:applications") | crontab -

### 10. Laporkan

Sampaikan dengan jelas:
- Status tiap langkah, termasuk yang gagal atau kamu lewati beserta alasannya
- Daftar situs lain di server ini beserta statusnya sebelum dan sesudah deploy
- Path sertifikat yang kamu pakai, atau yang masih perlu diisi
- Variabel `.env` yang masih kosong dan akibatnya

Jangan melaporkan sesuatu sebagai berhasil kalau kamu belum benar-benar
memverifikasinya dengan perintah di atas.

## Kalau perlu membatalkan

    cd /opt/sbk
    docker compose -p sbk -f docker-compose.yml -f docker-compose.app2.yml down
    sudo rm -f /etc/nginx/sites-enabled/sabhumikaryabarito.conf
    sudo nginx -t && sudo systemctl reload nginx

Perintah ini tidak menyentuh apa pun milik aplikasi lain. Tambahkan `-v` pada
`down` hanya bila kamu memang ingin menghapus database beserta seluruh isinya.

## Rujukan di dalam repo

- docs/operasional.md  — arsitektur, backup, pemulihan, pemeliharaan
- docs/panduan-admin.md — panduan panel admin untuk tim konten
- .env.example          — seluruh variabel beserta keterangannya
```
