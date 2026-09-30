import type { FieldHook } from 'payload'
import { slugify } from '@/lib/utils'

/**
 * Isi slug otomatis dari field sumber bila slug masih kosong.
 * Slug yang sudah pernah diisi manual tidak akan ditimpa, supaya URL
 * yang sudah terlanjur diindeks mesin pencari tidak berubah sendiri.
 */
export const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return slugify(value)
    }

    if (operation === 'create' || operation === 'update') {
      const fallback = data?.[fallbackField]
      if (typeof fallback === 'string' && fallback.length > 0) {
        return slugify(fallback)
      }
    }

    return value
  }
