/**
 * useLiveSession Hook
 * Manages real-time WebSocket connection or fetches historical data
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { Position, Weather, Lap, PitStop, WebSocketMessage } from '@/types/f1'
import { getWebSocketURL } from '@/api/openf1'

interface UseLiveSessionState {
  positions: Position[]
  weather: Weather | null
  laps: Lap[]
  pitStops: PitStop[]
  isConnected: boolean
  error: string | null
  lastUpdate: number
}

interface UseLiveSessionOptions {
  onUpdate?: (state: UseLiveSessionState) => void
  batchInterval?: number
  isPast?: boolean
  reconnectConfig?: {
    maxAttempts: number
    initialDelayMs: number
    maxDelayMs: number
  }
}

export function useLiveSession(
  sessionKey: number,
  options: UseLiveSessionOptions = {}
) {
  const {
    batchInterval = 200,
    isPast = false,
    reconnectConfig = {
      maxAttempts: 10,
      initialDelayMs: 1000,
      maxDelayMs: 16000,
    },
  } = options

  const [state, setState] = useState<UseLiveSessionState>({
    positions: [],
    weather: null,
    laps: [],
    pitStops: [],
    isConnected: false,
    error: null,
    lastUpdate: 0,
  })

  const wsRef = useRef<WebSocket | null>(null)
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectCountRef = useRef(0)
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null)
  const batchQueueRef = useRef<Partial<UseLiveSessionState>>({})
  const batchTimerRef = useRef<number | null>(null)
  const initialDataFetchedRef = useRef(false)

  const fetchInitialData = useCallback(async (): Promise<void> => {
    if (initialDataFetchedRef.current) return

    try {
      const { getPositions, getWeather, getLaps, getPitStops } = await import('@/api/openf1')
      
      const [positions, weather, laps, pitStops] = await Promise.all([
        getPositions(sessionKey),
        getWeather(sessionKey),
        getLaps(sessionKey),
        getPitStops(sessionKey)
      ])

      setState((prev) => ({
        ...prev,
        positions,
        weather,
        laps,
        pitStops,
        isConnected: isPast,
        lastUpdate: Date.now(),
      }))

      initialDataFetchedRef.current = true
    } catch (error) {
      console.error('Failed to fetch initial data:', error)
    }
  }, [sessionKey, isPast])

  const processBatch = useCallback((): void => {
    if (Object.keys(batchQueueRef.current).length > 0) {
      setState((prev) => ({
        ...prev,
        ...batchQueueRef.current,
        lastUpdate: Date.now(),
      }))
      batchQueueRef.current = {}
    }
  }, [])

  const scheduleBatchProcess = useCallback((): void => {
    if (batchTimerRef.current === null) {
      batchTimerRef.current = window.setTimeout(() => {
        processBatch()
        batchTimerRef.current = null
      }, batchInterval)
    }
  }, [batchInterval, processBatch])

  const handleWebSocketMessage = useCallback(
    (event: MessageEvent): void => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        switch (message.type) {
          case 'position': batchQueueRef.current.positions = message.data as Position[]; break
          case 'weather': batchQueueRef.current.weather = message.data as Weather; break
          case 'lap': batchQueueRef.current.laps = message.data as Lap[]; break
          case 'pit_stop': batchQueueRef.current.pitStops = message.data as PitStop[]; break
        }
        scheduleBatchProcess()
      } catch (error) {
        console.warn('Failed to parse WebSocket message:', error)
      }
    },
    [scheduleBatchProcess]
  )

  const startPolling = useCallback(async (): Promise<void> => {
    if (isPast) return
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current)

    pollingTimerRef.current = setInterval(async () => {
      try {
        const { getPositions, getWeather } = await import('@/api/openf1')
        const [positions, weather] = await Promise.all([
          getPositions(sessionKey),
          getWeather(sessionKey),
        ])

        setState((prev) => ({
          ...prev,
          positions,
          weather,
          lastUpdate: Date.now(),
        }))
      } catch (error) {
        console.warn('Polling error:', error)
      }
    }, 2000) as unknown as NodeJS.Timeout
  }, [sessionKey, isPast])

  const connectWebSocket = useCallback((): void => {
    if (isPast || wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      const url = getWebSocketURL(sessionKey)
      const ws = new WebSocket(url)

      ws.onopen = (): void => {
        reconnectCountRef.current = 0
        setState((prev) => ({ ...prev, isConnected: true, error: null }))
      }

      ws.onmessage = handleWebSocketMessage

      ws.onerror = (): void => {
        setState((prev) => ({ ...prev, error: 'Reconnecting...', isConnected: false }))
      }

      ws.onclose = (): void => {
        wsRef.current = null
        setState((prev) => ({ ...prev, isConnected: false }))
        if (reconnectCountRef.current < reconnectConfig.maxAttempts) {
          const delay = Math.min(reconnectConfig.initialDelayMs * Math.pow(2, reconnectCountRef.current), reconnectConfig.maxDelayMs)
          reconnectTimerRef.current = setTimeout(() => connectWebSocket(), delay)
          reconnectCountRef.current++
        } else {
          startPolling()
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error('WebSocket connection error:', error)
      startPolling()
    }
  }, [sessionKey, isPast, handleWebSocketMessage, reconnectConfig, startPolling])

  const cleanup = useCallback((): void => {
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    if (pollingTimerRef.current) { clearInterval(pollingTimerRef.current); }
    if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); }
    if (batchTimerRef.current !== null) { clearTimeout(batchTimerRef.current); }
  }, [])

  useEffect(() => {
    fetchInitialData()
    if (!isPast) connectWebSocket()
    return cleanup
  }, [sessionKey, isPast, fetchInitialData, connectWebSocket, cleanup])

  return state
}
