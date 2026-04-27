import { readPositions, readPrices, writePrices, type PriceLock } from './positions-shared'

const TRADING_DAY_WINDOW = 7

async function fetchStockCloseOnOrAfter(symbol: string, isoDate: string): Promise<{ price: number; dateUsed: string }> {
  const start = Math.floor(new Date(isoDate + 'T00:00:00Z').getTime() / 1000)
  const end = start + TRADING_DAY_WINDOW * 86400
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${start}&period2=${end}&interval=1d`
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; elia-web)' } })
  if (!res.ok) throw new Error(`yahoo ${symbol} ${isoDate}: HTTP ${res.status}`)
  const json: any = await res.json()
  const result = json?.chart?.result?.[0]
  const ts: number[] = result?.timestamp ?? []
  const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? []
  for (let i = 0; i < ts.length; i++) {
    const c = closes[i]
    if (c == null) continue
    return { price: c, dateUsed: new Date(ts[i] * 1000).toISOString().slice(0, 10) }
  }
  throw new Error(`yahoo ${symbol} ${isoDate}: no close in ${TRADING_DAY_WINDOW}d window`)
}

async function fetchCryptoCloseOn(coingeckoId: string, isoDate: string): Promise<{ price: number; dateUsed: string }> {
  const [y, m, d] = isoDate.split('-')
  const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coingeckoId)}/history?date=${d}-${m}-${y}&localization=false`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`coingecko ${coingeckoId} ${isoDate}: HTTP ${res.status}`)
  const json: any = await res.json()
  const price = json?.market_data?.current_price?.usd
  if (typeof price !== 'number') throw new Error(`coingecko ${coingeckoId} ${isoDate}: no usd price`)
  return { price, dateUsed: isoDate }
}

async function main() {
  const positions = await readPositions()
  const prices = await readPrices()
  let changed = 0

  for (const { id, data } of positions) {
    if (data.kind === 'private') continue
    const lock: PriceLock = prices[id] ?? {}
    const symbolOrId = data.kind === 'stock' ? data.symbol : data.coingeckoId
    if (!symbolOrId) {
      console.warn(`✗ ${id}: missing ${data.kind === 'stock' ? 'symbol' : 'coingeckoId'}`)
      continue
    }

    const fetcher = data.kind === 'stock'
      ? (date: string) => fetchStockCloseOnOrAfter(data.symbol!, date)
      : (date: string) => fetchCryptoCloseOn(data.coingeckoId!, date)

    if (lock.entryPrice == null && data.entryDate) {
      try {
        const { price, dateUsed } = await fetcher(data.entryDate)
        lock.entryPrice = price
        lock.entryDateUsed = dateUsed
        console.log(`✓ ${id} entry: $${price.toFixed(2)} on ${dateUsed}${dateUsed !== data.entryDate ? ` (requested ${data.entryDate})` : ''}`)
        changed++
      } catch (err) {
        console.error(`✗ ${id} entry: ${(err as Error).message}`)
      }
    }

    if (data.exitDate && lock.exitPrice == null) {
      try {
        const { price, dateUsed } = await fetcher(data.exitDate)
        lock.exitPrice = price
        lock.exitDateUsed = dateUsed
        console.log(`✓ ${id} exit:  $${price.toFixed(2)} on ${dateUsed}${dateUsed !== data.exitDate ? ` (requested ${data.exitDate})` : ''}`)
        changed++
      } catch (err) {
        console.error(`✗ ${id} exit:  ${(err as Error).message}`)
      }
    }

    if (!data.exitDate && lock.exitPrice != null) {
      delete lock.exitPrice
      delete lock.exitDateUsed
      changed++
    }

    prices[id] = lock
  }

  for (const id of Object.keys(prices)) {
    if (!positions.find((p) => p.id === id)) {
      delete prices[id]
      console.log(`- ${id}: removed (no MDX)`)
      changed++
    }
  }

  if (changed > 0) {
    await writePrices(prices)
    console.log(`\nwrote ${changed} change(s) to content/positions/prices.json`)
  } else {
    console.log('all prices up to date')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
