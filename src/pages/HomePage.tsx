/**
 * HomePage — DammyLive Editorial
 * Luxury editorial landing with asymmetric layout,
 * mixed italic headlines, extreme type scale, and generous negative space
 */

import { Link } from 'react-router-dom'
import {
  Calendar,
  Trophy,
  Map,
  Activity,
  ChevronRight,
} from 'lucide-react'
import TrackGallery from '../components/shared/TrackGallery'

const features = [
  {
    id: 'schedule',
    title: 'Race Calendar',
    desc: 'The complete 2026 championship schedule. Every session, every venue, precisely documented.',
    icon: Calendar,
    path: '/schedule',
    tag: 'Current Season',
  },
  {
    id: 'live',
    title: 'Live Timing',
    desc: 'Real-time telemetry, interval gaps, and tire strategy data as the race unfolds.',
    icon: Activity,
    path: '/live',
    tag: 'Live Data',
  },
  {
    id: 'standings',
    title: 'Championships',
    desc: 'Driver and Constructor standings with full historical archive from 1950 to present.',
    icon: Trophy,
    path: '/standings',
    tag: 'Updated',
  },
  {
    id: 'circuits',
    title: 'Circuits',
    desc: 'Comprehensive track profiles, detailed layouts, and venue histories from around the globe.',
    icon: Map,
    path: '/circuits',
    tag: '24 Venues',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] relative">
      {/* ── Hero Section — Massive editorial type with Cinematic Video ── */}
      <section className="relative pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 overflow-hidden border-b border-[#1A1A1A]/10">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
            
            {/* Left: Typography content */}
            <div className="flex-1 max-w-3xl">
              {/* F1 Logo & Overline */}
              <div className="flex items-center gap-6 mb-8 md:mb-12">
                <img src="/F1.svg.png" alt="F1" className="h-5 sm:h-6 object-contain" />
                <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                  2026 Season
                </span>
              </div>

              {/* Mixed Italic Headline — Signature editorial element */}
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#1A1A1A] leading-[0.9] tracking-tight mb-8 md:mb-12">
                The Art of <br />
                <em className="text-[#D4AF37]">Precision</em> <br />
                Racing
              </h1>

              <p className="font-sans text-base md:text-lg text-[#6C6863] max-w-xl mb-12 md:mb-16 leading-relaxed">
                A curated editorial platform for Formula 1. Real-time telemetry,
                historical archives, and considered insights — presented with
                the precision the sport demands.
              </p>

              {/* Buttons — Primary gold-slide + Secondary outline */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/schedule" className="btn-primary group">
                  <span className="flex items-center gap-3">
                    Explore Calendar
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" strokeWidth={1.5} />
                  </span>
                </Link>
                <Link to="/standings" className="btn-secondary text-center">
                  View Standings
                </Link>
              </div>
            </div>

            {/* Right: Cinematic Video */}
            <div className="hidden lg:block flex-1 w-full relative">
              {/* Vertical text label */}
              <div
                className="absolute -left-12 top-1/2 -translate-y-1/2 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#1A1A1A]/30 z-20"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Editorial / Vol. 01 / 2026
              </div>
              
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EBE5DE] group">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37] z-20" />
                <video
                  src="/hero-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Feature Grid — Asymmetric editorial cards ── */}
      <section className="py-20 md:py-32 max-w-[1600px] mx-auto px-8 md:px-16">
        {/* Section heading */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 md:w-12 bg-[#1A1A1A]" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
              The Platform
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#1A1A1A] leading-[0.9]">
            Curated <em className="text-[#D4AF37]">Excellence</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {features.map((feature, idx) => (
            <Link
              key={feature.id}
              to={feature.path}
              className="group border-t border-[#1A1A1A]/10 p-8 md:p-12 flex flex-col justify-between min-h-[280px] md:min-h-[360px] transition-all duration-700 hover:bg-[#1A1A1A]/[0.02] relative"
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#6C6863] group-hover:text-[#D4AF37] transition-colors duration-500">
                  {feature.tag}
                </span>
                <feature.icon className="w-5 h-5 text-[#1A1A1A]/10 group-hover:text-[#D4AF37] transition-colors duration-700" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] mb-3 leading-tight group-hover:text-[#D4AF37] transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="font-sans text-sm text-[#6C6863] leading-relaxed max-w-sm">
                  {feature.desc}
                </p>
              </div>

              {/* Bottom reveal */}
              <div className="flex items-center gap-2 mt-8 opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-500">
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  Explore
                </span>
                <ChevronRight className="w-3 h-3 text-[#D4AF37]" strokeWidth={1.5} />
              </div>

              {/* Right border for odd items (creates asymmetric grid feel) */}
              {idx % 2 === 0 && (
                <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-[#1A1A1A]/10" />
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Iconic Circuits Parallax Gallery ── */}
      <TrackGallery />

      {/* ── Dark Section — Statistics / Rhythm Break ── */}
      <section className="bg-[#1A1A1A] py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16">
          <div className="grid md:grid-cols-12 gap-16 md:gap-24">
            {/* Left — Content, offset to column 2 */}
            <div className="md:col-span-5 md:col-start-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#F9F8F6]/50">
                  Architecture
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-[#F9F8F6] leading-[0.9] mb-8">
                The <em className="text-[#D4AF37]">Details</em>
              </h2>
              {/* Drop Cap — Signature editorial element */}
              <p className="font-sans text-base text-[#F9F8F6]/60 leading-relaxed">
                <span className="font-serif text-7xl text-[#F9F8F6] float-left mr-3 leading-[0.8]">E</span>
                very data point is captured, processed, and presented with
                exacting precision. From real-time telemetry to decades of
                championship history — a definitive resource for the serious
                follower of Formula 1.
              </p>
            </div>

            {/* Right — Stats */}
            <div className="md:col-span-4 md:col-start-8 flex flex-col justify-end gap-12">
              {[
                { value: '76', label: 'Years of Data', sub: '1950 — Present' },
                { value: '24', label: 'Global Circuits', sub: 'Current Season' },
                { value: '∞', label: 'Live Updates', sub: 'Real-Time Feed' },
              ].map((stat, i) => (
                <div key={i} className="border-t border-[#F9F8F6]/10 pt-6">
                  <div className="font-serif text-5xl md:text-6xl text-[#F9F8F6] leading-none mb-2">
                    {stat.value}
                  </div>
                  <div className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#F9F8F6]/40">
                    {stat.label}
                  </div>
                  <div className="font-sans text-[10px] font-medium text-[#D4AF37] uppercase tracking-[0.15em] mt-1">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section — Clean editorial ── */}
      <section className="py-20 md:py-32 border-t border-[#1A1A1A]/10">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 text-center max-w-2xl">
          <div className="h-px w-12 bg-[#D4AF37] mx-auto mb-12" />
          <h2 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] leading-[0.9] mb-6">
            Begin Your <em className="text-[#D4AF37]">Journey</em>
          </h2>
          <p className="font-sans text-sm text-[#6C6863] leading-relaxed mb-12 max-w-md mx-auto">
            Explore the 2026 championship calendar, review historical standings,
            or dive into live session data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/schedule" className="btn-primary">
              <span>Explore Calendar</span>
            </Link>
            <Link to="/drivers" className="btn-secondary">
              View Drivers
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
