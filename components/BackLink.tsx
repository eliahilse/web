'use client'

import { Link } from 'next-view-transitions'
import { CaretLeft } from '@phosphor-icons/react'

interface BackLinkProps {
  href: string
  label: string
}

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8 inline-flex items-center gap-2"
    >
      <CaretLeft size={16} />
      <span>{label}</span>
    </Link>
  )
}
