/**
 * WeatherOverlay Component
 * Displays current session weather conditions
 */

import { Weather } from '@/types/f1'

interface WeatherOverlayProps {
  weather: Weather | null
  isLoading?: boolean
}

/**
 * Weather display with icons and conditions
 * Shows temperature, humidity, pressure, rainfall status
 */
export default function WeatherOverlay({
  weather,
  isLoading = false,
}: WeatherOverlayProps) {
  if (isLoading) {
    return (
      <div className="p-4 bg-muted rounded-lg animate-pulse">
        <div className="h-4 bg-muted-foreground/20 rounded w-32" />
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        Weather data unavailable
      </div>
    )
  }

  const rainIcon = weather.rainfall ? '🌧️' : '☀️'
  const windDirection = `${weather.wind_direction.toFixed(0)}°`
  const windSpeed = `${weather.wind_speed.toFixed(1)} m/s`

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-card rounded-lg border border-border">
      {/* Air Temperature */}
      <div className="text-center">
        <div className="text-2xl mb-1">🌡️</div>
        <div className="text-xs text-muted-foreground">Air</div>
        <div className="text-lg font-semibold">{weather.air_temperature}°C</div>
      </div>

      {/* Track Temperature */}
      <div className="text-center">
        <div className="text-2xl mb-1">🏁</div>
        <div className="text-xs text-muted-foreground">Track</div>
        <div className="text-lg font-semibold">{weather.track_temperature}°C</div>
      </div>

      {/* Humidity */}
      <div className="text-center">
        <div className="text-2xl mb-1">💧</div>
        <div className="text-xs text-muted-foreground">Humidity</div>
        <div className="text-lg font-semibold">{weather.humidity}%</div>
      </div>

      {/* Rainfall */}
      <div className="text-center">
        <div className="text-2xl mb-1">{rainIcon}</div>
        <div className="text-xs text-muted-foreground">Rainfall</div>
        <div className="text-lg font-semibold">
          {weather.rainfall ? 'Yes' : 'No'}
        </div>
      </div>

      {/* Wind */}
      <div className="text-center">
        <div className="text-2xl mb-1">💨</div>
        <div className="text-xs text-muted-foreground">Wind</div>
        <div className="text-sm font-semibold">
          {windSpeed}
          <br />
          {windDirection}
        </div>
      </div>
    </div>
  )
}
