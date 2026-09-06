'use client'

import { useEffect, useMemo, useState } from 'react'
import BackLink from '@/components/BackLink'
import type { ResolvedPosition } from '@/lib/markets/types'
import { computeSeries, computeMarkers, computeStats, computeAllocation, flattenFeed } from '@/lib/markets/portfolio'
import PortfolioChart from './PortfolioChart'
import StatBoard from './StatBoard'
import AllocationChart from './AllocationChart'
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
      allocation: computeAllocation(data.positions),
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
        {!data && !error && (
          <div className="space-y-8 animate-pulse" aria-label="Loading">
            <div>
              <div className="h-3 w-40 rounded bg-tag mb-2" />
              <div className="h-9 w-32 rounded bg-tag mb-4" />
              <div className="w-full aspect-[800/320] rounded-lg bg-card-bg border border-card-border" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-[92px] rounded-lg bg-card-bg border border-card-border" />
              ))}
            </div>
          </div>
        )}

        {data && derived && (
          <div className="space-y-8">
            <PortfolioChart series={derived.series} markers={derived.markers} />
            <StatBoard stats={derived.stats} />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Allocation</h2>
              <AllocationChart slices={derived.allocation} />
            </div>
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
