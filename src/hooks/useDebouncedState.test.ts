/**
 * Tests for useDebouncedState Hook
 * Unit tests for debounced state updates
 */

import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useDebouncedState } from '@/hooks/useDebouncedState'

describe('useDebouncedState', () => {
  it('initializes with initial value', () => {
    const { result } = renderHook(() => useDebouncedState(0))
    expect(result.current[0]).toBe(0)
  })

  it('updates state after delay', async () => {
    const { result } = renderHook(() => useDebouncedState(0, 100))
    const [, setState] = result.current

    act(() => {
      setState(5)
    })

    // State should not update immediately
    expect(result.current[0]).toBe(0)

    // Wait for debounce
    await waitFor(() => {
      expect(result.current[0]).toBe(5)
    })
  })

  it('cancels previous updates on new input', async () => {
    const { result } = renderHook(() => useDebouncedState(0, 100))
    const [, setState] = result.current

    act(() => {
      setState(5)
    })

    // Update again before delay
    act(() => {
      setState(10)
    })

    await waitFor(() => {
      // Should skip intermediate value (5) and go directly to 10
      expect(result.current[0]).toBe(10)
    })
  })

  it('accepts function updates', async () => {
    const { result } = renderHook(() => useDebouncedState(0, 100))
    const [, setState] = result.current

    act(() => {
      setState((prev) => prev + 1)
    })

    await waitFor(() => {
      expect(result.current[0]).toBe(1)
    })
  })

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    const { unmount } = renderHook(() => useDebouncedState(0, 100))

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
