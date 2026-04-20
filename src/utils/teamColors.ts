/**
 * Utility Functions - Team Colors & Display
 * Maps team names to official F1 colors and driver info
 */

export interface TeamColor {
  name: string
  bgColor: string
  textColor: string
  hex: string
  accent: string
}

const TEAM_COLORS: Record<string, TeamColor> = {
  RED_BULL: {
    name: 'Red Bull Racing',
    bgColor: 'bg-blue-900',
    textColor: 'text-white',
    hex: '#0600EF',
    accent: '#FFFF00',
  },
  MERCEDES: {
    name: 'Mercedes',
    bgColor: 'bg-teal-400',
    textColor: 'text-black',
    hex: '#00D2BE',
    accent: '#000000',
  },
  MCLAREN: {
    name: 'McLaren',
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    hex: '#FF8700',
    accent: '#FFFFFF',
  },
  FERRARI: {
    name: 'Ferrari',
    bgColor: 'bg-red-700',
    textColor: 'text-white',
    hex: '#DC0000',
    accent: '#FFFF00',
  },
  ALPINE: {
    name: 'Alpine',
    bgColor: 'bg-blue-400',
    textColor: 'text-white',
    hex: '#0093D0',
    accent: '#FF8700',
  },
  WILLIAMS: {
    name: 'Williams',
    bgColor: 'bg-blue-300',
    textColor: 'text-blue-900',
    hex: '#005AFF',
    accent: '#FFFFFF',
  },
  ASTON_MARTIN: {
    name: 'Aston Martin',
    bgColor: 'bg-emerald-600',
    textColor: 'text-white',
    hex: '#006C3B',
    accent: '#00FF00',
  },
  HAAS: {
    name: 'Haas F1 Team',
    bgColor: 'bg-gray-700',
    textColor: 'text-white',
    hex: '#FFFFFF',
    accent: '#FF0000',
  },
  ALPHA_TAURI: {
    name: 'AlphaTauri',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    hex: '#2B4562',
    accent: '#00FFFF',
  },
  ALFA_ROMEO: {
    name: 'Alfa Romeo',
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    hex: '#9B0000',
    accent: '#00FF00',
  },
  SAUBER: {
    name: 'Sauber',
    bgColor: 'bg-teal-600',
    textColor: 'text-white',
    hex: '#00A19A',
    accent: '#FFFFFF',
  },
  KICK_SAUBER: {
    name: 'Kick Sauber',
    bgColor: 'bg-teal-600',
    textColor: 'text-white',
    hex: '#00A19A',
    accent: '#FFFFFF',
  },
}

/**
 * Get team color info, with fallback
 */
export function getTeamColor(
  teamName: string
): TeamColor {
  // Normalize team name
  const normalized = teamName
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/\W/g, '')

  // Try exact match
  if (TEAM_COLORS[normalized]) {
    return TEAM_COLORS[normalized]
  }

  // Try partial match
  for (const [key, color] of Object.entries(TEAM_COLORS)) {
    if (teamName.toUpperCase().includes(key) || key.includes(normalized)) {
      return color
    }
  }

  // Default fallback
  return {
    name: teamName,
    bgColor: 'bg-gray-500',
    textColor: 'text-white',
    hex: '#808080',
    accent: '#FFFFFF',
  }
}

/**
 * Get team abbreviation
 */
export function getTeamAbbr(teamName: string): string {
  const abbr = teamName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)

  return abbr || 'N/A'
}

/**
 * Format driver name for display
 * @param firstName - Given name
 * @param lastName - Family name
 * @returns Formatted name
 */
export function formatDriverName(
  firstName: string,
  lastName: string,
  short = false
): string {
  if (short) {
    return `${firstName[0]}.${lastName}`.toUpperCase()
  }
  return `${firstName} ${lastName}`
}

/**
 * Get position badge color (1st, 2nd, 3rd)
 */
export function getPositionBadgeColor(
  position: number
): { bg: string; text: string; hex: string } {
  switch (position) {
    case 1:
      return { bg: 'bg-yellow-400', text: 'text-black', hex: '#FFD700' }
    case 2:
      return { bg: 'bg-gray-300', text: 'text-black', hex: '#C0C0C0' }
    case 3:
      return { bg: 'bg-orange-400', text: 'text-black', hex: '#CD7F32' }
    default:
      return { bg: 'bg-gray-400', text: 'text-white', hex: '#808080' }
  }
}

/**
 * Get status badge color
 */
export function getStatusBadgeColor(
  status: string
): { bg: string; text: string } {
  switch (status.toLowerCase()) {
    case 'on track':
      return { bg: 'bg-green-500', text: 'text-white' }
    case 'pit':
      return { bg: 'bg-yellow-500', text: 'text-black' }
    case 'retired':
      return { bg: 'bg-red-600', text: 'text-white' }
    case 'not started':
      return { bg: 'bg-gray-400', text: 'text-white' }
    default:
      return { bg: 'bg-gray-400', text: 'text-white' }
  }
}
