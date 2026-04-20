/**
 * LiveTable - Primary Timing Board
 * Minimalist Red Edition
 */

import { Position, Driver, Lap } from '@/types/f1'
import { TireBadge } from './TireBadge'
import { GapCell } from './GapCell'
import { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { getDriverImage } from '@/lib/imageMap'

interface LiveTableProps {
  positions: Position[]
  drivers: Driver[]
  laps: Lap[]
  expandedDriver?: number
  onRowClick: (driverNumber: number) => void
}

export function LiveTable({
  positions,
  drivers,
  laps,
  expandedDriver,
  onRowClick,
}: LiveTableProps) {
  // Map drivers by number
  const driverMap = useMemo(() => {
    const map = new Map<number, Driver>()
    drivers.forEach((d) => map.set(d.driver_number, d))
    return map
  }, [drivers])

  // Get last lap for each driver
  const lastLapMap = useMemo(() => {
    const map = new Map<number, Lap>()
    laps.forEach((l) => {
      const existing = map.get(l.driver_number)
      if (!existing || l.lap_number > existing.lap_number) {
        map.set(l.driver_number, l)
      }
    })
    return map
  }, [laps])

  return (
    <div className="minimal-card overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg-subtle text-[10px] font-black uppercase tracking-widest text-text-muted border-b border-border">
              <th className="px-6 py-4 text-left w-20">POS</th>
              <th className="px-6 py-4 text-left w-16">#</th>
              <th className="px-6 py-4 text-left">Competitor</th>
              <th className="px-6 py-4 text-center">Tire</th>
              <th className="px-6 py-4 text-center">Laps</th>
              <th className="px-6 py-4 text-center">Last Lap</th>
              <th className="px-6 py-4 text-right">Interval</th>
              <th className="px-6 py-4 text-right">Gap</th>
            </tr>
          </thead>
          <tbody>
            {positions
              .sort((a, b) => a.position - b.position)
              .map((pos) => {
                const driver = driverMap.get(pos.driver_number)
                const lastLap = lastLapMap.get(pos.driver_number)
                const isExpanded = expandedDriver === pos.driver_number

                return (
                  <tr
                    key={pos.driver_number}
                    className={`f1-table-row border-b border-border group cursor-pointer ${
                      isExpanded ? 'bg-f1-red/5 border-l-f1-red' : ''
                    }`}
                    onClick={() => onRowClick(pos.driver_number)}
                  >
                    <td className="px-6 py-6">
                      <div className={`text-xl font-black italic tracking-tighter ${pos.position <= 3 ? 'text-f1-red' : 'text-text-primary'}`}>
                        {pos.position.toString().padStart(2, '0')}
                      </div>
                    </td>
                    
                    <td className="px-6 py-6">
                        <div className="text-sm font-black text-text-muted italic group-hover:text-f1-red transition-colors">
                            {pos.driver_number}
                        </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                          <div 
                              className="absolute left-0 top-0 w-1 h-full rounded-sm" 
                              style={{ backgroundColor: driver?.team_colour ? `#${driver.team_colour}` : '#8d8d95' }} 
                          />
                          <div className="w-full h-full ml-1.5 overflow-hidden rounded-lg bg-bg-subtle border border-border flex items-center justify-center">
                            {driver && getDriverImage(driver.last_name) ? (
                              <img 
                                src={getDriverImage(driver.last_name)!}
                                className="absolute top-0 h-[350%] w-auto max-w-none object-contain object-top mt-1"
                                alt={driver.last_name}
                              />
                            ) : (
                              <div className="text-[10px] font-black opacity-20 italic">F1</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-md font-black text-text-primary uppercase italic leading-none group-hover:text-f1-red transition-colors">
                            {driver ? (
                                <>{driver.first_name} <span className="text-f1-red">{driver.last_name}</span></>
                            ) : (
                                'Detecting...'
                            )}
                          </div>
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                            {driver?.team_name || 'Telemetry Hub'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6 text-center">
                      {lastLap ? (
                        <TireBadge 
                            compound={lastLap.tyre_compound} 
                            laps={lastLap.tyre_age} 
                        />
                      ) : (
                        <span className="text-text-muted opacity-30">—</span>
                      )}
                    </td>

                    <td className="px-6 py-6 text-center">
                        <div className="text-sm font-black text-text-primary tabular-nums">
                            {pos.lap_count}
                        </div>
                    </td>

                    <td className="px-6 py-6 text-center">
                      <div className={`text-xs font-black tabular-nums tracking-tighter ${lastLap?.is_personal_best ? 'text-f1-green' : 'text-text-primary'}`}>
                        {lastLap?.lap_duration 
                            ? (lastLap.lap_duration / 1000).toFixed(3)
                            : lastLap?.is_pit_out_lap ? 'PIT' : '—'}
                      </div>
                    </td>

                    <td className="px-6 py-6 text-right">
                      <GapCell position={pos.position} gap={pos.interval} />
                    </td>

                    <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                             <GapCell position={pos.position} gap={pos.gap_to_leader} />
                             <ChevronRight className={`w-3 h-3 text-f1-red transition-all ${isExpanded ? 'rotate-90 opacity-100' : 'opacity-0 group-hover:opacity-40 group-hover:translate-x-1'}`} />
                        </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
