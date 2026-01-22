'use client'

import { useEffect, useState } from 'react'
import { Link } from 'next-view-transitions'
import BackLink from '@/components/BackLink'

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

export default function SideProjectsClient({ projects }: { projects: ProjectMetadata[] }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="page-container">
          {/* Header */}
          <div
            className={`mb-12 transform transition-all duration-700 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <BackLink href="/" label="Back to home" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Side Projects</h1>
            <p className="text-lg text-muted-foreground">Personal ventures and experiments</p>
          </div>

          {/* Timeline */}
          <div>
            {projects.map((project, index) => (
              <div
                key={project.slug}
                className="animate-fade-in-up mb-8 last:mb-0"
                style={{
                  animationDelay: `${200 + index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="flex flex-col md:flex-row md:gap-8">
                  {/* Date column */}
                  <div className="md:w-[120px] flex-shrink-0 md:text-right">
                    <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {formatPeriod(project.startDate, project.endDate)}
                    </span>
                  </div>

                  {/* Content */}
                  <Link href={`/side-projects/${project.slug}`} className="flex-1 group">
                    <div className="bg-card-bg border border-card-border rounded-lg p-6 hover:border-card-border-hover hover:bg-card-bg-hover transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                        <h2 className="text-xl font-semibold text-foreground transition-colors">
                          {project.title}
                        </h2>
                        <div className="flex items-center gap-2">
                          {project.returns && (
                            <span className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/80">
                              {project.returns}
                            </span>
                          )}
                          {project.status && (
                            <span className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/80 capitalize">
                              {project.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {project.description && (
                        <p className="text-muted-foreground text-xs mb-4">
                          {project.description}
                        </p>
                      )}

                      {project.tags && project.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {project.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/80">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
