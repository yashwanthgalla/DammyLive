/**
 * DriversListPage - All current F1 drivers roster
 * Premium "Reference Style" Design: Half-body images with team color backgrounds
 * Matches Step 449 reference image exactly.
 */

import { useQuery } from '@tanstack/react-query'
import { getSessions, getDrivers } from '@/api/openf1'
import { Link } from 'react-router-dom'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { ShieldCheck } from 'lucide-react'
import { Driver } from '@/types/f1'
import { getDriverImage } from '@/lib/imageMap'

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
    <div className="min-h-screen bg-[#F8F7F3] text-text-primary">
      <div className="container px-4 sm:px-md py-8 sm:py-12 lg:py-xl">
        {/* Header section — simple as in the ref theme */}
        <div className="mb-12 border-b border-black/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-f1-red text-white text-[10px] font-black uppercase tracking-widest mb-4 rounded-md">
              <ShieldCheck className="w-3 h-3" />
              2026 Season
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none">
              Competitor <span className="text-f1-red">Roster</span>
            </h1>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm font-black uppercase italic">{uniqueDrivers.length} Profiles Loaded</div>
          </div>
        </div>

        {/* Content */}
        {isLoading || !latestSessionKey ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">Establishing Bio-Link...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6">
            {uniqueDrivers.map((driver, idx) => (
              <DriverReferenceCard key={driver.driver_number} driver={driver} idx={idx} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .animate-card-in { 
          animation: card-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: var(--delay);
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

/**
 * ─── DriverReferenceCard ───
 * CLONE of Step 449 reference image.
 * Horizontal orientation, half-body zoomed image, left-aligned text.
 */
function DriverReferenceCard({ driver, idx }: { driver: Driver; idx: number }) {
  const teamColor = driver.team_colour ? `#${driver.team_colour}` : '#ff1801'
  const localImage = getDriverImage(driver.last_name)
  const toDriverId = (d: Driver) => `${d.first_name}_${d.last_name}`.toLowerCase().replace(/ /g, '_')

  return (
    <Link
      to={`/driver/${toDriverId(driver)}`}
      className="group relative flex h-[220px] sm:h-[260px] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 animate-card-in border border-black/5"
      style={{ '--delay': `${Math.min(idx, 10) * 80}ms` } as any}
    >
      {/* ── Background: Team Gradient ── */}
      <div 
        className="absolute inset-0 transition-all duration-700 group-hover:scale-105"
        style={{ 
          background: `linear-gradient(135deg, ${teamColor} 0%, ${teamColor}dd 100%)` 
        }}
      />

      {/* Halftone Dot Pattern (like the ref) */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`, 
          backgroundSize: '8px 8px' 
        }}
      />

      {/* ── Content Layout ── */}
      <div className="relative z-10 w-full h-full flex flex-row">
        
        {/* Left Column: Stats & Name (Reference style) */}
        <div className="w-[60%] sm:w-[55%] p-6 sm:p-8 flex flex-col justify-between text-white">
          <div className="flex flex-col gap-0">
             <span className="text-base sm:text-xl font-bold uppercase tracking-tight leading-none h-fit">
               {driver.first_name}
             </span>
             <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter leading-none mb-1">
               {driver.last_name}
             </h2>
             <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-80 mb-4">
               {driver.team_name}
             </span>
             
             {/* Driver Number — Large but clean as in ref */}
             <div className="text-4xl sm:text-5xl font-black italic opacity-30 tracking-tighter leading-none">
               {driver.driver_number}
             </div>
          </div>

          {/* Bottom Flag — Circular as in Step 449 ref */}
          <div className="mt-auto">
             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                <img 
                  src={`https://purecatamphetamine.github.io/country-flag-icons/1x1/${driver.country_code}.svg`}
                  className="w-full h-full object-cover"
                  alt={driver.country_code}
                  onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')}
                />
             </div>
          </div>
        </div>

        {/* Right Column: Driver Image (ZOOMED to waist UP) */}
        <div className="relative w-[40%] sm:w-[45%] flex items-start justify-center">
          {localImage ? (
            <img
              src={localImage}
              alt={driver.full_name}
              className="absolute top-0 h-[220%] w-auto max-w-none object-contain object-top drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-105 origin-top"
            />
          ) : (
             <img 
               src={driver.headshot_url || ''}
               alt={driver.full_name}
               className="h-[120%] w-auto object-contain object-top grayscale group-hover:grayscale-0 opacity-50"
             />
          )}
        </div>
      </div>

      {/* Decorative side accent */}
      <div className="absolute top-0 right-0 w-2 h-full bg-white/10" />
    </Link>
  )
}
