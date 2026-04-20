/**
 * ConstructorPage — Full team/constructor profile
 * Pulls the COMPLETE Wikipedia article
 */

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getConstructorFullPage } from '@/api/wikipedia'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { ChevronRight, Building2 } from 'lucide-react'

export default function ConstructorPage() {
  const { constructorId } = useParams<{ constructorId: string }>()

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['constructorFullPage', constructorId],
    queryFn: () => getConstructorFullPage(constructorId || ''),
    staleTime: 30 * 60 * 1000,
    enabled: !!constructorId,
  })

  return (
    <div className="min-h-screen bg-bg">
      <div className="container px-4 sm:px-md py-8 sm:py-12 lg:py-xl">

        {/* Back nav */}
        <Link
          to="/standings"
          className="inline-flex items-center gap-2 text-xs font-black uppercase text-text-muted hover:text-f1-red transition-colors mb-10"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Standings
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">
              Loading Constructor Profile...
            </p>
          </div>
        ) : error || !page ? (
          <div className="py-24 text-center border border-dashed border-border bg-bg-subtle max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-text-primary uppercase italic mb-2">Error 404</h3>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
              Constructor data unavailable.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">

            {/* ── Hero ── */}
            <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 mb-10 sm:mb-16 pb-10 sm:pb-16 border-b border-border">

              {/* Team image */}
              <div className="lg:col-span-4">
                <div className="aspect-video bg-bg-subtle border border-border overflow-hidden relative flex items-center justify-center">
                  {page.thumbnail ? (
                    <img
                      src={page.thumbnail.source}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-20 h-20 text-text-muted opacity-20" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-f1-red" />
                </div>
              </div>

              {/* Title + intro */}
              <div className="lg:col-span-8 flex flex-col justify-end">
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-f1-red text-white text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                  <Building2 className="w-3 h-3" />
                  Constructor Record
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase italic text-text-primary tracking-tighter leading-none mb-4 sm:mb-6">
                  <span className="text-f1-red">{page.title}</span>
                </h1>

                {page.description && (
                  <p className="text-text-secondary font-bold uppercase tracking-wide text-sm mb-6">
                    {page.description}
                  </p>
                )}

                {/* Section index */}
                {page.sections.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {page.sections
                      .filter(s => s.level <= 2)
                      .map((sec) => (
                        <a
                          key={sec.anchor}
                          href={`#${sec.anchor}`}
                          className="px-3 py-1 bg-bg-subtle border border-border text-[9px] font-black uppercase tracking-widest text-text-muted hover:bg-f1-red hover:text-white hover:border-f1-red transition-all"
                        >
                          {sec.title}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Full Article ── */}
            <div
              className="wiki-content"
              dangerouslySetInnerHTML={{ __html: page.fullHtml }}
            />

            {/* Back to standings */}
            <div className="mt-16 pt-8 border-t border-border">
              <Link
                to="/standings"
                className="inline-flex items-center gap-2 px-6 py-3 bg-text-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-f1-red transition-colors"
              >
                View Standings
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .wiki-content { color: var(--text-secondary); line-height: 1.75; font-size: 0.95rem; }
        .wiki-content h2 {
          font-size: 1.5rem; font-weight: 900; text-transform: uppercase; font-style: italic;
          letter-spacing: -0.03em; color: #000;
          border-bottom: 2px solid var(--border); padding-bottom: 0.5rem;
          margin: 2.5rem 0 1rem; scroll-margin-top: 80px;
        }
        .wiki-content h3 {
          font-size: 1.1rem; font-weight: 900; text-transform: uppercase;
          letter-spacing: 0.05em; color: #000; margin: 1.75rem 0 0.5rem;
          border-left: 3px solid #ff1801; padding-left: 0.75rem; scroll-margin-top: 80px;
        }
        .wiki-content h4 { font-size: 0.9rem; font-weight: 800; text-transform: uppercase; color: var(--text-secondary); margin: 1.25rem 0 0.4rem; }
        .wiki-content p { margin-bottom: 1rem; font-weight: 500; }
        .wiki-content ul, .wiki-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .wiki-content li { margin-bottom: 0.3rem; }
        .wiki-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.78rem; overflow-x: auto; display: block; }
        .wiki-content table th { background: #f2f2f5; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.5rem 0.75rem; border: 1px solid var(--border); text-align: left; white-space: nowrap; font-size: 0.7rem; }
        .wiki-content table td { padding: 0.4rem 0.75rem; border: 1px solid var(--border); white-space: nowrap; }
        .wiki-content table tr:hover td { background: #fafafa; }
        .wiki-content .mw-references-wrap,
        .wiki-content .reflist,
        .wiki-content .references,
        .wiki-content .navbox,
        .wiki-content .noprint,
        .wiki-content .mw-empty-elt { display: none !important; }
      `}</style>
    </div>
  )
}
