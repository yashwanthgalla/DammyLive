/**
 * CircuitPage — Full circuit profile
 * Luxury Editorial Edition — Complete Wikipedia article
 */

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCircuit } from '@/api/jolpica'
import { getCircuitFullPage } from '@/api/wikipedia'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { ChevronRight, MapPin, Route, ExternalLink } from 'lucide-react'
import { getTrackBlueprint } from '@/lib/imageMap'

export default function CircuitPage() {
  const { circuitId } = useParams<{ circuitId: string }>()

  const { data: circuit } = useQuery({
    queryKey: ['circuit', circuitId],
    queryFn: () => getCircuit(circuitId || ''),
    enabled: !!circuitId,
    staleTime: 24 * 60 * 60 * 1000,
  })

  const circuitName = circuit?.name || (circuitId || '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['circuitFullPage', circuitId, circuitName],
    queryFn: () => getCircuitFullPage(circuitName, circuitId),
    staleTime: 30 * 60 * 1000,
    enabled: !!circuitId,
  })

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-12 md:py-20 lg:py-32">
        {/* Back nav */}
        <Link
          to="/circuits"
          className="inline-flex items-center gap-2 font-sans text-xs font-medium uppercase text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500 mb-12"
        >
          <ChevronRight className="w-4 h-4 rotate-180" strokeWidth={1.5} />
          All Circuits
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
          </div>
        ) : error || !page ? (
          <div className="py-24 text-center border-t border-[#1A1A1A] max-w-2xl mx-auto pt-12">
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3">Circuit Data</h3>
            <p className="font-sans text-sm text-[#6C6863]">Wikipedia data unavailable for this circuit.</p>
            {circuit && (
              <div className="mt-8 pt-8 border-t border-[#1A1A1A]/10">
                <h2 className="font-serif text-3xl text-[#1A1A1A] mb-3">{circuit.name}</h2>
                <div className="flex items-center justify-center gap-2 font-sans text-sm text-[#6C6863]">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                  {circuit.location}, {circuit.country}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="grid lg:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-24 pb-16 md:pb-24 border-b border-[#1A1A1A]/10">
              {/* Photo */}
              <div className="lg:col-span-4">
                <div className="aspect-video lg:aspect-[4/3] bg-[#EBE5DE] overflow-hidden relative shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] group flex items-center justify-center p-8">
                  {getTrackBlueprint(circuitId || '') ? (
                    <img
                      src={getTrackBlueprint(circuitId || '')!}
                      alt={page.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-[2000ms]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Route className="w-20 h-20 text-[#1A1A1A]/5" strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                </div>


                {/* Quick Facts */}
                {circuit && (
                  <div className="mt-6 border-t border-[#1A1A1A] pt-6 space-y-4">
                    <div className="font-sans text-[10px] font-medium text-[#D4AF37] uppercase tracking-[0.25em] flex items-center gap-2">
                      <Route className="w-3 h-3" strokeWidth={1.5} />
                      Quick Facts
                    </div>
                    {[
                      { label: 'Location', value: circuit.location },
                      { label: 'Country', value: circuit.country },
                      { label: 'Coordinates', value: `${circuit.lat?.toFixed(2)}°, ${circuit.lng?.toFixed(2)}°` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center py-2 border-b border-[#1A1A1A]/5">
                        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863]">{label}</span>
                        <span className="font-sans text-xs text-[#1A1A1A]">{value}</span>
                      </div>
                    ))}
                    {circuit.url && (
                      <a
                        href={circuit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-sans text-[10px] font-medium text-[#D4AF37] uppercase tracking-[0.2em] hover:text-[#1A1A1A] transition-colors duration-500 pt-2"
                      >
                        <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                        Wikipedia Source
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="lg:col-span-8 flex flex-col justify-end">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                    Circuit Profile
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-[#1A1A1A] leading-[0.9] tracking-tight mb-6">
                  {page.title}
                </h1>

                {page.description && (
                  <p className="font-sans text-sm text-[#6C6863] uppercase tracking-[0.15em] mb-8">
                    {page.description}
                  </p>
                )}

                {circuit && (
                  <div className="flex items-center gap-3 mb-8">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                    <span className="font-sans text-sm text-[#6C6863]">{circuit.location}, {circuit.country}</span>
                  </div>
                )}

                {page.sections.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {page.sections
                      .filter((s: any) => s.level <= 2)
                      .slice(0, 12)
                      .map((sec: any) => (
                        <a
                          key={sec.anchor}
                          href={`#${sec.anchor}`}
                          className="px-4 py-2 border border-[#1A1A1A]/10 font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-[#6C6863] hover:bg-[#1A1A1A] hover:text-[#F9F8F6] hover:border-[#1A1A1A] transition-all duration-500"
                        >
                          {sec.title}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Full Article */}
            <div
              className="wiki-content"
              dangerouslySetInnerHTML={{ __html: page.fullHtml }}
            />

            {/* Navigation */}
            <div className="mt-16 md:mt-24 pt-10 border-t border-[#1A1A1A]/10 flex flex-wrap gap-4">
              <Link to="/circuits" className="btn-primary">
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 rotate-180" strokeWidth={1.5} />
                  All Circuits
                </span>
              </Link>
              <Link to="/schedule" className="btn-secondary">Schedule</Link>
              <Link to="/standings" className="btn-secondary">Standings</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
