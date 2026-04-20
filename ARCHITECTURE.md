# F1 Live Dashboard - Architecture & Implementation Guide

## Project Overview

**F1 Live Dashboard** is a production-ready Formula 1 real-time data visualization web application built with React 19, TypeScript, and Vite. It displays live session data, standings, schedules, and analytics using the free OpenF1 and Jolpica APIs.

**Tech Stack:**
- React 19.2.5 + TypeScript 5 (strict mode)
- Vite 5 with ES2022 target
- TanStack React Query v5 (server state)
- Zustand v4 (UI state, persisted to localStorage)
- Tailwind CSS v3 (theming with CSS variables)
- @tanstack/react-virtual v3 (virtualized tables)
- Recharts v2 (charts and visualizations)
- Axios 1.6 (HTTP client with retry logic)

**Performance Target:** <150KB gzipped

## Architecture Overview

### 1. State Management

#### Zustand Stores (`src/store/uiStore.ts`)
- **useUIStore**: Persisted UI state (theme, selected year, expanded driver)
- **useSessionStore**: Runtime session context (selected session)

```typescript
// Theme toggles between light/dark with localStorage persistence
const theme = useUIStore((state) => state.theme)
useUIStore.getState().toggleTheme()
```

#### TanStack React Query (`src/api/queryClient.ts`)
- Manages server state (API responses)
- 10-minute stale time, 1-hour garbage collection
- Automatic 3x retry with exponential backoff
- Centralized queryClient configuration

### 2. Real-Time Data Architecture

#### WebSocket + HTTP Polling Fallback
The `useLiveSession` hook implements a robust real-time system:

```
WebSocket Connection → Batches 200ms → React Updates
        ↓ (after 10 failures)
HTTP Polling (2s interval) → Batches 200ms → React Updates
```

**Key Features:**
- Opens WebSocket to `wss://api.openf1.org/v1/stream?session={key}`
- Parses JSON messages (position, lap, weather, pit_stop)
- **200ms batching** prevents render thrashing (10-50 updates/sec → 5 batches/sec)
- Exponential backoff: 1s → 2s → 4s → 8s → 16s max
- Auto-cleanup on unmount (WebSocket close, timers cleared)

**Batching Logic:**
```typescript
useEffect(() => {
  const batchTimer = setInterval(() => {
    // Commits all queued updates from past 200ms
    setPositions(pendingPositions)
    setWeather(pendingWeather)
    // Prevents excessive React renders
  }, batchInterval)
}, [])
```

### 3. API Layer

#### API Client Factory (`src/api/client.ts`)
```typescript
const openf1Client = createApiClient('https://api.openf1.org/v1', {
  maxRetries: 3,
  retryDelay: 500,
  timeout: 5000
})
```

**Features:**
- Request queuing with 100ms minimum interval (10 req/s rate limit)
- Exponential backoff retry strategy
- Automatic error handling with user-friendly messages
- Rate limit detection (429 status code)

#### OpenF1 Client (`src/api/openf1.ts`)
Real-time endpoints:
- `getSessions(year, week)` - Race schedule
- `getCurrentSession()` - Active session
- `getPositions(sessionKey)` - Live positions
- `getLaps(sessionKey, driverNumber?)` - Lap data
- `getWeather(sessionKey)` - Conditions
- `getPitStops(sessionKey, driverNumber?)` - Pit history
- `getWebSocketURL(sessionKey)` - Stream connection

#### Jolpica Client (`src/api/jolpica.ts`)
Historical data:
- `getDriverStandings(year)` - Championship standings
- `getConstructorStandings(year)` - Team standings
- `getCircuits()` - Track information

### 4. Components Structure

#### Timing Components (`src/components/timing/`)
Small, reusable UI building blocks:

**TireBadge** - Tire compound display
```tsx
<TireBadge compound="SOFT" laps={5} size="sm" />
// Output: Red badge with "Soft (5L)"
```

**GapCell** - Position gap formatting
```tsx
<GapCell position={2} gapToLeader={1200} />
// Output: "+0:01.200" for position 2
```

**SessionStatus** - Driver status indicator
```tsx
<SessionStatus status="ON_TRACK" lapNumber={25} />
// Output: "🟢 LAP 25" (colored by status)
```

**WeatherOverlay** - Conditions display
```tsx
<WeatherOverlay weather={weather} />
// Output: 5-column grid (temp, humidity, rainfall, wind)
```

**PitStopList** - Pit stop history
```tsx
<PitStopList pitStops={pitStops} maxItems={10} />
// Output: Numbered list with times and tire info
```

**LiveTable** - Virtualized timing board (CRITICAL)
```tsx
<LiveTable
  positions={positions}
  drivers={drivers}
  laps={laps}
  expandedDriver={expandedDriver}
  onRowClick={setExpandedDriver}
/>
```

**Virtualization Details:**
- Uses `@tanstack/react-virtual` for O(1) rendering
- 11-column grid: Pos|Driver|Team|Laps|Status|Tyre|Gap|LastLap|S1|S2|S3
- 56px row height, max 600px container
- Only visible + 5 overscan rows mounted
- Sticky header with smooth scrolling
- 20+ driver table renders instantly

#### Chart Components (`src/components/charts/`)

**LapTimeChart** - Line chart of lap times
```tsx
<LapTimeChart
  driverName="Max Verstappen"
  laps={driverLaps}
  height={400}
/>
```
- Custom tooltip with formatted times
- Session best (large red dot), personal best (medium ring)
- Animated off for real-time performance

**StrategyGraph** - Scatter chart of tire strategy
```tsx
<StrategyGraph
  positions={positions}
  laps={laps}
  height={300}
/>
```
- X-axis: Lap number
- Y-axis: Tire age (laps on current compound)
- Points colored by compound (Red/Yellow/White/Green/Blue)
- Merges position + lap data

#### Page Components (`src/pages/`)

**HomePage** - Landing page with feature overview

**SchedulePage** - Session calendar
```tsx
// Groups sessions by location (circuit)
// Shows countdown timers
// Highlights active sessions with "LIVE NOW" badge
// Links to live timing for active sessions
```

**LivePage** - Real-time dashboard
```tsx
// Integrates all timing components
// useLiveSession hook for WebSocket/polling
// Displays: weather, timing table, pit stops, charts
// Expandable driver detail view
```

**StandingsPage** - Championships
```tsx
// Driver standings with points and wins
// Constructor standings with team info
// Toggle between drivers/constructors
// Medal colors for top 3 (gold/silver/bronze)
```

**CircuitPage** - Track information
```tsx
// Circuit details: length, lap record
// Season info: races held, most wins
// Historical data from Jolpica API
```

### 5. Custom Hooks

#### useLiveSession (250+ lines)
Real-time data management with WebSocket/polling:
```typescript
const { positions, weather, laps, pitStops, isConnected, error } = 
  useLiveSession(sessionKey, { batchInterval: 200 })
```

#### useDebouncedState
Debounced state updates:
```typescript
const [value, setValue] = useDebouncedState(0, 300)
```

#### useSessionTimer
Countdown and elapsed time:
```typescript
const timer = useSessionTimer(dateStart, isRunning)
// Returns: { days, hours, minutes, seconds, isExpired, total }
```

### 6. Utility Functions

#### Time Formatters (`src/utils/timeFormatters.ts`)
- `formatLapTime(ms)` → "1:35.234"
- `formatGap(ms)` → "+1:23.456"
- `formatInterval(ms)` → "0.345s"
- `formatCountdown(dateStart)` → "2d 14h"
- `formatSessionDateTime(date, gmtOffset)` → "Fri 20 Apr @ 14:00"
- `formatTyreAge(laps)` → "5L" or "NEW"

#### Tire Colors (`src/utils/tireColors.ts`)
F1 official colors mapped to Tailwind classes:
```typescript
const TYRE_COLORS = {
  SOFT: { hex: '#E10600', label: 'Soft', bgClass: 'bg-red-600' },
  MEDIUM: { hex: '#FDD835', label: 'Medium', bgClass: 'bg-yellow-400' },
  HARD: { hex: '#FFFFFF', label: 'Hard', bgClass: 'bg-white' },
  INTERMEDIATE: { hex: '#15803D', label: 'Inter', bgClass: 'bg-green-700' },
  WET: { hex: '#1D4ED8', label: 'Wet', bgClass: 'bg-blue-700' },
}
```

#### Team Colors (`src/utils/teamColors.ts`)
11 F1 teams with color branding:
```typescript
const TEAM_COLORS = {
  RED_BULL: { hex: '#0600EF', bgColor: 'bg-red-600' },
  MERCEDES: { hex: '#00D4BE', bgColor: 'bg-cyan-500' },
  // ... 9 more teams
}
```

### 7. Type Definitions (`src/types/f1.ts`)

Core TypeScript interfaces (strict mode, no `any`):
```typescript
interface Position {
  position: number
  driver_number: number
  session_key: number
  status: 'ON_TRACK' | 'PIT' | 'RETIRED' | 'NOT_STARTED'
  gap_to_leader?: number
  interval?: number
  lap_count: number
}

interface Lap {
  lap_number: number
  driver_number: number
  tyre_compound: TyreCompound
  tyre_age: number
  lap_duration: number
  duration_sector_1: number
  duration_sector_2: number
  duration_sector_3: number
}

interface Weather {
  air_temperature: number
  track_temperature: number
  humidity: number
  rainfall: boolean
  wind_direction: number
  wind_speed: number
}

// + 12 more interfaces for Driver, Session, PitStop, etc.
```

### 8. Styling & Theme System

#### Global Styles (`src/index.css`)
- Tailwind CSS directives
- CSS custom properties for theming
- Light/dark mode support
- F1-inspired color palette
- Scrollbar styling
- Reduced motion support

#### Theme Variables
```css
:root {
  --card: hsl(0 0% 100%);
  --primary: hsl(45 93% 62%); /* F1 Amber #f59e0b */
  --foreground: hsl(0 0% 3%);
  --muted: hsl(210 40% 96%);
  /* ... 10+ more */
}

.dark {
  --card: hsl(0 0% 8%);
  --primary: hsl(45 93% 62%);
  --foreground: hsl(0 0% 98%);
  /* ... */
}
```

### 9. Performance Optimizations

#### Code Splitting (Vite)
```javascript
// vite.config.ts
rollupOptions: {
  output: {
    manualChunks: {
      react: ['react', 'react-dom', 'react-router-dom'],
      query: ['@tanstack/react-query'],
      charts: ['recharts'],
      ui: ['@tanstack/react-virtual'],
    }
  }
}
```

#### Lazy Loading (React Router)
```typescript
const HomePage = lazy(() => import('@/pages/HomePage'))
const LivePage = lazy(() => import('@/pages/LivePage'))
// ... all pages lazy-loaded with Suspense fallback
```

#### Virtualization
- LiveTable: Only renders visible rows (O(1) complexity)
- No extra DOM nodes for off-screen items
- 56px row height × 600px container = max 10-15 rows rendered

#### Batching Strategy
- 200ms batches reduce render frequency
- 10-50 updates/sec → 5 batches/sec
- useTransition for non-blocking updates (React 19)

#### Image/Bundle Optimization
- terser minification with drop_console
- Tree-shaking of unused code
- Vendor chunk separation for caching
- Target: <150KB gzipped

## Data Flow Diagram

```
User Opens App
    ↓
App.tsx loads theme from localStorage via useUIStore
    ↓
QueryClientProvider initializes React Query
    ↓
Router navigates to requested page
    ↓
Page component fetches data via useQuery
    ↓
For Live Session:
  ├─→ useLiveSession opens WebSocket
  ├─→ Parser queues position/lap/weather messages
  ├─→ 200ms batch timer commits updates
  ├─→ Component re-renders with new data
  └─→ If WebSocket fails → HTTP polling takes over
    ↓
Charts render with Recharts
    ↓
LiveTable virtualizer renders only visible rows
```

## Error Handling Strategy

1. **API Errors**
   - Retry with exponential backoff (3x)
   - User-friendly error messages
   - Rate limit detection (429)

2. **WebSocket Failures**
   - 10 reconnection attempts with backoff
   - Falls back to HTTP polling
   - Graceful degradation

3. **React Errors**
   - ErrorBoundary catches component crashes
   - Displays error UI with reload button
   - Console logging for debugging

4. **Type Safety**
   - Strict TypeScript (strict: true)
   - No implicit `any` (noImplicitAny: true)
   - All API responses typed

## Build & Deployment

### Development
```bash
npm run dev  # Start Vite dev server
npm run type-check  # Type checking
npm run lint  # ESLint with strict rules
```

### Production
```bash
npm run build  # Vite build with optimization
# Output: dist/ directory (<150KB gzipped)
```

### Key Build Features
- Source maps for debugging
- CSS minification
- JS minification with terser
- Console.log removed in production
- Vendor code splitting for caching
- ES2022 target for modern browsers

## Testing Strategy

Unit tests for critical functions:
- Time formatters (timeFormatters.test.ts)
- Hooks (useDebouncedState.test.ts)
- Utilities (tireColors.test.ts)
- Components (pending)

Integration tests:
- API client with mocked responses
- React Query flow
- WebSocket batching

## Future Enhancements

1. **Phase 4: Tests & Polish**
   - Unit test coverage >80%
   - Integration tests for API flows
   - E2E tests with Playwright
   - Performance profiling

2. **Optional Features**
   - DriverDetailModal for expanded driver info
   - SectorComparison component
   - PitStopAnalysis for trends
   - LiveIndicator pulsing badge
   - Comparison mode (driver vs driver)
   - Historical replay system

3. **Accessibility**
   - ARIA labels for all interactive elements
   - Keyboard navigation
   - Color-blind friendly palette
   - Screen reader testing

4. **Analytics**
   - Track page views
   - Monitor WebSocket connection quality
   - Log errors to error tracking service
   - Performance metrics collection

## Deployment Checklist

- [ ] All tests passing
- [ ] No console errors/warnings in production build
- [ ] Performance budget met (<150KB gzipped)
- [ ] Accessibility audit passed
- [ ] Dark/light theme tested
- [ ] Mobile responsive verified
- [ ] API rate limits respected
- [ ] Legal disclaimers displayed
- [ ] Error boundaries functional
- [ ] WebSocket fallback tested

## Credits & Attribution

**APIs:**
- OpenF1 (https://openf1.org) - Real-time F1 data
- Jolpica - Historical F1 data

**Libraries:**
- React 19 - UI framework
- TanStack React Query - Server state
- Zustand - UI state
- Recharts - Visualization
- Tailwind CSS - Styling
- Axios - HTTP client

**Disclaimer:** This is an unofficial Formula 1 fan project. Not affiliated with F1, FIA, or official F1 entities.
