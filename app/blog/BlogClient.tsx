'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BackLink from '@/components/BackLink'
import { useRouter } from 'next/navigation'
import { Funnel, MagnifyingGlass } from '@phosphor-icons/react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

interface BlogMetadata {
  title: string
  description?: string
  date: string
  tags?: string[]
  category?: string
  slug: string
}

interface BlogClientProps {
  posts: BlogMetadata[]
  allCategories: string[]
  allTags: string[]
}

export default function BlogClient({ posts, allCategories, allTags }: BlogClientProps) {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [showTagFilter, setShowTagFilter] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

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
            <BackLink href="/" label="Back to home" />
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
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap flex-1">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-card-border-hover text-foreground'
                        : 'bg-card-bg text-muted-foreground hover:bg-tag'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Icons */}
              <div className="flex gap-2 items-center">
                {allTags.length > 1 && (
                  <button
                    onClick={() => setShowTagFilter(!showTagFilter)}
                    className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
                      showTagFilter ? 'bg-card-border-hover text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-tag'
                    }`}
                    title="Filter by tags"
                  >
                    <Funnel size={18} weight={showTagFilter ? 'fill' : 'regular'} />
                  </button>
                )}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-tag transition-all duration-200 cursor-pointer"
                  title="Search (⌘K)"
                >
                  <MagnifyingGlass size={18} />
                </button>
              </div>
            </div>

            {/* Tag Filter (collapsible) */}
            {showTagFilter && allTags.length > 1 && (
              <div className="flex gap-2 flex-wrap animate-[fadeIn_0.15s_ease-out]">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded transition-all duration-200 cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-card-border-hover text-foreground'
                        : 'bg-tag text-foreground/80 hover:bg-card-bg-hover'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid gap-6" key={`${selectedCategory}-${selectedTag}`}>
            {filteredPosts.map((post, index) => (
              <div
                key={post.slug}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${300 + index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="bg-card-bg border border-card-border rounded-lg p-6 hover:border-card-border-hover hover:bg-card-bg-hover transition-all duration-200">
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                          {post.title}
                        </h2>
                        {post.description && (
                          <p className="text-muted-foreground text-sm mb-3">{post.description}</p>
                        )}
                      </div>
                      {post.category && (
                        <span className="bg-tag text-foreground/70 text-xs px-3 py-1 rounded-full ml-4 whitespace-nowrap">
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
                              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/80">
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

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search posts..." />
        <CommandList>
          <CommandEmpty>No posts found.</CommandEmpty>
          <CommandGroup heading="Posts">
            {posts.map((post) => (
              <CommandItem
                key={post.slug}
                value={`${post.title} ${post.description || ''} ${post.tags?.join(' ') || ''}`}
                onSelect={() => {
                  router.push(`/blog/${post.slug}`)
                  setSearchOpen(false)
                }}
              >
                <div className="flex flex-col">
                  <span>{post.title}</span>
                  {post.description && (
                    <span className="text-xs text-muted-foreground">{post.description}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
