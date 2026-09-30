import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** Health check untuk monitoring uptime dan orkestrasi container. */
export const GET = () =>
  NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION ?? 'dev',
  })
