'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BackLink from '@/components/BackLink'

interface WorkMetadata {
  title: string
  role: string
  location: string
  startDate: string
  endDate: string
  tags?: string[]
  slug: string
}

function formatPeriod(startDate: string, endDate: string): string {
  const formatDate = (d: string) => {
    const [year, month] = d.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month, 10) - 1]} ${year}`
  }
  return `${formatDate(startDate)} – ${formatDate(endDate)}`
}

export default function WorkClient({ experiences }: { experiences: WorkMetadata[] }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div
            className={`mb-12 transform transition-all duration-700 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <BackLink href="/" label="Back to home" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Work</h1>
            <p className="text-lg text-muted-foreground">Professional experience and roles</p>
          </div>

          {/* Timeline */}
          <div>
            {experiences.map((exp, index) => (
              <div
                key={exp.slug}
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
                      {formatPeriod(exp.startDate, exp.endDate)}
                    </span>
                  </div>

                  {/* Content */}
                  <Link href={`/work/${exp.slug}`} className="flex-1 group">
                    <div className="bg-card-bg border border-card-border rounded-lg p-6 hover:border-card-border-hover hover:bg-card-bg-hover transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                        <h2 className="text-xl font-semibold text-foreground transition-colors">
                          {exp.title}
                        </h2>
                        <span className="text-sm text-muted-foreground">
                          {exp.location}
                        </span>
                      </div>

                      <p className="text-muted-foreground font-medium mb-4">
                        {exp.role}
                      </p>

                      {exp.tags && exp.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {exp.tags.map((tag) => (
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
