/**
 * CircuitsListPage - All F1 Circuits
 * Luxury Editorial Edition
 */

import { useQuery } from '@tanstack/react-query'
import { getCircuits, getCurrentSeasonCircuits } from '@/api/jolpica'
import { Link } from 'react-router-dom'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useState, useMemo } from 'react'
import { Search, MapPin, Route, ChevronRight, Globe } from 'lucide-react'
import { Circuit } from '@/types/f1'
import { getTrackBlueprint } from '@/lib/imageMap'

type ViewFilter = 'current' | 'all'

export default function CircuitsListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewFilter, setViewFilter] = useState<ViewFilter>('current')
  const [countryFilter, setCountryFilter] = useState<string>('all')

  const { data: currentCircuits, isLoading: currentLoading } = useQuery({
    queryKey: ['currentSeasonCircuits'],
    queryFn: () => getCurrentSeasonCircuits(),
    staleTime: 24 * 60 * 60 * 1000,
  })

  const { data: allCircuits, isLoading: allLoading } = useQuery({
    queryKey: ['allHistoricalCircuits'],
    queryFn: () => getCircuits(),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: viewFilter === 'all',
  })

  const isLoading = viewFilter === 'current' ? currentLoading : allLoading
  const circuits = viewFilter === 'current' ? (currentCircuits || []) : (allCircuits || [])

  const countries = useMemo(() => {
    const set = new Set<string>()
    circuits.forEach((c: Circuit) => { if (c.country) set.add(c.country) })
    return Array.from(set).sort()
  }, [circuits])

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
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-12 md:py-20 lg:py-32">
        {/* Header */}
        <div className="mb-12 md:mb-20 border-b border-[#1A1A1A]/10 pb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                  {viewFilter === 'current' ? 'Current Season' : 'Archive · 1950 → Present'}
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-[#1A1A1A] leading-[0.9] tracking-tight">
                Grand Prix <br />
                <em className="text-[#D4AF37]">Circuits</em>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* View Toggle */}
              <div className="flex border border-[#1A1A1A]/10">
                <button
                  onClick={() => { setViewFilter('current'); setCountryFilter('all') }}
                  className={`px-5 py-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2 ${
                    viewFilter === 'current'
                      ? 'bg-[#1A1A1A] text-[#F9F8F6]'
                      : 'text-[#6C6863] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Route className="w-3 h-3" strokeWidth={1.5} />
                  Current
                </button>
                <button
                  onClick={() => setViewFilter('all')}
                  className={`px-5 py-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2 ${
                    viewFilter === 'all'
                      ? 'bg-[#1A1A1A] text-[#F9F8F6]'
                      : 'text-[#6C6863] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Globe className="w-3 h-3" strokeWidth={1.5} />
                  All Time
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6C6863] pointer-events-none" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search circuits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-8 bg-transparent border-b border-[#1A1A1A]/10 focus:border-[#D4AF37] font-sans text-sm text-[#1A1A1A] placeholder:text-[#6C6863]/50 placeholder:font-serif placeholder:italic outline-none transition-colors duration-500"
              />
            </div>

            {countries.length > 1 && (
              <div className="relative">
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="appearance-none w-full sm:w-[200px] py-3 pr-8 bg-transparent border-b border-[#1A1A1A]/10 focus:border-[#D4AF37] font-sans text-xs font-medium uppercase tracking-[0.15em] text-[#1A1A1A] cursor-pointer outline-none transition-colors duration-500"
                >
                  <option value="all">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6C6863] rotate-90 pointer-events-none" strokeWidth={1.5} />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
          </div>
        ) : filteredCircuits.length > 0 ? (
          viewFilter === 'all' && groupedByCountry ? (
            <div className="space-y-16 md:space-y-24">
              {groupedByCountry.map(([country, countryCircuits]) => (
                <div key={country}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-0.5 h-6 bg-[#D4AF37]" />
                    <h2 className="font-serif text-xl md:text-2xl text-[#1A1A1A]">{country}</h2>
                    <span className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#6C6863] border border-[#1A1A1A]/10 px-3 py-1">
                      {countryCircuits.length} Track{countryCircuits.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
                    {countryCircuits.map((circuit: Circuit) => (
                      <CircuitCard key={circuit.circuitId} circuit={circuit} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
              {filteredCircuits.map((circuit: Circuit) => (
                <CircuitCard key={circuit.circuitId} circuit={circuit} />
              ))}
            </div>
          )
        ) : (
          <div className="py-32 text-center border-t border-[#1A1A1A]/10">
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3">No Tracks Found</h3>
            <p className="font-sans text-sm text-[#6C6863] mb-6">
              {searchTerm ? 'No circuits match your search' : 'Data unavailable'}
            </p>
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setCountryFilter('all') }}
                className="font-sans text-[10px] font-medium text-[#D4AF37] uppercase tracking-[0.2em] hover:text-[#1A1A1A] transition-colors duration-500"
              >
                Reset Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/** Circuit Card — Editorial */
function CircuitCard({ circuit }: { circuit: Circuit }) {
  const blueprint = getTrackBlueprint(circuit.circuitId)

  return (
    <Link
      to={`/circuit/${circuit.circuitId}`}
      className="group border-t border-[#1A1A1A]/10 overflow-hidden flex flex-col transition-all duration-700 hover:bg-[#1A1A1A]/[0.02]"
    >
      {/* Track visual area */}
      <div className="relative h-40 sm:h-48 bg-[#EBE5DE] flex items-center justify-center overflow-hidden p-6">
        {blueprint ? (
          <img
            src={blueprint}
            alt={`${circuit.name} layout`}
            className="relative z-10 w-full h-[80%] max-w-[85%] object-contain group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="relative z-10">
            <Route className="w-10 h-10 text-[#1A1A1A]/10 group-hover:text-[#D4AF37]/30 transition-colors duration-700" strokeWidth={1} />
          </div>
        )}

        {/* Country label */}
        <div className="absolute top-4 right-4 font-sans text-[8px] font-medium uppercase tracking-[0.25em] text-[#1A1A1A]/30 z-20">
          {circuit.country}
        </div>
        
        {/* Inset shadow */}
        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]" />
      </div>

      {/* Circuit info */}
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <h2 className="font-serif text-base md:text-lg text-[#1A1A1A] leading-tight group-hover:text-[#D4AF37] transition-colors duration-500 mb-2">
          {circuit.name}
        </h2>

        <div className="flex items-center gap-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863]">
          <MapPin className="w-3 h-3 text-[#D4AF37] flex-shrink-0" strokeWidth={1.5} />
          <span className="truncate">{circuit.location}, {circuit.country}</span>
        </div>

        <div className="mt-auto pt-5 border-t border-[#1A1A1A]/5 flex items-center justify-between group-hover:border-[#D4AF37]/20 transition-colors duration-500">
          <span className="font-sans text-[9px] font-medium text-[#6C6863] uppercase tracking-[0.2em] group-hover:text-[#D4AF37] transition-colors duration-500">
            Full Details
          </span>
          <ChevronRight className="w-3 h-3 text-[#D4AF37] translate-x-[-8px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" strokeWidth={1.5} />
        </div>
      </div>
    </Link>
  )
}
