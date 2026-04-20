/**
 * Utility Functions - Tire/Tyre Styling
 * Maps tire compounds to F1 standard colors and CSS classes
 */

import { TyreCompound } from '@/types/f1'

export interface TyreStyle {
  compound: TyreCompound
  label: string
  bgColor: string
  textColor: string
  hex: string
}

const TYRE_COLORS: Record<TyreCompound, TyreStyle> = {
  SOFT: {
    compound: 'SOFT',
    label: 'Soft',
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    hex: '#E10600', // F1 Red
  },
  MEDIUM: {
    compound: 'MEDIUM',
    label: 'Medium',
    bgColor: 'bg-yellow-400',
    textColor: 'text-black',
    hex: '#FDD835', // F1 Yellow
  },
  HARD: {
    compound: 'HARD',
    label: 'Hard',
    bgColor: 'bg-white',
    textColor: 'text-black',
    hex: '#FFFFFF', // F1 White
  },
  INTERMEDIATE: {
    compound: 'INTERMEDIATE',
    label: 'Inter',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    hex: '#15803D', // Green
  },
  WET: {
    compound: 'WET',
    label: 'Wet',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    hex: '#1D4ED8', // Blue
  },
}

/**
 * Get tire styling information
 */
export function getTyreStyle(compound: TyreCompound): TyreStyle {
  return TYRE_COLORS[compound]
}

/**
 * Get tire label
 */
export function getTyreLabel(compound: TyreCompound): string {
  return TYRE_COLORS[compound].label
}

/**
 * Get Tailwind bg color class for tire
 */
export function getTyreBgClass(compound: TyreCompound): string {
  return TYRE_COLORS[compound].bgColor
}

/**
 * Get Tailwind text color class for tire
 */
export function getTyreTextClass(compound: TyreCompound): string {
  return TYRE_COLORS[compound].textColor
}

/**
 * Get hex color code for tire
 */
export function getTyreHex(compound: TyreCompound): string {
  return TYRE_COLORS[compound].hex
}

/**
 * Get all tire styles as array
 */
export function getAllTyreStyles(): TyreStyle[] {
  return Object.values(TYRE_COLORS)
}

/**
 * CSS class for tire badge
 */
export function getTyreBadgeClasses(compound: TyreCompound): string {
  const style = TYRE_COLORS[compound]
  return `${style.bgColor} ${style.textColor} px-2 py-1 rounded text-xs font-bold`
}

/**
 * Return tire compound from string (with fallback)
 */
export function parseTyreCompound(str: unknown): TyreCompound {
  if (typeof str === 'string') {
    const upper = str.toUpperCase()
    if (upper in TYRE_COLORS) {
      return upper as TyreCompound
    }
  }
  return 'HARD' // Safe default
}
