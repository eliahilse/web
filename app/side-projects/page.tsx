import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import SideProjectsClient from './SideProjectsClient'

interface ProjectMetadata {
  title: string
  description?: string
  status?: string
  startDate: string
  endDate: string
  returns?: string
  tags?: string[]
  slug: string
}

async function getProjects(): Promise<ProjectMetadata[]> {
  const dir = path.join(process.cwd(), 'content', 'side-projects')
  let files: string[] = []
  try {
    files = await fs.readdir(dir)
  } catch {
    return []
  }
  const mdxFiles = files.filter(f => f.endsWith('.mdx'))
  const entries = await Promise.all(mdxFiles.map(async (file) => {
    const filepath = path.join(dir, file)
    const raw = await fs.readFile(filepath, 'utf8')
    const { data } = matter(raw)
    const slug = file.replace(/\.mdx$/, '')
    return {
      title: data.title ?? slug,
      description: data.description,
      status: data.status,
      startDate: data.startDate ?? '1970-01',
      endDate: data.endDate ?? '1970-01',
      returns: data.returns,
      tags: data.tags,
      slug,
    } as ProjectMetadata
  }))
  // sort by startDate descending (newest first)
  entries.sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
  return entries
}

export default async function SideProjectsPage() {
  const projects = await getProjects()
  return <SideProjectsClient projects={projects} />
}
