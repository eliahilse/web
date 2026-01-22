'use client';

import { useEffect, useState } from 'react'
import { Link } from 'next-view-transitions'
import BackLink from '@/components/BackLink'

interface TeamMember {
  name: string
  linkedin?: string
}

interface CompetitionMetadata {
  title: string
  pitch?: string // URL to pitch deck/page
  demo?: string
  github?: string
  hackathon: string
  placement?: string
  location?: string
  track?: string
  team?: TeamMember[]
  date: string
  slug: string
  description?: string
  video?: string // URL to YouTube or other video
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<CompetitionMetadata[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Mock data - in production this would fetch from an API route
    const mockCompetitions: CompetitionMetadata[] = [
      {
        title: "Synapse",
        pitch: "",
        demo: "https://synapse.elia.vc",
        github: "https://github.com/synapsedotai/synapse",
        hackathon: "CDTM x Anthropic Hackathon (ft. Elevenlabs, Lovable)",
        placement: "2nd (jury debated 1h)",
        location: "Munich, DE",
        track: "Visionaries Club",
        team: [
          { name: "Elia Hilse", linkedin: "https://linkedin.com/in/eliahilse" },
          { name: "Jan Tokic", linkedin: "https://www.linkedin.com/in/jan-tokic" },
          { name: "Jan Jürgens", linkedin: "https://www.linkedin.com/in/janjuergens1/" },
          { name: "Johannes Schwab", linkedin: "https://www.linkedin.com/in/johannes-nic-schwab/" },
          { name: "Johannes Brix", linkedin: "https://www.linkedin.com/in/johannesbrix/" }
        ],
        date: "2024-01-15",
        slug: "synapse",
        description: "Built Synapse: a self-learning knowledge system identifying internal experts and surfacing management insights across an organization.",
        video: "https://www.youtube.com/watch?v=H_io8qfVFmg"
      }
    ]
    
    setCompetitions(mockCompetitions)
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Competitions</h1>
            <p className="text-lg text-muted-foreground">Hackathons, contests, and competitive programming achievements</p>
          </div>

          {/* Competitions Grid */}
          <div className="grid gap-6">
            {competitions.map((competition, index) => (
              <div 
                key={competition.slug} 
                className="block animate-fade-in-up"
                style={{ 
                  animationDelay: `${200 + index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <Link href={`/competitions/${competition.slug}`} className="block group">
                  <div className="bg-card-bg border border-card-border rounded-lg p-6 hover:border-card-border-hover hover:bg-card-bg-hover transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                          {competition.title}
                        </h2>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground items-center">
                          <span className="font-medium">{competition.hackathon}</span>
                          {competition.placement && (
                            <>
                              <span>•</span>
                              <span className="text-nova-red">{competition.placement}</span>
                            </>
                          )}
                          {competition.track && (
                            <>
                              <span>•</span>
                              <span>
                                <span className="text-foreground/70">Track:</span> {competition.track}
                              </span>
                            </>
                          )}
                          {competition.location && (<><span>•</span><span>{competition.location}</span></>)}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {competition.description && (
                      <p className="text-muted-foreground mb-4">{competition.description}</p>
                    )}

                  {/* Media + Details Row */}
                  {(competition.video || competition.team?.length || competition.pitch || competition.demo || competition.github) && (
                    <div className="grid md:grid-cols-2 gap-4 items-start">
                      {/* Left: Video + Links */}
                      <div className="space-y-3">
                        {competition.video && (
                          <div className="aspect-video w-full">
                            <iframe
                              className="w-full h-full rounded-md border border-card-border"
                              src={competition.video.replace('watch?v=', 'embed/')}
                              title={competition.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>

                      {/* Right: Team */}
                      <div className="space-y-4 h-full flex flex-col justify-between">
                        {!!competition.team?.length && (
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">Team</h4>
                            <div className="flex flex-wrap gap-2">
                              {competition.team!.map((member, idx) => (
                                <span key={idx}>
                                  {member.linkedin ? (
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="relative z-10 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" onClick={(e) => e.stopPropagation()}>{member.name}</a>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">{member.name}</span>
                                  )}
                                  {idx < (competition.team!.length - 1) && <span className="text-muted-foreground">, </span>}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}


                        {(competition.pitch || competition.demo || competition.github || competition.video) && (
                          <div className="flex flex-wrap gap-4 mb-2" onClick={(e) => e.stopPropagation()}>
                            {competition.pitch && (<a href={competition.pitch} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200" onClick={(e) => e.stopPropagation()}>Pitch →</a>)}
                            {competition.demo && (<a href={competition.demo} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200" onClick={(e) => e.stopPropagation()}>Demo →</a>)}
                            {competition.github && (<a href={competition.github} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200" onClick={(e) => e.stopPropagation()}>GitHub →</a>)}
                            {competition.video && (<a href={competition.video} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200" onClick={(e) => e.stopPropagation()}>Video →</a>)}
                          </div>
                        )}
                      </div>
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
