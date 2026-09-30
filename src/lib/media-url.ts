/**
 * Payload mengembalikan URL media dalam bentuk absolut (serverURL + path).
 * Media selalu disajikan dari origin yang sama dengan situs, jadi URL diubah
 * menjadi relatif: `next/image` memperlakukannya sebagai gambar lokal (tanpa
 * perlu `images.remotePatterns`), dan tautan tetap benar ketika domain berubah
 * — mis. saat pindah dari staging ke produksi.
 */
export const toRelativeMediaUrl = (url: string): string => {
  if (!url.startsWith('http')) return url
  try {
    const parsed = new URL(url)
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
}
