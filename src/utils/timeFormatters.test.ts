/**
 * Tests for Time Formatters
 * Unit tests for all time formatting utilities
 */

import { describe, it, expect } from 'vitest'
import {
  formatLapTime,
  formatGap,
  formatInterval,
  formatPitStopTime,
  formatCountdown,
} from '@/utils/timeFormatters'

describe('Time Formatters', () => {
  describe('formatLapTime', () => {
    it('formats milliseconds to mm:ss.sss', () => {
      expect(formatLapTime(95234)).toBe('1:35.234')
    })

    it('handles zero and negative values', () => {
      expect(formatLapTime(0)).toBe('--:--')
      expect(formatLapTime(-100)).toBe('--:--')
    })

    it('handles undefined', () => {
      expect(formatLapTime(undefined)).toBe('--:--')
    })

    it('formats seconds correctly', () => {
      expect(formatLapTime(5000)).toBe('0:05.000')
    })
  })

  describe('formatGap', () => {
    it('formats gap to leader', () => {
      const result = formatGap(10000)
      expect(result).toContain('+')
    })

    it('returns dashes for zero', () => {
      expect(formatGap(0)).toBe('---')
      expect(formatGap(undefined)).toBe('---')
    })

    it('shows minutes for large gaps', () => {
      const result = formatGap(65000)
      expect(result).toContain('m')
    })
  })

  describe('formatInterval', () => {
    it('formats interval in milliseconds', () => {
      const result = formatInterval(500)
      expect(result).toContain('ms')
    })

    it('formats interval in seconds', () => {
      const result = formatInterval(5000)
      expect(result).toContain('s')
    })

    it('formats interval in minutes', () => {
      const result = formatInterval(125000)
      expect(result).toContain('m')
    })
  })

  describe('formatPitStopTime', () => {
    it('formats pit stop duration', () => {
      expect(formatPitStopTime(28.5)).toBe('28.50s')
    })

    it('handles invalid input', () => {
      expect(formatPitStopTime(0)).toBe('--')
      expect(formatPitStopTime(-5)).toBe('--')
    })
  })

  describe('formatCountdown', () => {
    it('returns LIVE for expired countdown', () => {
      const pastDate = new Date(Date.now() - 1000).toISOString()
      expect(formatCountdown(pastDate)).toBe('LIVE')
    })

    it('formats future countdown', () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      const result = formatCountdown(futureDate)
      expect(result).toMatch(/\d+h \d+m/)
    })
  })
})
