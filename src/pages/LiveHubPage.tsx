/**
 * LiveHubPage - Redirects to active session or shows live session list
 * Now requires authentication to access live race data
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

  // Auth gate — redirect unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="p-8 sm:p-12 border border-border bg-white rounded-sm">
            <div className="w-16 h-16 bg-f1-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-f1-red" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-f1-red text-white text-[10px] font-black uppercase tracking-widest mb-6">
              Access Restricted
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary uppercase italic tracking-tighter leading-none mb-4">
              Live <span className="text-f1-red">Telemetry</span> Feed
            </h1>
            <p className="text-text-secondary text-sm mb-8 leading-relaxed">
              Sign in or create an account to access real-time race data, live timing, and telemetry feeds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/auth"
                className="btn-primary px-8 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
              >
                Sign In
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/schedule"
                className="px-8 py-4 border-2 border-border text-text-primary font-black uppercase tracking-widest hover:border-text-primary transition-all text-xs text-center rounded-sm"
              >
                View Schedule
              </Link>
            </div>
          </div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-6">
            Free accounts get full access to live feeds
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
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white">
        <LoadingSpinner />
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">Syncing Engine...</p>
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

  // If no active session, find the most recent past one
  const pastSessions = sessions?.filter(s => new Date(s.date_end || s.date_start) < now)
    .sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime())

  if (pastSessions && pastSessions.length > 0) {
    return <Navigate to={`/live/${pastSessions[0].session_key}`} replace />
  }

  return (
    <div className="container py-16 sm:py-32 text-center px-4">
      <div className="max-w-md mx-auto p-8 sm:p-12 border-2 border-dashed border-border rounded-sm">
        <Activity className="w-12 h-12 text-f1-red mx-auto mb-6 animate-pulse" />
        <h1 className="text-xl font-black text-text-primary uppercase italic mb-2">No Active Transmission</h1>
        <p className="text-text-secondary text-sm mb-8">Currently between sessions. Please check the schedule for upcoming events.</p>
        <Navigate to="/schedule" />
      </div>
    </div>
  )
}
