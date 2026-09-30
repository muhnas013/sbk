import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

const port = Number(process.env.SMTP_PORT || 587)

/*
 * Nodemailer dinaikkan ke v10 lewat `overrides` di package.json untuk menutup
 * advisory GHSA-6vj9-mwq6-2f5v (cache DNS global memakai ulang `servername` TLS
 * antar-transport — berpotensi membocorkan kredensial SMTP antar-tenant).
 *
 * Di v10 opsi `auth` pindah dari `SMTPConnection.Options` ke
 * `SMTPTransportOptions`, sementara tipe adapter Payload masih menunjuk tipe
 * lama. Perilaku runtime `createTransport` tidak berubah, jadi bentuk opsinya
 * disusun terpisah lalu di-cast pada satu titik ini saja.
 */
const transportOptions = {
  host: process.env.SMTP_HOST,
  port,
  // Port 465 memakai TLS implisit; port lain memakai STARTTLS.
  secure: port === 465,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
}

/**
 * Adapter email. Bila SMTP belum dikonfigurasi, Payload menulis email ke
 * konsol — cukup untuk pengembangan, dan tidak menggagalkan boot aplikasi.
 */
export const emailAdapter = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@localhost',
      defaultFromName: process.env.EMAIL_FROM_NAME || 'PT Sabhumi Karya Barito',
      transportOptions: transportOptions as Parameters<typeof nodemailerAdapter>[0] extends {
        transportOptions?: infer T
      }
        ? T
        : never,
    })
  : undefined
