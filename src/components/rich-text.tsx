import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '@/lib/utils'

/**
 * Merender konten rich text dari Payload dengan gaya tipografi situs.
 * Mengembalikan `null` bila konten kosong, agar tidak meninggalkan ruang kosong.
 */
export const RichText = ({
  data,
  className,
}: {
  data?: SerializedEditorState | null
  className?: string
}) => {
  if (!data) return null

  return (
    <div
      className={cn(
        'space-y-5 text-sm leading-relaxed text-stone',
        '[&_h2]:mt-10 [&_h2]:text-lg [&_h2]:text-ink',
        '[&_h3]:mt-8 [&_h3]:text-base [&_h3]:text-ink',
        '[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5',
        '[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5',
        '[&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[color:var(--accent-text)]',
        '[&_strong]:font-semibold [&_strong]:text-ink',
        '[&_hr]:my-10 [&_hr]:border-line',
        '[&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:italic',
        className,
      )}
    >
      <LexicalRichText data={data} />
    </div>
  )
}
