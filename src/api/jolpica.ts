/**
 * Jolpica F1 API Endpoints
 * Historical data: standings, circuits, schedule
 * Base: https://api.jolpi.ca/ergast/f1
 */

import { createApiClient } from './client'
import {
  DriverStanding,
  ConstructorStanding,
  Circuit,
} from '@/types/f1'

const jolpicaClient = createApiClient('https://api.jolpi.ca/ergast/f1')

/**
 * Get current driver standings for a season
 * @param year - Calendar year
 */
export async function getDriverStandings(
  year: number
): Promise<DriverStanding[]> {
  try {
    const { data } = await jolpicaClient.get<{
      MRData: {
        StandingsTable: {
          StandingsLists: Array<{
            DriverStandings: Array<any>
          }>
        }
      }
    }>(`/${year}/driverStandings`)

    const standings =
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || []

    // Map Ergast API response to DriverStanding format
    return standings.map((standing: any) => ({
      position: parseInt(standing.position || '0', 10),
      points: parseInt(standing.points || '0', 10),
      wins: parseInt(standing.wins || '0', 10),
      driver: {
        driverId: standing.Driver?.driverId || '',
        code: standing.Driver?.code || '',
        givenName: standing.Driver?.givenName || '',
        familyName: standing.Driver?.familyName || '',
        dateOfBirth: standing.Driver?.dateOfBirth || '',
        nationality: standing.Driver?.nationality || '',
      },
      constructor: {
        constructorId: standing.Constructors?.[0]?.constructorId || '',
        name: standing.Constructors?.[0]?.name || '',
        nationality: standing.Constructors?.[0]?.nationality || '',
      },
    }))
  } catch (error) {
    console.warn(`Failed to fetch driver standings for ${year}:`, error)
    return []
  }
}

/**
 * Get current constructor standings for a season
 * @param year - Calendar year
 */
export async function getConstructorStandings(
  year: number
): Promise<ConstructorStanding[]> {
  try {
    const { data } = await jolpicaClient.get<{
      MRData: {
        StandingsTable: {
          StandingsLists: Array<{
            ConstructorStandings: Array<any>
          }>
        }
      }
    }>(`/${year}/constructorStandings`)

    const standings =
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || []

    // Map Ergast API response to ConstructorStanding format
    return standings.map((standing: any) => ({
      position: parseInt(standing.position || '0', 10),
      points: parseInt(standing.points || '0', 10),
      wins: parseInt(standing.wins || '0', 10),
      constructor: {
        constructorId: standing.Constructor?.constructorId || '',
        name: standing.Constructor?.name || '',
        nationality: standing.Constructor?.nationality || '',
      },
    }))
  } catch (error) {
    console.warn(`Failed to fetch constructor standings for ${year}:`, error)
    return []
  }
}

/**
 * Get all circuits ever used in F1 (1950 → present)
 * Includes all historical tracks
 */
export async function getCircuits(): Promise<Circuit[]> {
  try {
    const { data } = await jolpicaClient.get<{
      MRData: {
        CircuitTable: {
          Circuits: any[]
        }
      }
    }>('/circuits', { params: { limit: 200 } })

    const circuits = (data?.MRData?.CircuitTable?.Circuits || []).map((c: any) => ({
      circuitId: c.circuitId || '',
      circuitRef: c.circuitRef || c.circuitId || '',
      name: c.circuitName || c.name || '',
      location: c.Location?.locality || '',
      country: c.Location?.country || '',
      lat: parseFloat(c.Location?.lat) || 0,
      lng: parseFloat(c.Location?.long) || 0,
      url: c.url || '',
    }))
    return circuits
  } catch (error) {
    console.warn('Failed to fetch circuits:', error)
    return []
  }
}

/**
 * Get circuit details by ID
 */
export async function getCircuit(circuitId: string): Promise<Circuit | null> {
  try {
    const circuits = await getCircuits()
    return circuits.find((c) => c.circuitId === circuitId) || null
  } catch (error) {
    console.warn(`Failed to fetch circuit ${circuitId}:`, error)
    return null
  }
}

/**
 * Get circuits for current F1 season
 * Fetches the schedule and extracts unique circuits
 */
export async function getCurrentSeasonCircuits(): Promise<Circuit[]> {
  try {
    const currentYear = new Date().getFullYear()
    
    // Get schedule for current year
    const { data } = await jolpicaClient.get<{
      MRData: {
        RaceTable: {
          Races: Array<{
            Circuit: any
          }>
        }
      }
    }>(`/${currentYear}`)

    const races = data?.MRData?.RaceTable?.Races || []
    
    // Extract unique circuits from races
    const circuitMap = new Map<string, Circuit>()
    races.forEach((race: any) => {
      if (race.Circuit) {
        const circuit: Circuit = {
          circuitId: race.Circuit.circuitId || '',
          circuitRef: race.Circuit.circuitRef || '',
          name: race.Circuit.name || '',
          location: race.Circuit.Location?.locality || '',
          country: race.Circuit.Location?.country || '',
          lat: parseFloat(race.Circuit.Location?.lat) || 0,
          lng: parseFloat(race.Circuit.Location?.long) || 0,
          url: race.Circuit.url || '',
        }
        circuitMap.set(circuit.circuitId, circuit)
      }
    })

    return Array.from(circuitMap.values())
  } catch (error) {
    console.warn('Failed to fetch current season circuits:', error)
    return []
  }
}

/**
 * Get winners for all races in a season
 * @param year - Calendar year
 */
export async function getSeasonResults(year: number): Promise<any[]> {
  try {
    const { data } = await jolpicaClient.get<{
      MRData: {
        RaceTable: {
          Races: any[]
        }
      }
    }>(`/${year}/results/1`)

    return data?.MRData?.RaceTable?.Races || []
  } catch (error) {
    console.warn(`Failed to fetch season results for ${year}:`, error)
    return []
  }
}
