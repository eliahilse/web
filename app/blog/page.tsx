'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BlogMetadata {
  title: string
  description?: string
  date: string
  tags?: string[]
  category?: string
  slug: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogMetadata[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  useEffect(() => {
    // Mock data - in production this would fetch from an API route
    const mockPosts: BlogMetadata[] = [
      {
        title: "Matcha: A Critical Look at Heavy Metals",
        description: "A personal exploration of matcha consumption and the unexpected discovery of heavy metal contamination.",
        date: "2025-10-30",
        tags: ["experience", "health", "personal"],
        category: "experience",
        slug: "matcha-heavy-metals"
      },
      {
        title: "The Coming Age of Prolonged Life: A Society Unprepared",
        description: "When life-extension treatments become available—but not to everyone—society splits into mortals and immortals. A look at the end of capitalism as we know it.",
        date: "2025-11-15",
        tags: ["opinion", "longevity", "society", "future"],
        category: "opinion",
        slug: "longevity-society"
      },
      {
        title: "Crypto's 70/30 Problem: Signal Buried in Noise",
        description: "Most crypto is garbage. But the 30% that isn't might reshape global finance. We should probably figure out which is which.",
        date: "2025-12-01",
        tags: ["opinion", "crypto", "finance", "technology"],
        category: "opinion",
        slug: "crypto-signal-noise"
      }
    ]
    
    // Sort newest first
    mockPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
    setPosts(mockPosts)
    setIsLoaded(true)
  }, [])

  // Get all unique categories and tags
  const allCategories: string[] = ['all', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean) as string[]))]
  const allTags: string[] = ['all', ...Array.from(new Set(posts.flatMap(p => p.tags || [])))]

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory
    const tagMatch = selectedTag === 'all' || post.tags?.includes(selectedTag)
    return categoryMatch && tagMatch
  })

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div 
            className={`mb-8 transform transition-all duration-700 ease-out ${
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground">Thoughts, experiences, and opinions</p>
          </div>

          {/* Filters */}
          <div 
            className={`mb-8 space-y-4 transform transition-all duration-700 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm text-muted-foreground">Filter by:</span>
              
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-white/20 text-foreground'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Tag Filter */}
              {allTags.length > 1 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex gap-2 flex-wrap">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`text-xs px-3 py-1.5 rounded transition-all duration-200 ${
                          selectedTag === tag
                            ? 'bg-white/20 text-foreground'
                            : 'bg-white/10 text-foreground/80 hover:bg-white/15'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid gap-6" key={`${selectedCategory}-${selectedTag}`}>
            {filteredPosts.map((post, index) => (
              <div 
                key={post.slug}
                className={`animate-fade-in-up`}
                style={{ 
                  animationDelay: `${300 + index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 hover:bg-white/7 transition-all duration-200">
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:underline">
                          {post.title}
                        </h2>
                        {post.description && (
                          <p className="text-muted-foreground text-sm mb-3">{post.description}</p>
                        )}
                      </div>
                      {post.category && (
                        <span className="bg-white/10 text-foreground/70 text-xs px-3 py-1 rounded-full ml-4 whitespace-nowrap">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </time>
                      {post.tags && post.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex gap-2 flex-wrap">
                            {post.tags.map((tag) => (
                              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/10 text-foreground/80">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
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
