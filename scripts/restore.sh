#!/bin/sh
# ---------------------------------------------------------------------------
# Restore backup ke lingkungan staging.
# Pemakaian: ./scripts/restore.sh backup/db-20260930-030000.dump
# PERINGATAN: perintah ini menimpa isi database tujuan.
# ---------------------------------------------------------------------------
set -eu

DUMP_FILE=${1:?Sertakan path file dump, contoh: ./scripts/restore.sh backup/db-xxx.dump}

if [ ! -f "$DUMP_FILE" ]; then
  echo "File tidak ditemukan: $DUMP_FILE" >&2
  exit 1
fi

echo "Database tujuan: ${POSTGRES_DB:-sbk} pada host ${PGHOST:-db}"
printf 'Lanjutkan menimpa database ini? (ketik: ya) '
read -r CONFIRM
[ "$CONFIRM" = "ya" ] || { echo "Dibatalkan."; exit 1; }

pg_restore --clean --if-exists --no-owner \
  -h "${PGHOST:-db}" -U "${POSTGRES_USER:-sbk}" -d "${POSTGRES_DB:-sbk}" \
  "$DUMP_FILE"

echo "Restore selesai."
