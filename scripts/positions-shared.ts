import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'

export const POSITIONS_DIR = path.join(process.cwd(), 'content', 'positions')
export const PRICES_FILE = path.join(POSITIONS_DIR, 'prices.json')
export const GENERATED_FILE = path.join(process.cwd(), 'lib', 'markets', 'positions.generated.ts')

export type IndexFrontmatter = {
  kind: 'stock' | 'crypto' | 'private'
  symbol?: string
  coingeckoId?: string
  name?: string
  entryValuation?: number
  currentValuation?: number
  exitValuation?: number
}

export type EventKind = 'entry' | 'update' | 'change' | 'exit'

export type ParsedEvent = {
  filename: string
  date: string
  kind: EventKind
  tldr: string
  html: string
}

export type ParsedPosition = {
  id: string
  data: IndexFrontmatter
  introHtml?: string
  events: ParsedEvent[]
}

export type PriceLock = {
  entryPrice?: number
  entryDateUsed?: string
  exitPrice?: number
  exitDateUsed?: string
}

export type PricesFile = Record<string, PriceLock>

function toIsoDate(v: unknown): string | undefined {
  if (v == null) return undefined
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v)
}

async function renderMarkdown(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(md)
  return String(file)
}

export async function readPositions(): Promise<ParsedPosition[]> {
  let entries: import('node:fs').Dirent[]
  try {
    entries = await fs.readdir(POSITIONS_DIR, { withFileTypes: true })
  } catch {
    return []
  }
  const out: ParsedPosition[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const id = entry.name
    const dir = path.join(POSITIONS_DIR, id)

    const indexPath = path.join(dir, 'index.mdx')
    let indexRaw: string
    try {
      indexRaw = await fs.readFile(indexPath, 'utf8')
    } catch {
      console.warn(`! ${id}: missing index.mdx, skipping`)
      continue
    }
    const { data: indexData, content: introMd } = matter(indexRaw)
    const introHtml = introMd.trim() ? await renderMarkdown(introMd) : undefined

    const files = await fs.readdir(dir)
    const eventFiles = files.filter((f) => f.endsWith('.mdx') && f !== 'index.mdx').sort()

    const events: ParsedEvent[] = []
    for (const file of eventFiles) {
      const raw = await fs.readFile(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      const date = toIsoDate(data.date)
      const kind = data.kind as EventKind | undefined
      const tldr = data.tldr ? String(data.tldr) : ''
      if (!date || !kind) {
        console.warn(`! ${id}/${file}: missing date or kind, skipping`)
        continue
      }
      const html = content.trim() ? await renderMarkdown(content) : ''
      events.push({ filename: file, date, kind, tldr, html })
    }

    events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.filename.localeCompare(b.filename)))

    out.push({
      id,
      data: indexData as IndexFrontmatter,
      introHtml,
      events,
    })
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

export function findEventDate(events: ParsedEvent[], kind: EventKind): string | undefined {
  return events.find((e) => e.kind === kind)?.date
}
