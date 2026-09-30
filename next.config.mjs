import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [96, 128, 256, 384],
  },
  // Sharp harus tetap eksternal agar binary native ikut ke output standalone.
  serverExternalPackages: ['sharp'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
