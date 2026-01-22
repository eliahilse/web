import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import BackLink from '@/components/BackLink'

function formatPeriod(startDate: string, endDate: string): string {
  const formatDate = (d: string) => {
    const [year, month] = d.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month, 10) - 1]} ${year}`
  }
  return `${formatDate(startDate)} – ${formatDate(endDate)}`
}

async function getMdx(slug: string) {
  const filepath = path.join(process.cwd(), 'content', 'work', `${slug}.mdx`)
  const raw = await fs.readFile(filepath, 'utf8')
  const { data, content } = matter(raw)
  const file = await unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(content)
  const html = String(file)
  return { data, html }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'work')
  let files: string[] = []
  try {
    files = await fs.readdir(dir)
  } catch {
    return []
  }
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ slug: f.replace(/\.mdx$/, '') }))
}

export default async function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data, html } = await getMdx(slug)

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="max-w-3xl mx-auto">
          <BackLink href="/work" label="Back to work" />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{String(data.title ?? slug)}</h1>

            <p className="text-nova-red font-medium text-lg mb-3">{String(data.role)}</p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              {data.startDate && data.endDate && (
                <span className="font-mono">{formatPeriod(data.startDate, data.endDate)}</span>
              )}
              {data.location && (
                <>
                  <span>•</span>
                  <span>{String(data.location)}</span>
                </>
              )}
            </div>

            {data.tags && Array.isArray(data.tags) && data.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {data.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/80">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <article className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}
