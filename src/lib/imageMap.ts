/**
 * Image Mappings for Drivers, Team Logos, Track Blueprints, and Track Images
 * Maps driver names / team names / circuit IDs to local image assets in /public
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
  'hlkenberg': '/driverimages/nicohulkenberg.png',
  'bearman': '/driverimages/olivebearmen.png',
  'piastri': '/driverimages/oscarpiastri.png',
  'gasly': '/driverimages/piereegasly.png',
  'perez': '/driverimages/sergioperez.png',
  'pérez': '/driverimages/sergioperez.png',
  'prez': '/driverimages/sergioperez.png',
  'bottas': '/driverimages/valtteribottaz.png',
}

// ── Team Logos ──
// Maps team name variants (lowercase) → logo filename in /public/teamlogo/
export const teamLogoMap: Record<string, string> = {
  // Alpine
  'alpine': '/teamlogo/alpine.png',
  'alpine f1 team': '/teamlogo/alpine.png',
  'bwt alpine f1 team': '/teamlogo/alpine.png',
  // Aston Martin
  'aston_martin': '/teamlogo/astonmartin.png',
  'aston martin': '/teamlogo/astonmartin.png',
  'aston martin aramco f1 team': '/teamlogo/astonmartin.png',
  // Audi / Sauber
  'audi': '/teamlogo/audi.png',
  'sauber': '/teamlogo/audi.png',
  'kick sauber': '/teamlogo/audi.png',
  'stake f1 team kick sauber': '/teamlogo/audi.png',
  // Cadillac
  'cadillac': '/teamlogo/cadillac.png',
  'cadillac f1 team': '/teamlogo/cadillac.png',
  // Ferrari
  'ferrari': '/teamlogo/ferrari.png',
  'scuderia ferrari': '/teamlogo/ferrari.png',
  'scuderia ferrari hp': '/teamlogo/ferrari.png',
  // Haas
  'haas': '/teamlogo/hassf1.png',
  'haas f1 team': '/teamlogo/hassf1.png',
  'moneygram haas f1 team': '/teamlogo/hassf1.png',
  // McLaren
  'mclaren': '/teamlogo/mclaren.png',
  'mclaren f1 team': '/teamlogo/mclaren.png',
  // Mercedes
  'mercedes': '/teamlogo/mercedes.png',
  'mercedes-amg petronas f1 team': '/teamlogo/mercedes.png',
  // Racing Bulls / VCARB / AlphaTauri
  'rb': '/teamlogo/racingbulls.png',
  'racing bulls': '/teamlogo/racingbulls.png',
  'visa cash app racing bulls': '/teamlogo/racingbulls.png',
  'visa cash app rb f1 team': '/teamlogo/racingbulls.png',
  // Red Bull Racing
  'red_bull': '/teamlogo/redbullracing.png',
  'red bull': '/teamlogo/redbullracing.png',
  'red bull racing': '/teamlogo/redbullracing.png',
  'oracle red bull racing': '/teamlogo/redbullracing.png',
  // Williams
  'williams': '/teamlogo/williams.png',
  'williams racing': '/teamlogo/williams.png',
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
 * Strips accents and special characters for matching
 */
export function getDriverImage(lastName: string): string | null {
  if (!lastName) return null
  const key = lastName.toLowerCase().replace(/[^a-zà-ÿ]/gi, '')
  // Try exact match first
  if (driverImageMap[key]) return driverImageMap[key]
  // Try stripping accents
  const normalized = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (driverImageMap[normalized]) return driverImageMap[normalized]
  // Try partial match
  for (const [mapKey, path] of Object.entries(driverImageMap)) {
    if (mapKey.includes(normalized) || normalized.includes(mapKey)) return path
  }
  return null
}

/**
 * Get team logo by team name, constructor ID, or any variant
 */
export function getTeamLogo(teamName: string): string | null {
  if (!teamName) return null
  const key = teamName.toLowerCase().trim()
  // Exact match
  if (teamLogoMap[key]) return teamLogoMap[key]
  // Partial match — check if any key is contained in the team name
  for (const [mapKey, path] of Object.entries(teamLogoMap)) {
    if (key.includes(mapKey) || mapKey.includes(key)) return path
  }
  return null
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
