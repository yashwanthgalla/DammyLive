/**
 * StandingsPage - F1 Championships
 * Minimalist Red Edition — with full historical year selector (1950 → current)
 */

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  getDriverStandings,
  getConstructorStandings,
} from '@/api/jolpica'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { User, Building2, Trophy, UserCircle2, ChevronDown, Calendar } from 'lucide-react'
import { getDriverImage } from '@/lib/imageMap'

// F1 started in 1950. Constructor championship started in 1958.
const FIRST_F1_YEAR = 1950
const FIRST_CONSTRUCTOR_YEAR = 1958
const CURRENT_YEAR = new Date().getFullYear()

// Generate all years from current year down to 1950
const ALL_YEARS = Array.from(
  { length: CURRENT_YEAR - FIRST_F1_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
)

// Group years by decade for the dropdown
const DECADES = ALL_YEARS.reduce<Record<string, number[]>>((acc, year) => {
  const decade = `${Math.floor(year / 10) * 10}s`
  if (!acc[decade]) acc[decade] = []
  acc[decade].push(year)
  return acc
}, {})

export default function StandingsPage() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const [standingsType, setStandingsType] = useState<'drivers' | 'constructors'>('drivers')
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)

  // Fetch driver standings
  const driverStandingsQuery = useQuery({
    queryKey: ['driverStandings', selectedYear],
    queryFn: () => getDriverStandings(selectedYear),
    staleTime: 60 * 60 * 1000,
  })

  // Fetch constructor standings
  const constructorStandingsQuery = useQuery({
    queryKey: ['constructorStandings', selectedYear],
    queryFn: () => getConstructorStandings(selectedYear),
    staleTime: 60 * 60 * 1000,
    enabled: selectedYear >= FIRST_CONSTRUCTOR_YEAR,
  })

  const isLoading =
    (standingsType === 'drivers' && driverStandingsQuery.isLoading) ||
    (standingsType === 'constructors' && constructorStandingsQuery.isLoading)

  const drivers = driverStandingsQuery.data || []
  const constructors = constructorStandingsQuery.data || []

  const data = standingsType === 'drivers' ? drivers : constructors

  const getTeamColor = (id: string) => {
    const mapping: Record<string, string> = {
      mercedes: '#27F4D2',
      ferrari: '#E80020',
      red_bull: '#3671C6',
      mclaren: '#FF8000',
      alpine: '#0093CC',
      aston_martin: '#229971',
      williams: '#64C4FF',
      haas: '#B6BABD',
      rb: '#6692FF',
      sauber: '#52E252',
    }
    return mapping[id] || '#8d8d95'
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container px-4 sm:px-md py-8 sm:py-12 lg:py-xl">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8 border-b border-border pb-6 sm:pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-f1-red/10 text-f1-red text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4 rounded-lg">
              World Championship
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase italic leading-none">
              Season <span className="text-f1-red">{selectedYear}</span> <br />
              {standingsType === 'drivers' ? 'Driver' : 'Constructor'} Status
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Year Selector */}
            <div className="relative">
              <button
                onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                className="flex items-center gap-3 px-5 py-3 bg-white border-2 border-border rounded-xl hover:border-text-primary transition-all w-full sm:w-auto justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-f1-red" />
                  <span className="text-sm font-black text-text-primary uppercase italic">{selectedYear}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${yearDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Year Dropdown */}
              {yearDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setYearDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 bg-white border-2 border-border rounded-2xl shadow-xl w-[320px] sm:w-[380px] max-h-[400px] overflow-y-auto">
                    <div className="p-4 border-b border-border sticky top-0 bg-white rounded-t-2xl z-10">
                      <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Select Season</div>
                      <div className="text-xs font-bold text-text-secondary mt-1">F1 World Championship • 1950 → {CURRENT_YEAR}</div>
                    </div>
                    <div className="p-3">
                      {Object.entries(DECADES).map(([decade, years]) => (
                        <div key={decade} className="mb-4 last:mb-0">
                          <div className="text-[9px] font-black text-f1-red uppercase tracking-widest px-2 mb-2">{decade}</div>
                          <div className="grid grid-cols-5 gap-1.5">
                            {years.map((year) => (
                              <button
                                key={year}
                                onClick={() => {
                                  setSelectedYear(year)
                                  setYearDropdownOpen(false)
                                  // Auto-switch to drivers if constructor standings not available
                                  if (year < FIRST_CONSTRUCTOR_YEAR && standingsType === 'constructors') {
                                    setStandingsType('drivers')
                                  }
                                }}
                                className={`py-2 px-1 text-xs font-black rounded-lg transition-all text-center ${
                                  year === selectedYear
                                    ? 'bg-f1-red text-white shadow-md'
                                    : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                                }`}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Type Toggles */}
            <div className="flex p-1 bg-bg-subtle rounded-xl border border-border">
              <button
                onClick={() => setStandingsType('drivers')}
                className={`px-5 sm:px-8 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                  standingsType === 'drivers'
                    ? 'bg-f1-red text-white shadow-md'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <User className="w-3 h-3" />
                Drivers
              </button>
              <button
                onClick={() => {
                  if (selectedYear >= FIRST_CONSTRUCTOR_YEAR) {
                    setStandingsType('constructors')
                  }
                }}
                className={`px-5 sm:px-8 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                  standingsType === 'constructors'
                    ? 'bg-f1-red text-white shadow-md'
                    : selectedYear < FIRST_CONSTRUCTOR_YEAR
                    ? 'text-text-muted/30 cursor-not-allowed'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                title={selectedYear < FIRST_CONSTRUCTOR_YEAR ? `Constructor championship started in ${FIRST_CONSTRUCTOR_YEAR}` : ''}
              >
                <Building2 className="w-3 h-3" />
                Teams
              </button>
            </div>
          </div>
        </div>

        {/* Era Badge */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-subtle border border-border rounded-lg text-[10px] font-black text-text-muted uppercase tracking-widest">
            <Trophy className="w-3 h-3 text-f1-red" />
            {selectedYear >= 2022 ? 'Ground Effect Era' :
             selectedYear >= 2014 ? 'Turbo Hybrid Era' :
             selectedYear >= 2006 ? 'V8 Era' :
             selectedYear >= 2000 ? 'V10 Era' :
             selectedYear >= 1989 ? 'V10/V12 Era' :
             selectedYear >= 1977 ? 'Ground Effect / Turbo Era' :
             selectedYear >= 1966 ? '3-Litre Era' :
             selectedYear >= 1961 ? '1.5-Litre Era' :
             selectedYear >= 1954 ? '2.5-Litre Era' :
             'Inaugural Era'}
          </div>
          {selectedYear < FIRST_CONSTRUCTOR_YEAR && standingsType === 'constructors' && (
            <div className="text-[10px] font-bold text-f1-red uppercase tracking-wider">
              Constructor championship not available before {FIRST_CONSTRUCTOR_YEAR}
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">Retrieving {selectedYear} Grid Data...</p>
          </div>
        ) : data.length > 0 ? (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Table */}
            <div className="lg:col-span-12 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-bg-subtle text-[10px] font-black uppercase tracking-widest text-text-muted border-b border-border">
                    <th className="px-4 py-4 text-left w-20">POS</th>
                    <th className="px-4 py-4 text-left">Competitor</th>
                    <th className="px-4 py-4 text-left hidden sm:table-cell w-[180px]">Team</th>
                    <th className="px-4 py-4 text-right w-24">Points</th>
                    <th className="px-4 py-4 text-right w-20">Wins</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((standing: any, idx: number) => {
                    const pos = parseInt(standing.position)
                    const constructorId = standing.constructor?.constructorId || ''
                    const teamColor = getTeamColor(constructorId)
                    
                    return (
                      <tr 
                        key={idx}
                        className="f1-table-row border-b border-border group"
                      >
                        <td className="px-4 py-6">
                           <span className={`text-2xl font-black italic tracking-tighter ${pos <= 3 ? 'text-f1-red' : 'text-text-primary'}`}>
                               {pos.toString().padStart(2, '0')}
                           </span>
                        </td>
                        
                        <td className="px-4 py-6">
                            <div className="flex items-center gap-4">
                                {/* Driver Face Portrait (ZOOMED TO FACE ONLY) */}
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-bg-subtle border border-border rounded-2xl flex items-center justify-center text-text-muted group-hover:bg-white transition-all overflow-hidden relative shadow-sm">
                                    {standingsType === 'drivers' ? (
                                      getDriverImage(standing.driver.familyName) ? (
                                        <img 
                                          src={getDriverImage(standing.driver.familyName)!}
                                          className="absolute top-0 h-[350%] w-auto max-w-none object-contain object-top mt-1"
                                          alt={standing.driver.familyName}
                                        />
                                      ) : (
                                        <UserCircle2 className="w-8 h-8 opacity-10" />
                                      )
                                    ) : (
                                      <Building2 className="w-8 h-8 opacity-10" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-base sm:text-lg font-black text-text-primary uppercase italic leading-none transition-colors truncate">
                                        {standingsType === 'drivers' ? (
                                            <Link
                                              to={`/driver/${standing.driver.driverId}`}
                                              className="hover:text-f1-red transition-colors"
                                            >
                                              <span className="opacity-60">{standing.driver.givenName}</span> <span className="text-f1-red">{standing.driver.familyName}</span>
                                            </Link>
                                        ) : (
                                            <Link
                                              to={`/constructor/${standing.constructor.constructorId}`}
                                              className="hover:text-f1-red transition-colors"
                                            >
                                              {standing.constructor.name}
                                            </Link>
                                        )}
                                    </div>
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                                        <img 
                                          src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${standing.driver?.nationality === 'British' ? 'GB' : standing.driver?.nationality === 'Monegasque' ? 'MC' : standing.driver?.nationality === 'Italian' ? 'IT' : 'UN'}.svg`}
                                          className="w-3 h-2 block"
                                          onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                        {standingsType === 'drivers' ? standing.driver.nationality : standing.constructor.nationality}
                                    </div>
                                    {/* Show team on mobile for drivers */}
                                    {standingsType === 'drivers' && (
                                      <div className="sm:hidden flex items-center gap-1.5 mt-1">
                                        <div className="w-1 h-3 rounded-full" style={{ backgroundColor: teamColor }} />
                                        <span className="text-[9px] font-bold uppercase text-text-muted">{standing.constructor.name}</span>
                                      </div>
                                    )}
                                </div>
                            </div>
                        </td>

                        {standingsType === 'drivers' && (
                            <td className="px-4 sm:px-6 py-4 sm:py-6 hidden sm:table-cell">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: teamColor }} />
                                    <Link
                                      to={`/constructor/${standing.constructor.constructorId}`}
                                      className="text-[11px] font-black uppercase italic text-text-secondary tracking-tight hover:text-f1-red transition-colors"
                                    >
                                        {standing.constructor.name}
                                    </Link>
                                </div>
                            </td>
                        )}

                        <td className="px-4 sm:px-6 py-4 sm:py-6 text-right">
                           <div className="text-lg sm:text-xl font-black text-text-primary tabular-nums tracking-tighter">
                               {standing.points}
                           </div>
                        </td>

                        <td className="px-4 sm:px-6 py-4 sm:py-6 text-right">
                           <div className={`text-xs font-black italic uppercase ${parseInt(standing.wins) > 0 ? 'text-f1-red' : 'text-text-muted/30'}`}>
                                {standing.wins}W
                           </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
            <div className="py-32 text-center border-2 border-dashed border-border rounded-2xl">
                <Trophy className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-black text-text-primary uppercase italic mb-2">No Data Available</h3>
                <p className="text-text-secondary text-sm">
                  {selectedYear === CURRENT_YEAR 
                    ? 'Season has not started yet. Check back after the first race.'
                    : `Standings data for ${selectedYear} is not available.`}
                </p>
            </div>
        )}
      </div>

       <style>{`
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
