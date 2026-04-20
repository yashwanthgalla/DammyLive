/**
 * CircuitPage — Full circuit profile
 * Pulls Wikipedia article for comprehensive track info & history
 */

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCircuit } from '@/api/jolpica'
import { getCircuitFullPage } from '@/api/wikipedia'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { ChevronRight, MapPin, Route, Globe, ExternalLink } from 'lucide-react'
import { getTrackBlueprint, getTrackImage } from '@/lib/imageMap'

export default function CircuitPage() {
  const { circuitId } = useParams<{ circuitId: string }>()

  // Get basic circuit info from Jolpica
  const { data: circuit } = useQuery({
    queryKey: ['circuit', circuitId],
    queryFn: () => getCircuit(circuitId || ''),
    enabled: !!circuitId,
    staleTime: 24 * 60 * 60 * 1000,
  })

  // Get full Wikipedia article
  const circuitName = circuit?.name || (circuitId || '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['circuitFullPage', circuitId, circuitName],
    queryFn: () => getCircuitFullPage(circuitName, circuitId),
    staleTime: 30 * 60 * 1000,
    enabled: !!circuitId,
  })

  return (
    <div className="min-h-screen bg-bg">
      <div className="container px-4 sm:px-md py-8 sm:py-12 lg:py-xl">

        {/* Back nav */}
        <Link
          to="/circuits"
          className="inline-flex items-center gap-2 text-xs font-black uppercase text-text-muted hover:text-f1-red transition-colors mb-10"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          All Circuits
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">
              Loading Circuit Data...
            </p>
          </div>
        ) : error || !page ? (
          <div className="py-24 text-center border border-dashed border-border bg-bg-subtle max-w-2xl mx-auto rounded-2xl">
            <h3 className="text-xl font-black text-text-primary uppercase italic mb-2">Circuit Data</h3>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Detailed Wikipedia data unavailable for this circuit.
            </p>
            {circuit && (
              <div className="mt-6 p-6 border-t border-border">
                <h2 className="text-2xl sm:text-3xl font-black text-text-primary uppercase italic tracking-tighter mb-2">{circuit.name}</h2>
                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                  <MapPin className="w-4 h-4 text-f1-red" />
                  {circuit.location}, {circuit.country}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">

            {/* ── Hero ── */}
            <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 mb-10 sm:mb-16 pb-10 sm:pb-16 border-b border-border">

              {/* Photo */}
              <div className="lg:col-span-4">
                <div className="aspect-video lg:aspect-[4/3] bg-bg-subtle border border-border rounded-2xl overflow-hidden relative">
                  {getTrackImage(circuitId || '') ? (
                    <img
                      src={getTrackImage(circuitId || '')!}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  ) : page.thumbnail ? (
                    <img
                      src={page.thumbnail.source}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-subtle to-white">
                      <Route className="w-20 h-20 text-text-muted opacity-10" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-f1-red" />
                </div>

                {/* Track Blueprint */}
                {getTrackBlueprint(circuitId || '') && (
                  <div className="mt-4 bg-white border border-border rounded-2xl p-4 sm:p-6 flex flex-col items-center">
                    <div className="text-[10px] font-black text-f1-red uppercase tracking-widest mb-3">Circuit Layout</div>
                    <img
                      src={getTrackBlueprint(circuitId || '')!}
                      alt={`${page.title} layout`}
                      className="w-full max-h-48 object-contain"
                    />
                  </div>
                )}

                {/* Quick Facts */}
                {circuit && (
                  <div className="mt-4 bg-white border border-border rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-f1-red uppercase tracking-widest mb-3">
                      <Route className="w-3 h-3" />
                      Quick Facts
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Location</span>
                      <span className="text-xs font-black text-text-primary italic text-right">{circuit.location}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Country</span>
                      <span className="text-xs font-black text-text-primary italic">{circuit.country}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Coordinates</span>
                      <span className="text-xs font-black text-text-primary italic">{circuit.lat?.toFixed(2)}°, {circuit.lng?.toFixed(2)}°</span>
                    </div>
                    {circuit.url && (
                      <a
                        href={circuit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] font-black text-f1-red uppercase tracking-widest hover:underline pt-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Wikipedia Source
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Name + intro */}
              <div className="lg:col-span-8 flex flex-col justify-end">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-f1-red text-white text-[10px] font-black uppercase tracking-widest mb-6 w-fit rounded-lg">
                  <Globe className="w-3 h-3" />
                  Circuit Profile
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase italic text-text-primary tracking-tighter leading-none mb-4 sm:mb-6">
                  {page.title}
                </h1>

                {page.description && (
                  <p className="text-text-secondary font-bold uppercase tracking-wide text-sm mb-6">
                    {page.description}
                  </p>
                )}

                {circuit && (
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold text-text-secondary uppercase tracking-tight mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-subtle border border-border rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-f1-red" />
                      {circuit.location}, {circuit.country}
                    </div>
                  </div>
                )}

                {/* Section index */}
                {page.sections.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {page.sections
                      .filter(s => s.level <= 2)
                      .slice(0, 12)
                      .map((sec) => (
                        <a
                          key={sec.anchor}
                          href={`#${sec.anchor}`}
                          className="px-3 py-1.5 bg-bg-subtle border border-border text-[9px] font-black uppercase tracking-widest text-text-muted hover:bg-f1-red hover:text-white hover:border-f1-red transition-all rounded-lg"
                        >
                          {sec.title}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Full Article ── */}
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-12">
                <div
                  className="wiki-content"
                  dangerouslySetInnerHTML={{ __html: page.fullHtml }}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 sm:mt-16 pt-8 border-t border-border flex flex-wrap gap-3">
              <Link
                to="/circuits"
                className="inline-flex items-center gap-2 px-6 py-3 bg-text-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-f1-red transition-colors rounded-xl"
              >
                <ChevronRight className="w-3 h-3 rotate-180" />
                All Circuits
              </Link>
              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border text-text-primary text-[10px] font-black uppercase tracking-widest hover:border-f1-red hover:text-f1-red transition-colors rounded-xl"
              >
                View Schedule
                <ChevronRight className="w-3 h-3" />
              </Link>
              <Link
                to="/standings"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border text-text-primary text-[10px] font-black uppercase tracking-widest hover:border-f1-red hover:text-f1-red transition-colors rounded-xl"
              >
                View Standings
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* ── Fade-in ── */
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        /* ── Wikipedia article content styling ── */
        .wiki-content { color: var(--text-secondary); line-height: 1.75; font-size: 0.95rem; }

        .wiki-content h2 {
          font-size: 1.5rem;
          font-weight: 900;
          text-transform: uppercase;
          font-style: italic;
          letter-spacing: -0.03em;
          color: #000;
          border-bottom: 2px solid var(--border);
          padding-bottom: 0.5rem;
          margin: 2.5rem 0 1rem;
          scroll-margin-top: 80px;
        }
        .wiki-content h3 {
          font-size: 1.1rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #000;
          margin: 1.75rem 0 0.5rem;
          border-left: 3px solid #ff1801;
          padding-left: 0.75rem;
          scroll-margin-top: 80px;
        }
        .wiki-content h4 {
          font-size: 0.9rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin: 1.25rem 0 0.4rem;
        }
        .wiki-content p {
          margin-bottom: 1rem;
          font-weight: 500;
        }
        .wiki-content ul, .wiki-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .wiki-content li { margin-bottom: 0.3rem; }

        /* Tables */
        .wiki-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.78rem;
          overflow-x: auto;
          display: block;
        }
        .wiki-content table th {
          background: #f2f2f5;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          text-align: left;
          white-space: nowrap;
          font-size: 0.7rem;
        }
        .wiki-content table td {
          padding: 0.4rem 0.75rem;
          border: 1px solid var(--border);
          white-space: nowrap;
        }
        .wiki-content table tr:hover td { background: #fafafa; }

        /* Hide Wikipedia boilerplate */
        .wiki-content .mw-references-wrap,
        .wiki-content .reflist,
        .wiki-content .references,
        .wiki-content .external-links,
        .wiki-content .navbox,
        .wiki-content .noprint,
        .wiki-content [id="References"],
        .wiki-content [id="External_links"],
        .wiki-content .mw-empty-elt { display: none !important; }
      `}</style>
    </div>
  )
}
