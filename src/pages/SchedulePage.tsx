/**
 * SchedulePage - F1 Race Calendar
 * Minimalist Red Edition
 */

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSessions } from '@/api/openf1'
import { getSeasonResults } from '@/api/jolpica'
import { useUIStore } from '@/store/uiStore'
import Countdown from '@/components/shared/Countdown'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Link } from 'react-router-dom'
import { formatSessionDateTime } from '@/utils/timeFormatters'
import { Session } from '@/types/f1'
import { Flag, Zap, Clock, Trophy, ChevronRight, MapPin, UserCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { getDriverImage } from '@/lib/imageMap'

export default function SchedulePage() {
  const selectedYear = useUIStore((state) => state.selectedYear)
  const [expandedRace, setExpandedRace] = useState<string | null>(null)

  // Fetch sessions for current year
  const sessionsQuery = useQuery({
    queryKey: ['sessions', selectedYear],
    queryFn: () => getSessions(selectedYear),
    staleTime: 60 * 60 * 1000,
  })

  // Fetch results for winners
  const resultsQuery = useQuery({
    queryKey: ['seasonResults', selectedYear],
    queryFn: () => getSeasonResults(selectedYear),
    staleTime: 24 * 60 * 60 * 1000,
  })

  const isLoading = sessionsQuery.isLoading || resultsQuery.isLoading
  const sessions = sessionsQuery.data || []
  const results = resultsQuery.data || []

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <LoadingSpinner />
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">Syncing Calendar...</p>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="container py-24 text-center">
        <div className="max-w-md mx-auto p-12 border-2 border-dashed border-border rounded-sm">
          <h1 className="text-xl font-black text-text-primary uppercase italic mb-2">Error 503</h1>
          <p className="text-text-secondary text-sm mb-8">Service unavailable.</p>
          <button onClick={() => window.location.reload()} className="btn-primary w-full">Retry Connection</button>
        </div>
      </div>
    )
  }

  // Group sessions by location
  const groupedSessions = sessions.reduce(
    (acc: Record<string, Session[]>, session: Session) => {
      const key = session.location || 'Global'
      if (!acc[key]) acc[key] = []
      acc[key].push(session)
      return acc
    },
    {} as Record<string, Session[]>
  )

  const sessionTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'practice': return <Flag className="w-4 h-4" />
      case 'qualifying': return <Clock className="w-4 h-4" />
      case 'sprint': return <Zap className="w-4 h-4" />
      case 'race': return <Trophy className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  // Find winner for a location
  const getWinnerForRace = (location: string) => {
    // Basic fuzzy match for location
    const result = results.find((r: any) => 
        r.Circuit.Location.locality.toLowerCase().includes(location.toLowerCase()) ||
        location.toLowerCase().includes(r.Circuit.Location.locality.toLowerCase())
    )
    return result?.Results?.[0] || null
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container px-4 sm:px-md py-8 sm:py-12 lg:py-xl">
        {/* Header */}
        <div className="mb-8 sm:mb-12 lg:mb-16 border-b border-border pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8">
            <div>
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-f1-red text-white text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4">
                    Season Calendar
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase italic leading-none">
                    World <span className="text-f1-red">Championship</span> <br />
                    Events {selectedYear}
                </h1>
            </div>
            <div className="text-left md:text-right">
                <div className="text-sm font-black text-text-primary uppercase italic">{sessions.length} Sessions</div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Satellite Verified</div>
            </div>
        </div>

        {/* Races List */}
        <div className="space-y-10 sm:space-y-16">
        {Object.entries(groupedSessions).map(([location, raceSessions]) => {
          const winner = getWinnerForRace(location)
          const isExpanded = expandedRace === location
          
          return (
            <div key={location} className="relative">
              <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                      <div className="w-2 h-8 bg-f1-red rounded-full" />
                      <div>
                         <h2 className="text-2xl font-black uppercase italic text-text-primary leading-none">{location}</h2>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                             <MapPin className="w-3 h-3 text-f1-red" />
                             Circuit Venue Link Active
                         </div>
                      </div>
                  </div>
                  
                  {winner && (
                      <button 
                        onClick={() => setExpandedRace(isExpanded ? null : location)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-sm transition-all text-[10px] font-black uppercase tracking-widest ${
                            isExpanded ? 'bg-f1-red text-white border-f1-red' : 'bg-bg-subtle text-text-muted border-border hover:border-f1-red hover:text-f1-red'
                        }`}
                      >
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {isExpanded ? 'Hide Results' : 'View Winner'}
                      </button>
                  )}
              </div>

              {/* Race Winner Spotlight Section - Expansion */}
              {isExpanded && winner && (
                  <div className="mb-8 p-8 minimal-card bg-bg-subtle border-l-4 border-l-f1-red animate-slide-up flex flex-col md:flex-row items-center gap-12 group">
                      <div className="flex-shrink-0 relative">
                         <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-full bg-white border border-border flex items-center justify-center text-text-muted overflow-hidden relative shadow-xl">
                             {getDriverImage(winner.Driver.familyName) ? (
                               <img 
                                 src={getDriverImage(winner.Driver.familyName)!}
                                 className="absolute top-0 h-[350%] w-auto max-w-none object-contain object-top mt-4"
                                 alt={winner.Driver.familyName}
                               />
                             ) : (
                               <UserCircle2 className="w-20 h-20 opacity-10" />
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-f1-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                         <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-f1-red text-white flex items-center justify-center font-black italic rounded-full border-4 border-bg-subtle">
                             P1
                         </div>
                      </div>
                      
                      <div className="flex-1 text-center md:text-left">
                          <div className="text-f1-red text-[10px] font-black uppercase tracking-[0.3em] mb-2 font-mono">Race Outcome Decoded</div>
                          <h3 className="text-4xl font-black text-text-primary uppercase italic leading-none mb-2">
                              {winner.Driver.givenName} <span className="text-f1-red">{winner.Driver.familyName}</span>
                          </h3>
                          <div className="flex flex-wrap justify-center md:justify-start gap-6">
                              <div className="flex items-center gap-2">
                                  <Trophy className="w-4 h-4 text-f1-yellow" />
                                  <span className="text-xs font-black uppercase text-text-secondary italic">{winner.Constructor.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-text-muted" />
                                  <span className="text-xs font-bold text-text-muted uppercase tabular-nums">{winner.Time?.time || 'Finished'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <div className="text-[10px] font-black text-f1-red">PTS</div>
                                  <span className="text-sm font-black text-text-primary">+{winner.points}</span>
                              </div>
                          </div>
                      </div>

                      <div className="hidden lg:block opacity-5 group-hover:opacity-10 transition-opacity translate-x-12">
                          <Trophy className="w-32 h-32 text-text-primary" />
                      </div>
                  </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {raceSessions.map((session: Session) => {
                  const now = new Date()
                  const sessionDate = new Date(session.date_start)
                  const isActive = sessionDate <= now && (session.date_end ? new Date(session.date_end) >= now : true)
                  const isPast = session.date_end ? new Date(session.date_end) < now : false

                  return (
                    <Link
                      key={session.session_key}
                      to={isPast ? `/results/${session.session_key}` : `/live/${session.session_key}`}
                      className={`minimal-card p-4 sm:p-6 lg:p-8 group relative flex flex-col justify-between h-[220px] sm:h-[260px] lg:h-[280px] ${
                          isPast ? 'opacity-50 grayscale hover:grayscale-0 transition-all' : ''
                      }`}
                    >
                      <div>
                          <div className="flex items-start justify-between mb-6">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                                  isActive ? 'bg-f1-red text-white border-f1-red' : 'bg-bg-subtle text-text-muted border-border group-hover:border-f1-red group-hover:text-f1-red'
                              }`}>
                                  {sessionTypeIcon(session.session_type)}
                              </div>
                              
                              {isActive ? (
                                  <div className="flex items-center gap-2 px-3 py-1 bg-f1-red text-white text-[8px] font-black uppercase italic animate-pulse rounded-lg">
                                      <div className="w-1 h-1 bg-white rounded-full" />
                                      Live Transmission
                                  </div>
                              ) : isPast ? (
                                  <div className="text-[8px] font-black uppercase text-text-muted tracking-wider">Completed</div>
                              ) : null}
                          </div>

                          <h3 className="text-xl font-black text-text-primary uppercase italic mb-2 leading-none group-hover:text-f1-red transition-colors">
                              {session.session_name}
                          </h3>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">
                              {session.session_type}
                          </p>
                          
                          <div className="text-xs font-medium text-text-secondary">
                            {formatSessionDateTime(session.date_start, session.gmt_offset)}
                          </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-border group-hover:border-f1-red/10">
                          {isPast ? (
                              <div className="flex items-center justify-between">
                                 <div className="text-[10px] font-black uppercase text-text-muted">Results Sealed</div>
                                 {winner && session.session_type.toLowerCase() === 'race' && (
                                     <div className="text-[10px] font-black text-f1-red uppercase italic flex items-center gap-1">
                                         Winner: {winner.Driver.code}
                                     </div>
                                 )}
                              </div>
                          ) : (
                              <div className="flex items-center justify-between">
                                  <Countdown dateStart={session.date_start} size="sm" />
                                  {isActive && <ChevronRight className="w-4 h-4 text-f1-red animate-bounce-x" />}
                              </div>
                          )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
