'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Heading, Lead } from '@/components/ui/typography'

const ErrorPage = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    // Digest saja yang dicatat — pesan error tidak ditampilkan ke pengunjung.
    console.error('Terjadi kesalahan pada halaman:', error.digest)
  }, [error])

  return (
    <Section spacing="lg">
      <Container className="max-w-2xl text-center">
        <Heading as="h1" size="lg">
          Terjadi kesalahan
        </Heading>
        <Lead className="mt-4">Sistem sedang bermasalah. Silakan coba beberapa saat lagi.</Lead>
        <Button onClick={reset} className="mt-10">
          Muat Ulang
        </Button>
      </Container>
    </Section>
  )
}

export default ErrorPage
