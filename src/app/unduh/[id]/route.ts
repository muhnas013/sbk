import { NextResponse, type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * Menyajikan berkas Pusat Unduhan lewat route terkontrol, bukan tautan langsung
 * ke berkas. Dengan begitu dokumen non-publik tidak bisa diambil hanya dengan
 * menebak nama berkas, dan jumlah unduhan dapat dihitung.
 */
export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const payload = await getPayloadClient()

  const document = await payload
    .findByID({ collection: 'documents', id, depth: 0, overrideAccess: false })
    .catch(() => null)

  if (!document || !document.isPublic || !document.url) {
    return new NextResponse('Dokumen tidak ditemukan.', { status: 404 })
  }

  // Penambah counter sengaja tidak di-`await` sebagai penghalang: kegagalan
  // mencatat statistik tidak boleh membuat unduhan gagal.
  payload
    .update({
      collection: 'documents',
      id: document.id,
      data: { downloadCount: (document.downloadCount ?? 0) + 1 },
      overrideAccess: true,
      context: { skipAudit: true },
    })
    .catch((error) => payload.logger.warn(`Gagal menambah counter unduhan: ${String(error)}`))

  const fileUrl = new URL(
    document.url,
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  )
  const upstream = await fetch(fileUrl)

  if (!upstream.ok || !upstream.body) {
    return new NextResponse('Berkas tidak dapat diakses.', { status: 502 })
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': document.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(document.filename ?? 'dokumen')}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
