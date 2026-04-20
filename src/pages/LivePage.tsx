/**
 * LivePage - Real-time F1 Session Dashboard
 * Minimalist Red Edition — with auth gate & responsive design
 */

import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLiveSession } from '@/hooks/useLiveSession'
import { getSession, getDrivers } from '@/api/openf1'
import { useAuthStore } from '@/store/authStore'
import {
  LiveTable,
  WeatherOverlay,
  PitStopList,
} from '@/components/timing'
import LapTimeChart from '@/components/charts/LapTimeChart'
import StrategyGraph from '@/components/charts/StrategyGraph'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { formatSessionDateTime } from '@/utils/timeFormatters'
import { Session } from '@/types/f1'
import { Activity, Radio, ChevronLeft, MapPin, Clock, Zap, Trophy, Lock, ChevronRight } from 'lucide-react'
import { getDriverImage } from '@/lib/imageMap'

export default function LivePage() {
  const { sessionKey } = useParams<{ sessionKey: string }>()
  const [expandedDriver, setExpandedDriver] = useState<number | undefined>()
  const { isAuthenticated } = useAuthStore()

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="p-8 sm:p-12 border border-border bg-white rounded-sm">
            <div className="w-16 h-16 bg-f1-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-f1-red" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-f1-red text-white text-[10px] font-black uppercase tracking-widest mb-6">
              Authentication Required
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary uppercase italic tracking-tighter leading-none mb-4">
              Live <span className="text-f1-red">Session</span> Data
            </h1>
            <p className="text-text-secondary text-sm mb-8 leading-relaxed">
              You must be logged in to view real-time race telemetry and live timing data.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/auth"
                className="btn-primary px-8 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
              >
                Sign In
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/schedule"
                className="px-8 py-4 border-2 border-border text-text-primary font-black uppercase tracking-widest hover:border-text-primary transition-all text-xs text-center rounded-sm"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle missing session key
  if (!sessionKey || isNaN(parseInt(sessionKey))) {
    return (
      <div className="container py-16 sm:py-24 text-center px-4">
        <div className="max-w-md mx-auto p-8 sm:p-12 border-2 border-dashed border-border rounded-sm">
          <h1 className="text-xl font-black text-text-primary uppercase italic mb-2">Signal Lost</h1>
          <p className="text-text-secondary text-sm mb-8">No valid session key detected. Please select a session from the schedule.</p>
          <Link to="/schedule" className="btn-primary w-full inline-block text-center">Return to Schedule</Link>
        </div>
      </div>
    )
  }

  const sessionKeyNum = parseInt(sessionKey)

  // Fetch session metadata
  const sessionQuery = useQuery({
    queryKey: ['session', sessionKeyNum],
    queryFn: () => getSession(sessionKeyNum),
    staleTime: 10 * 60 * 1000,
  })

  // Fetch driver list
  const driversQuery = useQuery({
    queryKey: ['drivers', sessionKeyNum],
    queryFn: () => getDrivers(sessionKeyNum),
    staleTime: 30 * 60 * 1000,
  })

  const liveState = useLiveSession(sessionKeyNum, {
    batchInterval: 200,
    isPast: sessionQuery.data ? new Date(sessionQuery.data.date_end || sessionQuery.data.date_start) < new Date() : false,
  })

  const isLoading = sessionQuery.isLoading || driversQuery.isLoading || (!liveState.isConnected && !liveState.error && !liveState.lastUpdate)
  const session: Session | undefined = sessionQuery.data
  const isPast = session ? new Date(session.date_end || session.date_start) < new Date() : false

  return (
    <div className="min-h-screen bg-bg pb-12 sm:pb-24">
      {/* Session Header */}
      <div className="bg-bg-subtle border-b border-border mb-6 sm:mb-12">
        <div className="container py-4 sm:py-8 px-4">
          <Link to="/schedule" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-text-muted hover:text-f1-red transition-colors mb-4 sm:mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Schedule
          </Link>

          {session && (
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-8">
              <div>
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 ${isPast ? 'bg-text-primary' : 'bg-f1-red'} text-white flex items-center justify-center font-bold text-[7px] sm:text-[8px] uppercase italic text-center px-1`}>
                    {isPast ? 'FINAL' : 'LIVE'}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-black text-text-primary uppercase italic tracking-tighter leading-none">
                      {session.session_name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        <MapPin className="w-3 h-3 text-f1-red" />
                        {session.location} ({session.country_code})
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        <Clock className="w-3 h-3 text-f1-red" />
                        {formatSessionDateTime(session.date_start, session.gmt_offset)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-8 text-right bg-white p-3 sm:p-6 border border-border rounded-sm">
                <div>
                  <div className="text-[9px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">
                    {isPast ? 'Data Integrity' : 'Global Feed'}
                  </div>
                  <div className={`text-[10px] sm:text-xs font-black uppercase italic ${isPast ? 'text-text-primary' : (liveState.isConnected ? 'text-f1-green' : 'text-f1-red animate-pulse')}`}>
                    {isPast ? 'Archive Finalized' : (liveState.isConnected ? 'Synchronized' : 'Connecting Engine...')}
                  </div>
                </div>
                <div className="w-px h-8 sm:h-10 bg-border" />
                <div>
                  <div className="text-[9px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">System</div>
                  <div className="text-base sm:text-xl font-black text-text-primary uppercase italic tracking-widest flex items-center gap-2">
                    {isPast ? (
                      <Trophy className="w-4 h-4 text-f1-red" />
                    ) : (
                      <Radio className={`w-4 h-4 ${liveState.isConnected ? 'text-f1-red animate-pulse' : 'text-text-muted'}`} />
                    )}
                    <span className="hidden sm:inline">{isPast ? 'Classification' : 'Live Engine'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container px-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-32 gap-4">
            <LoadingSpinner />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">Syncing Engine Data...</p>
          </div>
        )}

        {/* Connection Error */}
        {liveState.error && !isLoading && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-f1-red/5 border border-f1-red/20 flex items-center gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-f1-red rounded-full flex items-center justify-center text-white flex-shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-f1-red uppercase tracking-widest mb-1">System Alert</div>
              <p className="text-sm text-text-primary font-medium uppercase font-mono tracking-tighter italic">Error 503</p>
            </div>
          </div>
        )}

        {/* Dash Grid */}
        {!isLoading && (
          <div className="grid lg:grid-cols-12 gap-4 sm:gap-8">
            {/* Weather & Conditions - Full Width */}
            <div className="lg:col-span-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-f1-red" />
                <h2 className="text-base sm:text-xl font-black uppercase italic text-text-primary">Conditions Monitor</h2>
              </div>
              <WeatherOverlay weather={liveState.weather} />
            </div>

            {/* Primary Data: Live Table */}
            <div className="lg:col-span-12 overflow-x-auto">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-f1-red animate-pulse" />
                <h2 className="text-base sm:text-xl font-black uppercase italic text-text-primary">Global Telemetry Hub</h2>
              </div>
              {driversQuery.data && (
                <LiveTable
                  positions={liveState.positions}
                  drivers={driversQuery.data}
                  laps={liveState.laps}
                  expandedDriver={expandedDriver}
                  onRowClick={setExpandedDriver}
                />
              )}
            </div>

            {/* Strategy Analysis */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-f1-red" />
                <h2 className="text-base sm:text-xl font-black uppercase italic text-text-primary">Tire Strategy Graph</h2>
              </div>
              <div className="minimal-card p-3 sm:p-6">
                <StrategyGraph
                  positions={liveState.positions}
                  laps={liveState.laps}
                  height={350}
                />
              </div>
            </div>

            {/* Pit Stop History */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-f1-red" />
                <h2 className="text-base sm:text-xl font-black uppercase italic text-text-primary">Pit Stop Feed</h2>
              </div>
              <div className="minimal-card p-3 sm:p-6 h-[300px] sm:h-[400px] overflow-y-auto">
                <PitStopList pitStops={liveState.pitStops} maxItems={20} />
              </div>
            </div>

            {/* Expanded Driver Details */}
            {expandedDriver && (
              <div className="lg:col-span-12 mt-4 sm:mt-8 animate-slide-up">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-f1-red text-white flex items-center justify-center font-bold text-xs italic">
                    {expandedDriver}
                  </div>
                  <h2 className="text-base sm:text-xl font-black uppercase italic text-text-primary">Driver Telemetry Breakdown</h2>
                </div>
                <div className="minimal-card p-4 sm:p-8">
                  <div className="grid lg:grid-cols-12 gap-6 sm:gap-12">
                    <div className="lg:col-span-4">
                      <div className="driver-avatar bg-bg-subtle border border-border flex items-center justify-center text-text-muted overflow-hidden relative rounded-2xl h-[300px]">
                        {(() => {
                           const driver = driversQuery.data?.find(d => d.driver_number === expandedDriver)
                           const image = driver ? getDriverImage(driver.last_name) : null
                           return image ? (
                             <img 
                               src={image}
                               className="absolute top-0 h-[180%] w-auto object-contain object-top origin-top mt-4"
                               alt={driver?.last_name}
                             />
                           ) : (
                            <div className="text-center p-8">
                              <div className="text-3xl sm:text-4xl font-black text-f1-red/10 italic">#{expandedDriver}</div>
                            </div>
                           )
                        })()}
                      </div>
                    </div>
                    <div className="lg:col-span-8">
                      <LapTimeChart
                        driverName={`Driver #${expandedDriver}`}
                        laps={liveState.laps.filter((l: any) => l.driver_number === expandedDriver)}
                        height={400}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
