'use client'

import { useState } from 'react'
import type { FeedItem } from '@/lib/markets/portfolio'
import type { EventKind } from '@/lib/markets/types'

function eventDot(kind: EventKind) {
  switch (kind) {
    case 'entry': return 'bg-emerald-500'
    case 'exit': return 'bg-red-500'
    case 'change': return 'bg-amber-500'
    default: return 'bg-muted-foreground'
  }
}

export default function UpdateFeed({ items }: { items: FeedItem[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground">No updates yet.</div>
  }

  return (
    <ol className="relative space-y-5 border-l border-card-border pl-6">
      {items.map((item, i) => {
        const key = `${item.positionId}-${item.event.date}-${i}`
        const isOpen = openKey === key
        const e = item.event
        return (
          <li key={key} className="relative">
            <span className={`absolute -left-[1.85rem] top-2 w-2.5 h-2.5 rounded-full ring-4 ring-background ${eventDot(e.kind)}`} />
            <div className="bg-card-bg border border-card-border rounded-lg p-4 hover:border-card-border-hover transition-colors">
              <div className="flex items-baseline gap-2 flex-wrap mb-1">
                <span className="text-sm font-semibold text-foreground">{item.positionName}</span>
                {item.positionSymbol && (
                  <span className="text-xs font-mono text-muted-foreground">{item.positionSymbol}</span>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/70 capitalize">{e.kind}</span>
                <time className="text-xs text-muted-foreground font-mono ml-auto">
                  {new Date(e.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </time>
              </div>
              <button
                type="button"
                className="w-full text-left cursor-pointer"
                onClick={() => e.html && setOpenKey(isOpen ? null : key)}
              >
                <div className="text-sm text-foreground">{e.tldr}</div>
              </button>
              {isOpen && e.html && (
                <div
                  className="article-content text-sm text-foreground/80 mt-3 pt-3 border-t border-card-border"
                  dangerouslySetInnerHTML={{ __html: e.html }}
                />
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
