/**
 * Countdown Component — Luxury Editorial
 * Displays countdown timer with serif numerals
 */

import { useSessionTimer } from '@/hooks/useSessionTimer'
import { useEffect, useState } from 'react'

interface CountdownProps {
  dateStart: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

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
    return <div className={`text-center font-serif ${size === 'lg' ? 'text-2xl' : 'text-sm'} text-[#6C6863]`}>--:--</div>
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-3xl',
  }

  if (timer.isExpired) {
    return (
      <div className={`${sizeClasses[size]} font-sans font-medium text-[#D4AF37] text-center uppercase tracking-[0.2em] text-xs`}>
        Live
      </div>
    )
  }

  const display = `${timer.days}d ${timer.hours}h ${timer.minutes}m ${timer.seconds}s`

  return (
    <div className={`${sizeClasses[size]} text-center`}>
      <div className="font-mono text-[#1A1A1A] tabular-nums">{display}</div>
      {showLabel && <div className="font-sans text-[10px] text-[#6C6863] mt-1 uppercase tracking-[0.2em]">until start</div>}
    </div>
  )
}
