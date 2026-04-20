/**
 * GapCell Component
 * Displays gap to leader or interval to previous driver
 */

import { formatGap, formatInterval } from '@/utils/timeFormatters'

interface GapCellProps {
  position: number
  gapToLeader?: number
  interval?: number
  gap?: number
}

/**
 * Display gap or interval with proper formatting
 * Position 1 shows nothing (leader), others show gap or interval
 */
export function GapCell({
  position,
  gapToLeader,
  interval,
  gap,
}: GapCellProps) {
  // Leader doesn't need gap display
  if (position === 1) {
    return <div className="text-center text-sm font-medium">-</div>
  }

  // Prefer gap if available, then interval
  const displayValue = gap !== undefined ? gap : gapToLeader ?? interval
  const isGap = gap !== undefined || gapToLeader !== undefined

  const formatted = isGap
    ? formatGap(displayValue)
    : formatInterval(displayValue)

  return (
    <div className="text-center text-sm tabular-nums text-muted-foreground">
      {formatted}
    </div>
  )
}
