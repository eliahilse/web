'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SeriesPoint, PortfolioMarker } from '@/lib/markets/portfolio'

type Props = {
  series: SeriesPoint[]
  markers: PortfolioMarker[]
}

type RangeKey = '3M' | '6M' | '1Y' | 'ALL'
const RANGES: { key: RangeKey; months: number | null }[] = [
  { key: '3M', months: 3 },
  { key: '6M', months: 6 },
  { key: '1Y', months: 12 },
  { key: 'ALL', months: null },
]

const PADDING = { top: 16, right: 16, bottom: 28, left: 52 }
const WIDTH = 800
const HEIGHT = 320

const retOf = (p: SeriesPoint) => (p.invested === 0 ? 0 : p.value / p.invested - 1)
const ms = (iso: string) => new Date(iso).getTime()
const localDate = (iso: string) => new Date(`${iso}T00:00:00`)

function fmtPct(n: number) {
  const s = n >= 0 ? '+' : ''
  return `${s}${(n * 100).toFixed(1)}%`
}

function fmtTick(n: number, step: number) {
  const s = n > 0 ? '+' : ''
  return `${s}${(n * 100).toFixed(step >= 0.1 ? 0 : 1)}%`
}

function fmtUnits(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 1 })
}

function fmtMonth(iso: string) {
  return localDate(iso).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function fmtDate(iso: string) {
  return localDate(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function cutoffFor(lastIso: string, months: number) {
  const d = new Date(lastIso)
  d.setUTCMonth(d.getUTCMonth() - months)
  return d.toISOString().slice(0, 10)
}

function niceStep(rough: number) {
  const pow = 10 ** Math.floor(Math.log10(rough))
  const f = rough / pow
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10
  return nice * pow
}

function gainColor(n: number) {
  return n >= 0 ? 'text-emerald-500' : 'text-red-500'
}

export default function PortfolioChart({ series, markers }: Props) {
  const [range, setRange] = useState<RangeKey>('ALL')
  const [hover, setHover] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const rangeOptions = useMemo(() => {
    if (series.length === 0) return []
    const first = series[0].date
    const last = series[series.length - 1].date
    return RANGES.filter((r) => r.months == null || cutoffFor(last, r.months) > first)
  }, [series])

  useEffect(() => {
    if (!rangeOptions.some((r) => r.key === range)) setRange('ALL')
  }, [rangeOptions, range])

  useEffect(() => {
    setHover(null)
  }, [range])

  const visible = useMemo(() => {
    if (series.length === 0) return series
    const opt = RANGES.find((r) => r.key === range)
    if (!opt || opt.months == null) return series
    const cutoff = cutoffFor(series[series.length - 1].date, opt.months)
    const idx = series.findIndex((p) => p.date >= cutoff)
    const sliced = idx <= 0 ? series : series.slice(idx)
    return sliced.length >= 2 ? sliced : series
  }, [series, range])

  const geo = useMemo(() => {
    if (visible.length === 0) return null

    const innerW = WIDTH - PADDING.left - PADDING.right
    const innerH = HEIGHT - PADDING.top - PADDING.bottom
    const startMs = ms(visible[0].date)
    const endMs = ms(visible[visible.length - 1].date)
    const spanMs = endMs - startMs || 1

    const rets = visible.map(retOf)
    const minR = Math.min(...rets)
    const maxR = Math.max(...rets)
    const pad = Math.max(0.02, (maxR - minR) * 0.08)
    const step = niceStep((maxR - minR + pad * 2) / 5)
    const half = step / 2
    const yMin = Math.floor((minR - pad) / half) * half
    const yMax = Math.ceil((maxR + pad) / half) * half
    const ySpan = yMax - yMin || 1

    const xAt = (iso: string) => PADDING.left + ((ms(iso) - startMs) / spanMs) * innerW
    const yAt = (r: number) => PADDING.top + innerH - ((r - yMin) / ySpan) * innerH

    const pts = visible.map((p, i) => ({ x: xAt(p.date), y: yAt(rets[i]) }))
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    const baseY = PADDING.top + innerH
    const area = `${line} L${pts[pts.length - 1].x.toFixed(1)} ${baseY} L${pts[0].x.toFixed(1)} ${baseY} Z`

    const yTicks: number[] = []
    for (let t = Math.ceil(yMin / step) * step; t <= yMax + 1e-9; t += step) yTicks.push(Math.round(t / step) * step)
    const monthsSpan = spanMs / (1000 * 60 * 60 * 24 * 30)
    const xTickCount = Math.min(6, Math.max(2, Math.round(monthsSpan / 3)))
    const xTicks = Array.from({ length: xTickCount }, (_, i) =>
      new Date(startMs + (spanMs * i) / (xTickCount - 1)).toISOString().slice(0, 10),
    )

    const markerIdx = new Map<number, PortfolioMarker[]>()
    for (const m of markers) {
      const i = visible.findIndex((p) => p.date === m.date)
      if (i === -1) continue
      markerIdx.set(i, [...(markerIdx.get(i) ?? []), m])
    }

    return { pts, rets, line, area, zeroY: yMin <= 0 && yMax >= 0 ? yAt(0) : null, baseY, yTicks, step, xTicks, markerIdx, xAt, yAt }
  }, [visible, markers])

  const indexFromClientX = useCallback(
    (clientX: number) => {
      const svg = svgRef.current
      if (!svg || !geo) return null
      const rect = svg.getBoundingClientRect()
      if (rect.width === 0) return null
      const x = ((clientX - rect.left) / rect.width) * WIDTH
      const pts = geo.pts
      let lo = 0
      let hi = pts.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (pts[mid].x < x) lo = mid + 1
        else hi = mid
      }
      if (lo > 0 && Math.abs(pts[lo - 1].x - x) < Math.abs(pts[lo].x - x)) return lo - 1
      return lo
    },
    [geo],
  )

  if (!geo || visible.length === 0) {
    return <div className="text-sm text-muted-foreground">No portfolio data yet.</div>
  }

  const lastIdx = visible.length - 1
  const shownIdx = hover ?? lastIdx
  const shownPoint = visible[shownIdx]
  const shownRet = geo.rets[shownIdx]
  const hoverPt = hover != null ? geo.pts[hover] : null
  const hoverMarkers = hover != null ? (geo.markerIdx.get(hover) ?? []) : []
  const flipTooltip = hoverPt != null && hoverPt.x > WIDTH * 0.62
  const rangeDelta = range === 'ALL' ? null : (1 + geo.rets[lastIdx]) / (1 + geo.rets[0]) - 1

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const cur = hover ?? lastIdx
      const next = e.key === 'ArrowLeft' ? Math.max(0, cur - 1) : Math.min(lastIdx, cur + 1)
      setHover(next)
    } else if (e.key === 'Escape') {
      setHover(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Portfolio (unit-weighted)</div>
          <div className={`text-4xl font-mono tabular-nums transition-colors duration-200 ${gainColor(shownRet)}`}>
            {fmtPct(shownRet)}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1 tabular-nums">
            {fmtDate(shownPoint.date)} · {shownPoint.count} position{shownPoint.count === 1 ? '' : 's'}
            {rangeDelta != null && hover == null && (
              <span className={`ml-2 ${gainColor(rangeDelta)}`}>{fmtPct(rangeDelta)} over {range}</span>
            )}
          </div>
        </div>
        {rangeOptions.length > 1 && (
          <div className="flex gap-1" role="group" aria-label="Chart range">
            {rangeOptions.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                aria-pressed={range === r.key}
                className={`text-xs font-mono px-2.5 py-1 rounded-md transition-colors duration-200 cursor-pointer ${
                  range === r.key ? 'bg-tag text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-tag/60'
                }`}
              >
                {r.key}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto touch-pan-y outline-none cursor-crosshair"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          tabIndex={0}
          aria-label={`Unit-weighted portfolio return, ${fmtPct(geo.rets[lastIdx])} as of ${fmtDate(visible[lastIdx].date)}. Use arrow keys to inspect points.`}
          onPointerMove={(e) => setHover(indexFromClientX(e.clientX))}
          onPointerDown={(e) => setHover(indexFromClientX(e.clientX))}
          onPointerLeave={() => setHover(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setHover(null)}
        >
          <defs>
            <linearGradient id="pf-area" x1="0" y1="0" x2="0" y2="1" className="text-emerald-500">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
            <clipPath id="pf-plot">
              <rect x={PADDING.left} y={0} width={WIDTH - PADDING.left - PADDING.right} height={HEIGHT} />
            </clipPath>
          </defs>

          {geo.yTicks.map((t, i) => (
            <g key={`y${i}`}>
              <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={geo.yAt(t)} y2={geo.yAt(t)} className="stroke-card-border" strokeWidth={1} />
              <text x={PADDING.left - 8} y={geo.yAt(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-[10px] font-mono">
                {fmtTick(t, geo.step)}
              </text>
            </g>
          ))}

          {geo.zeroY != null && (
            <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={geo.zeroY} y2={geo.zeroY} className="stroke-muted-foreground/40" strokeWidth={1} />
          )}

          {geo.xTicks.map((d, i) => (
            <text
              key={`x${i}`}
              x={geo.xAt(d)}
              y={HEIGHT - PADDING.bottom + 16}
              textAnchor={i === 0 ? 'start' : i === geo.xTicks.length - 1 ? 'end' : 'middle'}
              className="fill-muted-foreground text-[10px] font-mono"
            >
              {fmtMonth(d)}
            </text>
          ))}

          <g key={range} clipPath="url(#pf-plot)">
            <path d={geo.area} fill="url(#pf-area)" className="chart-area" />
            <path
              d={geo.line}
              fill="none"
              className="stroke-emerald-500 chart-line"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
            />
          </g>

          {Array.from(geo.markerIdx.entries()).map(([i, list]) => (
            <circle
              key={`m${i}`}
              cx={geo.pts[i].x}
              cy={geo.pts[i].y}
              r={5}
              className={`${list.some((m) => m.kind === 'exit') ? 'fill-red-500' : 'fill-emerald-500'} stroke-background`}
              strokeWidth={2}
            />
          ))}

          <g className="chart-live">
            <circle cx={geo.pts[lastIdx].x} cy={geo.pts[lastIdx].y} r={5} className="fill-emerald-500 chart-pulse" />
            <circle cx={geo.pts[lastIdx].x} cy={geo.pts[lastIdx].y} r={4} className="fill-emerald-500 stroke-background" strokeWidth={2} />
          </g>

          {hoverPt && (
            <g className="pointer-events-none">
              <line x1={hoverPt.x} x2={hoverPt.x} y1={PADDING.top} y2={geo.baseY} className="stroke-muted-foreground/50" strokeWidth={1} />
              <circle cx={hoverPt.x} cy={hoverPt.y} r={6} className="fill-emerald-500 stroke-background" strokeWidth={2} />
            </g>
          )}
        </svg>

        {hoverPt && (
          <div
            className="pointer-events-none absolute z-10"
            style={{
              left: `${(hoverPt.x / WIDTH) * 100}%`,
              top: `${(hoverPt.y / HEIGHT) * 100}%`,
              transform: flipTooltip ? 'translate(calc(-100% - 14px), -50%)' : 'translate(14px, -50%)',
            }}
          >
            <div className="rounded-lg border border-card-border bg-popover shadow-lg px-3 py-2 text-xs font-mono whitespace-nowrap tabular-nums">
              <div className="text-muted-foreground">{fmtDate(shownPoint.date)}</div>
              <div className="flex items-center gap-2 text-base text-foreground">
                <span className="inline-block w-3 h-0.5 rounded bg-emerald-500" />
                {fmtPct(shownRet)}
              </div>
              <div className="text-muted-foreground">
                {shownPoint.count} position{shownPoint.count === 1 ? '' : 's'} · {fmtUnits(shownPoint.invested)} → {fmtUnits(shownPoint.value)}u
              </div>
              {hoverMarkers.map((m, i) => (
                <div key={i} className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-card-border">
                  <span className={`w-1.5 h-1.5 rounded-full ${m.kind === 'entry' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="capitalize text-muted-foreground">{m.kind}</span>
                  <span className="text-foreground">{m.positionName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
