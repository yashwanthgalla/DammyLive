/**
 * LiveHubPage - Redirects to active session or shows live session list
 * Luxury Editorial Edition — Auth gate with editorial styling
 */

import { useQuery } from '@tanstack/react-query'
import { getSessions } from '@/api/openf1'
import { Navigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Activity, Lock, ChevronRight } from 'lucide-react'

export default function LiveHubPage() {
  const { isAuthenticated } = useAuthStore()
  const currentYear = new Date().getFullYear()

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-8">
        <div className="max-w-lg w-full text-center">
          <div className="p-12 md:p-16 border-t border-[#1A1A1A]">
            <Lock className="w-8 h-8 text-[#D4AF37] mx-auto mb-8" strokeWidth={1.5} />
            <div className="flex items-center gap-4 justify-center mb-8">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                Access Required
              </span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] leading-[0.9] mb-4">
              Live <em className="text-[#D4AF37]">Telemetry</em>
            </h1>
            <p className="font-sans text-sm text-[#6C6863] mb-10 leading-relaxed max-w-sm mx-auto">
              Sign in to access real-time race data, live timing, and telemetry feeds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="btn-primary">
                <span className="flex items-center gap-2">
                  Sign In
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </span>
              </Link>
              <Link to="/schedule" className="btn-secondary text-center">
                View Schedule
              </Link>
            </div>
          </div>
          <p className="font-sans text-[10px] font-medium text-[#6C6863] uppercase tracking-[0.25em] mt-8">
            Free accounts get full access
          </p>
        </div>
      </div>
    )
  }

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions', currentYear],
    queryFn: () => getSessions(currentYear),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#F9F8F6]">
        <LoadingSpinner />
      </div>
    )
  }

  // Find active session
  const now = new Date()
  const activeSession = sessions?.find(s => {
    const start = new Date(s.date_start)
    const end = s.date_end ? new Date(s.date_end) : new Date(start.getTime() + 2 * 60 * 60 * 1000)
    return start <= now && end >= now
  })

  if (activeSession) {
    return <Navigate to={`/live/${activeSession.session_key}`} replace />
  }

  // Most recent past session
  const pastSessions = sessions?.filter(s => new Date(s.date_end || s.date_start) < now)
    .sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime())

  if (pastSessions && pastSessions.length > 0) {
    return <Navigate to={`/live/${pastSessions[0].session_key}`} replace />
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-32 text-center">
      <div className="max-w-md mx-auto p-12 border-t border-[#1A1A1A]">
        <Activity className="w-10 h-10 text-[#D4AF37] mx-auto mb-6 animate-pulse" strokeWidth={1.5} />
        <h1 className="font-serif text-2xl text-[#1A1A1A] mb-3">No Active Session</h1>
        <p className="font-sans text-sm text-[#6C6863] mb-8">Between sessions. Check the schedule for upcoming events.</p>
        <Navigate to="/schedule" />
      </div>
    </div>
  )
}
