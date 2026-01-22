'use client'

import { useEffect, useState } from 'react'
import BackLink from '@/components/BackLink'

interface Package {
  name: string
  description: string
  registry: 'npm' | 'pypi'
  url: string
  github?: string
  downloads?: string
}

export default function OpenSourcePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const packages: Package[] = [
    {
      name: 'hyperfly',
      description: 'Globally distributed intelligent load balancer on top of Cloudflare Workers',
      registry: 'npm',
      url: 'https://www.npmjs.com/package/hyperfly',
    },
    {
      name: 'kyora',
      description: 'CLI utility for AI-assisted Solana validator setup and maintenance',
      registry: 'npm',
      url: 'https://www.npmjs.com/package/kyora',
    },
    {
      name: 'solanace',
      description: 'High-level Python library for interacting with the Solana blockchain',
      registry: 'pypi',
      url: 'https://pypi.org/project/solanace/',
    },
  ]

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
            <h1 className="text-4xl font-bold text-foreground mb-4">Open Source</h1>
            <p className="text-lg text-muted-foreground">Libraries and packages published for the community</p>
          </div>

          <div className="grid gap-6">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${200 + index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="bg-card-bg border border-card-border rounded-lg p-6 hover:border-card-border-hover hover:bg-card-bg-hover transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-foreground font-mono">
                        {pkg.name}
                      </h2>
                      <span className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/80">
                        {pkg.registry}
                      </span>
                    </div>
                    {pkg.downloads && (
                      <span className="text-xs text-muted-foreground">
                        {pkg.downloads} downloads
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    {pkg.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href={pkg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground hover:opacity-70 transition-colors duration-200"
                    >
                      {pkg.registry === 'npm' ? 'npm' : 'PyPI'} →
                    </a>
                    {pkg.github && (
                      <a
                        href={pkg.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground hover:opacity-70 transition-colors duration-200"
                      >
                        GitHub →
                      </a>
                    )}
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
