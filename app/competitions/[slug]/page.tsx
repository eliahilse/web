import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import BackLink from '@/components/BackLink'

async function getMdx(slug: string) {
  const filepath = path.join(process.cwd(), 'content', 'competitions', `${slug}.mdx`)
  const raw = await fs.readFile(filepath, 'utf8')
  const { data, content } = matter(raw)
  const file = await unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(content)
  const html = String(file)
  return { data, html }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'competitions')
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

export default async function CompetitionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data, html } = await getMdx(slug)
  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="page-container">
          <BackLink href="/competitions" label="Back to competitions" />
          <h1 className="text-4xl font-bold text-foreground mb-2 page-heading">{String(data.title ?? slug)}</h1>
          {data.description && (
            <p className="text-muted-foreground mb-6">{String(data.description)}</p>
          )}

          {(data.video || data.team?.length || data.pitch || data.demo || data.github) && (
            <div className="grid md:grid-cols-2 gap-6 mb-8 items-start">
              {/* Left: Video + Links */}
              <div className="space-y-3">
                {data.video && (
                  <div className="aspect-video w-full">
                    <iframe
                      className="w-full h-full rounded-md border border-card-border"
                      src={String(data.video).replace('watch?v=', 'embed/')}
                      title={String(data.title ?? slug)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                )}
                {(data.pitch || data.demo || data.github || data.video) && (
                  <div className="flex flex-wrap gap-4">
                    {data.pitch && (<a href={String(data.pitch)} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:opacity-70 transition-colors duration-200">Pitch →</a>)}
                    {data.demo && (<a href={String(data.demo)} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:opacity-70 transition-colors duration-200">Demo →</a>)}
                    {data.github && (<a href={String(data.github)} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:opacity-70 transition-colors duration-200">GitHub →</a>)}
                    {data.video && (<a href={String(data.video)} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:opacity-70 transition-colors duration-200">Video →</a>)}
                  </div>
                )}
              </div>

              {/* Right: Team */}
              <div className="space-y-4">
                {!!data.team?.length && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Team</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.team.map((member: { name: string; linkedin?: string }, idx: number) => (
                        <span key={idx}>
                          {member.linkedin ? (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{member.name}</a>
                          ) : (
                            <span className="text-sm text-muted-foreground">{member.name}</span>
                          )}
                          {idx < (data.team.length - 1) && <span className="text-muted-foreground">, </span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links moved under video */}
              </div>
            </div>
          )}

          <article className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}


