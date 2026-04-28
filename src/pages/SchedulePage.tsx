/**
 * SchedulePage - F1 Race Calendar
 * Luxury Editorial Edition
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
import { Flag, Zap, Clock, Trophy, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { getDriverImage } from '@/lib/imageMap'

const getFlagUrl = (countryCode?: string) => {
  if (!countryCode) return null;
  const map: Record<string, string> = {
    BRN: 'bh', KSA: 'sa', AUS: 'au', JPN: 'jp', CHN: 'cn',
    USA: 'us', ITA: 'it', MON: 'mc', CAN: 'ca', ESP: 'es',
    AUT: 'at', GBR: 'gb', HUN: 'hu', BEL: 'be', NED: 'nl',
    AZE: 'az', SGP: 'sg', MEX: 'mx', BRA: 'br', QAT: 'qa',
    UAE: 'ae'
  }
  const iso2 = map[countryCode.toUpperCase()]
  return iso2 ? `https://flagcdn.com/h24/${iso2}.png` : null
}

export default function SchedulePage() {
  const selectedYear = useUIStore((state) => state.selectedYear)
  const [expandedRace, setExpandedRace] = useState<string | null>(null)

  const sessionsQuery = useQuery({
    queryKey: ['sessions', selectedYear],
    queryFn: () => getSessions(selectedYear),
    staleTime: 60 * 60 * 1000,
  })

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
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-32 text-center">
        <div className="max-w-md mx-auto p-12 border-t border-[#1A1A1A]">
          <h1 className="font-serif text-2xl text-[#1A1A1A] mb-3">Service Unavailable</h1>
          <p className="font-sans text-sm text-[#6C6863] mb-8">Calendar data could not be retrieved.</p>
          <button onClick={() => window.location.reload()} className="btn-primary w-full"><span>Retry</span></button>
        </div>
      </div>
    )
  }

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
    const props = { className: "w-4 h-4", strokeWidth: 1.5 }
    switch (type.toLowerCase()) {
      case 'practice': return <Flag {...props} />
      case 'qualifying': return <Clock {...props} />
      case 'sprint': return <Zap {...props} />
      case 'race': return <Trophy {...props} />
      default: return <Clock {...props} />
    }
  }

  const getWinnerForRace = (location: string) => {
    const result = results.find((r: any) => 
      r.Circuit.Location.locality.toLowerCase().includes(location.toLowerCase()) ||
      location.toLowerCase().includes(r.Circuit.Location.locality.toLowerCase())
    )
    return result?.Results?.[0] || null
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-12 md:py-20 lg:py-32">
        {/* Header */}
        <div className="mb-12 md:mb-20 border-b border-[#1A1A1A]/10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img src="/F1.svg.png" alt="F1 Logo" className="h-3.5 md:h-4 object-contain" />
              <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                Season Calendar
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-[#1A1A1A] leading-[0.9] tracking-tight">
              World <em className="text-[#D4AF37]">Championship</em>
            </h1>
          </div>
        </div>

        {/* Races List */}
        <div className="space-y-16 md:space-y-24">
        {Object.entries(groupedSessions).map(([location, raceSessions]) => {
          const winner = getWinnerForRace(location)
          const isExpanded = expandedRace === location
          
          return (
            <div key={location} className="relative">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-start gap-4 group cursor-default">
                  <div className="w-0.5 h-10 mt-0.5 bg-[#D4AF37] group-hover:bg-[#1A1A1A] transition-colors duration-500" />
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] leading-none group-hover:text-[#D4AF37] transition-colors duration-500">{location}</h2>
                      {getFlagUrl(raceSessions[0]?.country_code) && (
                        <img 
                          src={getFlagUrl(raceSessions[0]?.country_code)!} 
                          alt="flag"
                          className="h-[14px] md:h-[16px] w-auto shadow-[0_0_0_1px_rgba(26,26,26,0.1)] grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 mt-1" 
                        />
                      )}
                    </div>
                    <div className="font-sans text-[10px] font-medium text-[#6C6863] uppercase tracking-[0.25em] mt-2 group-hover:text-[#1A1A1A]/50 transition-colors duration-500">
                      Circuit Venue
                    </div>
                  </div>
                </div>
                
                {winner && (
                  <button 
                    onClick={() => setExpandedRace(isExpanded ? null : location)}
                    className={`flex items-center gap-2 px-4 py-2 border transition-all duration-500 font-sans text-[10px] font-medium uppercase tracking-[0.2em] ${
                      isExpanded ? 'bg-[#1A1A1A] text-[#F9F8F6] border-[#1A1A1A]' : 'bg-transparent text-[#6C6863] border-[#1A1A1A]/10 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                    }`}
                  >
                    {isExpanded ? <ChevronUp className="w-3 h-3" strokeWidth={1.5} /> : <ChevronDown className="w-3 h-3" strokeWidth={1.5} />}
                    {isExpanded ? 'Hide' : 'Winner'}
                  </button>
                )}
              </div>

              {/* Winner Spotlight */}
              {isExpanded && winner && (
                <div className="mb-10 p-8 md:p-12 border-t border-[#1A1A1A] border-l-2 border-l-[#D4AF37] flex flex-col md:flex-row items-center gap-12 group animate-fade-in">
                  <div className="flex-shrink-0 relative">
                    <div className="w-28 h-28 lg:w-36 lg:h-36 bg-[#EBE5DE] flex items-center justify-center overflow-hidden relative shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
                      {getDriverImage(winner.Driver.familyName) ? (
                        <img 
                          src={getDriverImage(winner.Driver.familyName)!}
                          className="absolute top-0 h-[350%] w-auto max-w-none object-contain object-top mt-4 grayscale group-hover:grayscale-0 transition-all duration-[1500ms]"
                          alt={winner.Driver.familyName}
                        />
                      ) : (
                        <span className="font-serif text-4xl text-[#1A1A1A]/10">P1</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#D4AF37] mb-3">Race Winner</div>
                    <h3 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] leading-tight mb-3">
                      <span className="text-[#6C6863]">{winner.Driver.givenName}</span>{' '}
                      {winner.Driver.familyName}
                    </h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
                        <span className="font-sans text-xs text-[#6C6863] uppercase tracking-[0.1em]">{winner.Constructor.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#6C6863]" strokeWidth={1.5} />
                        <span className="font-sans text-xs text-[#6C6863] uppercase tabular-nums">{winner.Time?.time || 'Finished'}</span>
                      </div>
                      <div className="font-sans text-xs font-medium text-[#D4AF37] uppercase tracking-[0.1em]">
                        +{winner.points} PTS
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {raceSessions.map((session: Session) => {
                  const now = new Date()
                  const sessionDate = new Date(session.date_start)
                  const isActive = sessionDate <= now && (session.date_end ? new Date(session.date_end) >= now : true)
                  const isPast = session.date_end ? new Date(session.date_end) < now : false

                  return (
                    <Link
                      key={session.session_key}
                      to={isPast ? `/results/${session.session_key}` : `/live/${session.session_key}`}
                      className={`border-t border-[#1A1A1A]/10 p-6 md:p-8 group flex flex-col justify-between min-h-[240px] md:min-h-[280px] transition-all duration-700 hover:bg-[#1A1A1A]/[0.02] relative ${
                        isPast ? 'opacity-40 hover:opacity-100' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between mb-6">
                          <div className={`w-8 h-8 flex items-center justify-center border transition-colors duration-500 ${
                            isActive ? 'bg-[#D4AF37] text-[#1A1A1A] border-[#D4AF37]' : 'bg-transparent text-[#6C6863] border-[#1A1A1A]/10 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]'
                          }`}>
                            {sessionTypeIcon(session.session_type)}
                          </div>
                          
                          {isActive && (
                            <div className="font-sans text-[8px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                              Live
                            </div>
                          )}
                          {isPast && (
                            <div className="font-sans text-[8px] font-medium uppercase tracking-[0.2em] text-[#6C6863]">Completed</div>
                          )}
                        </div>

                        <h3 className="font-serif text-lg md:text-xl text-[#1A1A1A] mb-2 leading-tight group-hover:text-[#D4AF37] transition-colors duration-500">
                          {session.session_name}
                        </h3>
                        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863] mb-3">
                          {session.session_type}
                        </p>
                        <div className="font-sans text-xs text-[#6C6863]">
                          {formatSessionDateTime(session.date_start, session.gmt_offset)}
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-[#1A1A1A]/5 group-hover:border-[#D4AF37]/20 transition-colors duration-500">
                        {isPast ? (
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863]">Results</span>
                            {winner && session.session_type.toLowerCase() === 'race' && (
                              <span className="font-sans text-[10px] font-medium text-[#D4AF37] uppercase">Winner: {winner.Driver.code}</span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <Countdown dateStart={session.date_start} size="sm" />
                            {isActive && <ChevronRight className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />}
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
    </div>
  )
}
