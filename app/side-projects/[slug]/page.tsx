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
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  if (start === end) return start
  return `${start} – ${end}`
}

async function getMdx(slug: string) {
  const filepath = path.join(process.cwd(), 'content', 'side-projects', `${slug}.mdx`)
  const raw = await fs.readFile(filepath, 'utf8')
  const { data, content } = matter(raw)
  const file = await unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(content)
  const html = String(file)
  return { data, html }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'side-projects')
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

export default async function SideProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data, html } = await getMdx(slug)
  
  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="page-container">
          <BackLink href="/side-projects" label="Back to side projects" />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{String(data.title ?? slug)}</h1>
            {data.description && (
              <p className="text-muted-foreground mb-3">{String(data.description)}</p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              {data.startDate && data.endDate && (
                <span className="font-mono">{formatPeriod(data.startDate, data.endDate)}</span>
              )}
              {data.returns && (
                <>
                  <span>•</span>
                  <span className="text-nova-red">{String(data.returns)}</span>
                </>
              )}
              {data.status && (
                <>
                  <span>•</span>
                  <span className="bg-tag text-foreground/70 text-xs px-3 py-1 rounded-full capitalize">
                    {String(data.status)}
                  </span>
                </>
              )}
              {data.tags && Array.isArray(data.tags) && data.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex gap-2 flex-wrap">
                    {data.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <article className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}


