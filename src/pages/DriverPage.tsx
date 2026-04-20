/**
 * DriverPage — Full driver profile
 * Pulls the COMPLETE Wikipedia article + local assets + live telemetry data
 */

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDriverFullPage } from '@/api/wikipedia'
import { getDrivers, getSessions } from '@/api/openf1'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { ChevronRight, Flag, Trophy } from 'lucide-react'
import { getDriverImage } from '@/lib/imageMap'

export default function DriverPage() {
  const { driverId } = useParams<{ driverId: string }>()
  const currentYear = new Date().getFullYear()

  // 1. Get Wikipedia data
  const driverName = (driverId || '')
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const { data: page, isLoading: wikiLoading, error: wikiError } = useQuery({
    queryKey: ['driverFullPage', driverId],
    queryFn: () => getDriverFullPage(driverName),
    staleTime: 30 * 60 * 1000,
    enabled: !!driverId,
  })

  // 2. Get OpenF1 data for team color/info
  const { data: sessions } = useQuery({
    queryKey: ['sessions_info'],
    queryFn: () => getSessions(currentYear),
    staleTime: 60 * 60 * 1000,
  })

  const latestSessionKey = sessions?.[sessions.length - 1]?.session_key

  const { data: drivers } = useQuery({
    queryKey: ['drivers_info', latestSessionKey],
    queryFn: () => getDrivers(latestSessionKey!),
    enabled: !!latestSessionKey,
    staleTime: 60 * 60 * 1000,
  })

  // Find this specific driver in the active roster
  const activeDriver = drivers?.find(d => {
    const lastName = driverId?.split('_').pop()?.toLowerCase()
    return d.last_name.toLowerCase() === lastName
  })

  const teamColor = activeDriver?.team_colour ? `#${activeDriver.team_colour}` : '#ff1801'
  const localImage = getDriverImage(activeDriver?.last_name || driverId?.split('_').pop() || '')

  if (wikiLoading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center py-32 gap-4">
        <LoadingSpinner />
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">
          Establishing Telemetry Link...
        </p>
      </div>
    )
  }

  if (wikiError || !page) {
    return (
      <div className="min-h-screen bg-bg container px-4 py-32">
        <div className="py-24 text-center border-2 border-dashed border-border bg-bg-subtle max-w-2xl mx-auto rounded-3xl">
          <h3 className="text-xl font-black text-text-primary uppercase italic mb-2">Error 404</h3>
          <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">Profile data link severed.</p>
          <Link to="/drivers" className="inline-block mt-8 text-f1-red font-black uppercase text-xs border-b-2 border-f1-red pb-1">Return to Roster</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* ── Background Accent ── */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-white to-bg opacity-40 pointer-events-none" />

      <div className="container relative z-10 px-4 sm:px-md py-8 sm:py-12 lg:py-xl">
        {/* Back nav */}
        <Link
          to="/drivers"
          className="inline-flex items-center gap-2 text-xs font-black uppercase text-text-muted hover:text-f1-red transition-colors mb-10"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Roster Index
        </Link>

        {/* ── Hero Section ── */}
        <div className="relative group mb-12 sm:mb-20">
          <div className="grid lg:grid-cols-12 gap-0 bg-white rounded-[2rem] overflow-hidden border border-border/40 shadow-xl max-w-6xl mx-auto">
            
            {/* Image Side - Compact */}
            <div className="lg:col-span-5 relative h-[350px] lg:h-[450px] overflow-hidden flex items-start justify-center"
              style={{ background: `linear-gradient(135deg, ${teamColor}, ${teamColor}dd)` }}
            >
               {/* Subtle halftone texture */}
               <div className="absolute inset-0 opacity-[0.08]"
                style={{ backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`, backgroundSize: '8px 8px' }}
               />
               
               {/* Number Watermark - Smaller */}
               {activeDriver && (
                 <div className="absolute top-6 left-8 text-[10rem] lg:text-[14rem] font-black italic text-white/5 select-none pointer-events-none leading-none">
                   {activeDriver.driver_number}
                 </div>
               )}

               {/* Balanced Face/Torso Image */}
               {localImage ? (
                 <img
                   src={localImage}
                   alt={page.title}
                   className="relative z-10 w-auto h-[280%] object-contain object-top drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-transform duration-700 origin-top mt-2 group-hover:scale-105"
                 />
               ) : (
                 <img
                   src={page.thumbnail?.source}
                   alt={page.title}
                   className="relative z-10 w-full h-full object-cover object-top grayscale opacity-50"
                 />
               )}
            </div>

            {/* Info Side - Minimal & Refined */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <div className="px-2.5 py-1 bg-f1-red text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                  {activeDriver?.team_name || 'Competitor'}
                </div>
                {activeDriver && (
                  <div className="px-2.5 py-1 bg-bg-subtle border border-border text-[9px] font-black uppercase tracking-widest rounded-md text-text-muted">
                    #{activeDriver.driver_number}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <span className="text-xl sm:text-2xl font-bold text-text-secondary uppercase tracking-tight leading-none block h-fit opacity-60">
                  {activeDriver?.first_name || page.title.split(' ')[0]}
                </span>
                <h1 className="text-5xl sm:text-7xl font-black text-f1-red uppercase italic tracking-tighter leading-[0.85]">
                  {activeDriver?.last_name || page.title.split(' ').slice(1).join(' ')}
                </h1>
              </div>

              {page.description && (
                <p className="text-text-secondary font-black uppercase tracking-wide text-[10px] sm:text-xs leading-relaxed mb-8 max-w-lg opacity-80">
                  {page.description}
                </p>
              )}

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-8 mb-8 border-t border-border pt-8">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 grayscale">
                     <Flag className="w-3 h-3" /> Country
                  </div>
                  <div className="text-sm font-black text-text-primary uppercase flex items-center gap-2">
                     <img 
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${activeDriver?.country_code || 'UN'}.svg`}
                        className="w-4 h-3 rounded-sm"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                     />
                     {activeDriver?.country_code || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
                     <Trophy className="w-3 h-3 text-f1-red" /> Constructor
                  </div>
                  <div className="text-sm font-black text-text-primary uppercase italic">
                     {activeDriver?.team_name || 'Independent'}
                  </div>
                </div>
              </div>

              {/* Minimal Section Links */}
              {page.sections.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {page.sections
                    .filter(s => s.level <= 2)
                    .slice(0, 8)
                    .map((sec) => (
                      <a
                        key={sec.anchor}
                        href={`#${sec.anchor}`}
                        className="px-4 py-2 bg-bg-subtle border border-border text-[9px] font-black uppercase tracking-widest text-text-muted hover:bg-f1-red hover:text-white hover:border-f1-red transition-all rounded-xl"
                      >
                        {sec.title}
                      </a>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Article Content ── */}
        <div className="grid lg:grid-cols-12 gap-12 sm:gap-20">
          <div className="lg:col-span-12">
            <div
              className="wiki-content"
              dangerouslySetInnerHTML={{ __html: page.fullHtml }}
            />
          </div>
        </div>

        {/* ── Hall of Champions ── */}
        <div className="mt-24 sm:mt-40 pt-16 border-t-2 border-border">
          <div className="mb-12">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-text-primary text-white text-[10px] font-black uppercase tracking-widest mb-6 rounded-lg">
               <Trophy className="w-3 h-3" />
               Hall of Champions
             </div>
             <h2 className="text-4xl sm:text-6xl font-black text-text-primary tracking-tighter uppercase italic leading-none">
               Legends & <span className="text-f1-red">Retired</span> Drivers
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Michael Schumacher', country: 'Germany', championships: 7, wins: 91, years: '1991–2012', team: 'Ferrari / Mercedes', died: null },
              { name: 'Ayrton Senna', country: 'Brazil', championships: 3, wins: 41, years: '1984–1994', team: 'McLaren / Williams', died: 1994 },
              { name: 'Alain Prost', country: 'France', championships: 4, wins: 51, years: '1980–1993', team: 'McLaren / Ferrari / Williams', died: null },
              { name: 'Juan Manuel Fangio', country: 'Argentina', championships: 5, wins: 24, years: '1950–1958', team: 'Alfa Romeo / Mercedes / Ferrari / Maserati', died: 1995 },
              { name: 'Niki Lauda', country: 'Austria', championships: 3, wins: 25, years: '1971–1985', team: 'Ferrari / McLaren', died: 2019 },
              { name: 'Jim Clark', country: 'Scotland', championships: 2, wins: 25, years: '1960–1968', team: 'Lotus', died: 1968 },
              { name: 'Jackie Stewart', country: 'Scotland', championships: 3, wins: 27, years: '1965–1973', team: 'BRM / Matra / Tyrrell', died: null },
              { name: 'Nelson Piquet', country: 'Brazil', championships: 3, wins: 23, years: '1978–1991', team: 'Brabham / Williams / Lotus / Benetton', died: null },
              { name: 'Nigel Mansell', country: 'UK', championships: 1, wins: 31, years: '1980–1995', team: 'Williams / Ferrari / McLaren', died: null },
              { name: 'Mika Häkkinen', country: 'Finland', championships: 2, wins: 20, years: '1991–2001', team: 'McLaren', died: null },
              { name: 'Damon Hill', country: 'UK', championships: 1, wins: 22, years: '1992–1999', team: 'Williams / Arrows / Jordan', died: null },
              { name: 'Jenson Button', country: 'UK', championships: 1, wins: 15, years: '2000–2017', team: 'McLaren / Brawn GP / Williams / BAR', died: null },
              { name: 'Kimi Räikkönen', country: 'Finland', championships: 1, wins: 21, years: '2001–2021', team: 'McLaren / Ferrari / Lotus / Alfa Romeo / Sauber', died: null },
              { name: 'Sebastian Vettel', country: 'Germany', championships: 4, wins: 53, years: '2007–2022', team: 'Red Bull / Ferrari / Aston Martin / Toro Rosso', died: null },
              { name: 'Nico Rosberg', country: 'Germany', championships: 1, wins: 23, years: '2006–2016', team: 'Mercedes / Williams', died: null },
              { name: 'Graham Hill', country: 'UK', championships: 2, wins: 14, years: '1958–1975', team: 'BRM / Lotus / Brabham', died: 1975 },
              { name: 'Emerson Fittipaldi', country: 'Brazil', championships: 2, wins: 14, years: '1970–1980', team: 'Lotus / McLaren / Fittipaldi', died: null },
              { name: 'Jochen Rindt', country: 'Austria', championships: 1, wins: 6, years: '1964–1970', team: 'Cooper / Brabham / Lotus', died: 1970 },
            ].map((legend, lid) => (
              <Link
                key={lid}
                to={`/driver/${legend.name.toLowerCase().replace(/ /g, '_').replace(/ä/g, 'a').replace(/ö/g, 'o')}`}
                className="group bg-white border border-border rounded-3xl p-6 sm:p-8 hover:border-f1-red/30 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{legend.country}</div>
                    <h3 className="text-xl font-black uppercase italic text-text-primary leading-tight group-hover:text-f1-red transition-colors">
                      {legend.name.split(' ').slice(0, -1).join(' ')}
                      <br />
                      <span className="text-f1-red group-hover:text-text-primary transition-colors text-2xl">
                        {legend.name.split(' ').slice(-1)[0]}
                      </span>
                    </h3>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-f1-red/10 rounded-2xl flex items-center justify-center">
                    <span className="text-lg font-black text-f1-red italic">{legend.championships}×</span>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-6">{legend.team}</div>

                <div className="flex items-center gap-6 pt-5 border-t border-border text-[10px] font-black uppercase tracking-[0.2em]">
                  <div className="text-text-muted">
                    <span className="text-text-primary text-sm">{legend.wins}</span> Wins
                  </div>
                  <div className="text-text-muted">
                    {legend.years}
                  </div>
                  {legend.died && (
                    <div className="text-f1-red ml-auto font-black">
                      † {legend.died}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Nav */}
        <div className="mt-20 pt-10 border-t border-border flex flex-wrap gap-4">
          <Link to="/drivers" className="btn-secondary rounded-2xl px-10 py-4 flex items-center gap-2">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Roster
          </Link>
          <Link to="/standings" className="btn-primary rounded-2xl px-10 py-4 flex items-center gap-2">
             Live Standings <Trophy className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .wiki-content { color: var(--text-secondary); line-height: 1.8; font-size: 1rem; }
        .wiki-content h2 { font-size: 2rem; font-weight: 900; text-transform: uppercase; font-style: italic; letter-spacing: -0.04em; color: #000; border-bottom: 4px solid var(--border); padding-bottom: 0.5rem; margin: 4rem 0 1.5rem; scroll-margin-top: 100px; }
        .wiki-content h3 { font-size: 1.25rem; font-weight: 900; text-transform: uppercase; color: #000; margin: 2.5rem 0 1rem; border-left: 6px solid #ff1801; padding-left: 1rem; scroll-margin-top: 100px; }
        .wiki-content p { margin-bottom: 1.5rem; font-weight: 500; }
        .wiki-content table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 0.85rem; overflow-x: auto; display: block; border: 1px solid var(--border); border-radius: 1rem; }
        .wiki-content table th { background: #f8f8fb; font-weight: 900; text-transform: uppercase; padding: 1rem; border: 1px solid var(--border); text-align: left; }
        .wiki-content table td { padding: 0.8rem 1rem; border: 1px solid var(--border); }
        .wiki-content .mw-references-wrap, .wiki-content .reflist, .wiki-content .references, .wiki-content .external-links, .wiki-content .navbox, .wiki-content .noprint, .wiki-content [id="References"], .wiki-content [id="External_links"], .wiki-content .mw-empty-elt { display: none !important; }
      `}</style>
    </div>
  )
}
