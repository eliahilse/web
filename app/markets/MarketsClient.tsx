'use client'

import { useEffect, useMemo, useState } from 'react'
import BackLink from '@/components/BackLink'
import type { ResolvedPosition } from '@/lib/markets/types'
import { computeSeries, computeMarkers, computeStats, flattenFeed } from '@/lib/markets/portfolio'
import PortfolioChart from './PortfolioChart'
import StatBoard from './StatBoard'
import UpdateFeed from './UpdateFeed'

type ApiResponse = { positions: ResolvedPosition[]; generatedAt: string }

export default function MarketsClient() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/markets')
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(String(e)))
  }, [])

  const derived = useMemo(() => {
    if (!data) return null
    const series = computeSeries(data.positions)
    return {
      series,
      markers: computeMarkers(data.positions),
      stats: computeStats(data.positions, series),
      feed: flattenFeed(data.positions),
    }
  }, [data])

  return (
    <div className="min-h-screen flex flex-col p-8">
      <div className="page-container">
        <BackLink href="/" label="Back to home" />
        <h1 className="text-4xl font-bold text-foreground mb-2 font-serif">Markets</h1>
        <p className="text-lg text-muted-foreground mb-8">Public, private, and crypto positions</p>

        {error && <div className="text-red-500 text-sm">Failed to load: {error}</div>}
        {!data && !error && <div className="text-muted-foreground text-sm">Loading…</div>}

        {data && derived && (
          <div className="space-y-8">
            <PortfolioChart series={derived.series} markers={derived.markers} />
            <StatBoard stats={derived.stats} />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Updates</h2>
              <UpdateFeed items={derived.feed} />
            </div>
            <div className="text-xs text-muted-foreground">
              Updated {new Date(data.generatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
