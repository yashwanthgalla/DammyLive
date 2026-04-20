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
  return rawHtml
    .replace(/<a\s[^>]*href="\/wiki\/[^"]*"[^>]*>([\s\S]*?)<\/a>/g, '$1')
    .replace(/<a\s[^>]*href="#[^"]*"[^>]*>([\s\S]*?)<\/a>/g, '$1')
    .replace(/<span[^>]*class="[^"]*mw-editsection[^"]*"[^>]*>[\s\S]*?<\/span>/g, '')
    .replace(/<sup[^>]*class="[^"]*reference[^"]*"[^>]*>[\s\S]*?<\/sup>/g, '')
    .replace(/<div[^>]*class="[^"]*reflist[^"]*"[^>]*>[\s\S]*?<\/div>/g, '')
    .replace(/<table[^>]*class="[^"]*infobox[^"]*"[^>]*>[\s\S]*?<\/table>/g, '')
    .replace(/<table[^>]*class="[^"]*navbox[^"]*"[^>]*>[\s\S]*?<\/table>/g, '')
    .replace(/<div[^>]*class="[^"]*hatnote[^"]*"[^>]*>[\s\S]*?<\/div>/g, '')
}

async function fetchFullPage(wikiTitle: string): Promise<WikiFullPage | null> {
  try {
    const encoded = encodeURIComponent(wikiTitle.replace(/ /g, '_'))

    const [summaryRes, sectionsRes, htmlRes] = await Promise.all([
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`),
      fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encoded}&prop=sections&format=json&origin=*`),
      fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encoded}&prop=text&disableeditsection=1&format=json&origin=*`),
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

export async function getDriverFullPage(fullName: string): Promise<WikiFullPage | null> {
  const specific = await fetchFullPage(`${fullName} (racing driver)`)
  if (specific) return specific
  return fetchFullPage(fullName)
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
