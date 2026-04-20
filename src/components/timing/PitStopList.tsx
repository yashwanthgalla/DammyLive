/**
 * PitStopList Component
 * Displays pit stop history for a session or driver
 */

import { PitStop } from '@/types/f1'
import { formatPitStopTime } from '@/utils/timeFormatters'
import { TireBadge } from './TireBadge'

interface PitStopListProps {
  pitStops: PitStop[]
  maxItems?: number
  isLoading?: boolean
}

/**
 * List of pit stops with timing and tire information
 * Shows pit stop number, lap, duration, and tire changes
 */
export default function PitStopList({
  pitStops,
  maxItems = 10,
  isLoading = false,
}: PitStopListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-muted rounded animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (pitStops.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No pit stops yet
      </div>
    )
  }

  const displayStops = pitStops.slice(0, maxItems)

  return (
    <div className="space-y-2">
      {displayStops.map((stop) => (
        <div
          key={stop.pit_stop_number}
          className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Stop number badge */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded font-bold text-xs">
              {stop.pit_stop_number}
            </div>

            {/* Lap and duration info */}
            <div className="min-w-0">
              <div className="font-semibold">Lap {stop.lap_number}</div>
              <div className="text-xs text-muted-foreground">
                Duration: {formatPitStopTime(stop.duration)}
              </div>
            </div>
          </div>

          {/* Tire change info */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right text-xs text-muted-foreground">
              {stop.tyre_new ? 'New' : 'Used'} tyres
            </div>
            <TireBadge compound={stop.tyre_compound_out} size="sm" />
          </div>
        </div>
      ))}

      {pitStops.length > maxItems && (
        <div className="text-xs text-muted-foreground text-center pt-2">
          +{pitStops.length - maxItems} more
        </div>
      )}
    </div>
  )
}
