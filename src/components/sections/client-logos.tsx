import { Container, Section } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import type { Client } from '@/payload-types'
import type { Dictionary } from '@/i18n/dictionaries'

export const ClientLogos = ({ clients, dict }: { clients: Client[]; dict: Dictionary }) => {
  if (clients.length === 0) return null

  return (
    <Section spacing="md">
      <Container>
        <Eyebrow className="text-center">{dict.nav.clients}</Eyebrow>
        <ul className="mt-10 grid grid-cols-2 items-center gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {clients.map((client) => (
            <li key={client.id} className="relative h-14">
              <MediaImage
                media={client.logo}
                alt={client.name}
                sizes="(min-width: 1024px) 20vw, 33vw"
                className="object-contain opacity-60 transition-opacity hover:opacity-100"
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
