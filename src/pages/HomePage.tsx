/**
 * HomePage - F1 Live Dashboard
 * Minimalist Red Edition — with logo & responsive design
 */

import { Link } from 'react-router-dom'
import {
  Calendar,
  Trophy,
  Map,
  Activity,
  Zap,
  ChevronRight,
  Cpu,
  Globe2
} from 'lucide-react'

const features = [
  {
    id: 'schedule',
    title: 'Race Schedule',
    desc: 'Full 2026 calendar and session timings.',
    icon: Calendar,
    path: '/schedule',
    tag: 'Next: Monaco'
  },
  {
    id: 'live',
    title: 'Live Timing',
    desc: 'Real-time telemetry and interval gaps.',
    icon: Activity,
    path: '/live',
    tag: 'Live Now',
    active: true
  },
  {
    id: 'standings',
    title: 'Standings',
    desc: 'Driver and Constructor championships.',
    icon: Trophy,
    path: '/standings',
    tag: 'Updated'
  },
  {
    id: 'circuits',
    title: 'Circuits',
    desc: 'Detailed track layouts and history.',
    icon: Map,
    path: '/circuits',
    tag: '24 Venues'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section - Minimalist Red */}
      <section className="relative pt-12 sm:pt-16 lg:pt-24 pb-10 sm:pb-16 overflow-hidden border-b border-border">
        <div className="container relative z-10 px-4">
          <div className="max-w-4xl">
            {/* Logo badge */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <img src="/logo.png" alt="DammyLive" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-f1-red text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                2026 Season Active
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-text-primary tracking-tighter leading-[0.9] mb-4 sm:mb-8 uppercase italic">
              Speed. <br />
              <span className="text-f1-red">Precision.</span> <br />
              Data.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-xl mb-8 sm:mb-12 font-medium leading-relaxed">
              The professional telemetry hub for Formula 1. Real-time data,
              live standings, and deep-dive technical insights.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link to="/schedule" className="btn-primary flex items-center justify-center gap-2 group px-6 py-3 sm:px-8 sm:py-4">
                Explore Calendar
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/standings" className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-text-primary text-text-primary font-black uppercase tracking-widest hover:bg-text-primary hover:text-white transition-all text-xs rounded-sm text-center">
                View Standings
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-[-10%] top-0 bottom-0 w-1/2 bg-bg-subtle skew-x-[-15deg] -z-10 hidden md:block" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10rem] sm:text-[15rem] lg:text-[20rem] font-black text-black/[0.02] select-none pointer-events-none italic tracking-tighter whitespace-nowrap hidden sm:block">
          TELEMETRY
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-10 sm:py-16 lg:py-20 container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature) => (
            <Link
              key={feature.id}
              to={feature.path}
              className="minimal-card group p-6 sm:p-8 flex flex-col justify-between h-[240px] sm:h-[280px] lg:h-[320px] relative"
            >
              <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:opacity-100 group-hover:text-f1-red transition-all">
                <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              </div>

              <div>
                <div className="inline-block px-2 py-1 bg-bg-subtle text-text-muted text-[10px] font-bold uppercase tracking-wider mb-4 sm:mb-6 rounded-sm group-hover:bg-f1-red/10 group-hover:text-f1-red transition-colors">
                  {feature.tag}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-text-primary uppercase italic mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 text-f1-red text-xs font-black uppercase tracking-widest mt-auto opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                Access Hub <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Technical Specs */}
      <section className="bg-bg-subtle py-12 sm:py-16 lg:py-24">
        <div className="container px-4">
          <div className="mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary uppercase italic tracking-tighter mb-4">
              Advanced <span className="text-f1-red">Architecture</span>
            </h2>
            <div className="h-1 w-20 bg-f1-red" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {[
              { icon: Zap, title: "Optimized Engine", desc: "Data processing with extreme precision and minimal latency for real-time race insights." },
              { icon: Globe2, title: "Global Network", desc: "Synchronized data across all championships and world venues in the 2026 season." },
              { icon: Cpu, title: "Raw Insights", desc: "Advanced session analysis including tire performance, gaps, and technical classifications." }
            ].map((stat, i) => (
              <div key={i} className="flex gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-white flex-shrink-0 flex items-center justify-center text-f1-red border border-border">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="font-black text-text-primary uppercase italic mb-2 tracking-tight text-sm sm:text-base">{stat.title}</h4>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Asset Preview */}
          <div className="mt-12 sm:mt-20 p-6 sm:p-8 lg:p-12 bg-white border border-border rounded-sm flex flex-col sm:flex-row items-center justify-between group overflow-hidden relative">
            <div className="relative z-10 max-w-md">
              <div className="text-f1-red text-[10px] font-black uppercase tracking-tighter mb-2">Technical Preview</div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary uppercase italic leading-none mb-4 sm:mb-6">
                Integrated <br /> Visual Assets
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mb-6 sm:mb-8 leading-relaxed font-medium">
                Coming Soon: High-resolution driver profiles, precise track maps, and
                consistent team branding integrated into every data point.
              </p>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                <div className="px-3 sm:px-4 py-2 bg-bg-subtle border border-border text-[10px] font-bold uppercase tracking-widest opacity-50">Driver Pack</div>
                <div className="px-3 sm:px-4 py-2 bg-bg-subtle border border-border text-[10px] font-bold uppercase tracking-widest opacity-50">Circuit Maps</div>
              </div>
            </div>

            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-bg-subtle/50 group-hover:bg-f1-red/5 transition-colors origin-right transform skew-x-[-15deg] hidden sm:block" />
            <div className="hidden lg:flex absolute right-12 bottom-[-20%] w-64 h-[120%] bg-border/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  )
}
