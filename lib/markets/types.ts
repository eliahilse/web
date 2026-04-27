export type HistoryPoint = { date: string; close: number }

export type Quote = {
  price: number
  currency: string
  history: HistoryPoint[]
}

export type EventKind = 'entry' | 'update' | 'change' | 'exit'

export type PositionEvent = {
  date: string
  kind: EventKind
  tldr: string
  html: string
}

type Common = {
  id: string
  intro?: string
  events: PositionEvent[]
  entryDate: string
  exitDate?: string
}

export type StockPosition = Common & {
  kind: 'stock'
  symbol: string
  name: string
  entryPrice: number
  exitPrice?: number
}

export type CryptoPosition = Common & {
  kind: 'crypto'
  symbol: string
  coingeckoId: string
  name: string
  entryPrice: number
  exitPrice?: number
}

export type PrivatePosition = Common & {
  kind: 'private'
  name: string
  entryValuation: number
  currentValuation: number
  exitValuation?: number
}

export type Position = StockPosition | CryptoPosition | PrivatePosition

export type ResolvedTradeable<P extends StockPosition | CryptoPosition> =
  | (P & { exited: false; quote: Quote; gainPct: number })
  | (P & { exited: true; gainPct: number })

export type ResolvedPosition =
  | ResolvedTradeable<StockPosition>
  | ResolvedTradeable<CryptoPosition>
  | (PrivatePosition & { exited: boolean; gainPct: number })
