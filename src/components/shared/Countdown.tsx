/**
 * Countdown Component
 * Displays countdown timer to session start or session status
 */

import { useSessionTimer } from '@/hooks/useSessionTimer'
import { useEffect, useState } from 'react'

interface CountdownProps {
  dateStart: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

/**
 * Countdown timer component
 * Shows time until session or "LIVE" if session has started
 */
export default function Countdown({
  dateStart,
  size = 'md',
  showLabel = true,
}: CountdownProps) {
  const [isMounted, setIsMounted] = useState(false)
  const timer = useSessionTimer(dateStart)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className={`text-center font-semibold ${size === 'lg' ? 'text-2xl' : 'text-sm'}`}>--:--</div>
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-3xl',
  }

  if (timer.isExpired) {
    return (
      <div className={`${sizeClasses[size]} font-bold text-primary text-center`}>
        🔴 LIVE
      </div>
    )
  }

  const display = `${timer.days}d ${timer.hours}h ${timer.minutes}m ${timer.seconds}s`

  return (
    <div className={`${sizeClasses[size]} font-semibold text-center`}>
      <div>{display}</div>
      {showLabel && <div className="text-xs text-muted-foreground mt-1">until start</div>}
    </div>
  )
}
