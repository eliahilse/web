import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import { Link } from 'next-view-transitions'
import BackLink from '@/components/BackLink'

async function getMdx(slug: string) {
  const filepath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`)
  const raw = await fs.readFile(filepath, 'utf8')
  const { data, content } = matter(raw)
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content)
  const html = String(file)
  return { data, html }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'blog')
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

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data, html } = await getMdx(slug)
  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="page-container">
          <BackLink href="/blog" label="Back to blog" />
          
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2 page-heading">{String(data.title ?? slug)}</h1>
            {data.description && (
              <p className="text-muted-foreground mb-3">{String(data.description)}</p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {data.date && (
                <time dateTime={String(data.date)}>
                  {new Date(String(data.date)).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
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

