import type { Field } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

type RichTextOptions = {
  name?: string
  label?: string
  required?: boolean
  localized?: boolean
  /** Heading yang boleh dipakai. Dibatasi agar struktur heading halaman tetap benar. */
  headings?: ('h2' | 'h3' | 'h4')[]
}

export const richTextField = ({
  name = 'content',
  label = 'Konten',
  required = false,
  localized = true,
  headings = ['h2', 'h3', 'h4'],
}: RichTextOptions = {}): Field => ({
  name,
  type: 'richText',
  label,
  required,
  localized,
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: headings }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      HorizontalRuleFeature(),
      BlocksFeature({ blocks: [] }),
    ],
  }),
})
