/**
 * Core F1 Data Type Definitions
 * Strict TypeScript interfaces for all OpenF1 and Jolpica API responses
 */

// ============ SESSION & TIMING ============

export interface Session {
  session_key: number
  session_name: string
  date_start: string
  date_end?: string
  gmt_offset: string
  session_type: 'Practice' | 'Qualifying' | 'Sprint' | 'Race'
  location: string
  country_code: string
  circuit_key: number
  year: number
}

export interface Driver {
  driver_number: number
  first_name: string
  last_name: string
  full_name: string
  name_acronym: string
  team_name: string
  team_colour: string
  country_code: string
  headshot_url?: string
}

export interface Position {
  session_key: number
  driver_number: number
  position: number
  gap_to_leader?: number
  interval?: number
  status: 'On track' | 'Retired' | 'Not started' | 'Pit'
  lap_count: number
  lap_number?: number
  last_lap_time?: number
  sector_1_session_best?: number
  sector_2_session_best?: number
  sector_3_session_best?: number
  meets_stewards_investigation: boolean
  pit_out_lap?: number
}

export interface Lap {
  session_key: number
  lap_number: number
  driver_number: number
  is_pit_out_lap: boolean
  duration_sector_1?: number
  duration_sector_2?: number
  duration_sector_3?: number
  lap_duration?: number
  is_personal_best: boolean
  is_session_best: boolean
  tyre_compound: TyreCompound
  tyre_age?: number
  fresh_tyre: boolean
  is_inlap: boolean
  is_outlap: boolean
  deleted: boolean
}

export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET'

export interface Weather {
  session_key: number
  date: string
  air_temperature: number
  track_temperature: number
  humidity: number
  pressure: number
  rainfall: boolean
  wind_direction: number
  wind_speed: number
}

export interface PitStop {
  session_key: number
  pit_stop_number: number
  lap_number: number
  driver_number: number
  duration: number
  duration_sector_2: number
  duration_sector_3: number
  duration_delta_sector_2: number
  duration_delta_sector_3: number
  tyre_compound_in: TyreCompound
  tyre_compound_out: TyreCompound
  tyre_new: boolean
}

// ============ STANDINGS ============

export interface DriverStanding {
  position: number
  points: number
  wins: number
  driver: {
    driverId: string
    code: string
    givenName: string
    familyName: string
    dateOfBirth: string
    nationality: string
  }
  constructor: {
    constructorId: string
    name: string
    nationality: string
  }
}

export interface ConstructorStanding {
  position: number
  points: number
  wins: number
  constructor: {
    constructorId: string
    name: string
    nationality: string
  }
}

// ============ CIRCUIT & LOCATION ============

export interface Circuit {
  circuitId: string
  circuitRef: string
  name: string
  location: string
  country: string
  lat: number
  lng: number
  alt?: number
  url: string
  // Optional properties for extended circuit info
  length?: number
  lapRecord?: {
    time: string
    driver: string
  }
  firstGrandPrix?: string
  racesHeld?: number
  mostWins?: {
    driver: string
    count: number
  }
}

export interface TrackInfo {
  length: number
  turns: number
  drsZones: number
  lapRecord?: {
    time: string
    driver: string
    year: number
  }
  weather?: {
    avgTemp: number
    avgRainfall: number
  }
}

// ============ API RESPONSES ============

export interface ApiResponse<T> {
  data: T
  meta?: {
    count: number
    limit: number
    offset: number
  }
}

// ============ UI STATE ============

export interface SessionState {
  selectedSession: Session | null
  livePositions: Position[]
  liveWeather: Weather | null
  liveUpdateTime: number
  isConnected: boolean
  connectionError?: string
}

export interface UIState {
  theme: 'light' | 'dark'
  selectedYear: number
  selectedCircuit?: string
  showLegend: boolean
  expandedDriver?: number
}

// ============ REAL-TIME ============

export interface WebSocketMessage {
  type: 'position' | 'lap' | 'weather' | 'pit_stop' | 'flag'
  timestamp: number
  data: unknown
}

export interface ReconnectConfig {
  maxAttempts: number
  initialDelay: number
  maxDelay: number
  backoffMultiplier: number
}
