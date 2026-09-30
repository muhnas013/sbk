#!/bin/bash
# ---------------------------------------------------------------------------
# Penyiapan awal VPS untuk website PT Sabhumi Karya Barito.
#
# Jalankan SEKALI sebagai root pada VPS Ubuntu 24.04 yang masih bersih:
#   bash scripts/vps-setup.sh <nama-user-deploy>
#
# Skrip ini sengaja berhenti pada kesalahan pertama (`set -e`) supaya tidak
# ada langkah pengerasan yang terlewat diam-diam.
# ---------------------------------------------------------------------------
set -euo pipefail

DEPLOY_USER="${1:?Sertakan nama user deploy, contoh: bash scripts/vps-setup.sh deploy}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Jalankan sebagai root." >&2
  exit 1
fi

echo "==> Memperbarui paket sistem"
apt-get update -qq
apt-get upgrade -y -qq

echo "==> Memasang paket dasar"
apt-get install -y -qq ca-certificates curl git ufw fail2ban unattended-upgrades

echo "==> Membuat user deploy: $DEPLOY_USER"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos '' "$DEPLOY_USER"
  usermod -aG sudo "$DEPLOY_USER"
  mkdir -p "/home/$DEPLOY_USER/.ssh"
  # Salin kunci root agar tidak terkunci di luar server setelah SSH diperketat.
  cp /root/.ssh/authorized_keys "/home/$DEPLOY_USER/.ssh/authorized_keys" 2>/dev/null || true
  chown -R "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
  chmod 700 "/home/$DEPLOY_USER/.ssh"
  chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys" 2>/dev/null || true
fi

if [ ! -s "/home/$DEPLOY_USER/.ssh/authorized_keys" ]; then
  echo "PERINGATAN: /home/$DEPLOY_USER/.ssh/authorized_keys kosong." >&2
  echo "Pasang kunci publik Anda dulu sebelum melanjutkan — login password akan dimatikan." >&2
  exit 1
fi

echo "==> Memasang Docker"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
usermod -aG docker "$DEPLOY_USER"

echo "==> Mengonfigurasi firewall (hanya SSH, HTTP, HTTPS)"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 443/udp comment 'HTTP/3'
ufw --force enable

echo "==> Memperketat SSH (nonaktifkan login password & login root)"
cat > /etc/ssh/sshd_config.d/99-hardening.conf <<'SSHEOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
SSHEOF
sshd -t
systemctl reload ssh

echo "==> Mengaktifkan pembaruan keamanan otomatis"
dpkg-reconfigure -f noninteractive unattended-upgrades

echo "==> Mengaktifkan fail2ban"
systemctl enable --now fail2ban

cat <<'DONE'

Penyiapan selesai.

Langkah berikutnya:
  1. Login ulang sebagai user deploy — login root sudah dimatikan.
  2. Clone repositori ke direktori deploy.
  3. Salin .env.example menjadi .env lalu isi seluruh nilainya.
  4. `docker compose up -d --build`
  5. Pasang cron pembersihan data pelamar (UU PDP):
       0 3 * * * cd <DIR> && docker compose exec -T app npm run purge:applications
DONE
