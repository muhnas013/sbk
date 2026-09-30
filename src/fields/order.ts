import type { Field } from 'payload'

/** Field urutan tampil. Angka lebih kecil tampil lebih dulu. */
export const orderField: Field = {
  name: 'order',
  type: 'number',
  label: 'Urutan Tampil',
  defaultValue: 0,
  admin: {
    position: 'sidebar',
    step: 1,
    description: 'Angka lebih kecil tampil lebih dahulu.',
  },
}
