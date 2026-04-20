/**
 * Image Mappings for Drivers, Track Blueprints, and Track Images
 * Maps driver names / circuit IDs to local image assets in /public
 */

// ── Driver Images ──
// Maps driver last name (lowercase) → image filename in /public/driverimages/
export const driverImageMap: Record<string, string> = {
  'albon': '/driverimages/alexalbon.png',
  'lindblad': '/driverimages/arvidlindblad.png',
  'sainz': '/driverimages/carlozsainz.png',
  'leclerc': '/driverimages/charlesleclerc.png',
  'ocon': '/driverimages/estebanocon.png',
  'colapinto': '/driverimages/francocolapinto.png',
  'alonso': '/driverimages/frenandoalanso.png',
  'bortoleto': '/driverimages/gabrielbortoleto.png',
  'russell': '/driverimages/georgerussel.png',
  'hadjar': '/driverimages/isackhadjar.png',
  'antonelli': '/driverimages/kimiantonelli.png',
  'stroll': '/driverimages/lancestroll.png',
  'norris': '/driverimages/landonorris.png',
  'hamilton': '/driverimages/lewishamilton.png',
  'lawson': '/driverimages/liamlawson.png',
  'verstappen': '/driverimages/maxverstappen.png',
  'hulkenberg': '/driverimages/nicohulkenberg.png',
  'hülkenberg': '/driverimages/nicohulkenberg.png',
  'bearman': '/driverimages/olivebearmen.png',
  'piastri': '/driverimages/oscarpiastri.png',
  'gasly': '/driverimages/piereegasly.png',
  'perez': '/driverimages/sergioperez.png',
  'pérez': '/driverimages/sergioperez.png',
  'bottas': '/driverimages/valtteribottaz.png',
}

// ── Track Blueprints ──
// Maps circuit ID → blueprint image filename in /public/trackblueprint/
export const trackBlueprintMap: Record<string, string> = {
  'yas_marina': '/trackblueprint/abudhabi.png',
  'albert_park': '/trackblueprint/australia2026.png',
  'red_bull_ring': '/trackblueprint/austria.png',
  'baku': '/trackblueprint/azerbaijan.png',
  'catalunya': '/trackblueprint/barcelona.png',
  'spa': '/trackblueprint/belgium.png',
  'interlagos': '/trackblueprint/brazil.png',
  'villeneuve': '/trackblueprint/canada.png',
  'shanghai': '/trackblueprint/china2026.png',
  'silverstone': '/trackblueprint/greatbritain.png',
  'hungaroring': '/trackblueprint/hungary.png',
  'monza': '/trackblueprint/italy.png',
  'suzuka': '/trackblueprint/japan2026.png',
  'las_vegas': '/trackblueprint/lasvegas.png',
  'miami': '/trackblueprint/maimi26.png',
  'rodriguez': '/trackblueprint/mexico.png',
  'monaco': '/trackblueprint/monoco.png',
  'zandvoort': '/trackblueprint/netherlands.png',
  'losail': '/trackblueprint/qatar.png',
  'marina_bay': '/trackblueprint/singapore.png',
  'ricard': '/trackblueprint/spain.png',
  'americas': '/trackblueprint/unitedstates.png',
}

// ── Track Images (photos) ──
// Maps circuit ID → track photo in /public/trackimage/
export const trackImageMap: Record<string, string> = {
  'catalunya': '/trackimage/barcelona.png',
  'spa': '/trackimage/belgium.png',
  'villeneuve': '/trackimage/canada.png',
  'miami': '/trackimage/maimi2026.png',
  'monaco': '/trackimage/monoco.png',
  'americas': '/trackimage/unitedstates.png',
}

/**
 * Get driver image by last name
 */
export function getDriverImage(lastName: string): string | null {
  const key = lastName.toLowerCase().replace(/[^a-z]/g, '')
  return driverImageMap[key] || null
}

/**
 * Get track blueprint by circuit ID
 */
export function getTrackBlueprint(circuitId: string): string | null {
  return trackBlueprintMap[circuitId] || null
}

/**
 * Get track photo by circuit ID
 */
export function getTrackImage(circuitId: string): string | null {
  return trackImageMap[circuitId] || null
}
