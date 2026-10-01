import { ButtonLink } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Heading, Lead } from '@/components/ui/typography'
import type { Locale } from '@/lib/constants'

/**
 * Tampil saat seluruh section beranda masih kosong — yakni tepat setelah
 * pemasangan, sebelum tim mengisi konten.
 *
 * Tanpa ini, beranda hanya menampilkan header dan footer dengan ruang kosong
 * di antaranya, yang mudah disalahartikan sebagai situs rusak. Panel ini
 * hilang dengan sendirinya begitu ada konten yang terbit.
 */
export const EmptyHomepage = ({ locale }: { locale: Locale }) => (
  <Section tone="alt" spacing="lg">
    <Container className="max-w-2xl py-16 text-center">
      <Heading as="h1" size="md">
        {locale === 'id' ? 'Situs belum berisi konten' : 'This site has no content yet'}
      </Heading>
      <Lead className="mt-5">
        {locale === 'id'
          ? 'Pemasangan berhasil dan situs sudah berjalan. Isi beranda, divisi usaha, layanan, dan proyek melalui panel admin — bagian yang sudah terisi akan langsung tampil di halaman ini.'
          : 'Installation succeeded and the site is running. Fill in the homepage, business divisions, services, and projects from the admin panel — whatever you publish will appear here.'}
      </Lead>
      <ButtonLink href="/admin" className="mt-10">
        {locale === 'id' ? 'Buka Panel Admin' : 'Open Admin Panel'}
      </ButtonLink>
    </Container>
  </Section>
)
