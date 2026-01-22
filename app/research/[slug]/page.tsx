import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import BackLink from '@/components/BackLink'

async function getMdx(slug: string) {
  const filepath = path.join(process.cwd(), 'content', 'research', `${slug}.mdx`)
  const raw = await fs.readFile(filepath, 'utf8')
  const { data, content } = matter(raw)
  const file = await unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(content)
  const html = String(file)
  return { data, html }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'research')
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

export default async function ResearchDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data, html } = await getMdx(slug)
  
  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="max-w-3xl mx-auto">
          <BackLink href="/research" label="Back to research" />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{String(data.title ?? slug)}</h1>
            {data.authors && Array.isArray(data.authors) && (
              <p className="text-muted-foreground mb-3">By {data.authors.join(', ')}</p>
            )}
            {data.description && (
              <p className="text-muted-foreground mb-4">{String(data.description)}</p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap mb-4">
              {data.date && (
                <time dateTime={String(data.date)}>
                  {new Date(String(data.date)).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </time>
              )}
              {data.status && (
                <>
                  <span>•</span>
                  <span className="bg-tag text-foreground/70 text-xs px-3 py-1 rounded-full capitalize">
                    {String(data.status).replace('-', ' ')}
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

            {/* External Links */}
            {data.links && (
              <div className="flex flex-wrap gap-4 mb-6">
                {data.links.whitepaper && (
                  <a href={String(data.links.whitepaper)} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200">
                    View Whitepaper →
                  </a>
                )}
                {data.links.website && (
                  <a href={String(data.links.website)} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200">
                    Website →
                  </a>
                )}
                {data.links.github && (
                  <a href={String(data.links.github)} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200">
                    GitHub →
                  </a>
                )}
                {data.links.pdf && (
                  <a href={String(data.links.pdf)} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200">
                    Download PDF →
                  </a>
                )}
              </div>
            )}
          </div>

          <article className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}


