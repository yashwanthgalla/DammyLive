/**
 * LivePage - Real-time F1 Session Dashboard
 * Luxury Editorial Edition — with auth gate & responsive design
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
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-8">
        <div className="max-w-lg w-full text-center">
          <div className="p-12 md:p-16 border-t border-[#1A1A1A]">
            <Lock className="w-8 h-8 text-[#D4AF37] mx-auto mb-8" strokeWidth={1.5} />
            <div className="flex items-center gap-4 justify-center mb-8">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                Authentication Required
              </span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] leading-[0.9] mb-4">
              Live <em className="text-[#D4AF37]">Session</em>
            </h1>
            <p className="font-sans text-sm text-[#6C6863] mb-10 leading-relaxed">
              Sign in to view real-time telemetry and live timing data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="btn-primary">
                <span className="flex items-center gap-2">
                  Sign In
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </span>
              </Link>
              <Link to="/schedule" className="btn-secondary text-center">Schedule</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle missing session key
  if (!sessionKey || isNaN(parseInt(sessionKey))) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-32 text-center">
        <div className="max-w-md mx-auto p-12 border-t border-[#1A1A1A]">
          <h1 className="font-serif text-2xl text-[#1A1A1A] mb-3">Session Not Found</h1>
          <p className="font-sans text-sm text-[#6C6863] mb-8">No valid session key detected.</p>
          <Link to="/schedule" className="btn-primary w-full"><span>Return to Schedule</span></Link>
        </div>
      </div>
    )
  }

  const sessionKeyNum = parseInt(sessionKey)

  const sessionQuery = useQuery({
    queryKey: ['session', sessionKeyNum],
    queryFn: () => getSession(sessionKeyNum),
    staleTime: 10 * 60 * 1000,
  })

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
    <div className="min-h-screen bg-[#F9F8F6] pb-16 md:pb-32">
      {/* Session Header */}
      <div className="border-b border-[#1A1A1A]/10 mb-8 md:mb-16">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-6 md:py-10">
          <Link to="/schedule" className="inline-flex items-center gap-2 font-sans text-[10px] font-medium uppercase text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500 mb-6 md:mb-8">
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            Schedule
          </Link>

          {session && (
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.2em] ${
                    isPast ? 'bg-transparent border border-[#1A1A1A]/10 text-[#6C6863]' : 'bg-[#D4AF37] text-[#1A1A1A]'
                  }`}>
                    {isPast ? 'Final Classification' : 'Live'}
                  </div>
                </div>
                <h1 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] leading-[0.9] tracking-tight mb-3">
                  {session.session_name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 font-sans text-[10px] font-medium text-[#6C6863] uppercase tracking-[0.2em]">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" strokeWidth={1.5} />
                    {session.location} ({session.country_code})
                  </div>
                  <div className="flex items-center gap-1.5 font-sans text-[10px] font-medium text-[#6C6863] uppercase tracking-[0.2em]">
                    <Clock className="w-3 h-3 text-[#D4AF37]" strokeWidth={1.5} />
                    {formatSessionDateTime(session.date_start, session.gmt_offset)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 md:p-6 border border-[#1A1A1A]/10">
                <div className="text-right">
                  <div className="font-sans text-[9px] font-medium text-[#6C6863] uppercase tracking-[0.25em] mb-1">
                    {isPast ? 'Status' : 'Feed'}
                  </div>
                  <div className={`font-sans text-[10px] font-medium uppercase tracking-[0.15em] ${
                    isPast ? 'text-[#1A1A1A]' : (liveState.isConnected ? 'text-[#D4AF37]' : 'text-[#6C6863] animate-pulse')
                  }`}>
                    {isPast ? 'Archived' : (liveState.isConnected ? 'Synchronized' : 'Connecting...')}
                  </div>
                </div>
                <div className="w-px h-8 bg-[#1A1A1A]/10" />
                <div>
                  <div className="font-sans text-[9px] font-medium text-[#6C6863] uppercase tracking-[0.25em] mb-1">Mode</div>
                  <div className="font-serif text-lg text-[#1A1A1A] flex items-center gap-2">
                    {isPast ? (
                      <Trophy className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                    ) : (
                      <Radio className={`w-4 h-4 ${liveState.isConnected ? 'text-[#D4AF37] animate-pulse' : 'text-[#6C6863]'}`} strokeWidth={1.5} />
                    )}
                    <span className="hidden sm:inline font-sans text-xs font-medium uppercase tracking-[0.15em]">
                      {isPast ? 'Classification' : 'Live'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 md:px-16">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {liveState.error && !isLoading && (
          <div className="mb-8 p-6 border-l-2 border-l-[#D4AF37] border border-[#1A1A1A]/10 flex items-center gap-4">
            <Zap className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
            <div>
              <div className="font-sans text-xs font-medium text-[#D4AF37] uppercase tracking-[0.2em] mb-1">System Alert</div>
              <p className="font-sans text-sm text-[#1A1A1A]">Connection interrupted</p>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        {!isLoading && (
          <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
            {/* Weather */}
            <div className="lg:col-span-12">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                <h2 className="font-serif text-xl text-[#1A1A1A]">Conditions</h2>
              </div>
              <WeatherOverlay weather={liveState.weather} />
            </div>

            {/* Live Table */}
            <div className="lg:col-span-12 overflow-x-auto">
              <div className="flex items-center gap-3 mb-6">
                <Radio className="w-4 h-4 text-[#D4AF37] animate-pulse" strokeWidth={1.5} />
                <h2 className="font-serif text-xl text-[#1A1A1A]">Live Timing</h2>
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

            {/* Strategy */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                <h2 className="font-serif text-xl text-[#1A1A1A]">Strategy</h2>
              </div>
              <div className="border-t border-[#1A1A1A] p-4 md:p-8">
                <StrategyGraph positions={liveState.positions} laps={liveState.laps} height={350} />
              </div>
            </div>

            {/* Pit Stops */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                <h2 className="font-serif text-xl text-[#1A1A1A]">Pit Stops</h2>
              </div>
              <div className="border-t border-[#1A1A1A] p-4 md:p-8 h-[300px] md:h-[400px] overflow-y-auto">
                <PitStopList pitStops={liveState.pitStops} maxItems={20} />
              </div>
            </div>

            {/* Expanded Driver */}
            {expandedDriver && (
              <div className="lg:col-span-12 mt-6 md:mt-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-center font-sans text-xs font-medium">
                    {expandedDriver}
                  </div>
                  <h2 className="font-serif text-xl text-[#1A1A1A]">Driver Telemetry</h2>
                </div>
                <div className="border-t border-[#1A1A1A] p-6 md:p-10">
                  <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                    <div className="lg:col-span-4">
                      <div className="aspect-[3/4] bg-[#EBE5DE] flex items-center justify-center overflow-hidden relative shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] group">
                        {(() => {
                          const driver = driversQuery.data?.find(d => d.driver_number === expandedDriver)
                          const image = driver ? getDriverImage(driver.last_name) : null
                          return image ? (
                            <img 
                              src={image}
                              className="absolute top-0 h-[200%] w-auto max-w-none object-contain object-top mt-4 grayscale group-hover:grayscale-0 transition-all duration-[1500ms]"
                              alt={driver?.last_name}
                            />
                          ) : (
                            <span className="font-serif text-5xl text-[#1A1A1A]/5 italic">#{expandedDriver}</span>
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
    </div>
  )
}
