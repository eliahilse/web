import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import BlogClient from './BlogClient'

interface BlogMetadata {
  title: string
  description?: string
  date: string
  tags?: string[]
  category?: string
  slug: string
}

async function getBlogPosts(): Promise<BlogMetadata[]> {
  const dir = path.join(process.cwd(), 'content', 'blog')
  let files: string[] = []
  try {
    files = await fs.readdir(dir)
  } catch {
    return []
  }
  const mdxFiles = files.filter(f => f.endsWith('.mdx'))
  const entries: BlogMetadata[] = []
  for (const file of mdxFiles) {
    const filepath = path.join(dir, file)
    const raw = await fs.readFile(filepath, 'utf8')
    const { data } = matter(raw)
    const slug = file.replace(/\.mdx$/, '')
    entries.push({
      title: data.title ?? slug,
      description: data.description,
      date: data.date ?? '1970-01-01',
      tags: data.tags,
      category: data.category,
      slug,
    })
  }
  // Newest first
  entries.sort((a, b) => (a.date < b.date ? 1 : -1))
  return entries
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  
  // Get all unique categories and tags
  const allCategories: string[] = ['all', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean) as string[]))]
  const allTags: string[] = ['all', ...Array.from(new Set(posts.flatMap(p => p.tags || [])))]

  return <BlogClient posts={posts} allCategories={allCategories} allTags={allTags} />
}
