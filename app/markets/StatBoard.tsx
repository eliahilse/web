'use client'

import type { Stats } from '@/lib/markets/portfolio'

function fmtPct(n: number) {
  const s = n >= 0 ? '+' : ''
  return `${s}${(n * 100).toFixed(1)}%`
}

function gainColor(n: number) {
  if (n > 0) return 'text-emerald-500'
  if (n < 0) return 'text-red-500'
  return 'text-foreground'
}

function Stat({ label, value, hint, color, index }: { label: string; value: string; hint?: string; color?: string; index: number }) {
  return (
    <div
      className="bg-card-bg border border-card-border rounded-lg p-5 hover:border-card-border-hover hover:bg-card-bg-hover transition-all duration-200 animate-fade-in-up"
      style={{ animationDelay: `${150 + index * 60}ms`, animationFillMode: 'both' }}
    >
      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-mono tabular-nums ${color ?? 'text-foreground'}`}>{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1 truncate">{hint}</div>}
    </div>
  )
}

export default function StatBoard({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Stat
        index={0}
        label="Total return"
        value={fmtPct(stats.totalReturnPct)}
        color={gainColor(stats.totalReturnPct)}
        hint="unit-weighted"
      />
      <Stat
        index={1}
        label="YoY"
        value={stats.yoyPct == null ? '—' : fmtPct(stats.yoyPct)}
        color={stats.yoyPct == null ? undefined : gainColor(stats.yoyPct)}
        hint="last 12 months"
      />
      <Stat
        index={2}
        label="Positions"
        value={String(stats.totalPositions)}
        hint={`${stats.active} active · ${stats.exited} exited`}
      />
      <Stat
        index={3}
        label="Best"
        value={stats.best ? fmtPct(stats.best.gainPct) : '—'}
        hint={stats.best?.name}
        color={stats.best ? gainColor(stats.best.gainPct) : undefined}
      />
      <Stat
        index={4}
        label="Worst"
        value={stats.worst ? fmtPct(stats.worst.gainPct) : '—'}
        hint={stats.worst?.name}
        color={stats.worst ? gainColor(stats.worst.gainPct) : undefined}
      />
    </div>
  )
}
