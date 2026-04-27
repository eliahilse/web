'use client'

import { useEffect, useState } from 'react'
import BackLink from '@/components/BackLink'
import type { ResolvedPosition, PositionEvent } from '@/lib/markets/types'

type ApiResponse = { positions: ResolvedPosition[]; generatedAt: string }

function formatPct(n: number) {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${(n * 100).toFixed(1)}%`
}

function gainColor(n: number) {
  if (n > 0) return 'text-emerald-500'
  if (n < 0) return 'text-red-500'
  return 'text-muted-foreground'
}

function eventDot(kind: PositionEvent['kind']) {
  switch (kind) {
    case 'entry': return 'bg-emerald-500'
    case 'exit': return 'bg-red-500'
    case 'change': return 'bg-amber-500'
    default: return 'bg-muted-foreground'
  }
}

function PositionCard({ p }: { p: ResolvedPosition }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="bg-card-bg border border-card-border rounded-lg p-6 hover:border-card-border-hover transition-colors">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-foreground">{p.name}</h2>
            {'symbol' in p && (
              <span className="text-xs text-muted-foreground font-mono">{p.symbol}</span>
            )}
            <span className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/70 capitalize">{p.kind}</span>
            {p.exited && (
              <span className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/70">exited</span>
            )}
          </div>
        </div>
        <div className={`text-right font-mono text-lg ${gainColor(p.gainPct)}`}>
          {formatPct(p.gainPct)}
        </div>
      </div>

      {p.intro && (
        <div
          className="article-content text-sm text-foreground/80 mb-4"
          dangerouslySetInnerHTML={{ __html: p.intro }}
        />
      )}

      <ol className="relative space-y-3 border-l border-card-border pl-5 ml-1">
        {p.events.map((e, i) => {
          const isOpen = openIdx === i
          return (
            <li key={i} className="relative">
              <span className={`absolute -left-[1.6rem] top-1.5 w-2 h-2 rounded-full ${eventDot(e.kind)}`} />
              <button
                type="button"
                className="w-full text-left cursor-pointer"
                onClick={() => setOpenIdx(isOpen ? null : i)}
              >
                <div className="flex items-baseline gap-2 flex-wrap">
                  <time className="text-xs text-muted-foreground font-mono">
                    {new Date(e.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="text-xs text-muted-foreground capitalize">· {e.kind}</span>
                </div>
                <div className="text-sm text-foreground mt-0.5">{e.tldr}</div>
              </button>
              {isOpen && e.html && (
                <div
                  className="article-content text-sm text-foreground/80 mt-2"
                  dangerouslySetInnerHTML={{ __html: e.html }}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

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

  return (
    <div className="min-h-screen flex flex-col p-8">
      <div className="page-container">
        <BackLink href="/" label="Back to home" />
        <h1 className="text-4xl font-bold text-foreground mb-2 font-serif">Markets</h1>
        <p className="text-lg text-muted-foreground mb-8">Public, private, and crypto positions</p>

        {error && <div className="text-red-500 text-sm">Failed to load: {error}</div>}
        {!data && !error && <div className="text-muted-foreground text-sm">Loading…</div>}

        {data && (
          <div className="grid gap-4">
            {data.positions.length === 0 && (
              <div className="text-muted-foreground text-sm">No positions yet.</div>
            )}
            {data.positions.map((p) => (
              <PositionCard key={p.id} p={p} />
            ))}
          </div>
        )}

        {data && (
          <div className="text-xs text-muted-foreground mt-6">
            Updated {new Date(data.generatedAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}
