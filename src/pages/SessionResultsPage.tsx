import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getSession, getDrivers, getSessionFinalPositions } from '@/api/openf1'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { ChevronRight, Trophy, Zap, Clock, Flag, UserCircle2 } from 'lucide-react'

export default function SessionResultsPage() {
  const { sessionKey } = useParams<{ sessionKey: string }>()
  const parsedKey = parseInt(sessionKey || '0', 10)

  // Fetch session details
  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ['session', parsedKey],
    queryFn: () => getSession(parsedKey),
    enabled: !!parsedKey,
  })

  // Fetch final positions
  const { data: positions, isLoading: positionsLoading } = useQuery({
    queryKey: ['sessionFinalPositions', parsedKey],
    queryFn: () => getSessionFinalPositions(parsedKey),
    enabled: !!parsedKey,
  })

  // Fetch driver details
  const { data: drivers, isLoading: driversLoading } = useQuery({
    queryKey: ['sessionDrivers', parsedKey],
    queryFn: () => getDrivers(parsedKey),
    enabled: !!parsedKey,
  })

  const isLoading = sessionLoading || positionsLoading || driversLoading
  const error = sessionError

  const sessionTypeIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'practice': return <Flag className="w-5 h-5" />
      case 'qualifying': return <Clock className="w-5 h-5" />
      case 'sprint': return <Zap className="w-5 h-5" />
      case 'race': return <Trophy className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container px-4 sm:px-md py-8 sm:py-12 lg:py-xl">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 border-b border-border pb-6 sm:pb-8">
            <Link to="/schedule" className="inline-flex items-center gap-2 text-xs font-black uppercase text-text-muted hover:text-f1-red transition-colors mb-8">
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Schedule
            </Link>

            {session && (
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                   <div className="inline-flex items-center gap-2 px-2 py-1 bg-bg-subtle text-text-primary text-[10px] font-black uppercase tracking-widest mb-4 border border-border">
                     {session.session_type} Classification
                   </div>
                   <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase italic leading-none">
                     {session.session_name} <br />
                     <span className="text-f1-red">{session.year}</span>
                   </h1>
                </div>
                <div className="flex bg-bg-subtle border border-border p-4 gap-4 items-center rounded-sm">
                   <div className="w-10 h-10 bg-f1-red text-white flex items-center justify-center">
                       {sessionTypeIcon(session.session_type)}
                   </div>
                   <div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Results Sealed</div>
                       <div className="text-sm font-black italic uppercase text-text-primary tracking-tight">Official Record</div>
                   </div>
                </div>
              </div>
            )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">Retrieving Session Archives...</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center border border-f1-red bg-black rounded-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-f1-red uppercase italic mb-2">Error 500</h3>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">Data unavailable.</p>
          </div>
        ) : positions && positions.length > 0 && drivers ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-subtle text-[10px] font-black uppercase tracking-widest text-text-muted border-y border-border">
                  <th className="px-6 py-4 text-left w-20">POS</th>
                  <th className="px-6 py-4 text-left">Driver</th>
                  <th className="px-6 py-4 text-left">Team</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos, idx) => {
                  const driver = drivers.find(d => d.driver_number === pos.driver_number)
                  if (!driver) return null
                  
                  // In F1, team color usually isn't strict HEX standard in this JSON format, but we'll try to map it.
                  const teamColorStr = driver.team_colour ? `#${driver.team_colour}` : 'transparent'

                  return (
                    <tr 
                      key={pos.driver_number}
                      className="border-b border-border hover:bg-bg-subtle transition-colors group"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="px-6 py-6">
                        <div className="text-2xl font-black italic text-text-primary tracking-tighter">
                          {pos.position || '-'}
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 border border-border bg-bg flex items-center justify-center group-hover:bg-white transition-colors">
                            {driver.headshot_url ? (
                                <img src={driver.headshot_url} alt={driver.name_acronym} className="w-8 h-8 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100" />
                            ) : (
                                <UserCircle2 className="w-5 h-5 text-text-muted opacity-50" />
                            )}
                            </div>
                            <div>
                                <div className="text-md font-black text-text-primary uppercase italic leading-none group-hover:text-f1-red transition-colors">
                                    {driver.first_name} <span className="text-f1-red">{driver.last_name}</span>
                                </div>
                                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                                    {driver.country_code}
                                </div>
                            </div>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: teamColorStr }} />
                             <span className="text-[11px] font-black uppercase italic text-text-secondary tracking-tight">
                                 {driver.team_name}
                             </span>
                        </div>
                      </td>

                      <td className="px-6 py-6 text-right">
                         <div className={`text-[10px] font-black uppercase tracking-widest ${pos.status?.toLowerCase().includes('retired') || pos.status?.toLowerCase().includes('out') ? 'text-text-muted/30' : 'text-f1-red'}`}>
                             {pos.status || 'Finished'}
                         </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center border border-border border-dashed bg-bg-subtle rounded-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-text-primary uppercase italic mb-2">Error 404</h3>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">Data unavailable.</p>
          </div>
        )}
      </div>
    </div>
  )
}
