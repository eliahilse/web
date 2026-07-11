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

function Stat({ label, value, hint, color }: { label: string; value: string; hint?: string; color?: string }) {
  return (
    <div className="bg-card-bg border border-card-border rounded-lg p-5">
      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-mono ${color ?? 'text-foreground'}`}>{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1 truncate">{hint}</div>}
    </div>
  )
}

export default function StatBoard({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Stat
        label="Total return"
        value={fmtPct(stats.totalReturnPct)}
        color={gainColor(stats.totalReturnPct)}
        hint="equal-weight"
      />
      <Stat
        label="YoY"
        value={stats.yoyPct == null ? '—' : fmtPct(stats.yoyPct)}
        color={stats.yoyPct == null ? undefined : gainColor(stats.yoyPct)}
        hint="last 12 months"
      />
      <Stat
        label="Positions"
        value={String(stats.totalPositions)}
        hint={`${stats.active} active · ${stats.exited} exited`}
      />
      <Stat
        label="Best"
        value={stats.best ? fmtPct(stats.best.gainPct) : '—'}
        hint={stats.best?.name}
        color={stats.best ? gainColor(stats.best.gainPct) : undefined}
      />
      <Stat
        label="Worst"
        value={stats.worst ? fmtPct(stats.worst.gainPct) : '—'}
        hint={stats.worst?.name}
        color={stats.worst ? gainColor(stats.worst.gainPct) : undefined}
      />
    </div>
  )
}
