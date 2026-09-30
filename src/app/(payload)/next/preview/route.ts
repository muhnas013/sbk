import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { isLocale } from '@/lib/constants'

/**
 * Mengaktifkan draft mode untuk Live Preview panel admin.
 *
 * Akses dibatasi ke pengguna panel yang sudah login: token diambil dari cookie
 * sesi Payload, bukan dari parameter URL, supaya tautan preview yang bocor
 * tidak bisa dipakai membuka konten yang belum terbit.
 */
export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl
  const path = searchParams.get('path')
  const locale = searchParams.get('locale') ?? 'id'

  if (!path || !path.startsWith('/')) {
    return new Response('Parameter `path` tidak valid.', { status: 400 })
  }
  if (!isLocale(locale)) {
    return new Response('Parameter `locale` tidak valid.', { status: 400 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return new Response('Anda harus login ke panel admin untuk memakai pratinjau.', {
      status: 401,
    })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(`/${locale}${path}`)
}
