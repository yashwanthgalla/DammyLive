/**
 * CircuitsListPage - All F1 Circuits (1950 → Present)
 * Premium Minimalist Red Edition — matching driver page quality
 */

import { useQuery } from '@tanstack/react-query'
import { getCircuits, getCurrentSeasonCircuits } from '@/api/jolpica'
import { Link } from 'react-router-dom'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useState, useMemo } from 'react'
import { Search, MapPin, Route, ChevronRight, Globe, Filter } from 'lucide-react'
import { Circuit } from '@/types/f1'
import { getTrackBlueprint, getTrackImage } from '@/lib/imageMap'

type ViewFilter = 'current' | 'all'

export default function CircuitsListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewFilter, setViewFilter] = useState<ViewFilter>('current')
  const [countryFilter, setCountryFilter] = useState<string>('all')

  // Fetch current season circuits
  const { data: currentCircuits, isLoading: currentLoading } = useQuery({
    queryKey: ['currentSeasonCircuits'],
    queryFn: () => getCurrentSeasonCircuits(),
    staleTime: 24 * 60 * 60 * 1000,
  })

  // Fetch ALL historical circuits
  const { data: allCircuits, isLoading: allLoading } = useQuery({
    queryKey: ['allHistoricalCircuits'],
    queryFn: () => getCircuits(),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: viewFilter === 'all',
  })

  const isLoading = viewFilter === 'current' ? currentLoading : allLoading
  const circuits = viewFilter === 'current' ? (currentCircuits || []) : (allCircuits || [])

  // Get unique countries for filter
  const countries = useMemo(() => {
    const set = new Set<string>()
    circuits.forEach((c: Circuit) => { if (c.country) set.add(c.country) })
    return Array.from(set).sort()
  }, [circuits])

  // Filter circuits
  const filteredCircuits = useMemo(() => {
    return circuits.filter((circuit: Circuit) => {
      const matchesSearch =
        circuit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        circuit.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        circuit.country?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCountry = countryFilter === 'all' || circuit.country === countryFilter
      return matchesSearch && matchesCountry
    })
  }, [circuits, searchTerm, countryFilter])

  // Group by country for the "all" view
  const groupedByCountry = useMemo(() => {
    if (viewFilter !== 'all') return null
    const groups: Record<string, Circuit[]> = {}
    filteredCircuits.forEach((c: Circuit) => {
      const country = c.country || 'Unknown'
      if (!groups[country]) groups[country] = []
      groups[country].push(c)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredCircuits, viewFilter])

  return (
    <div className="min-h-screen bg-bg">
      <div className="container px-4 sm:px-md py-8 sm:py-12 lg:py-xl">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 border-b border-border pb-6 sm:pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-f1-red text-white text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4 rounded-lg">
                <Globe className="w-3 h-3" />
                {viewFilter === 'current' ? 'Current Season' : 'All Time • 1950 → Present'}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase italic leading-none">
                Grand Prix <br />
                <span className="text-f1-red">Circuits</span>
              </h1>
              <p className="text-text-muted text-sm font-medium mt-2">
                {filteredCircuits.length} venue{filteredCircuits.length !== 1 ? 's' : ''} • {countries.length} countr{countries.length !== 1 ? 'ies' : 'y'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* View Toggle */}
              <div className="flex p-1 bg-bg-subtle rounded-xl border border-border">
                <button
                  onClick={() => { setViewFilter('current'); setCountryFilter('all') }}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                    viewFilter === 'current'
                      ? 'bg-f1-red text-white shadow-md'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Route className="w-3 h-3" />
                  Current
                </button>
                <button
                  onClick={() => setViewFilter('all')}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                    viewFilter === 'all'
                      ? 'bg-f1-red text-white shadow-md'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  All Time
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filter Row */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-f1-red transition-colors pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search by circuit name, city, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3.5 pr-4 pl-14 bg-white border border-border rounded-xl focus:outline-none focus:border-f1-red focus:ring-1 focus:ring-f1-red/10 transition-all text-text-primary placeholder:text-text-muted font-medium text-sm"
              />
            </div>

            {/* Country Filter */}
            {countries.length > 1 && (
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none z-10" />
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="appearance-none w-full sm:w-[200px] py-3.5 pr-10 pl-12 bg-white border border-border rounded-xl focus:outline-none focus:border-f1-red text-sm font-bold uppercase text-text-primary cursor-pointer"
                >
                  <option value="all">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted rotate-90 pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">
              {viewFilter === 'all' ? 'Loading All Historical Tracks...' : 'Scanning Global Track Data...'}
            </p>
          </div>
        ) : filteredCircuits.length > 0 ? (
          viewFilter === 'all' && groupedByCountry ? (
            // Grouped view for All-Time
            <div className="space-y-10 sm:space-y-14">
              {groupedByCountry.map(([country, countryCircuits]) => (
                <div key={country}>
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-1 h-8 bg-f1-red rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-black text-text-primary uppercase italic tracking-tight">
                      {country}
                    </h2>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-bg-subtle px-3 py-1 rounded-lg border border-border">
                      {countryCircuits.length} Track{countryCircuits.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {countryCircuits.map((circuit: Circuit, idx: number) => (
                      <CircuitCard key={circuit.circuitId} circuit={circuit} idx={idx} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Grid view for current season
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredCircuits.map((circuit: Circuit, idx: number) => (
                <CircuitCard key={circuit.circuitId} circuit={circuit} idx={idx} />
              ))}
            </div>
          )
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-2xl bg-bg-subtle">
            <h3 className="text-xl font-black text-text-primary uppercase italic mb-2">No Tracks Found</h3>
            <p className="text-text-secondary font-black uppercase tracking-widest text-xs mb-6">
              {searchTerm ? 'No circuits match your search' : 'Data unavailable'}
            </p>
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setCountryFilter('all') }}
                className="text-f1-red text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-f1-red pb-1 hover:text-text-primary hover:border-text-primary transition-colors"
              >
                Reset Search
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: var(--delay); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

/** ─── Circuit Card Component ─── */
function CircuitCard({ circuit, idx }: { circuit: Circuit; idx: number }) {
  const blueprint = getTrackBlueprint(circuit.circuitId)
  const trackPhoto = getTrackImage(circuit.circuitId)

  // Generate a subtle color for the top accent bar based on circuit name
  const getAccentColor = (name: string) => {
    const colors = [
      '#E80020', '#3671C6', '#FF8000', '#27F4D2',
      '#229971', '#0093CC', '#6692FF', '#64C4FF',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  const accentColor = getAccentColor(circuit.name || '')

  return (
    <Link
      to={`/circuit/${circuit.circuitId}`}
      className="group bg-white border border-border rounded-2xl overflow-hidden hover:border-f1-red/30 hover:shadow-xl transition-all duration-300 flex flex-col animate-slide-up"
      style={{ '--delay': `${Math.min(idx, 12) * 40}ms` } as any}
    >
      {/* Accent bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />

      {/* Track visual area */}
      <div className="relative h-36 sm:h-44 bg-gradient-to-br from-bg-subtle to-white flex items-center justify-center overflow-hidden">
        {/* Background: track photo if available */}
        {trackPhoto && (
          <img
            src={trackPhoto}
            alt={`${circuit.name} aerial`}
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          />
        )}

        {/* Blueprint image or fallback icon */}
        {blueprint ? (
          <img
            src={blueprint}
            alt={`${circuit.name} layout`}
            className="relative z-10 h-[80%] w-auto max-w-[85%] object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm"
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border-2 group-hover:scale-110 transition-all duration-300"
              style={{ borderColor: accentColor, backgroundColor: `${accentColor}10` }}
            >
              <Route className="w-6 h-6 sm:w-7 sm:h-7 transition-colors" style={{ color: accentColor }} />
            </div>
          </div>
        )}

        {/* Country badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/80 backdrop-blur-sm border border-border rounded-lg text-[8px] font-black uppercase tracking-widest text-text-muted z-20">
          {circuit.country}
        </div>

        {/* Blueprint badge if available */}
        {blueprint && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg text-[7px] font-black uppercase tracking-widest text-white/80 z-20">
            Circuit Layout
          </div>
        )}
      </div>

      {/* Circuit info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Circuit name — large and bold like driver names */}
        <h2 className="text-base sm:text-lg font-black text-text-primary uppercase italic leading-tight group-hover:text-f1-red transition-colors mb-2">
          {circuit.name}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-tight">
          <MapPin className="w-3 h-3 text-f1-red flex-shrink-0" />
          <span className="truncate">{circuit.location}, <span className="text-text-muted">{circuit.country}</span></span>
        </div>

        {/* Bottom action */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between group-hover:border-f1-red/20 transition-colors">
          <span className="text-[9px] font-black text-text-muted uppercase tracking-widest group-hover:text-f1-red transition-colors">
            Full Details
          </span>
          <ChevronRight className="w-4 h-4 text-f1-red translate-x-[-8px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
        </div>
      </div>
    </Link>
  )
}
