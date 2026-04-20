/**
 * useDebouncedState Hook
 * Debounces state updates to prevent excessive re-renders
 * Useful for user input that doesn't need immediate updates
 */

import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Custom hook for debounced state
 * @param initialValue - Initial state value
 * @param delay - Debounce delay in milliseconds
 * @returns [value, setValue] - Similar to useState but debounced
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay = 300
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const setDebouncedState = useCallback(
    (value: T | ((prev: T) => T)): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setState(value)
      }, delay)
    },
    [delay]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [state, setDebouncedState]
}
