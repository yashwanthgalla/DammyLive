/**
 * OpenF1 API Endpoints
 * Real-time F1 timing data: positions, laps, weather, pit stops
 * Base: https://api.openf1.org
 */

import { createApiClient } from './client'
import {
  Session,
  Position,
  Lap,
  Weather,
  PitStop,
  Driver,
} from '@/types/f1'

const openf1Client = createApiClient('https://api.openf1.org/v1')

/**
 * Get all sessions for a given year and optionally filtered by week
 * @param year - Calendar year (e.g., 2026)
 * @param week - Optional session week
 */
export async function getSessions(
  year: number,
  week?: number
): Promise<Session[]> {
  const params: Record<string, number | string> = { year }
  if (week) params.week = week

  const { data } = await openf1Client.get<Session[]>('/sessions', { params })
  return data
}

/**
 * Get a specific session by key
 */
export async function getSession(sessionKey: number): Promise<Session> {
  const { data } = await openf1Client.get<Session[]>('/sessions', {
    params: { session_key: sessionKey },
  })
  return data[0]
}

/**
 * Get current/latest session based on system time
 * Returns the most recent session that has started
 */
export async function getCurrentSession(): Promise<Session | null> {
  const currentYear = new Date().getFullYear()
  const sessions = await getSessions(currentYear)

  const now = new Date()
  const currentSession = sessions
    .filter((s) => new Date(s.date_start) <= now)
    .sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime())[0]

  return currentSession || null
}

/**
 * Get live positions for a session
 * High-frequency endpoint: use ?speed=fast for real-time updates
 * @param sessionKey - Session identifier
 */
export async function getPositions(
  sessionKey: number
): Promise<Position[]> {
  const { data } = await openf1Client.get<Position[]>('/position', {
    params: {
      session_key: sessionKey,
    },
  })
  return data
}

/**
 * Get final positions for a completed session
 */
export async function getSessionFinalPositions(
  sessionKey: number
): Promise<Position[]> {
  const positions = await getPositions(sessionKey)
  
  // Group by driver and get their last recorded position
  const latestByDriver = new Map<number, Position>()
  
  positions.forEach((pos) => {
    // We assume the records are either chronologically ordered by the API, 
    // or we can use the 'date' field if it exists. Since the API usually returns chronologically,
    // the last one we iterate over is the latest.
    latestByDriver.set(pos.driver_number, pos)
  })
  
  return Array.from(latestByDriver.values()).sort((a, b) => a.position - b.position)
}

/**
 * Get lap data for a session
 * Includes sector times, tyre info, lap status
 * @param sessionKey - Session identifier
 * @param driverNumber - Optional: filter by driver
 */
export async function getLaps(
  sessionKey: number,
  driverNumber?: number
): Promise<Lap[]> {
  const params: Record<string, number> = { session_key: sessionKey }
  if (driverNumber) params.driver_number = driverNumber

  const { data } = await openf1Client.get<Lap[]>('/laps', { params })
  return data
}

/**
 * Get weather data for a session
 * Updated periodically during sessions
 */
export async function getWeather(sessionKey: number): Promise<Weather | null> {
  try {
    const { data } = await openf1Client.get<Weather[]>('/weather', {
      params: { session_key: sessionKey },
    })
    return data && data.length > 0 ? data[data.length - 1] : null
  } catch {
    console.warn('Failed to fetch weather data')
    return null
  }
}

/**
 * Get pit stop history for a session
 * @param sessionKey - Session identifier
 * @param driverNumber - Optional: filter by driver
 */
export async function getPitStops(
  sessionKey: number,
  driverNumber?: number
): Promise<PitStop[]> {
  const params: Record<string, number> = { session_key: sessionKey }
  if (driverNumber) params.driver_number = driverNumber

  const { data } = await openf1Client.get<PitStop[]>('/pit_stops', { params })
  return data
}

/**
 * Get driver information for a session
 */
export async function getDrivers(sessionKey: number): Promise<Driver[]> {
  const { data } = await openf1Client.get<Driver[]>('/drivers', {
    params: { session_key: sessionKey },
  })
  return data
}

/**
 * WebSocket URL for real-time streaming
 * Use with exponential backoff reconnection
 */
export function getWebSocketURL(sessionKey: number): string {
  return `wss://api.openf1.org/v1/stream?session=${sessionKey}`
}
