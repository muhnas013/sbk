import type { GlobalConfig } from 'payload'
import { anyone, contentEditor } from '@/access'
import { richTextField } from '@/fields/richText'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Beranda',
  admin: {
    group: 'Konten',
    description: 'Isi dan urutan section pada halaman beranda.',
  },
  access: { read: anyone, update: contentEditor },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroEyebrow', type: 'text', label: 'Label Kecil', localized: true },
            {
              name: 'heroHeading',
              type: 'text',
              label: 'Judul Utama',
              localized: true,
              required: true,
            },
            { name: 'heroSubheading', type: 'textarea', label: 'Subjudul', localized: true },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Gambar Latar Hero',
            },
            {
              name: 'heroButtons',
              type: 'array',
              label: 'Tombol',
              maxRows: 2,
              labels: { singular: 'Tombol', plural: 'Tombol' },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Teks Tombol',
                  localized: true,
                  required: true,
                },
                { name: 'href', type: 'text', label: 'Tautan', required: true },
              ],
            },
          ],
        },
        {
          label: 'Sekilas Perusahaan',
          fields: [
            { name: 'aboutEyebrow', type: 'text', label: 'Label Kecil', localized: true },
            { name: 'aboutHeading', type: 'text', label: 'Judul', localized: true },
            richTextField({ name: 'aboutContent', label: 'Isi' }),
            { name: 'aboutImage', type: 'upload', relationTo: 'media', label: 'Gambar Pendamping' },
          ],
        },
        {
          label: 'Statistik',
          fields: [
            {
              name: 'stats',
              type: 'array',
              label: 'Angka',
              labels: { singular: 'Angka', plural: 'Angka' },
              maxRows: 4,
              fields: [
                { name: 'value', type: 'number', label: 'Angka', required: true },
                {
                  name: 'suffix',
                  type: 'text',
                  label: 'Akhiran',
                  admin: { description: 'Contoh: +' },
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Keterangan',
                  localized: true,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'CTA Penutup',
          fields: [
            { name: 'ctaHeading', type: 'text', label: 'Judul', localized: true },
            { name: 'ctaDescription', type: 'textarea', label: 'Deskripsi', localized: true },
            {
              name: 'ctaButton',
              type: 'group',
              label: 'Tombol',
              fields: [
                { name: 'label', type: 'text', label: 'Teks Tombol', localized: true },
                { name: 'href', type: 'text', label: 'Tautan' },
              ],
            },
          ],
        },
        {
          label: 'Susunan Section',
          fields: [
            {
              name: 'sections',
              type: 'array',
              label: 'Urutan & Tampilan Section',
              labels: { singular: 'Section', plural: 'Section' },
              admin: {
                description:
                  'Geser untuk mengatur urutan. Hapus centang "Tampilkan" untuk menyembunyikan tanpa kehilangan isinya.',
              },
              fields: [
                {
                  name: 'key',
                  type: 'select',
                  label: 'Section',
                  required: true,
                  options: [
                    { label: 'Hero', value: 'hero' },
                    { label: 'Sekilas Perusahaan', value: 'about' },
                    { label: 'Divisi Usaha', value: 'divisions' },
                    { label: 'Statistik', value: 'stats' },
                    { label: 'Proyek Terpilih', value: 'projects' },
                    { label: 'Legalitas & Sertifikasi', value: 'certifications' },
                    { label: 'Testimoni', value: 'testimonials' },
                    { label: 'Klien & Mitra', value: 'clients' },
                    { label: 'Berita Terbaru', value: 'posts' },
                    { label: 'CTA Penutup', value: 'cta' },
                  ],
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Tampilkan',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
