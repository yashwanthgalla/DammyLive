/**
 * DriverPage — Full driver profile
 * Luxury Editorial Edition — Complete Wikipedia article with editorial typography
 */

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDriverFullPage } from '@/api/wikipedia'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { ChevronRight } from 'lucide-react'
import { getDriverImage } from '@/lib/imageMap'

export default function DriverPage() {
  const { driverId } = useParams<{ driverId: string }>()

  const driverName = (driverId || '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const lastName = driverName.split(' ').pop() || ''

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['driverFullPage', driverId],
    queryFn: () => getDriverFullPage(driverName),
    staleTime: 30 * 60 * 1000,
    enabled: !!driverId,
  })

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-12 md:py-20 lg:py-32">
        {/* Back nav */}
        <Link
          to="/drivers"
          className="inline-flex items-center gap-2 font-sans text-xs font-medium uppercase text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500 mb-12"
        >
          <ChevronRight className="w-4 h-4 rotate-180" strokeWidth={1.5} />
          All Drivers
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner />
          </div>
        ) : error || !page ? (
          <div className="py-24 text-center border-t border-[#1A1A1A] max-w-2xl mx-auto pt-12">
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3">Profile Unavailable</h3>
            <p className="font-sans text-sm text-[#6C6863]">
              Detailed Wikipedia data unavailable for this driver.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="grid lg:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-24 pb-16 md:pb-24 border-b border-[#1A1A1A]/10">
              {/* Portrait */}
              <div className="lg:col-span-4">
                <div className="aspect-[3/4] bg-[#EBE5DE] relative overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] group">
                  {getDriverImage(lastName) ? (
                    <img
                      src={getDriverImage(lastName)!}
                      alt={page.title}
                      className="absolute top-0 left-1/2 -translate-x-1/2 h-[200%] w-auto max-w-none object-contain object-top grayscale group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-[1.02]"
                    />
                  ) : page.thumbnail ? (
                    <img
                      src={page.thumbnail.source}
                      alt={page.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-9xl text-[#1A1A1A]/5 italic">P</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                  
                  {/* Vertical text label */}
                  <div
                    className="hidden md:block absolute left-4 bottom-4 font-sans text-[8px] font-medium uppercase tracking-[0.3em] text-[#1A1A1A]/15"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    Driver Profile
                  </div>
                </div>
              </div>

              {/* Title + intro */}
              <div className="lg:col-span-8 flex flex-col justify-end">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                    Driver Profile
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] leading-[0.9] tracking-tight mb-6">
                  {page.title}
                </h1>

                {page.description && (
                  <p className="font-sans text-sm text-[#6C6863] uppercase tracking-[0.15em] mb-8">
                    {page.description}
                  </p>
                )}

                {/* Section index */}
                {page.sections.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {page.sections
                      .filter((s: any) => s.level <= 2)
                      .slice(0, 10)
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
              <Link to="/drivers" className="btn-primary">
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 rotate-180" strokeWidth={1.5} />
                  All Drivers
                </span>
              </Link>
              <Link to="/standings" className="btn-secondary">
                Standings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
