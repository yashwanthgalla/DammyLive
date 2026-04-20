/**
 * TireBadge Component
 * Displays tire compound with F1 official colors
 */

import { TyreCompound } from '@/types/f1'
import {
  getTyreBadgeClasses,
  getTyreLabel,
  getTyreHex,
} from '@/utils/tireColors'

interface TireBadgeProps {
  compound: TyreCompound
  laps?: number
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Tire badge with compound color and optional lap count
 */
export function TireBadge({
  compound,
  laps,
  size = 'md',
}: TireBadgeProps) {
  const label = getTyreLabel(compound)
  const classes = getTyreBadgeClasses(compound)
  const hex = getTyreHex(compound)

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return (
    <div
      className={`${classes} ${sizeClasses[size]} inline-flex items-center gap-1 rounded`}
      title={`${label} tyre${laps ? ` (${laps} laps)` : ''}`}
      style={{ backgroundColor: hex }}
    >
      <span>{label}</span>
      {laps !== undefined && laps > 0 && (
        <span className="opacity-75">({laps}L)</span>
      )}
    </div>
  )
}
