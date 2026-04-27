import type { Quote, HistoryPoint } from './types'

const ONE_YEAR_DAYS = 365

// yahoo finance unofficial chart endpoint — no key, daily candles
export async function fetchStockQuote(symbol: string): Promise<Quote> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d`
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; elia-web)' },
  })
  if (!res.ok) throw new Error(`yahoo ${symbol}: ${res.status}`)
  const json = (await res.json()) as YahooChartResponse
  const result = json?.chart?.result?.[0]
  if (!result) throw new Error(`yahoo ${symbol}: empty result`)

  const timestamps = result.timestamp ?? []
  const closes = result.indicators?.quote?.[0]?.close ?? []
  const history: HistoryPoint[] = []
  for (let i = 0; i < timestamps.length; i++) {
    const c = closes[i]
    if (c == null) continue
    history.push({
      date: new Date(timestamps[i] * 1000).toISOString().slice(0, 10),
      close: c,
    })
  }

  const price =
    result.meta?.regularMarketPrice ??
    history[history.length - 1]?.close ??
    0
  return { price, currency: result.meta?.currency ?? 'USD', history }
}

// coingecko free tier — no key, daily candles
export async function fetchCryptoQuote(coingeckoId: string): Promise<Quote> {
  const histUrl = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coingeckoId)}/market_chart?vs_currency=usd&days=${ONE_YEAR_DAYS}&interval=daily`
  const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coingeckoId)}&vs_currencies=usd`

  const [histRes, priceRes] = await Promise.all([fetch(histUrl), fetch(priceUrl)])
  if (!histRes.ok) throw new Error(`coingecko hist ${coingeckoId}: ${histRes.status}`)
  if (!priceRes.ok) throw new Error(`coingecko price ${coingeckoId}: ${priceRes.status}`)

  const histJson = (await histRes.json()) as { prices?: [number, number][] }
  const priceJson = (await priceRes.json()) as Record<string, { usd?: number }>

  const history: HistoryPoint[] =
    histJson.prices?.map(([ms, close]) => ({
      date: new Date(ms).toISOString().slice(0, 10),
      close,
    })) ?? []

  const price = priceJson[coingeckoId]?.usd ?? history[history.length - 1]?.close ?? 0
  return { price, currency: 'USD', history }
}

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: { regularMarketPrice?: number; currency?: string }
      timestamp?: number[]
      indicators?: { quote?: Array<{ close?: (number | null)[] }> }
    }>
  }
}
