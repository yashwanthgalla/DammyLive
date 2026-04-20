/**
 * StrategyGraph Component
 * Visualizes tire strategy across drivers and stint analysis
 */

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { Position, Lap } from '@/types/f1'
import { getTyreHex, getTyreLabel } from '@/utils/tireColors'

interface StrategyPoint {
  driverNumber: number
  driverName: string
  lapNumber: number
  tireAge: number
  compound: string
  position: number
}

interface StrategyGraphProps {
  positions: Position[]
  laps: Lap[]
  height?: number
}

/**
 * Custom tooltip for strategy chart
 */
function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as StrategyPoint

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold">{data.driverName}</p>
        <p className="text-xs text-muted-foreground">
          Lap: {data.lapNumber}
        </p>
        <p className="text-xs text-muted-foreground">
          Compound: {getTyreLabel(data.compound as any)}
        </p>
        <p className="text-xs text-muted-foreground">
          Age: {data.tireAge} laps
        </p>
      </div>
    )
  }

  return null
}

/**
 * Tire strategy visualization - shows stint progression and compound changes
 */
export default function StrategyGraph({
  positions,
  laps,
  height = 400,
}: StrategyGraphProps) {
  // Build driver name map
  const driverMap = new Map(
    positions.map((p) => [
      p.driver_number,
      `P${p.position} - ${p.driver_number}`,
    ])
  )

  // Prepare strategy data: group laps by driver and tire stint
  const strategyData: StrategyPoint[] = []

  for (const lap of laps) {
    const driverName = driverMap.get(lap.driver_number) || `Driver ${lap.driver_number}`
    const position = positions.find((p) => p.driver_number === lap.driver_number)?.position || 99

    strategyData.push({
      driverNumber: lap.driver_number,
      driverName,
      lapNumber: lap.lap_number,
      tireAge: lap.tyre_age || 0,
      compound: lap.tyre_compound,
      position,
    })
  }

  if (strategyData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          No strategy data available
        </p>
      </div>
    )
  }

  // Group by compound for visualization
  const compounds = [...new Set(strategyData.map((d) => d.compound))]

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold mb-4">Tire Strategy Analysis</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="lapNumber"
            label={{ value: 'Lap Number', position: 'insideBottomRight', offset: -10 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            type="number"
            dataKey="tireAge"
            label={{ value: 'Tire Age (laps)', angle: -90, position: 'insideLeft' }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Plot each compound with different color */}
          {compounds.map((compound) => (
            <Scatter
              key={compound}
              name={getTyreLabel(compound as any)}
              data={strategyData.filter((d) => d.compound === compound)}
              fill={getTyreHex(compound as any)}
              fillOpacity={0.7}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {compounds.map((compound) => (
          <div key={compound} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getTyreHex(compound as any) }}
            />
            <span className="text-sm">{getTyreLabel(compound as any)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
