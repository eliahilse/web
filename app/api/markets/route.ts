import { NextResponse } from 'next/server'
import { positions } from '@/lib/markets/positions'
import { fetchStockQuote, fetchCryptoQuote } from '@/lib/markets/sources'
import { swrCached } from '@/lib/cache'
import type { ResolvedPosition } from '@/lib/markets/types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const resolved = await Promise.all(
    positions.map(async (p): Promise<ResolvedPosition | null> => {
      try {
        if (p.kind === 'stock') {
          if (p.exitPrice != null) {
            return { ...p, exited: true, gainPct: (p.exitPrice - p.entryPrice) / p.entryPrice }
          }
          const quote = await swrCached(`px:stock:${p.symbol}:v1`, () => fetchStockQuote(p.symbol))
          return { ...p, exited: false, quote, gainPct: (quote.price - p.entryPrice) / p.entryPrice }
        }
        if (p.kind === 'crypto') {
          if (p.exitPrice != null) {
            return { ...p, exited: true, gainPct: (p.exitPrice - p.entryPrice) / p.entryPrice }
          }
          const quote = await swrCached(`px:crypto:${p.coingeckoId}:v1`, () => fetchCryptoQuote(p.coingeckoId))
          return { ...p, exited: false, quote, gainPct: (quote.price - p.entryPrice) / p.entryPrice }
        }
        const exited = p.exitValuation != null
        const current = exited ? p.exitValuation! : p.currentValuation
        return { ...p, exited, gainPct: (current - p.entryValuation) / p.entryValuation }
      } catch {
        return null
      }
    }),
  )

  return NextResponse.json({
    positions: resolved.filter((r): r is ResolvedPosition => r !== null),
    generatedAt: new Date().toISOString(),
  })
}
