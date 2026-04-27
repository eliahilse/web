import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

export const POSITIONS_DIR = path.join(process.cwd(), 'content', 'positions')
export const PRICES_FILE = path.join(POSITIONS_DIR, 'prices.json')
export const GENERATED_FILE = path.join(process.cwd(), 'lib', 'markets', 'positions.generated.ts')

export type RawFrontmatter = {
  kind: 'stock' | 'crypto' | 'private'
  symbol?: string
  coingeckoId?: string
  name?: string
  entryDate: string
  exitDate?: string
  entryValuation?: number
  currentValuation?: number
  exitValuation?: number
}

export type ParsedPosition = { id: string; data: RawFrontmatter }

export type PriceLock = {
  entryPrice?: number
  entryDateUsed?: string
  exitPrice?: number
  exitDateUsed?: string
}

export type PricesFile = Record<string, PriceLock>

export async function readPositions(): Promise<ParsedPosition[]> {
  let files: string[]
  try {
    files = await fs.readdir(POSITIONS_DIR)
  } catch {
    return []
  }
  const out: ParsedPosition[] = []
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue
    const raw = await fs.readFile(path.join(POSITIONS_DIR, file), 'utf8')
    const { data } = matter(raw)
    const id = file.replace(/\.mdx$/, '')
    out.push({ id, data: data as RawFrontmatter })
  }
  return out
}

export async function readPrices(): Promise<PricesFile> {
  try {
    const raw = await fs.readFile(PRICES_FILE, 'utf8')
    return JSON.parse(raw) as PricesFile
  } catch {
    return {}
  }
}

export async function writePrices(p: PricesFile): Promise<void> {
  const sorted = Object.fromEntries(Object.entries(p).sort(([a], [b]) => a.localeCompare(b)))
  await fs.writeFile(PRICES_FILE, JSON.stringify(sorted, null, 2) + '\n')
}
