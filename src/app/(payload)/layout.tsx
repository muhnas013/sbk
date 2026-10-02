/* Layout panel admin Payload. Jangan diubah kecuali mengikuti dokumentasi Payload. */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import localFont from 'next/font/local'
import React from 'react'

import { importMap } from './admin/importMap.js'

import '@payloadcms/next/css'
/* Diimpor paling akhir agar penyesuaian tema berada setelah gaya bawaan
   Payload pada berkas CSS hasil build. */
import './custom.scss'

/* Font yang sama dengan situs publik, dimuat lewat `next/font/local` dari
   berkas di dalam repositori — lihat alasannya di layout situs publik.
   `htmlProps` adalah satu-satunya jalan menempelkan kelas pada <html>, karena
   elemen itu dirender oleh `RootLayout` milik Payload. */
const jakarta = localFont({
  src: '../../fonts/plus-jakarta-sans-latin-variable.woff2',
  weight: '200 800',
  style: 'normal',
  variable: '--font-jakarta',
  display: 'swap',
})

const inter = localFont({
  src: '../../fonts/inter-latin-variable.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
})

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    htmlProps={{ className: `${inter.variable} ${jakarta.variable}` }}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
)

export default Layout
