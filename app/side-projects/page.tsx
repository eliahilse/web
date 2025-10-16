'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ProjectMetadata {
  title: string
  description?: string
  status?: string
  timeline?: string
  returns?: string
  date: string
  tags?: string[]
  slug: string
}

export default function SideProjectsPage() {
  const [projects, setProjects] = useState<ProjectMetadata[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const mockProjects: ProjectMetadata[] = [
      {
        title: "Casino Loyalty Arbitrage Operation",
        description: "Identified and systematically exploited inefficiencies in casino token reward mechanics across 7 platforms, achieving six-figure returns through quantitative modeling, automated play, and strategic payout management.",
        status: "ongoing",
        timeline: "2023-2025 (2 years)",
        returns: "Six figures (peak: $20k/month)",
        date: "2024-01-01",
        tags: ["quantitative", "optimization", "operations"],
        slug: "casino-arbitrage"
      }
    ]
    
    setProjects(mockProjects)
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
            <Link 
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6 inline-block"
            >
              ← Back to home
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-4">Side Projects</h1>
            <p className="text-lg text-muted-foreground">Personal ventures and experiments</p>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6">
            {projects.map((project, index) => (
              <div 
                key={project.slug} 
                className="block animate-fade-in-up"
                style={{ 
                  animationDelay: `${200 + index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 hover:bg-white/7 transition-all duration-200">
                  <Link href={`/side-projects/${project.slug}`} className="block group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:underline">
                          {project.title}
                        </h2>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground items-center mb-3">
                          {project.timeline && <span>{project.timeline}</span>}
                          {project.returns && (
                            <>
                              <span>•</span>
                              <span className="text-green-400">{project.returns}</span>
                            </>
                          )}
                          {project.status && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{project.status}</span>
                            </>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-muted-foreground text-sm">{project.description}</p>
                        )}
                      </div>
                    </div>

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-3">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/10 text-foreground/80">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
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

