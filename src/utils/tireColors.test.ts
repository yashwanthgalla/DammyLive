/**
 * Tests for Tire Colors Utilities
 */

import { describe, it, expect } from 'vitest'
import {
  getTyreStyle,
  getTyreLabel,
  getTyreBgClass,
  getTyreHex,
  getTyreBadgeClasses,
  parseTyreCompound,
} from '@/utils/tireColors'

describe('Tire Colors', () => {
  describe('getTyreStyle', () => {
    it('returns correct style for SOFT', () => {
      const style = getTyreStyle('SOFT')
      expect(style.label).toBe('Soft')
      expect(style.hex).toBe('#E10600')
    })

    it('returns correct style for each compound', () => {
      expect(getTyreStyle('MEDIUM').label).toBe('Medium')
      expect(getTyreStyle('HARD').label).toBe('Hard')
      expect(getTyreStyle('INTERMEDIATE').label).toBe('Inter')
      expect(getTyreStyle('WET').label).toBe('Wet')
    })
  })

  describe('getTyreLabel', () => {
    it('returns correct labels', () => {
      expect(getTyreLabel('SOFT')).toBe('Soft')
      expect(getTyreLabel('MEDIUM')).toBe('Medium')
      expect(getTyreLabel('HARD')).toBe('Hard')
    })
  })

  describe('getTyreHex', () => {
    it('returns correct hex values', () => {
      expect(getTyreHex('SOFT')).toBe('#E10600')
      expect(getTyreHex('MEDIUM')).toBe('#FDD835')
      expect(getTyreHex('HARD')).toBe('#FFFFFF')
    })
  })

  describe('parseTyreCompound', () => {
    it('parses uppercase strings', () => {
      expect(parseTyreCompound('SOFT')).toBe('SOFT')
      expect(parseTyreCompound('MEDIUM')).toBe('MEDIUM')
    })

    it('returns HARD as fallback', () => {
      expect(parseTyreCompound('INVALID')).toBe('HARD')
      expect(parseTyreCompound(null)).toBe('HARD')
    })
  })

  describe('getTyreBadgeClasses', () => {
    it('returns valid Tailwind classes', () => {
      const classes = getTyreBadgeClasses('SOFT')
      expect(classes).toContain('bg-red')
      expect(classes).toContain('text-white')
      expect(classes).toContain('px-2')
    })
  })
})
