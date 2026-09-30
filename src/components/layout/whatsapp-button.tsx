import { MessageCircle } from 'lucide-react'

/**
 * Tombol WhatsApp melayang. Nomor diambil dari pengaturan situs;
 * komponen tidak dirender bila nomor belum diisi admin.
 */
export const WhatsAppButton = ({
  phone,
  label,
  message,
}: {
  phone?: string | null
  label: string
  message?: string
}) => {
  if (!phone) return null

  const normalized = phone.replace(/\D/g, '')
  const href = `https://wa.me/${normalized}${message ? `?text=${encodeURIComponent(message)}` : ''}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  )
}
