/**
 * DriversListPage — All current F1 drivers
 * Luxury Editorial Edition — Grayscale portraits with team color accents
 */

import { useQuery } from '@tanstack/react-query'
import { getSessions, getDrivers } from '@/api/openf1'
import { Link } from 'react-router-dom'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Driver } from '@/types/f1'
import { getDriverImage, getTeamLogo } from '@/lib/imageMap'

export default function DriversListPage() {
  const currentYear = new Date().getFullYear()

  const { data: sessions } = useQuery({
    queryKey: ['sessions_for_drivers_v2'],
    queryFn: () => getSessions(currentYear),
    staleTime: 60 * 60 * 1000,
  })

  const latestSessionKey = sessions && sessions.length > 0
    ? [...sessions].sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime())[0]?.session_key
    : null

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['drivers_list_v2', latestSessionKey],
    queryFn: () => getDrivers(latestSessionKey!),
    staleTime: 60 * 60 * 1000,
    enabled: !!latestSessionKey,
  })

  const uniqueDrivers = (drivers || []).reduce((acc: Driver[], current: Driver) => {
    if (!acc.find(d => d.driver_number === current.driver_number)) acc.push(current)
    return acc
  }, []).sort((a, b) => a.driver_number - b.driver_number)

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-12 md:py-20 lg:py-32">
        {/* Header */}
        <div className="mb-16 md:mb-24 border-b border-[#1A1A1A]/10 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
              2026 Season
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-[#1A1A1A] leading-[0.9] tracking-tight">
            <em className="text-[#D4AF37]">Drivers</em>
          </h1>
        </div>

        {/* Content */}
        {isLoading || !latestSessionKey ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {uniqueDrivers.map((driver, idx) => (
              <DriverEditorialCard key={driver.driver_number} driver={driver} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * DriverEditorialCard — Grayscale portrait, color on hover, team accent line
 */
function DriverEditorialCard({ driver, idx }: { driver: Driver; idx: number }) {
  const teamColor = driver.team_colour ? `#${driver.team_colour}` : '#1A1A1A'
  const localImage = getDriverImage(driver.last_name)
  const toDriverId = (d: Driver) => `${d.first_name}_${d.last_name}`.toLowerCase().replace(/ /g, '_')

  return (
    <Link
      to={`/driver/${toDriverId(driver)}`}
      className="group border-t border-[#1A1A1A]/10 relative overflow-hidden"
      style={{ animationDelay: `${Math.min(idx, 10) * 60}ms` }}
    >
      {/* Image area — portrait aspect ratio, grayscale → color */}
      <div className="aspect-[3/4] relative overflow-hidden bg-[#EBE5DE]">
        {localImage ? (
          <img
            src={localImage}
            alt={driver.full_name}
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[180%] w-auto max-w-none object-contain object-top grayscale group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-105"
          />
        ) : driver.headshot_url ? (
          <img 
            src={driver.headshot_url}
            alt={driver.full_name}
            className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-[2000ms] opacity-60 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-serif text-8xl text-[#1A1A1A]/5">{driver.driver_number}</span>
          </div>
        )}

        {/* Shadow overlay for depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]" />

        {/* Team color accent bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: teamColor }} />

        {/* Vertical text label — Signature editorial element */}
        <div
          className="hidden md:block absolute left-4 bottom-4 font-sans text-[8px] font-medium uppercase tracking-[0.3em] text-[#1A1A1A]/20 group-hover:text-[#1A1A1A]/40 transition-colors duration-700"
          style={{ writingMode: 'vertical-rl' }}
        >
          {driver.team_name}
        </div>
      </div>

      {/* Info */}
      <div className="p-6 md:p-8">
        <div className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#6C6863] mb-2">
          #{driver.driver_number} · {driver.country_code}
        </div>
        <h2 className="font-serif text-xl md:text-2xl text-[#1A1A1A] leading-tight group-hover:text-[#D4AF37] transition-colors duration-500">
          <span className="text-[#6C6863]">{driver.first_name}</span>{' '}
          {driver.last_name}
        </h2>
        <div className="font-sans text-xs text-[#6C6863] mt-2 flex items-center gap-2">
          {getTeamLogo(driver.team_name) ? (
            <img src={getTeamLogo(driver.team_name)!} alt={driver.team_name} className="w-4 h-4 object-contain brightness-0" />
          ) : (
            <div className="w-3 h-0.5" style={{ backgroundColor: teamColor }} />
          )}
          {driver.team_name}
        </div>
      </div>
    </Link>
  )
}
