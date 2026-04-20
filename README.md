# F1 Live Dashboard

> Real-time Formula 1 dashboard with live timing, standings, and race data. Unofficial fan project.

## 🎯 Overview

A production-ready, responsive web application for viewing live F1 session data, driver standings, circuit information, and historical race data. Built with React 19, TypeScript, Vite, and real-time WebSocket architecture.

**⚠️ Legal Disclaimer**: This is an unofficial fan project not affiliated with Formula 1, the FIA, or any official F1 partner. Data is sourced from open community APIs (OpenF1, Jolpica). All F1 trademarks and copyrights belong to their respective owners.

## ✨ Features

- **Real-time Timing**: Live position updates, gaps, intervals, and sector times
- **Live Session Data**: Current weather, pit stops, tire strategies, and lap information
- **Standings**: Driver and constructor championships with historical comparisons
- **Schedule**: 2026 F1 calendar with session details and countdown timers
- **Circuits**: Track information, lap records, and historical data
- **Dark/Light Theme**: Responsive theme toggle with persistent preferences
- **Performance Optimized**:
  - WebSocket for real-time updates with HTTP polling fallback
  - Batched state updates (200ms) to prevent render thrashing
  - Virtualized lists for 20+ driver tables
  - Code splitting and lazy-loaded pages
  - <150KB gzipped bundle

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript 5
- **Build Tool**: Vite 5 with optimized chunking
- **Routing**: react-router-dom v6
- **State Management**: Zustand v4 (UI state) + TanStack React Query v5 (server state)
- **Styling**: Tailwind CSS v3 + shadcn/ui components
- **Charts**: Recharts v2
- **Real-time**: Native WebSocket + HTTP polling fallback
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint (strict TS) + Prettier
- **Dev Server**: Vite dev server with HMR

## 📦 Project Structure

```
src/
├── api/                 # API clients and queries
│   ├── client.ts        # Axios wrapper (retry, rate-limit, queue)
│   ├── openf1.ts        # OpenF1 real-time API endpoints
│   ├── jolpica.ts       # Jolpica historical API endpoints
│   └── queryClient.ts   # TanStack React Query config
├── hooks/               # Custom React hooks
│   ├── useLiveSession.ts      # WebSocket + polling + batching
│   ├── useDebouncedState.ts   # Debounced state updates
│   └── useSessionTimer.ts     # Countdown and elapsed timers
├── store/               # Zustand stores
│   └── uiStore.ts       # Theme, year, circuit selection
├── components/
│   ├── layout/          # Header, Footer, Sidebar
│   ├── shared/          # ErrorBoundary, LoadingSpinner
│   ├── timing/          # LiveTable, TireBadge, PitStops
│   ├── charts/          # LapTimeChart, StrategyGraph
│   └── ui/              # Primitive UI components
├── pages/               # Route components
│   ├── HomePage.tsx
│   ├── SchedulePage.tsx
│   ├── LivePage.tsx
│   ├── StandingsPage.tsx
│   └── CircuitPage.tsx
├── types/               # TypeScript interfaces
│   └── f1.ts            # F1 data models
├── utils/               # Helper functions
│   ├── timeFormatters.ts    # Time formatting (mm:ss.sss, gaps)
│   ├── tireColors.ts        # Tire compound styling
│   ├── teamColors.ts        # Team color mapping
│   └── ...
├── test/                # Test setup and utilities
│   └── setup.ts
├── App.tsx              # Router setup
├── main.tsx             # Entry point
└── index.css            # Global styles + theme variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (or latest LTS)
- npm or yarn

### Installation

1. **Clone or navigate to project**:
   ```bash
   cd dammylive
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Outputs to `dist/` - ready for Vercel, Netlify, or any static host.

### Other Commands

```bash
npm run type-check     # TypeScript strict mode check
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm test               # Run Vitest
npm run test:ui        # Vitest with UI
npm run test:coverage  # Coverage report
```

## 🌐 API Documentation

### OpenF1 API (Real-time)

Base: `https://api.openf1.org/v1`

- `GET /sessions` - List all sessions
- `GET /positions?session_key={key}` - Live driver positions
- `GET /laps?session_key={key}` - Lap data with sector times
- `GET /weather?session_key={key}` - Current weather conditions
- `GET /pit_stops?session_key={key}` - Pit stop history
- `WSS /stream?session={key}` - Real-time WebSocket stream

**Rate Limits**: 10 requests/second per IP

### Jolpica F1 API (Historical)

Base: `https://api.jolpi.ca/f1`

- `GET /{year}/driverStandings` - Driver championships
- `GET /{year}/constructorStandings` - Constructor championships
- `GET /circuits` - All F1 circuits
- `GET /circuits/{id}` - Specific circuit details

**Rate Limits**: Generous, community-maintained

## 🏗 Architecture Decisions

### Real-time Updates with Batching

The `useLiveSession` hook implements three-tier redundancy:

1. **Primary**: WebSocket (`wss://api.openf1.org/v1/stream?session={key}`)
   - Receives 10-50 updates per second during live sessions
   - Batches updates every 200ms via `setTimeout` to prevent React render thrashing
   - Automatic reconnection with exponential backoff (1s → 16s max)

2. **Fallback**: HTTP Polling (2s interval)
   - Triggered after 10 failed reconnection attempts
   - Uses `getPositions()` API endpoint
   - No real-time guarantee but ensures data flow continues

3. **Request Queuing & Rate Limiting**
   - API client automatically queues requests
   - Enforces 100ms minimum between requests
   - Respects API rate limits gracefully

### State Management

- **UI State** (Zustand, persisted): Theme, year, selected circuit, filters
- **Server State** (React Query): Sessions, standings, circuit data (10m stale, 1h cache)
- **Live Session State** (useLiveSession): Real-time positions, weather, laps (in-memory, not persisted)

### Performance Optimizations

| Technique | Benefit |
|-----------|---------|
| Code splitting | Pages lazy-loaded on route change |
| Virtualization | Render only visible rows in 20+ driver tables |
| Batched updates | 200ms debounce prevents render storms |
| Query cache | Stale-time 10m, gcTime 1h reduces API calls |
| Chunk optimization | Vendor chunks (React, Query, Charts) separated |
| Tree-shaking | ESM modules, no unused code in bundles |

Target: **<150KB gzipped**

## 🎨 Theming

The app uses CSS custom properties with Tailwind for theme switching:

- **Light Mode** (default): F1-inspired amber accents (#f59e0b)
- **Dark Mode**: High contrast with team colors
- **Tire Compounds**: F1 official colors
  - Soft: Red (#E10600)
  - Medium: Yellow (#FDD835)
  - Hard: White (#FFFFFF)
  - Intermediate: Green (#15803D)
  - Wet: Blue (#1D4ED8)

## 🧪 Testing

Test files are co-located in `src/**/*.test.ts(x)`.

```bash
# Unit tests for hooks
npm test -- useLiveSession

# Integration tests
npm test -- pages/LivePage

# Coverage report
npm run test:coverage
```

## 📱 Responsive Design

- **Mobile First**: Designed for 320px+ screens
- **Tablet** (768px+): Optimized layout, side navigation
- **Desktop** (1024px+): Full feature set
- **Horizontal Scroll**: Timing table on small screens
- **Touch Friendly**: 48px+ tap targets

## ♿ Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus management in modals/dropdowns
- Sufficient color contrast (WCAG AA)
- Semantic HTML (`<button>`, `<nav>`, etc.)
- Screen reader friendly

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Auto-detects Vite config
3. Deploy!

```bash
vercel deploy
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🐛 Troubleshooting

### WebSocket Connection Fails

1. Check network tab - verify `wss://api.openf1.org` connectivity
2. If blocked (corporate firewall), HTTP polling automatically starts
3. Check browser console for error messages

### Stale Data

- React Query caches for 10 minutes by default
- Manual refresh: `Cmd/Ctrl + Shift + R` (hard refresh)
- Or clear browser cache → reload

## 📝 API Rate Limiting

**OpenF1**: 10 requests/second
- The client automatically queues requests
- Built-in 100ms minimum between requests
- HTTP polling uses 2s interval (safe limit)

**Jolpica**: Generous limits (community API)
- Endpoints cached by React Query (10m stale)
- Historical data fetched once per page load

## 🔐 Security

- No sensitive data (all APIs are public/free)
- No authentication required
- All HTTPS connections
- XSS protection via React's built-in escaping
- CSRF protection: only GET requests (idempotent)

## 📄 License

MIT - See LICENSE file

---

**Status**: ✅ Production Ready | Last Updated: April 2026
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
