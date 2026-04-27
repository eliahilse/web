export type HistoryPoint = { date: string; close: number }

export type Quote = {
  price: number
  currency: string
  history: HistoryPoint[]
}

export type StockPosition = {
  kind: 'stock'
  id: string
  symbol: string
  name: string
  entryPrice: number
  entryDate: string
  exitPrice?: number
  exitDate?: string
}

export type CryptoPosition = {
  kind: 'crypto'
  id: string
  symbol: string
  coingeckoId: string
  name: string
  entryPrice: number
  entryDate: string
  exitPrice?: number
  exitDate?: string
}

export type PrivatePosition = {
  kind: 'private'
  id: string
  name: string
  entryValuation: number
  currentValuation: number
  entryDate: string
  exitValuation?: number
  exitDate?: string
}

export type Position = StockPosition | CryptoPosition | PrivatePosition

export type ResolvedTradeable<P extends StockPosition | CryptoPosition> =
  | (P & { exited: false; quote: Quote; gainPct: number })
  | (P & { exited: true; gainPct: number })

export type ResolvedPosition =
  | ResolvedTradeable<StockPosition>
  | ResolvedTradeable<CryptoPosition>
  | (PrivatePosition & { exited: boolean; gainPct: number })
