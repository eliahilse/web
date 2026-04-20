'use client'

import { useSearchParams } from 'next/navigation'
import BackLink from '@/components/BackLink'

interface BlogPostContentProps {
  title: string
  description?: string
  date?: string
  tags?: string[]
  html: string
  published: boolean
  shareKey?: string
}

export default function BlogPostContent({
  title,
  description,
  date,
  tags,
  html,
  published,
  shareKey,
}: BlogPostContentProps) {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')

  if (!published && key !== shareKey) {
    return (
      <div className="min-h-screen flex flex-col justify-between p-8">
        <div className="flex-1">
          <div className="page-container">
            <BackLink href="/blog" label="Back to blog" />
            <div className="mt-24 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">This post is not publicly available</h1>
              <p className="text-muted-foreground">If you received a link to this post, make sure it includes the access key.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="page-container">
          <BackLink href="/blog" label="Back to blog" />

          {!published && (
            <div className="mb-6 px-4 py-2 rounded-md bg-tag text-foreground/70 text-sm inline-block">
              draft — not publicly listed
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2 page-heading">{title}</h1>
            {description && (
              <p className="text-muted-foreground mb-3">{description}</p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {date && (
                <time dateTime={date}>
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              {tags && tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-tag text-foreground/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <article className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}
