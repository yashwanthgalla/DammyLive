/**
 * SessionStatus Component
 * Displays driver status badge (On Track, Pit, Retired, etc.)
 */

import { getStatusBadgeColor } from '@/utils/teamColors'

interface SessionStatusProps {
  status: 'On track' | 'Retired' | 'Not started' | 'Pit'
  lapNumber?: number
  size?: 'sm' | 'md'
}

/**
 * Status badge with appropriate color based on driver condition
 */
export default function SessionStatus({
  status,
  lapNumber,
  size = 'sm',
}: SessionStatusProps) {
  const { bg, text } = getStatusBadgeColor(status)

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  const statusDisplay = {
    'On track': '🏁 On Track',
    Pit: '⚙️ Pit',
    Retired: '❌ Retired',
    'Not started': '⏳ Not Started',
  }

  return (
    <div className={`${bg} ${text} ${sizeClasses[size]} rounded font-semibold inline-flex items-center gap-1`}>
      <span>{statusDisplay[status]}</span>
      {lapNumber && status === 'On track' && (
        <span className="opacity-75 ml-1">L{lapNumber}</span>
      )}
    </div>
  )
}
