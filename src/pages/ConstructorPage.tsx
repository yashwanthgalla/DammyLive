/**
 * ConstructorPage — Full team/constructor profile
 * Luxury Editorial Edition
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
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-12 md:py-20 lg:py-32">
        {/* Back nav */}
        <Link
          to="/standings"
          className="inline-flex items-center gap-2 font-sans text-xs font-medium uppercase text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500 mb-12"
        >
          <ChevronRight className="w-4 h-4 rotate-180" strokeWidth={1.5} />
          Standings
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
          </div>
        ) : error || !page ? (
          <div className="py-24 text-center border-t border-[#1A1A1A] max-w-2xl mx-auto pt-12">
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3">Constructor Unavailable</h3>
            <p className="font-sans text-sm text-[#6C6863]">Data unavailable.</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="grid lg:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-24 pb-16 md:pb-24 border-b border-[#1A1A1A]/10">
              {/* Team image */}
              <div className="lg:col-span-4">
                <div className="aspect-video bg-[#EBE5DE] overflow-hidden relative flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] group">
                  {page.thumbnail ? (
                    <img
                      src={page.thumbnail.source}
                      alt={page.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
                    />
                  ) : (
                    <Building2 className="w-20 h-20 text-[#1A1A1A]/5" strokeWidth={1} />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                </div>
              </div>

              {/* Title */}
              <div className="lg:col-span-8 flex flex-col justify-end">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                    Constructor Record
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-[#1A1A1A] leading-[0.9] tracking-tight mb-6">
                  <em className="text-[#D4AF37]">{page.title}</em>
                </h1>

                {page.description && (
                  <p className="font-sans text-sm text-[#6C6863] uppercase tracking-[0.15em] mb-8">
                    {page.description}
                  </p>
                )}

                {page.sections.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {page.sections
                      .filter((s: any) => s.level <= 2)
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

            {/* Back */}
            <div className="mt-16 md:mt-24 pt-10 border-t border-[#1A1A1A]/10">
              <Link to="/standings" className="btn-primary">
                <span className="flex items-center gap-2">
                  Standings
                  <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
