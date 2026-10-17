'use client'

import { useEffect, useState } from 'react'
import BackLink from '@/components/BackLink'

interface Link {
  label: string
  href: string
}

interface Project {
  name: string
  description: string
  links: Link[]
  tags?: string[]
  role: 'maintainer' | 'contributor'
}

const projects: Project[] = [
  {
    name: 'betteroffice',
    description:
      'Native OOXML engines in Rust: DOCX, XLSX & PPTX editing, rendering and real-time collaboration, compiled to WASM for the web. Ships to npm, crates.io and PyPI, and is used by OpenCode.',
    links: [
      { label: 'betteroffice.dev', href: 'https://betteroffice.dev' },
      { label: 'GitHub', href: 'https://github.com/openooxml/betteroffice' },
      { label: 'npm', href: 'https://www.npmjs.com/org/betteroffice' },
      { label: 'crates.io', href: 'https://crates.io/search?q=betteroffice' },
      { label: 'PyPI', href: 'https://pypi.org/search/?q=betteroffice' },
    ],
    tags: ['Rust', 'WASM', 'OOXML'],
    role: 'maintainer',
  },
  {
    name: 'hyperfly',
    description:
      'Binary compression for typed APIs at the edge of entropy: compiles a per-route binary protocol from the schema and observed traffic instead of shipping generic JSON through a generic compressor.',
    links: [
      { label: 'hyperfly.dev', href: 'https://hyperfly.dev' },
      { label: 'GitHub', href: 'https://github.com/eliahilse/hyperfly' },
    ],
    tags: ['TypeScript', 'Rust', 'Python'],
    role: 'maintainer',
  },
]

export default function OpenSourcePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="page-container">
          <div
            className={`mb-12 transform transition-all duration-700 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <BackLink href="/" label="Back to home" />
            <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">Open Source</h1>
            <p className="text-lg text-muted-foreground">Built in the open, for the greater good</p>
          </div>

          <div className="grid gap-6">
            {projects.map((project, index) => (
              <div
                key={project.name}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${200 + index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="bg-card-bg border border-card-border rounded-lg p-6 hover:border-card-border-hover hover:bg-card-bg-hover transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl font-semibold text-foreground">
                        {project.name}
                      </h2>
                      {project.tags?.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/80 capitalize">
                      {project.role}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground hover:opacity-70 transition-colors duration-200"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
