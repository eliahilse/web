import { getCloudflareContext } from '@opennextjs/cloudflare'

const FRESH_MS = 24 * 60 * 60 * 1000
const STALE_MS = 24 * 60 * 60 * 1000
const HARD_TTL_S = (FRESH_MS + STALE_MS) / 1000

type Entry<T> = { v: T; t: number }

// stale-while-revalidate: 1d fresh, +1d stale (bg refresh), then hard miss
export async function swrCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const { env, ctx } = getCloudflareContext()
  const kv = env.CACHE_KV

  const raw = await kv.get(key)
  if (raw) {
    try {
      const cached = JSON.parse(raw) as Entry<T>
      const age = Date.now() - cached.t
      if (age < FRESH_MS) return cached.v
      if (age < FRESH_MS + STALE_MS) {
        ctx.waitUntil(refresh(key, fetcher))
        return cached.v
      }
    } catch {
      // bad cache entry, fall through
    }
  }

  return await refresh(key, fetcher)
}

async function refresh<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const { env } = getCloudflareContext()
  const v = await fetcher()
  const entry: Entry<T> = { v, t: Date.now() }
  await env.CACHE_KV.put(key, JSON.stringify(entry), { expirationTtl: HARD_TTL_S })
  return v
}
