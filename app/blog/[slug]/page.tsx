import { Suspense } from 'react'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import BlogPostContent from './BlogPostContent'

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
    <Suspense>
      <BlogPostContent
        title={String(data.title ?? slug)}
        description={data.description ? String(data.description) : undefined}
        date={data.date ? String(data.date) : undefined}
        tags={Array.isArray(data.tags) ? data.tags : undefined}
        html={html}
        published={data.published !== false}
        shareKey={data.shareKey ? String(data.shareKey) : undefined}
      />
    </Suspense>
  )
}
