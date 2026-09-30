import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

/**
 * Adapter email. Bila SMTP belum dikonfigurasi, Payload menulis email ke
 * konsol — cukup untuk pengembangan, dan tidak menggagalkan boot aplikasi.
 */
export const emailAdapter = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@localhost',
      defaultFromName: process.env.EMAIL_FROM_NAME || 'PT Sabhumi Karya Barito',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        // Port 465 memakai TLS implisit; selain itu STARTTLS.
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      },
    })
  : undefined
