/**
 * LapTimeChart Component
 * Recharts-based visualization of lap times throughout session
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { Lap } from '@/types/f1'
import { formatLapTime } from '@/utils/timeFormatters'

interface LapData {
  lapNumber: number
  lapTime: number
  isPersonalBest: boolean
  isSessionBest: boolean
  tyreCompound: string
}

interface LapTimeChartProps {
  driverName: string
  laps: Lap[]
  height?: number
}

/**
 * Custom tooltip for lap time chart
 */
function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as LapData

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold mb-1">Lap {data.lapNumber}</p>
        <p className="text-sm text-muted-foreground">
          {formatLapTime(data.lapTime)}
        </p>
        {data.isSessionBest && (
          <p className="text-xs text-primary font-semibold">Session Best</p>
        )}
        {data.isPersonalBest && (
          <p className="text-xs text-ring font-semibold">Personal Best</p>
        )}
        <p className="text-xs text-muted-foreground">{data.tyreCompound}</p>
      </div>
    )
  }

  return null
}

/**
 * Lap time progression chart for driver analysis
 */
export default function LapTimeChart({
  driverName,
  laps,
  height = 300,
}: LapTimeChartProps) {
  // Filter valid lap times and prepare data
  const chartData: LapData[] = laps
    .filter((lap) => lap.lap_duration && lap.lap_duration > 0)
    .map((lap) => ({
      lapNumber: lap.lap_number,
      lapTime: lap.lap_duration!,
      isPersonalBest: lap.is_personal_best,
      isSessionBest: lap.is_session_best,
      tyreCompound: lap.tyre_compound,
    }))

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          No lap data available
        </p>
      </div>
    )
  }

  // Calculate min and max for Y-axis with padding
  const times = chartData.map((d) => d.lapTime)
  const minTime = Math.min(...times)
  const maxTime = Math.max(...times)
  const padding = (maxTime - minTime) * 0.1

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold mb-4">{driverName} - Lap Times</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="lapNumber"
            label={{ value: 'Lap Number', position: 'insideBottomRight', offset: -5 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            label={{ value: 'Lap Time (ms)', angle: -90, position: 'insideLeft' }}
            domain={[minTime - padding, maxTime + padding]}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="lapTime"
            stroke="hsl(var(--primary))"
            dot={(props) => {
              const { cx, cy, payload } = props
              const data = payload as LapData

              if (data.isSessionBest) {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  />
                )
              }

              if (data.isPersonalBest) {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="hsl(var(--ring))"
                    stroke="hsl(var(--card))"
                    strokeWidth={1}
                  />
                )
              }

              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={2}
                  fill="hsl(var(--primary))"
                />
              )
            }}
            isAnimationActive={false}
            name="Lap Time"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
