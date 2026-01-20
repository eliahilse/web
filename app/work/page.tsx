import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import WorkClient from './WorkClient'

interface WorkMetadata {
  title: string
  role: string
  location: string
  startDate: string
  endDate: string
  tags?: string[]
  slug: string
}

async function getWorkExperiences(): Promise<WorkMetadata[]> {
  const dir = path.join(process.cwd(), 'content', 'work')
  let files: string[] = []
  try {
    files = await fs.readdir(dir)
  } catch {
    return []
  }
  const mdxFiles = files.filter(f => f.endsWith('.mdx'))
  const entries: WorkMetadata[] = []
  for (const file of mdxFiles) {
    const filepath = path.join(dir, file)
    const raw = await fs.readFile(filepath, 'utf8')
    const { data } = matter(raw)
    const slug = file.replace(/\.mdx$/, '')
    entries.push({
      title: data.title ?? slug,
      role: data.role ?? '',
      location: data.location ?? '',
      startDate: data.startDate ?? '1970-01',
      endDate: data.endDate ?? '1970-01',
      tags: data.tags,
      slug,
    })
  }
  // sort by startDate descending (newest first)
  entries.sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
  return entries
}

export default async function WorkPage() {
  const experiences = await getWorkExperiences()
  return <WorkClient experiences={experiences} />
}
