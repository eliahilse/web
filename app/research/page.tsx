'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ResearchMetadata {
  title: string
  description?: string
  date: string
  tags?: string[]
  status?: string
  authors?: string[]
  links?: {
    whitepaper?: string
    website?: string
    github?: string
    pdf?: string
  }
  slug: string
}

export default function ResearchPage() {
  const [research, setResearch] = useState<ResearchMetadata[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const mockResearch: ResearchMetadata[] = [
      {
        title: "BunkerCoin: A Low Bandwidth, Shortwave Radio-Compatible Blockchain Protocol",
        description: "Novel L1 blockchain protocol designed to operate over shortwave radio with custom consensus mechanism (Alpenglow), location-aware routing (Sherpa), and native offline messaging. Co-authored with Solana co-founder Anatoly Yakovenko.",
        date: "2025-08-07",
        tags: ["blockchain", "distributed-systems", "radio", "consensus"],
        status: "active-research",
        authors: ["Elia Hilse (sole implementation & primary author)", "Anatoly Yakovenko (core concepts & advisor)"],
        links: {
          whitepaper: "https://bunkercoin.com/view?file=technical-whitepaper",
          website: "https://bunkercoin.com",
          github: "https://github.com/TheBunkerCoin/bunker_coin"
        },
        slug: "bunkercoin-whitepaper"
      }
    ]
    
    setResearch(mockResearch)
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Research</h1>
            <p className="text-lg text-muted-foreground">Technical papers, whitepapers, and academic work</p>
          </div>

          {/* Research Grid */}
          <div className="grid gap-6">
            {research.map((item, index) => (
              <div 
                key={item.slug} 
                className="block animate-fade-in-up"
                style={{ 
                  animationDelay: `${200 + index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <Link href={`/research/${item.slug}`} className="block group">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 hover:bg-white/7 transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                          {item.title}
                        </h2>
                        {item.authors && item.authors.length > 0 && (
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground items-center mb-3">
                            <span>By {item.authors.join(', ')}</span>
                            {item.status && (
                              <>
                                <span>•</span>
                                <span className="capitalize">{item.status.replace('-', ' ')}</span>
                              </>
                            )}
                          </div>
                        )}
                        {item.description && (
                          <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                      {item.links?.whitepaper && (
                        <a 
                          href={item.links.whitepaper} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-foreground hover:text-white transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Whitepaper →
                        </a>
                      )}
                      {item.links?.website && (
                        <a 
                          href={item.links.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-foreground hover:text-white transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Website →
                        </a>
                      )}
                      {item.links?.github && (
                        <a 
                          href={item.links.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-foreground hover:text-white transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          GitHub →
                        </a>
                      )}
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-4">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/10 text-foreground/80">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

