/**
 * StandingsPage - F1 Championships
 * Luxury Editorial Edition — with full historical year selector (1950 → current)
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
import { getDriverImage, getTeamLogo } from '@/lib/imageMap'

const FIRST_F1_YEAR = 1950
const FIRST_CONSTRUCTOR_YEAR = 1958
const CURRENT_YEAR = new Date().getFullYear()

const ALL_YEARS = Array.from(
  { length: CURRENT_YEAR - FIRST_F1_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
)

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

  const driverStandingsQuery = useQuery({
    queryKey: ['driverStandings', selectedYear],
    queryFn: () => getDriverStandings(selectedYear),
    staleTime: 60 * 60 * 1000,
  })

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
      mercedes: '#27F4D2', ferrari: '#E80020', red_bull: '#3671C6',
      mclaren: '#FF8000', alpine: '#0093CC', aston_martin: '#229971',
      williams: '#64C4FF', haas: '#B6BABD', rb: '#6692FF',
      sauber: '#52E252', audi: '#F5002C', cadillac: '#004A99',
    }
    return mapping[id] || '#6C6863'
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-12 md:py-20 lg:py-32">
        {/* Header Section */}
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#1A1A1A]/10 pb-10">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img src="/F1.svg.png" alt="F1 Logo" className="h-3.5 md:h-4 object-contain" />
              <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                World Championship
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-[#1A1A1A] leading-[0.9] tracking-tight">
              Season <em className="text-[#D4AF37]">{selectedYear}</em>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Year Selector */}
            <div className="relative">
              <button
                onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                className="flex items-center gap-3 px-5 py-3 bg-transparent border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all duration-500 w-full sm:w-auto justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
                  <span className="font-sans text-xs font-medium text-[#1A1A1A] uppercase tracking-[0.15em]">{selectedYear}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#6C6863] transition-transform duration-500 ${yearDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
              </button>

              {yearDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setYearDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 bg-[#F9F8F6] border border-[#1A1A1A]/10 shadow-xl w-[320px] sm:w-[380px] max-h-[400px] overflow-y-auto">
                    <div className="p-4 border-b border-[#1A1A1A]/10 sticky top-0 bg-[#F9F8F6] z-10">
                      <div className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#6C6863]">Select Season</div>
                      <div className="font-sans text-xs text-[#6C6863] mt-1">F1 World Championship · 1950 → {CURRENT_YEAR}</div>
                    </div>
                    <div className="p-3">
                      {Object.entries(DECADES).map(([decade, years]) => (
                        <div key={decade} className="mb-4 last:mb-0">
                          <div className="font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-[#D4AF37] px-2 mb-2">{decade}</div>
                          <div className="grid grid-cols-5 gap-1.5">
                            {years.map((year) => (
                              <button
                                key={year}
                                onClick={() => {
                                  setSelectedYear(year)
                                  setYearDropdownOpen(false)
                                  if (year < FIRST_CONSTRUCTOR_YEAR && standingsType === 'constructors') {
                                    setStandingsType('drivers')
                                  }
                                }}
                                className={`py-2 px-1 font-sans text-xs font-medium transition-all duration-500 text-center ${
                                  year === selectedYear
                                    ? 'bg-[#1A1A1A] text-[#F9F8F6]'
                                    : 'text-[#6C6863] hover:bg-[#EBE5DE] hover:text-[#1A1A1A]'
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
            <div className="flex border border-[#1A1A1A]/10">
              <button
                onClick={() => setStandingsType('drivers')}
                className={`px-6 py-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2 ${
                  standingsType === 'drivers'
                    ? 'bg-[#1A1A1A] text-[#F9F8F6]'
                    : 'text-[#6C6863] hover:text-[#1A1A1A]'
                }`}
              >
                <User className="w-3 h-3" strokeWidth={1.5} />
                Drivers
              </button>
              <button
                onClick={() => {
                  if (selectedYear >= FIRST_CONSTRUCTOR_YEAR) setStandingsType('constructors')
                }}
                className={`px-6 py-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2 ${
                  standingsType === 'constructors'
                    ? 'bg-[#1A1A1A] text-[#F9F8F6]'
                    : selectedYear < FIRST_CONSTRUCTOR_YEAR
                    ? 'text-[#6C6863]/30 cursor-not-allowed'
                    : 'text-[#6C6863] hover:text-[#1A1A1A]'
                }`}
                title={selectedYear < FIRST_CONSTRUCTOR_YEAR ? `Constructor championship started in ${FIRST_CONSTRUCTOR_YEAR}` : ''}
              >
                <Building2 className="w-3 h-3" strokeWidth={1.5} />
                Teams
              </button>
            </div>
          </div>
        </div>

        {/* Era Badge */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#6C6863] flex items-center gap-2 border border-[#1A1A1A]/10 px-4 py-2">
            <Trophy className="w-3 h-3 text-[#D4AF37]" strokeWidth={1.5} />
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
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
              Retrieving {selectedYear} data...
            </p>
          </div>
        ) : data.length > 0 ? (
          <div className="border-t border-[#1A1A1A]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#6C6863] border-b border-[#1A1A1A]/10">
                  <th className="px-4 py-5 text-left w-20">Pos</th>
                  <th className="px-4 py-5 text-left">Competitor</th>
                  <th className="px-4 py-5 text-left hidden sm:table-cell w-[180px]">Team</th>
                  <th className="px-4 py-5 text-right w-24">Points</th>
                  <th className="px-4 py-5 text-right w-20">Wins</th>
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
                      className="border-b border-[#1A1A1A]/5 group hover:bg-[#1A1A1A]/[0.02] transition-colors duration-500"
                    >
                      <td className="px-4 py-6">
                        <span className={`font-serif text-2xl tracking-tight ${pos <= 3 ? 'text-[#D4AF37]' : 'text-[#1A1A1A]'}`}>
                          {pos.toString().padStart(2, '0')}
                        </span>
                      </td>
                      
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-4">
                          {/* Driver image — grayscale default, color on hover */}
                          <div className="w-12 h-12 sm:w-14 sm:h-14 relative overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] bg-[#EBE5DE] flex items-center justify-center">
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 z-20" style={{ backgroundColor: teamColor }} />
                            
                            {standingsType === 'drivers' ? (
                              getDriverImage(standing.driver.familyName) ? (
                                <div className="relative w-full h-full">
                                  <img 
                                    src={getDriverImage(standing.driver.familyName)!}
                                    className="absolute top-0 h-[320%] w-auto max-w-none object-contain object-top mt-1 grayscale group-hover:grayscale-0 transition-all duration-[1500ms] group-hover:scale-105"
                                    alt={standing.driver.familyName}
                                  />
                                </div>
                              ) : (
                                <UserCircle2 className="w-6 h-6 text-[#1A1A1A]/10" strokeWidth={1} />
                              )
                            ) : (
                              getTeamLogo(standing.constructor.name) ? (
                                <img src={getTeamLogo(standing.constructor.name)!} alt={standing.constructor.name} className="w-8 h-8 object-contain brightness-0" />
                              ) : (
                                <Building2 className="w-6 h-6 text-[#1A1A1A]/10" strokeWidth={1} />
                              )
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-serif text-base sm:text-lg text-[#1A1A1A] leading-none truncate">
                              {standingsType === 'drivers' ? (
                                <Link
                                  to={`/driver/${standing.driver.givenName.toLowerCase()}_${standing.driver.familyName.toLowerCase().replace(/ /g, '_')}`}
                                  className="hover:text-[#D4AF37] transition-colors duration-500"
                                >
                                  <span className="text-[#6C6863]">{standing.driver.givenName}</span>{' '}
                                  {standing.driver.familyName}
                                </Link>
                              ) : (
                                <Link
                                  to={`/constructor/${standing.constructor.constructorId}`}
                                  className="hover:text-[#D4AF37] transition-colors duration-500"
                                >
                                  {standing.constructor.name}
                                </Link>
                              )}
                            </div>
                            <div className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863] mt-1.5">
                              {standingsType === 'drivers' ? standing.driver.nationality : standing.constructor.nationality}
                            </div>
                            {standingsType === 'drivers' && (
                              <div className="sm:hidden flex items-center gap-1.5 mt-1">
                                <div className="w-0.5 h-3" style={{ backgroundColor: teamColor }} />
                                <span className="font-sans text-[9px] font-medium uppercase text-[#6C6863]">{standing.constructor.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {standingsType === 'drivers' && (
                        <td className="px-4 py-6 hidden sm:table-cell">
                          <div className="flex items-center gap-3">
                            {getTeamLogo(standing.constructor.name) ? (
                              <img src={getTeamLogo(standing.constructor.name)!} alt={standing.constructor.name} className="w-5 h-5 object-contain brightness-0" />
                            ) : (
                              <div className="w-0.5 h-5" style={{ backgroundColor: teamColor }} />
                            )}
                            <Link
                              to={`/constructor/${standing.constructor.constructorId}`}
                              className="font-sans text-xs font-medium text-[#6C6863] uppercase tracking-[0.1em] hover:text-[#D4AF37] transition-colors duration-500"
                            >
                              {standing.constructor.name}
                            </Link>
                          </div>
                        </td>
                      )}

                      <td className="px-4 py-6 text-right">
                        <div className="font-serif text-xl text-[#1A1A1A] tabular-nums">
                          {standing.points}
                        </div>
                      </td>

                      <td className="px-4 py-6 text-right">
                        <div className={`font-sans text-xs font-medium uppercase tracking-[0.1em] ${parseInt(standing.wins) > 0 ? 'text-[#D4AF37]' : 'text-[#1A1A1A]/15'}`}>
                          {standing.wins}W
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center border-t border-[#1A1A1A]/10">
            <Trophy className="w-10 h-10 text-[#1A1A1A]/10 mx-auto mb-6" strokeWidth={1} />
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3">No Data Available</h3>
            <p className="font-sans text-sm text-[#6C6863]">
              {selectedYear === CURRENT_YEAR 
                ? 'Season has not started yet.'
                : `Standings data for ${selectedYear} is not available.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
