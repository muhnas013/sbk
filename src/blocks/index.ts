import type { Block } from 'payload'
import { bulletListField, faqField } from '@/fields/listItems'
import { richTextField } from '@/fields/richText'

const linkFields: Block['fields'] = [
  { name: 'label', type: 'text', label: 'Teks Tombol', localized: true },
  { name: 'href', type: 'text', label: 'Tautan' },
]

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Label Kecil di Atas Judul', localized: true },
    { name: 'heading', type: 'text', label: 'Judul Utama', localized: true, required: true },
    { name: 'subheading', type: 'textarea', label: 'Subjudul', localized: true },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media', label: 'Gambar Latar' },
    {
      name: 'buttons',
      type: 'array',
      label: 'Tombol',
      maxRows: 2,
      labels: { singular: 'Tombol', plural: 'Tombol' },
      fields: linkFields,
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Teks', plural: 'Teks' },
  fields: [richTextField({ name: 'content', label: 'Konten' })],
}

export const TextImageBlock: Block = {
  slug: 'textImage',
  labels: { singular: 'Teks + Gambar', plural: 'Teks + Gambar' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Label Kecil', localized: true },
    { name: 'heading', type: 'text', label: 'Judul', localized: true },
    richTextField({ name: 'content', label: 'Isi' }),
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Gambar', required: true },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Posisi Gambar',
      defaultValue: 'right',
      options: [
        { label: 'Kanan', value: 'right' },
        { label: 'Kiri', value: 'left' },
      ],
    },
    {
      name: 'button',
      type: 'group',
      label: 'Tombol (opsional)',
      fields: linkFields,
    },
  ],
}

export const CardGridBlock: Block = {
  slug: 'cardGrid',
  labels: { singular: 'Grid Kartu', plural: 'Grid Kartu' },
  fields: [
    { name: 'heading', type: 'text', label: 'Judul Section', localized: true },
    {
      name: 'columns',
      type: 'select',
      label: 'Jumlah Kolom',
      defaultValue: '3',
      options: [
        { label: '2 kolom', value: '2' },
        { label: '3 kolom', value: '3' },
        { label: '4 kolom', value: '4' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Kartu',
      labels: { singular: 'Kartu', plural: 'Kartu' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Gambar' },
        { name: 'title', type: 'text', label: 'Judul', localized: true, required: true },
        { name: 'description', type: 'textarea', label: 'Deskripsi', localized: true },
        { name: 'href', type: 'text', label: 'Tautan' },
      ],
    },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Statistik', plural: 'Statistik' },
  fields: [
    {
      name: 'items',
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
          admin: { description: 'Contoh: +, %, m²' },
        },
        { name: 'label', type: 'text', label: 'Keterangan', localized: true, required: true },
      ],
    },
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Galeri', plural: 'Galeri' },
  fields: [
    { name: 'heading', type: 'text', label: 'Judul Section', localized: true },
    {
      name: 'images',
      type: 'array',
      label: 'Foto',
      labels: { singular: 'Foto', plural: 'Foto' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text', label: 'Keterangan', localized: true },
      ],
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA Banner', plural: 'CTA Banner' },
  fields: [
    { name: 'heading', type: 'text', label: 'Judul', localized: true, required: true },
    { name: 'description', type: 'textarea', label: 'Deskripsi', localized: true },
    { name: 'button', type: 'group', label: 'Tombol', fields: linkFields },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media', label: 'Gambar Latar' },
  ],
}

export const FaqBlock: Block = {
  slug: 'faqBlock',
  labels: { singular: 'Tanya Jawab', plural: 'Tanya Jawab' },
  fields: [{ name: 'heading', type: 'text', label: 'Judul Section', localized: true }, faqField],
}

export const FeatureListBlock: Block = {
  slug: 'featureList',
  labels: { singular: 'Daftar Poin', plural: 'Daftar Poin' },
  fields: [
    { name: 'heading', type: 'text', label: 'Judul Section', localized: true },
    bulletListField({ name: 'items', label: 'Poin', itemLabel: 'Poin' }),
  ],
}

export const ContentListBlock: Block = {
  slug: 'contentList',
  labels: { singular: 'Daftar Konten Dinamis', plural: 'Daftar Konten Dinamis' },
  fields: [
    { name: 'heading', type: 'text', label: 'Judul Section', localized: true },
    {
      name: 'source',
      type: 'select',
      label: 'Sumber Data',
      required: true,
      defaultValue: 'projects',
      options: [
        { label: 'Proyek terbaru', value: 'projects' },
        { label: 'Proyek unggulan', value: 'projects-featured' },
        { label: 'Berita terbaru', value: 'posts' },
        { label: 'Layanan', value: 'services' },
        { label: 'Divisi usaha', value: 'divisions' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Jumlah Ditampilkan',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: { step: 1 },
    },
    { name: 'viewAllHref', type: 'text', label: 'Tautan "Lihat Semua"' },
  ],
}

export const allBlocks = [
  HeroBlock,
  RichTextBlock,
  TextImageBlock,
  CardGridBlock,
  StatsBlock,
  GalleryBlock,
  CtaBlock,
  FaqBlock,
  FeatureListBlock,
  ContentListBlock,
]
