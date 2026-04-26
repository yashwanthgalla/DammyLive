/**
 * Wikipedia REST + MediaWiki Action API
 * Fetches live summaries, bios, images, and full article sections
 */

export interface WikiSummary {
  title: string
  description?: string
  extract: string
  thumbnail?: { source: string; width: number; height: number }
}

export interface WikiFullPage {
  title: string
  thumbnail?: { source: string; width: number; height: number }
  description?: string
  intro: string
  sections: Array<{ title: string; level: number; anchor: string }>
  fullHtml: string   // entire article HTML, cleaned of wiki links/citations
}

// ------- internal helpers -------

async function fetchSummary(searchTitle: string): Promise<WikiSummary | null> {
  try {
    const encoded = encodeURIComponent(searchTitle.replace(/ /g, '_'))
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`)
    if (!res.ok) return null
    const data = await res.json()
    return { title: data.title, description: data.description, extract: data.extract, thumbnail: data.thumbnail }
  } catch {
    return null
  }
}

function sanitizeHtml(rawHtml: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(rawHtml, 'text/html')

  // Remove unwanted Wikipedia elements
  const selectorsToRemove = [
    '.mw-editsection',
    '.reference',
    '.reflist',
    '.infobox',
    '.navbox',
    '.hatnote',
    '.metadata',
    '.ambox',
    '.sistersitebox',
    '.mw-empty-elt',
    '[id="References"]',
    '[id="See_also"]',
    '[id="External_links"]'
  ]
  const elementsToRemove = doc.querySelectorAll(selectorsToRemove.join(', '))
  elementsToRemove.forEach(el => el.remove())

  // Strip links but keep text
  doc.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href')
    if (href?.startsWith('/wiki/') || href?.startsWith('#')) {
      const fragment = doc.createDocumentFragment()
      while (a.firstChild) {
        fragment.appendChild(a.firstChild)
      }
      a.parentNode?.replaceChild(fragment, a)
    }
  })

  return doc.body.innerHTML
}

async function fetchFullPage(wikiTitle: string): Promise<WikiFullPage | null> {
  try {
    // For REST summary endpoint: encode the whole title as a path segment
    const titleForPath = encodeURIComponent(wikiTitle.replace(/ /g, '_'))
    // For MediaWiki Action API: pass as a query-string value (no extra encoding needed)
    const titleForQuery = wikiTitle.replace(/ /g, '_')

    const [summaryRes, sectionsRes, htmlRes] = await Promise.all([
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${titleForPath}`),
      fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(titleForQuery)}&prop=sections&redirects=1&format=json&origin=*`),
      fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(titleForQuery)}&prop=text&redirects=1&disableeditsection=1&format=json&origin=*`),
    ])

    const summary = summaryRes.ok ? await summaryRes.json() : null
    const sectionsData = sectionsRes.ok ? await sectionsRes.json() : null
    const htmlData = htmlRes.ok ? await htmlRes.json() : null

    if (!htmlData?.parse) return null

    const rawHtml: string = htmlData.parse.text?.['*'] || ''
    const cleanHtml = sanitizeHtml(rawHtml)

    const sections = (sectionsData?.parse?.sections || []).map((s: any) => ({
      title: s.line.replace(/<[^>]+>/g, ''),
      level: parseInt(s.level || '2', 10),
      anchor: s.anchor || s.line,
    }))

    return {
      title: htmlData.parse.title,
      thumbnail: summary?.thumbnail,
      description: summary?.description,
      intro: summary?.extract || '',
      sections,
      fullHtml: cleanHtml,
    }
  } catch {
    return null
  }
}

// ------- Public API -------

export async function getDriverWikiSummary(fullName: string): Promise<WikiSummary | null> {
  const specific = await fetchSummary(`${fullName} (racing driver)`)
  if (specific) return specific
  return fetchSummary(fullName)
}

export async function getConstructorWikiSummary(teamName: string): Promise<WikiSummary | null> {
  const wikiNames: Record<string, string> = {
    ferrari: 'Scuderia Ferrari',
    mercedes: 'Mercedes-AMG Petronas Formula One Team',
    red_bull: 'Red Bull Racing',
    mclaren: 'McLaren',
    alpine: 'Alpine F1 Team',
    aston_martin: 'Aston Martin Aramco Cognizant Formula One Team',
    williams: 'Williams Racing',
    haas: 'Haas F1 Team',
    rb: 'RB Formula One Team',
    kick_sauber: 'Kick Sauber',
  }
  const mapped = wikiNames[teamName.toLowerCase().replace(/ /g, '_')]
  if (mapped) {
    const result = await fetchSummary(mapped)
    if (result) return result
  }
  return fetchSummary(teamName)
}

/**
 * Explicit Wikipedia article title map keyed by accent-normalized driver ID
 * (e.g. "sergio_perez", "nico_hulkenberg").
 * This avoids any fragile disambiguation guessing.
 */
const DRIVER_WIKI_MAP: Record<string, string> = {
  // 2026 grid
  'max_verstappen':      'Max Verstappen',
  'lando_norris':        'Lando Norris',
  'charles_leclerc':     'Charles Leclerc',
  'oscar_piastri':       'Oscar Piastri',
  'george_russell':      'George Russell (racing driver)',
  'lewis_hamilton':      'Lewis Hamilton',
  'carlos_sainz':        'Carlos Sainz Jr.',
  'fernando_alonso':     'Fernando Alonso',
  'lance_stroll':        'Lance Stroll',
  'pierre_gasly':        'Pierre Gasly',
  'esteban_ocon':        'Esteban Ocon',
  'alexander_albon':     'Alexander Albon',
  'alex_albon':          'Alexander Albon',
  'valtteri_bottas':     'Valtteri Bottas',
  'nico_hulkenberg':     'Nico Hülkenberg',
  'sergio_perez':        'Sergio Pérez',
  'yuki_tsunoda':        'Yuki Tsunoda',
  'liam_lawson':         'Liam Lawson (racing driver)',
  'oliver_bearman':      'Oliver Bearman',
  'kimi_antonelli':      'Andrea Kimi Antonelli',
  'isack_hadjar':        'Isack Hadjar',
  'gabriel_bortoleto':   'Gabriel Bortoleto',
  'franco_colapinto':    'Franco Colapinto',
  'jack_doohan':         'Jack Doohan (racing driver)',
  'oliver_oakes':        'Oliver Oakes',
  'arvid_lindblad':      'Arvid Lindblad',
  // Legends (for historic pages)
  'michael_schumacher':  'Michael Schumacher',
  'ayrton_senna':        'Ayrton Senna',
  'alain_prost':         'Alain Prost',
  'niki_lauda':          'Niki Lauda',
  'juan_manuel_fangio':  'Juan Manuel Fangio',
  'sebastian_vettel':    'Sebastian Vettel',
  'kimi_raikkonen':      'Kimi Räikkönen',
  'jenson_button':       'Jenson Button',
  'nico_rosberg':        'Nico Rosberg',
  'mika_hakkinen':       'Mika Häkkinen',
  'damon_hill':          'Damon Hill',
  'nigel_mansell':       'Nigel Mansell',
  'nelson_piquet':       'Nelson Piquet',
  'jackie_stewart':      'Jackie Stewart',
  'jim_clark':           'Jim Clark (racing driver)',
  'graham_hill':         'Graham Hill',
  'emerson_fittipaldi':  'Emerson Fittipaldi',
  'jochen_rindt':        'Jochen Rindt',
}

export async function getDriverFullPage(driverIdOrName: string): Promise<WikiFullPage | null> {
  // Normalize to accent-free lowercase key (e.g. "Sergio Pérez" → "sergio_perez")
  const key = driverIdOrName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')

  // 1. Try the explicit map first — most reliable
  const mappedTitle = DRIVER_WIKI_MAP[key]
  if (mappedTitle) {
    const result = await fetchFullPage(mappedTitle)
    if (result) return result
  }

  // 2. Try with (racing driver) suffix in case of disambiguation
  const withSuffix = await fetchFullPage(`${driverIdOrName} (racing driver)`)
  if (withSuffix) return withSuffix

  // 3. Last resort: plain name
  return fetchFullPage(driverIdOrName)
}

export async function getConstructorFullPage(constructorId: string): Promise<WikiFullPage | null> {
  const wikiNames: Record<string, string> = {
    ferrari: 'Scuderia Ferrari',
    mercedes: 'Mercedes-AMG Petronas Formula One Team',
    red_bull: 'Red Bull Racing',
    mclaren: 'McLaren',
    alpine: 'Alpine F1 Team',
    aston_martin: 'Aston Martin Aramco Cognizant Formula One Team',
    williams: 'Williams Racing',
    haas: 'Haas F1 Team',
    rb: 'RB Formula One Team',
    kick_sauber: 'Kick Sauber',
  }
  const mapped = wikiNames[constructorId.toLowerCase()]
  return fetchFullPage(mapped || constructorId)
}

/**
 * Get full Wikipedia article for a circuit
 * Tries circuit-specific Wiki titles first, then falls back to name search
 */
export async function getCircuitFullPage(circuitName: string, circuitId?: string): Promise<WikiFullPage | null> {
  // Common circuit name → Wikipedia article mapping
  const wikiNames: Record<string, string> = {
    'albert_park': 'Melbourne Grand Prix Circuit',
    'bahrain': 'Bahrain International Circuit',
    'jeddah': 'Jeddah Corniche Circuit',
    'suzuka': 'Suzuka International Racing Course',
    'shanghai': 'Shanghai International Circuit',
    'miami': 'Miami International Autodrome',
    'imola': 'Autodromo Enzo e Dino Ferrari',
    'monaco': 'Circuit de Monaco',
    'villeneuve': 'Circuit Gilles Villeneuve',
    'catalunya': 'Circuit de Barcelona-Catalunya',
    'red_bull_ring': 'Red Bull Ring',
    'silverstone': 'Silverstone Circuit',
    'hungaroring': 'Hungaroring',
    'spa': 'Circuit de Spa-Francorchamps',
    'zandvoort': 'Circuit Zandvoort',
    'monza': 'Autodromo Nazionale Monza',
    'baku': 'Baku City Circuit',
    'marina_bay': 'Marina Bay Street Circuit',
    'americas': 'Circuit of the Americas',
    'rodriguez': 'Autódromo Hermanos Rodríguez',
    'interlagos': 'Interlagos',
    'losail': 'Losail International Circuit',
    'yas_marina': 'Yas Marina Circuit',
    'las_vegas': 'Las Vegas Grand Prix',
    'nurburgring': 'Nürburgring',
    'hockenheimring': 'Hockenheimring',
    'istanbul': 'Istanbul Park',
    'sepang': 'Sepang International Circuit',
    'mugello': 'Mugello Circuit',
    'portimao': 'Algarve International Circuit',
    'sochi': 'Sochi Autodrom',
    'paul_ricard': 'Circuit Paul Ricard',
    'indianapolis': 'Indianapolis Motor Speedway',
    'yeongam': 'Korean International Circuit',
    'buddh': 'Buddh International Circuit',
    'valencia': 'Valencia Street Circuit',
    'magny_cours': 'Circuit de Nevers Magny-Cours',
    'fuji': 'Fuji Speedway',
    'brands_hatch': 'Brands Hatch',
    'kyalami': 'Kyalami',
    'jacarepagua': 'Autódromo Internacional Nelson Piquet',
    'adelaide': 'Adelaide Street Circuit',
    'detroit': 'Detroit street circuit',
    'dallas': 'Fair Park',
    'dijon': 'Dijon-Prenois',
    'osterreichring': 'Österreichring',
    'zolder': 'Circuit Zolder',
    'long_beach': 'Long Beach Grand Prix',
    'watkins_glen': 'Watkins Glen International',
    'mosport': 'Mosport',
    'anderstorp': 'Scandinavian Raceway',
    'jarama': 'Circuito del Jarama',
    'nivelles': 'Nivelles-Baulers',
    'clermont_ferrand': 'Charade Circuit',
    'montjuic': 'Circuit de Montjuïc',
    'buenos_aires': 'Autódromo Oscar y Juan Gálvez',
    'estoril': 'Estoril Circuit',
    'jerez': 'Circuito de Jerez',
    'aida': 'TI Circuit Aida',
    'donington': 'Donington Park',
    'phoenix': 'Phoenix street circuit',
    'ricard': 'Circuit Paul Ricard',
  }

  // Try mapped name first
  if (circuitId) {
    const mapped = wikiNames[circuitId.toLowerCase()]
    if (mapped) {
      const result = await fetchFullPage(mapped)
      if (result) return result
    }
  }

  // Try the full circuit name
  const byName = await fetchFullPage(circuitName)
  if (byName) return byName

  // Try with "circuit" appended
  return fetchFullPage(`${circuitName} circuit`)
}
