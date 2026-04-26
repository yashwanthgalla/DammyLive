/**
 * Header Component
 * Luxury Editorial Edition — Minimal, architectural navigation
 */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, Trophy, Map, Users, Menu, X, LogOut } from 'lucide-react'
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
      <header className="sticky top-0 z-50 w-full border-b border-[#1A1A1A]/10 bg-[#F9F8F6]/95 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-5">
          <div className="flex items-center justify-between">
            {/* Logo — Editorial serif */}
            <Link
              to="/"
              className="flex items-center gap-3 group flex-shrink-0"
              title="DammyLive Editorial"
            >
              <img
                src="/logo.png"
                alt="DammyLive"
                className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all duration-[1500ms]"
              />
              <div className="flex flex-col">
                <span className="font-serif text-xl md:text-2xl text-[#1A1A1A] tracking-tight leading-none group-hover:text-[#D4AF37] transition-colors duration-500">
                  Dammy<em className="text-[#D4AF37] group-hover:text-[#1A1A1A] transition-colors duration-500">Live</em>
                </span>
                <span className="font-sans text-[8px] font-medium uppercase tracking-[0.3em] text-[#6C6863] hidden sm:block">
                  Editorial · 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation — Minimal text links */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-sans text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-500 relative pb-1 ${
                    isActive(link.to)
                      ? 'text-[#1A1A1A]'
                      : 'text-[#6C6863] hover:text-[#D4AF37]'
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1A1A1A]" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-7 h-7 object-cover grayscale hover:grayscale-0 transition-all duration-[1500ms]" />
                    ) : (
                      <div className="w-7 h-7 bg-[#1A1A1A] flex items-center justify-center text-[#F9F8F6] text-[9px] font-sans font-medium uppercase tracking-wider">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#1A1A1A] max-w-[80px] truncate">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span className="hidden sm:inline">Exit</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-[#1A1A1A] hover:text-[#D4AF37] transition-colors duration-500"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
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
            className="absolute inset-0 bg-[#1A1A1A]/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer — Editorial */}
          <nav className="absolute top-0 right-0 w-[80%] max-w-[360px] h-full bg-[#F9F8F6] border-l border-[#1A1A1A]/10 flex flex-col animate-slide-in-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#1A1A1A]/10">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="DammyLive" className="w-6 h-6 object-contain grayscale" />
                <span className="font-serif text-lg text-[#1A1A1A] tracking-tight">
                  Dammy<em className="text-[#D4AF37]">Live</em>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-[#1A1A1A] hover:text-[#D4AF37] transition-colors duration-500"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto py-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-8 py-5 font-sans text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 border-l-2 ${
                    isActive(link.to)
                      ? 'text-[#1A1A1A] border-l-[#D4AF37] bg-[#EBE5DE]/30'
                      : 'text-[#6C6863] hover:text-[#1A1A1A] border-l-transparent hover:border-l-[#1A1A1A]/20'
                  }`}
                >
                  <link.icon className="w-4 h-4" strokeWidth={1.5} />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="px-8 py-6 border-t border-[#1A1A1A]/10">
              <div className="font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-[#6C6863] mb-3">
                Editorial · Volume 01
              </div>
              {!isAuthenticated && (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full py-3 flex items-center justify-center"
                >
                  <span>Sign In</span>
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
        .animate-slide-in-right { animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
      `}</style>
    </>
  )
}
