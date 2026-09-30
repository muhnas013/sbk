import type { CollectionConfig } from 'payload'

/** Koleksi yang tidak ikut dicatat: log itu sendiri, media, dan data masuk dari publik. */
const EXCLUDED = new Set(['activity-logs', 'media', 'contact-submissions', 'job-applications'])

const titleOf = (doc: Record<string, unknown>, useAsTitle?: string): string => {
  const candidates = [useAsTitle, 'title', 'name', 'summary'].filter(Boolean) as string[]
  for (const key of candidates) {
    const value = doc[key]
    if (typeof value === 'string' && value.length > 0) return value
  }
  return String(doc.id ?? '')
}

/**
 * Menyisipkan hook pencatat aktivitas ke sebuah koleksi.
 *
 * Kegagalan penulisan log sengaja ditelan: log yang gagal tidak boleh
 * membatalkan operasi konten yang sebenarnya sudah berhasil.
 */
export const withAuditLog = (collection: CollectionConfig): CollectionConfig => {
  if (EXCLUDED.has(collection.slug)) return collection

  const label =
    typeof collection.labels?.singular === 'string' ? collection.labels.singular : collection.slug

  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [
        ...(collection.hooks?.afterChange ?? []),
        async ({ req, doc, operation }) => {
          if (req.context?.skipAudit) return doc
          try {
            await req.payload.create({
              collection: 'activity-logs',
              overrideAccess: true,
              // Ikut transaksi operasi induk: log ikut batal bila operasinya batal,
              // dan tidak ada query di luar transaksi yang bisa saling mengunci.
              req,
              context: { skipAudit: true },
              data: {
                summary: `${label}: ${titleOf(doc, collection.admin?.useAsTitle)}`,
                action: operation === 'create' ? 'create' : 'update',
                collectionLabel: label,
                documentId: String(doc.id),
                user: req.user?.id,
                userEmail: req.user?.email,
              },
            })
          } catch (error) {
            req.payload.logger.warn(`Gagal menulis log aktivitas: ${String(error)}`)
          }
          return doc
        },
      ],
      afterDelete: [
        ...(collection.hooks?.afterDelete ?? []),
        async ({ req, doc }) => {
          if (req.context?.skipAudit) return doc
          try {
            await req.payload.create({
              collection: 'activity-logs',
              overrideAccess: true,
              // Ikut transaksi operasi induk: log ikut batal bila operasinya batal,
              // dan tidak ada query di luar transaksi yang bisa saling mengunci.
              req,
              context: { skipAudit: true },
              data: {
                summary: `${label}: ${titleOf(doc, collection.admin?.useAsTitle)}`,
                action: 'delete',
                collectionLabel: label,
                documentId: String(doc.id),
                user: req.user?.id,
                userEmail: req.user?.email,
              },
            })
          } catch (error) {
            req.payload.logger.warn(`Gagal menulis log aktivitas: ${String(error)}`)
          }
          return doc
        },
      ],
    },
  }
}
