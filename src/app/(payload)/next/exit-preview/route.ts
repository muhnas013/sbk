import { draftMode } from 'next/headers'

/** Mematikan draft mode dan kembali ke tampilan publik. */
export const GET = async () => {
  const draft = await draftMode()
  draft.disable()
  return new Response('Mode pratinjau dimatikan.', { status: 200 })
}
