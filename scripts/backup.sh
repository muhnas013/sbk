#!/bin/sh
# ---------------------------------------------------------------------------
# Backup harian: dump database + arsip media.
# Dijalankan oleh service `backup` pada docker-compose.yml.
# Unggah off-site diatur terpisah lewat `scripts/backup-offsite.sh` di VPS.
# ---------------------------------------------------------------------------
set -eu

STAMP=$(date +%Y%m%d-%H%M%S)
DEST=/backup
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

mkdir -p "$DEST"

echo "[$(date -Iseconds)] Memulai backup database…"
pg_dump -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -f "$DEST/db-$STAMP.dump"

echo "[$(date -Iseconds)] Mengarsipkan media…"
tar -czf "$DEST/media-$STAMP.tar.gz" -C /data media

echo "[$(date -Iseconds)] Menghapus backup lebih tua dari $RETENTION_DAYS hari…"
find "$DEST" -name 'db-*.dump' -mtime "+$RETENTION_DAYS" -delete
find "$DEST" -name 'media-*.tar.gz' -mtime "+$RETENTION_DAYS" -delete

echo "[$(date -Iseconds)] Backup selesai: db-$STAMP.dump, media-$STAMP.tar.gz"
