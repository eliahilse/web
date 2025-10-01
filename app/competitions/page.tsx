import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

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

async function getCompetitions(): Promise<CompetitionMetadata[]> {
  const dir = path.join(process.cwd(), 'content', 'competitions')
  let files: string[] = []
  try {
    files = await fs.readdir(dir)
  } catch {
    return []
  }
  const mdxFiles = files.filter(f => f.endsWith('.mdx'))
  const entries: CompetitionMetadata[] = []
  for (const file of mdxFiles) {
    const filepath = path.join(dir, file)
    const raw = await fs.readFile(filepath, 'utf8')
    const { data } = matter(raw)
    const slug = file.replace(/\.mdx$/, '')
    entries.push({
      title: data.title ?? slug,
      pitch: data.pitch,
      demo: data.demo,
      github: data.github,
      hackathon: data.hackathon ?? '',
      placement: data.placement,
      location: data.location,
      track: data.track,
      team: data.team,
      date: data.date ?? '1970-01-01',
      slug,
      description: data.description,
      video: data.video,
    })
  }
  // Newest first
  entries.sort((a, b) => (a.date < b.date ? 1 : -1))
  return entries
}

export default async function CompetitionsPage() {
  const competitions = await getCompetitions()

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6 inline-block"
            >
              ← Back to home
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-4">Competitions</h1>
            <p className="text-lg text-muted-foreground">Hackathons, contests, and competitive programming achievements</p>
          </div>

          {/* Competitions Grid */}
          <div className="grid gap-6">
            {competitions.map((competition) => (
              <div key={competition.slug} className="block">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 hover:bg-white/7 transition-all duration-200">
                  {/* Clickable Header + Description */}
                  <Link href={`/competitions/${competition.slug}`} className="block group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:underline">
                          {competition.title}
                        </h2>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground items-center">
                          <span className="font-medium">{competition.hackathon}</span>
                          {competition.placement && (
                            <>
                              <span>•</span>
                              <span className="text-green-400">{competition.placement}</span>
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
                  </Link>

                  {/* Media + Details Row */}
                  {(competition.video || competition.team?.length || competition.pitch || competition.demo || competition.github) && (
                    <div className="grid md:grid-cols-2 gap-4 items-start">
                      {/* Left: Video + Links */}
                      <div className="space-y-3">
                        {competition.video && (
                          <div className="aspect-video w-full">
                            <iframe
                              className="w-full h-full rounded-md border border-white/10"
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
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{member.name}</a>
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
                          <div className="flex flex-wrap gap-4 mb-2">
                            {competition.pitch && (<a href={competition.pitch} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200">Pitch →</a>)}
                            {competition.demo && (<a href={competition.demo} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200">Demo →</a>)}
                            {competition.github && (<a href={competition.github} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200">GitHub →</a>)}
                            {competition.video && (<a href={competition.video} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-white transition-colors duration-200">Video →</a>)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
