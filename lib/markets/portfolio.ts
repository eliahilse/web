import type { ResolvedPosition, PositionEvent } from './types'

export type SeriesPoint = { date: string; value: number; invested: number }

const today = () => new Date().toISOString().slice(0, 10)

// equal-weight: each position contributes $1 at entry; ratios drive its value over time
function ratioAt(p: ResolvedPosition, date: string): number | null {
  if (date < p.entryDate) return null

  if (p.kind === 'private') {
    const startMs = new Date(p.entryDate).getTime()
    const endIso = p.exited && p.exitDate ? p.exitDate : today()
    const endMs = new Date(endIso).getTime()
    const cur = new Date(date).getTime()
    const finalVal = p.exited ? (p.exitValuation ?? p.currentValuation) : p.currentValuation
    const finalRatio = finalVal / p.entryValuation
    if (cur >= endMs) return finalRatio
    if (endMs === startMs) return finalRatio
    return 1 + (finalRatio - 1) * ((cur - startMs) / (endMs - startMs))
  }

  if (p.exited) {
    if (p.exitDate && date >= p.exitDate && p.exitPrice != null) {
      return p.exitPrice / p.entryPrice
    }
  }

  if ('quote' in p && p.quote) {
    const hist = p.quote.history
    let last = p.entryPrice
    for (const h of hist) {
      if (h.date > date) break
      if (h.date >= p.entryDate) last = h.close
    }
    return last / p.entryPrice
  }

  return 1
}

export function computeSeries(positions: ResolvedPosition[]): SeriesPoint[] {
  if (positions.length === 0) return []

  const dates = new Set<string>()
  for (const p of positions) {
    dates.add(p.entryDate)
    if (p.exitDate) dates.add(p.exitDate)
    if ('quote' in p && p.quote) {
      for (const h of p.quote.history) {
        if (h.date >= p.entryDate) dates.add(h.date)
      }
    }
  }
  dates.add(today())

  const earliest = positions.reduce((m, p) => (p.entryDate < m ? p.entryDate : m), today())
  const sorted = Array.from(dates).filter((d) => d >= earliest).sort()

  return sorted.map((date) => {
    let value = 0
    let invested = 0
    for (const p of positions) {
      const r = ratioAt(p, date)
      if (r == null) continue
      value += r
      invested += 1
    }
    return { date, value, invested }
  })
}

export type PortfolioMarker = {
  date: string
  kind: 'entry' | 'exit'
  positionId: string
  positionName: string
}

export function computeMarkers(positions: ResolvedPosition[]): PortfolioMarker[] {
  const m: PortfolioMarker[] = []
  for (const p of positions) {
    m.push({ date: p.entryDate, kind: 'entry', positionId: p.id, positionName: p.name })
    if (p.exitDate) m.push({ date: p.exitDate, kind: 'exit', positionId: p.id, positionName: p.name })
  }
  return m.sort((a, b) => a.date.localeCompare(b.date))
}

export type Stats = {
  totalPositions: number
  active: number
  exited: number
  totalReturnPct: number
  yoyPct: number | null
  best: { name: string; gainPct: number } | null
  worst: { name: string; gainPct: number } | null
}

function computeYoy(series: SeriesPoint[]): number | null {
  if (series.length === 0) return null
  const latest = series[series.length - 1]
  const oneYearAgo = new Date(latest.date)
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const targetIso = oneYearAgo.toISOString().slice(0, 10)
  if (series[0].date > targetIso) return null

  const yearAgo = series.find((p) => p.date >= targetIso) ?? series[0]
  const todayRet = latest.invested === 0 ? 0 : latest.value / latest.invested - 1
  const yearAgoRet = yearAgo.invested === 0 ? 0 : yearAgo.value / yearAgo.invested - 1
  return (1 + todayRet) / (1 + yearAgoRet) - 1
}

export function computeStats(positions: ResolvedPosition[], series?: SeriesPoint[]): Stats {
  const total = positions.length
  const active = positions.filter((p) => !p.exited).length
  const exited = total - active

  let invested = 0
  let value = 0
  for (const p of positions) {
    invested += 1
    value += 1 + p.gainPct
  }
  const totalReturnPct = invested === 0 ? 0 : value / invested - 1

  const sorted = [...positions].sort((a, b) => b.gainPct - a.gainPct)
  const best = sorted[0] ? { name: sorted[0].name, gainPct: sorted[0].gainPct } : null
  const worst = sorted[sorted.length - 1] && sorted.length > 1
    ? { name: sorted[sorted.length - 1].name, gainPct: sorted[sorted.length - 1].gainPct }
    : null

  const yoyPct = series ? computeYoy(series) : null

  return { totalPositions: total, active, exited, totalReturnPct, yoyPct, best, worst }
}

export type FeedItem = {
  positionId: string
  positionName: string
  positionSymbol?: string
  positionKind: ResolvedPosition['kind']
  event: PositionEvent
}

export function flattenFeed(positions: ResolvedPosition[]): FeedItem[] {
  const items: FeedItem[] = []
  for (const p of positions) {
    for (const e of p.events) {
      items.push({
        positionId: p.id,
        positionName: p.name,
        positionSymbol: 'symbol' in p ? p.symbol : undefined,
        positionKind: p.kind,
        event: e,
      })
    }
  }
  return items.sort((a, b) => b.event.date.localeCompare(a.event.date))
}
