# syntax=docker/dockerfile:1.7

# --- Tahap 1: dependencies -------------------------------------------------
FROM node:26-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# --- Tahap 2: build --------------------------------------------------------
FROM node:26-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Build tidak menyentuh database; adapter Payload cukup diberi nilai dummy.
ENV DATABASE_URI=postgres://build:build@localhost:5432/build
ENV PAYLOAD_SECRET=build-time-placeholder-secret

RUN npm run generate:importmap && npm run build

# --- Tahap 3: migrator -----------------------------------------------------
# Migrasi butuh CLI Payload beserta seluruh dependensi dan berkas sumber, yang
# sengaja tidak ikut ke image runtime. Dijalankan sebagai container sekali
# pakai sebelum aplikasi menyala.
FROM node:26-alpine AS migrator
WORKDIR /app

# Sharp merender teks SVG lewat fontconfig. Tanpa font terpasang, teks itu
# hilang diam-diam — termasuk watermark "CONTOH" pada gambar dokumen legalitas
# demo, yang justru menjadi penanda bahwa dokumen itu bukan dokumen asli.
RUN apk add --no-cache fontconfig ttf-dejavu

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

ENV NODE_ENV=production
# Nilai dummy dari tahap build tidak boleh terbawa ke runtime.
ENV DATABASE_URI=""
ENV PAYLOAD_SECRET=""

CMD ["npx", "payload", "migrate"]

# --- Tahap 4: runner -------------------------------------------------------
FROM node:26-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache curl \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Direktori media di-mount sebagai volume; dibuat lebih dulu agar kepemilikan benar.
RUN mkdir -p /app/media && chown -R nextjs:nodejs /app/media

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]
