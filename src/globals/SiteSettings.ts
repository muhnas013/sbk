import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan Situs',
  admin: { group: 'Pengaturan' },
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identitas',
          fields: [
            {
              name: 'companyName',
              type: 'text',
              label: 'Nama Perusahaan',
              required: true,
              defaultValue: 'PT Sabhumi Karya Barito',
            },
            { name: 'tagline', type: 'text', label: 'Tagline', localized: true },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Deskripsi Singkat',
              localized: true,
              maxLength: 300,
              admin: {
                description: 'Dipakai di footer dan sebagai deskripsi bawaan mesin pencari.',
              },
            },
            {
              name: 'logoLight',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo (latar terang)',
            },
            { name: 'logoDark', type: 'upload', relationTo: 'media', label: 'Logo (latar gelap)' },
            { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon' },
          ],
        },
        {
          label: 'Kontak',
          fields: [
            { name: 'address', type: 'textarea', label: 'Alamat', localized: true },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', label: 'Telepon', admin: { width: '50%' } },
                { name: 'email', type: 'email', label: 'Email', admin: { width: '50%' } },
              ],
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: 'Nomor WhatsApp',
              admin: {
                description: 'Format internasional tanpa tanda plus, contoh: 6281234567890.',
              },
            },
            { name: 'operationalHours', type: 'text', label: 'Jam Operasional', localized: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'mapLatitude',
                  type: 'number',
                  label: 'Latitude Peta',
                  admin: { width: '50%' },
                },
                {
                  name: 'mapLongitude',
                  type: 'number',
                  label: 'Longitude Peta',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'socials',
              type: 'array',
              label: 'Sosial Media',
              labels: { singular: 'Akun', plural: 'Sosial Media' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Platform',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'X / Twitter', value: 'x' },
                  ],
                },
                { name: 'url', type: 'text', label: 'URL', required: true },
              ],
            },
          ],
        },
        {
          label: 'Legalitas Ringkas',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'nib', type: 'text', label: 'NIB', admin: { width: '50%' } },
                { name: 'npwp', type: 'text', label: 'NPWP', admin: { width: '50%' } },
              ],
            },
            {
              name: 'footerLegalNote',
              type: 'textarea',
              label: 'Catatan Legal di Footer',
              localized: true,
              maxLength: 200,
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'googleAnalyticsId',
              type: 'text',
              label: 'Google Analytics 4 ID',
              admin: {
                description:
                  'Contoh: G-XXXXXXXXXX. Aktif hanya setelah pengunjung menyetujui cookie.',
              },
            },
            {
              name: 'searchConsoleVerification',
              type: 'text',
              label: 'Kode Verifikasi Search Console',
            },
          ],
        },
      ],
    },
  ],
}
