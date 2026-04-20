/**
 * useSessionTimer Hook
 * Manages countdown timer to session start and elapsed time during session
 */

import { useState, useEffect } from 'react'
import { getCountdownTime } from '@/utils/timeFormatters'

export interface SessionTimerState {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  total: number
  elapsedSeconds?: number
}

/**
 * Hook for session countdown timer
 * @param dateStart - ISO date string of session start
 * @param isRunning - Whether timer should be active
 * @returns Current countdown state
 */
export function useSessionTimer(
  dateStart: string,
  isRunning = true
): SessionTimerState {
  const [state, setState] = useState<SessionTimerState>(() =>
    getCountdownTime(dateStart)
  )

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setState(getCountdownTime(dateStart))
    }, 1000)

    return () => clearInterval(interval)
  }, [dateStart, isRunning])

  return state
}

/**
 * Hook for session elapsed time
 * @param sessionStartMs - Session start time in milliseconds
 * @returns Elapsed seconds since session started
 */
export function useElapsedTime(sessionStartMs: number): number {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const elapsedMs = Math.max(0, now - sessionStartMs)
      setElapsed(Math.floor(elapsedMs / 1000))
    }, 100)

    return () => clearInterval(interval)
  }, [sessionStartMs])

  return elapsed
}

/**
 * Format elapsed time to display
 */
export function formatElapsedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
