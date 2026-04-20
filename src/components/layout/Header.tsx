/**
 * Header Component
 * Minimalist Red Edition — with logo image & responsive mobile menu
 */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, Trophy, Map, Radio, UserCircle2, Users, Menu, X, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const navLinks = [
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/standings', icon: Trophy, label: 'Standings' },
  { to: '/drivers', icon: Users, label: 'Drivers' },
  { to: '/circuits', icon: Map, label: 'Circuits' },
]

export default function Header() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md">
        <div className="container px-md py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-md">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group flex-shrink-0"
              title="Dammylive Telemetry Hub"
            >
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="DammyLive"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="flex flex-col -space-y-1 mt-0.5">
                <span className="text-lg sm:text-2xl font-black italic tracking-tighter text-text-primary uppercase group-hover:text-f1-red transition-colors">
                  Dammy<span className="text-f1-red group-hover:text-text-primary transition-colors">Live</span>
                </span>
                <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-text-muted hidden xs:block">
                  Telemetry Hub // 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-bg-subtle p-1 rounded-xl border border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 xl:px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive(link.to)
                      ? 'bg-f1-red text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white'
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden xl:flex items-center gap-2 text-[10px] font-black text-f1-red uppercase tracking-widest bg-f1-red/5 px-4 py-2 border border-f1-red/10 rounded-xl">
                <Radio className="w-3 h-3 animate-pulse" />
                System Active
              </div>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-bg-subtle border border-border rounded-xl">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 bg-f1-red rounded-full flex items-center justify-center text-white text-[8px] font-black">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-primary max-w-[80px] truncate">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-1 px-3 py-2 bg-text-primary text-white hover:bg-f1-red transition-all rounded-xl"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Exit</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-text-primary text-white hover:bg-f1-red transition-all rounded-xl"
                >
                  <UserCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Join Network</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 border border-border rounded-xl hover:bg-bg-subtle transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <nav className="absolute top-0 right-0 w-[80%] max-w-[320px] h-full bg-white border-l border-border shadow-xl flex flex-col animate-slide-in-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="DammyLive" className="w-7 h-7 object-contain" />
                <span className="text-lg font-black italic tracking-tighter text-text-primary uppercase">
                  Dammy<span className="text-f1-red">Live</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center border border-border rounded-xl hover:bg-bg-subtle transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-l-4 ${
                    isActive(link.to)
                      ? 'bg-f1-red/5 text-f1-red border-l-f1-red'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle border-l-transparent'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-border">
              <div className="flex items-center gap-2 text-[10px] font-black text-f1-red uppercase tracking-widest bg-f1-red/5 px-4 py-3 border border-f1-red/10 rounded-xl mb-4 justify-center">
                <Radio className="w-3 h-3 animate-pulse" />
                System Active
              </div>
              {!isAuthenticated && (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <UserCircle2 className="w-4 h-4" />
                  Join Network
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </>
  )
}
