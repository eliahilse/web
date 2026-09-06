'use client'

import { useMemo, useState } from 'react'
import type { AllocationSlice } from '@/lib/markets/portfolio'

const SIZE = 220
const CX = SIZE / 2
const CY = SIZE / 2
const R_OUTER = 100
const R_INNER = 64
const MAX_SLICES = 5
const SERIES = Array.from({ length: MAX_SLICES }, (_, i) => `var(--series-${i + 1})`)
const OTHER_COLOR = 'var(--dot)'

type Wedge = AllocationSlice & { color: string; start: number; end: number }

function fmtPct(n: number) {
  const s = n >= 0 ? '+' : ''
  return `${s}${(n * 100).toFixed(1)}%`
}

function fmtShare(n: number) {
  return `${(n * 100).toFixed(1)}%`
}

function fmtUnits(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 1 })
}

function polar(r: number, angle: number) {
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) }
}

function wedgePath(start: number, end: number) {
  const large = end - start > Math.PI ? 1 : 0
  const o0 = polar(R_OUTER, start)
  const o1 = polar(R_OUTER, end)
  const i0 = polar(R_INNER, end)
  const i1 = polar(R_INNER, start)
  return [
    `M${o0.x.toFixed(2)} ${o0.y.toFixed(2)}`,
    `A${R_OUTER} ${R_OUTER} 0 ${large} 1 ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `L${i0.x.toFixed(2)} ${i0.y.toFixed(2)}`,
    `A${R_INNER} ${R_INNER} 0 ${large} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

export default function AllocationChart({ slices }: { slices: AllocationSlice[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const wedges = useMemo<Wedge[]>(() => {
    if (slices.length === 0) return []
    const head = slices.slice(0, MAX_SLICES)
    const tail = slices.slice(MAX_SLICES)
    const list: AllocationSlice[] = tail.length
      ? [
          ...head,
          {
            id: '__other',
            name: `Other (${tail.length})`,
            kind: 'private',
            entryUnits: tail.reduce((s, x) => s + x.entryUnits, 0),
            currentUnits: tail.reduce((s, x) => s + x.currentUnits, 0),
            share: tail.reduce((s, x) => s + x.share, 0),
            gainPct: 0,
          },
        ]
      : head
    let angle = -Math.PI / 2
    return list.map((s, i) => {
      const sweep = s.share * Math.PI * 2
      const w = { ...s, color: s.id === '__other' ? OTHER_COLOR : SERIES[i], start: angle, end: angle + sweep }
      angle += sweep
      return w
    })
  }, [slices])

  if (wedges.length === 0) {
    return <div className="text-sm text-muted-foreground">No active positions.</div>
  }

  const totalEntry = wedges.reduce((s, w) => s + w.entryUnits, 0)
  const totalNow = wedges.reduce((s, w) => s + w.currentUnits, 0)
  const active = hovered ? wedges.find((w) => w.id === hovered) ?? null : null
  const dim = hovered != null

  return (
    <div className="bg-card-bg border border-card-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-[220px] h-[220px] shrink-0"
          role="img"
          aria-label={`Allocation across ${wedges.length} positions, ${fmtUnits(totalNow)} units total`}
          onPointerLeave={() => setHovered(null)}
        >
          {wedges.map((w) =>
            w.share >= 0.9999 ? (
              <circle
                key={w.id}
                cx={CX}
                cy={CY}
                r={(R_OUTER + R_INNER) / 2}
                fill="none"
                stroke={w.color}
                strokeWidth={R_OUTER - R_INNER}
                className="transition-opacity duration-200"
                onPointerEnter={() => setHovered(w.id)}
              />
            ) : (
              <path
                key={w.id}
                d={wedgePath(w.start, w.end)}
                fill={w.color}
                stroke="var(--background)"
                strokeWidth={2}
                className="transition-opacity duration-200 cursor-pointer"
                style={{ opacity: dim && hovered !== w.id ? 0.4 : 1 }}
                onPointerEnter={() => setHovered(w.id)}
              />
            ),
          )}
          <text x={CX} y={CY - 6} textAnchor="middle" className="fill-foreground font-mono text-[22px] tabular-nums">
            {active ? fmtShare(active.share) : fmtUnits(totalNow)}
          </text>
          <text x={CX} y={CY + 14} textAnchor="middle" className="fill-muted-foreground text-[10px] uppercase tracking-wide">
            {active ? active.name : 'units now'}
          </text>
        </svg>

        <ul className="flex-1 w-full space-y-1 text-sm font-mono tabular-nums" onPointerLeave={() => setHovered(null)}>
          {wedges.map((w) => (
            <li
              key={w.id}
              onPointerEnter={() => setHovered(w.id)}
              className={`grid grid-cols-[12px_1fr_auto] sm:grid-cols-[12px_1fr_auto_auto_auto] items-center gap-x-3 rounded-md px-2 py-1.5 transition-colors duration-200 ${
                hovered === w.id ? 'bg-tag' : ''
              } ${dim && hovered !== w.id ? 'opacity-50' : ''}`}
            >
              <span className="w-3 h-3 rounded-sm" style={{ background: w.color }} />
              <span className="truncate text-foreground">
                {w.name}
                {w.symbol && <span className="text-muted-foreground ml-2 text-xs">{w.symbol}</span>}
              </span>
              <span className="text-foreground text-right">{fmtShare(w.share)}</span>
              <span className="hidden sm:block text-muted-foreground text-right text-xs">
                {fmtUnits(w.entryUnits)} → {fmtUnits(w.currentUnits)}u
              </span>
              <span className={`hidden sm:block text-right text-xs ${w.gainPct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {w.id === '__other' ? '' : fmtPct(w.gainPct)}
              </span>
            </li>
          ))}
          <li className="grid grid-cols-[12px_1fr_auto] sm:grid-cols-[12px_1fr_auto_auto_auto] items-center gap-x-3 px-2 pt-2 mt-1 border-t border-card-border text-xs text-muted-foreground">
            <span />
            <span>Total</span>
            <span className="text-right">100%</span>
            <span className="hidden sm:block text-right">
              {fmtUnits(totalEntry)} → {fmtUnits(totalNow)}u
            </span>
            <span className={`hidden sm:block text-right ${totalNow >= totalEntry ? 'text-emerald-500' : 'text-red-500'}`}>
              {fmtPct(totalEntry === 0 ? 0 : totalNow / totalEntry - 1)}
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
