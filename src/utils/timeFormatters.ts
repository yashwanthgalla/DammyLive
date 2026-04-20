/**
 * Utility Functions - Time Formatting
 * Converts milliseconds to display format (mm:ss.sss, lap times, etc.)
 */

/**
 * Format milliseconds to mm:ss.sss format
 * @param ms - Milliseconds
 * @returns Formatted time string
 */
export function formatLapTime(ms: number | undefined): string {
  if (!ms || ms <= 0) return '--:--'

  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toFixed(3).padStart(7, '0')}`
}

/**
 * Format time gap between drivers
 * Shows in +mm:ss.sss or negative format
 */
export function formatGap(ms: number | undefined): string {
  if (!ms || ms <= 0) return '---'

  const totalSeconds = ms / 1000
  if (totalSeconds < 60) {
    return `+${totalSeconds.toFixed(3)}`
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `+${minutes}m${seconds.toFixed(1)}s`
}

/**
 * Format interval between consecutive drivers
 */
export function formatInterval(ms: number | undefined): string {
  if (!ms || ms <= 0) return '---'

  const totalSeconds = ms / 1000

  if (totalSeconds < 1) {
    return `${(ms).toFixed(0)}ms`
  }

  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(2)}s`
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m${seconds.toFixed(1)}s`
}

/**
 * Format pit stop duration
 * Shows duration of stop including tire change
 */
export function formatPitStopTime(seconds: number): string {
  if (!seconds || seconds <= 0) return '--'

  return `${seconds.toFixed(2)}s`
}

/**
 * Format session countdown timer
 * @param dateStart - ISO date string of session start
 * @returns { days, hours, minutes, seconds, isExpired }
 */
export function getCountdownTime(dateStart: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  total: number
} {
  const now = new Date().getTime()
  const sessionTime = new Date(dateStart).getTime()
  const diff = sessionTime - now

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      total: 0,
    }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    total: diff,
  }
}

/**
 * Format countdown for display
 * Returns string like "2d 14h" or "45m 30s"
 */
export function formatCountdown(dateStart: string): string {
  const { days, hours, minutes, seconds, isExpired } = getCountdownTime(dateStart)

  if (isExpired) return 'LIVE'

  if (days > 0) {
    return `${days}d ${hours}h`
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }

  return `${seconds}s`
}

/**
 * Format session date/time for display
 */
export function formatSessionDateTime(dateStart: string, _gmtOffset: string): string {
  const date = new Date(dateStart)

  const day = date.toLocaleDateString('en-US', { weekday: 'short' })
  const dayNum = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return `${day} ${dayNum} ${month} @ ${time}`
}

/**
 * Format tyre age in laps
 */
export function formatTyreAge(laps: number | undefined): string {
  if (!laps || laps === 0) return 'NEW'
  return `${laps}L`
}
