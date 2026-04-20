/**
 * Global UI Store using Zustand
 * Manages: theme, selected session, filters, preferences
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { UIState, Session } from '@/types/f1'

interface UIStore extends UIState {
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setSelectedYear: (year: number) => void
  setSelectedCircuit: (circuit: string | undefined) => void
  setShowLegend: (show: boolean) => void
  setExpandedDriver: (driverNumber: number | undefined) => void
}

const initialState: UIState = {
  theme: 'light',
  selectedYear: new Date().getFullYear(),
  selectedCircuit: undefined,
  showLegend: true,
  expandedDriver: undefined,
}

/**
 * UI Store - persisted to localStorage
 * Used for theme, year selection, filter state
 */
export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setTheme: () => {
          set({ theme: 'light' } as Partial<UIStore>)
          document.documentElement.classList.remove('dark')
        },

        toggleTheme: () => {
          set({ theme: 'light' } as Partial<UIStore>)
          document.documentElement.classList.remove('dark')
        },

        setSelectedYear: (year: number) => {
          set({ selectedYear: year } as Partial<UIStore>)
        },

        setSelectedCircuit: (circuit: string | undefined) => {
          set({ selectedCircuit: circuit } as Partial<UIStore>)
        },

        setShowLegend: (show: boolean) => {
          set({ showLegend: show } as Partial<UIStore>)
        },

        setExpandedDriver: (driverNumber: number | undefined) => {
          set({ expandedDriver: driverNumber } as Partial<UIStore>)
        },
      }),
      {
        name: 'f1-dashboard-ui',
        version: 1,
      }
    )
  )
)

/**
 * Session-specific store (not persisted)
 * Manages live session data without persistence
 */
interface SessionStore {
  selectedSession: Session | null
  setSelectedSession: (session: Session | null) => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  selectedSession: null,
  setSelectedSession: (session: Session | null) => {
    set({ selectedSession: session })
  },
}))
