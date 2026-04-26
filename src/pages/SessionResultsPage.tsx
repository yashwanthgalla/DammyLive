/**
 * SessionResultsPage — Luxury Editorial Edition
 * Final classification display
 */

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getSession, getDrivers, getSessionFinalPositions } from '@/api/openf1'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { ChevronRight, Trophy, Zap, Clock, Flag, UserCircle2 } from 'lucide-react'
import { getTeamLogo } from '@/lib/imageMap'

export default function SessionResultsPage() {
  const { sessionKey } = useParams<{ sessionKey: string }>()
  const parsedKey = parseInt(sessionKey || '0', 10)

  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ['session', parsedKey],
    queryFn: () => getSession(parsedKey),
    enabled: !!parsedKey,
  })

  const { data: positions, isLoading: positionsLoading } = useQuery({
    queryKey: ['sessionFinalPositions', parsedKey],
    queryFn: () => getSessionFinalPositions(parsedKey),
    enabled: !!parsedKey,
  })

  const { data: drivers, isLoading: driversLoading } = useQuery({
    queryKey: ['sessionDrivers', parsedKey],
    queryFn: () => getDrivers(parsedKey),
    enabled: !!parsedKey,
  })

  const isLoading = sessionLoading || positionsLoading || driversLoading
  const error = sessionError

  const sessionTypeIcon = (type?: string) => {
    const props = { className: "w-5 h-5", strokeWidth: 1.5 }
    switch (type?.toLowerCase()) {
      case 'practice': return <Flag {...props} />
      case 'qualifying': return <Clock {...props} />
      case 'sprint': return <Zap {...props} />
      case 'race': return <Trophy {...props} />
      default: return <Clock {...props} />
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-12 md:py-20 lg:py-32">
        {/* Header */}
        <div className="mb-12 md:mb-20 border-b border-[#1A1A1A]/10 pb-10">
          <Link to="/schedule" className="inline-flex items-center gap-2 font-sans text-xs font-medium uppercase text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500 mb-10">
            <ChevronRight className="w-4 h-4 rotate-180" strokeWidth={1.5} />
            Schedule
          </Link>

          {session && (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                    {session.session_type} Classification
                  </span>
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-[#1A1A1A] leading-[0.9] tracking-tight">
                  {session.session_name} <br />
                  <em className="text-[#D4AF37]">{session.year}</em>
                </h1>
              </div>
              <div className="flex items-center gap-4 p-4 border border-[#1A1A1A]/10">
                <div className="w-10 h-10 bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-center">
                  {sessionTypeIcon(session.session_type)}
                </div>
                <div>
                  <div className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#6C6863]">Final</div>
                  <div className="font-serif text-sm text-[#1A1A1A]">Official Record</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="py-24 text-center border-t border-[#1A1A1A] max-w-2xl mx-auto pt-12">
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3">Data Unavailable</h3>
            <p className="font-sans text-sm text-[#6C6863]">Session results could not be retrieved.</p>
          </div>
        ) : positions && positions.length > 0 && drivers ? (
          <div className="border-t border-[#1A1A1A]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#6C6863] border-b border-[#1A1A1A]/10">
                  <th className="px-4 md:px-6 py-5 text-left w-20">Pos</th>
                  <th className="px-4 md:px-6 py-5 text-left">Driver</th>
                  <th className="px-4 md:px-6 py-5 text-left">Team</th>
                  <th className="px-4 md:px-6 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos: any) => {
                  const driver = drivers.find((d: any) => d.driver_number === pos.driver_number)
                  if (!driver) return null
                  
                  const teamColorStr = driver.team_colour ? `#${driver.team_colour}` : 'transparent'

                  return (
                    <tr 
                      key={pos.driver_number}
                      className="border-b border-[#1A1A1A]/5 group hover:bg-[#1A1A1A]/[0.02] transition-colors duration-500"
                    >
                      <td className="px-4 md:px-6 py-6">
                        <span className={`font-serif text-2xl tracking-tight ${(pos.position && pos.position <= 3) ? 'text-[#D4AF37]' : 'text-[#1A1A1A]'}`}>
                          {pos.position ? pos.position.toString().padStart(2, '0') : '-'}
                        </span>
                      </td>

                      <td className="px-4 md:px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#EBE5DE] flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
                            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: teamColorStr }} />
                            {driver.headshot_url ? (
                              <img src={driver.headshot_url} alt={driver.name_acronym} className="w-8 h-8 object-cover grayscale group-hover:grayscale-0 transition-all duration-[1500ms]" />
                            ) : (
                              <UserCircle2 className="w-5 h-5 text-[#1A1A1A]/10" strokeWidth={1} />
                            )}
                          </div>
                          <div>
                            <div className="font-serif text-base text-[#1A1A1A] leading-none group-hover:text-[#D4AF37] transition-colors duration-500">
                              <span className="text-[#6C6863]">{driver.first_name}</span>{' '}
                              {driver.last_name}
                            </div>
                            <div className="font-sans text-[10px] font-medium text-[#6C6863] uppercase tracking-[0.2em] mt-1.5">
                              {driver.country_code}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 md:px-6 py-6">
                        <div className="flex items-center gap-3">
                          {getTeamLogo(driver.team_name) ? (
                            <img src={getTeamLogo(driver.team_name)!} alt={driver.team_name} className="w-5 h-5 object-contain brightness-0" />
                          ) : (
                            <div className="w-0.5 h-5" style={{ backgroundColor: teamColorStr }} />
                          )}
                          <span className="font-sans text-xs font-medium uppercase tracking-[0.1em] text-[#6C6863]">
                            {driver.team_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 md:px-6 py-6 text-right">
                        <span className={`font-sans text-[10px] font-medium uppercase tracking-[0.2em] ${
                          pos.status?.toLowerCase().includes('retired') || pos.status?.toLowerCase().includes('out')
                            ? 'text-[#6C6863]/30'
                            : 'text-[#D4AF37]'
                        }`}>
                          {pos.status || 'Finished'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center border-t border-[#1A1A1A]/10">
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3">No Results</h3>
            <p className="font-sans text-sm text-[#6C6863]">Data unavailable.</p>
          </div>
        )}
      </div>
    </div>
  )
}
