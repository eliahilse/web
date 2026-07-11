'use client'

import { useMemo } from 'react'
import type { SeriesPoint, PortfolioMarker } from '@/lib/markets/portfolio'

type Props = {
  series: SeriesPoint[]
  markers: PortfolioMarker[]
}

const PADDING = { top: 20, right: 20, bottom: 30, left: 50 }
const WIDTH = 800
const HEIGHT = 320

function fmtPct(n: number) {
  const s = n >= 0 ? '+' : ''
  return `${s}${(n * 100).toFixed(1)}%`
}

function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

export default function PortfolioChart({ series, markers }: Props) {
  const dims = useMemo(() => {
    if (series.length === 0) return null

    const innerW = WIDTH - PADDING.left - PADDING.right
    const innerH = HEIGHT - PADDING.top - PADDING.bottom

    const startMs = new Date(series[0].date).getTime()
    const endMs = new Date(series[series.length - 1].date).getTime()
    const spanMs = endMs - startMs || 1

    const returnPcts = series.map((p) => (p.invested === 0 ? 0 : p.value / p.invested - 1))
    const minR = Math.min(0, ...returnPcts)
    const maxR = Math.max(0, ...returnPcts)
    const padR = Math.max(0.05, (maxR - minR) * 0.1)
    const yMin = minR - padR
    const yMax = maxR + padR
    const ySpan = yMax - yMin || 1

    const xAt = (iso: string) => PADDING.left + ((new Date(iso).getTime() - startMs) / spanMs) * innerW
    const yAt = (ret: number) => PADDING.top + innerH - ((ret - yMin) / ySpan) * innerH

    const path = series
      .map((p, i) => {
        const ret = p.invested === 0 ? 0 : p.value / p.invested - 1
        const x = xAt(p.date)
        const y = yAt(ret)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')

    const zeroY = yAt(0)

    const yTicks = Array.from({ length: 5 }, (_, i) => yMin + (ySpan * i) / 4)

    const monthsSpan = (endMs - startMs) / (1000 * 60 * 60 * 24 * 30)
    const xTickCount = Math.min(6, Math.max(2, Math.round(monthsSpan / 3)))
    const xTicks = Array.from({ length: xTickCount }, (_, i) => {
      const t = startMs + ((endMs - startMs) * i) / (xTickCount - 1)
      return new Date(t).toISOString().slice(0, 10)
    })

    return { xAt, yAt, path, zeroY, yTicks, xTicks, innerW, innerH }
  }, [series])

  if (!dims) {
    return <div className="text-sm text-muted-foreground">No portfolio data yet.</div>
  }

  const { xAt, yAt, path, zeroY, yTicks, xTicks } = dims
  const latest = series[series.length - 1]
  const latestPct = latest.invested === 0 ? 0 : latest.value / latest.invested - 1

  return (
    <div>
      <div className="mb-4">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">Portfolio (equal-weight)</div>
        <div className={`text-4xl font-mono ${latestPct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {fmtPct(latestPct)}
        </div>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {yTicks.map((t, i) => (
          <g key={`y${i}`}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={yAt(t)}
              y2={yAt(t)}
              className="stroke-card-border"
              strokeDasharray="2 4"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 8}
              y={yAt(t)}
              dy="0.32em"
              textAnchor="end"
              className="fill-muted-foreground text-[10px] font-mono"
            >
              {fmtPct(t)}
            </text>
          </g>
        ))}

        <line
          x1={PADDING.left}
          x2={WIDTH - PADDING.right}
          y1={zeroY}
          y2={zeroY}
          className="stroke-muted-foreground/40"
          strokeWidth={1}
        />

        {xTicks.map((d, i) => (
          <text
            key={`x${i}`}
            x={xAt(d)}
            y={HEIGHT - PADDING.bottom + 16}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px] font-mono"
          >
            {fmtMonth(d)}
          </text>
        ))}

        <path d={path} fill="none" className="stroke-emerald-500" strokeWidth={2} strokeLinejoin="round" />

        {markers.map((m, i) => {
          const point = series.find((s) => s.date === m.date)
          if (!point) return null
          const ret = point.invested === 0 ? 0 : point.value / point.invested - 1
          const x = xAt(m.date)
          const y = yAt(ret)
          const fill = m.kind === 'entry' ? 'fill-emerald-500' : 'fill-red-500'
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={5} className={`${fill} stroke-background`} strokeWidth={2} />
              <title>{`${m.kind} · ${m.positionName} · ${m.date}`}</title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
