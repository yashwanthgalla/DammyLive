/**
 * F1 Live Dashboard - Main App Component
 * Luxury Editorial Edition
 * Includes paper noise texture overlay and visible editorial grid lines
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ErrorBoundary from './components/shared/ErrorBoundary'
import LoadingOverlay from './components/shared/LoadingOverlay'
import ScrollToTop from './components/shared/ScrollToTop'

// Lazy-loaded pages
const SchedulePage = lazy(() => import('./pages/SchedulePage'))
const LivePage = lazy(() => import('./pages/LivePage'))
const LiveHubPage = lazy(() => import('./pages/LiveHubPage'))
const StandingsPage = lazy(() => import('./pages/StandingsPage'))
const CircuitPage = lazy(() => import('./pages/CircuitPage'))
const CircuitsListPage = lazy(() => import('./pages/CircuitsListPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const SessionResultsPage = lazy(() => import('./pages/SessionResultsPage'))
const DriverPage = lazy(() => import('./pages/DriverPage'))
const ConstructorPage = lazy(() => import('./pages/ConstructorPage'))
const DriversListPage = lazy(() => import('./pages/DriversListPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

/**
 * Page Loader Component — Editorial
 */
function PageLoader() {
  return <LoadingOverlay message="Curating..." subMessage="Preparing your editorial experience" />
}

/**
 * Main App Component with Router
 * Includes paper noise texture and visible grid lines for editorial feel
 */
export default function App() {
  // Disable right-click context menu and developer tools shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 - Developer Tools
      if (e.key === 'F12') {
        e.preventDefault()
      }
      // Ctrl+Shift+I - Inspect Element (Windows/Linux)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
      }
      // Ctrl+Shift+J - Console (Windows/Linux)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
      }
      // Ctrl+Shift+C - Inspect Element (Chrome)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
      }
      // Cmd+Option+I - Inspect Element (Mac)
      if (e.metaKey && e.altKey && e.key === 'i') {
        e.preventDefault()
      }
      // Cmd+Option+J - Console (Mac)
      if (e.metaKey && e.altKey && e.key === 'j') {
        e.preventDefault()
      }
      // Cmd+Option+U - View Source (Mac)
      if (e.metaKey && e.altKey && e.key === 'u') {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#F9F8F6] text-[#1A1A1A] transition-colors relative">
        {/* Paper Noise Texture Overlay */}
        <div className="paper-noise" aria-hidden="true" />



        <ErrorBoundary>
          <Header />
        </ErrorBoundary>

        <main className="flex-1 w-full">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/live" element={<LiveHubPage />} />
                <Route path="/live/:sessionKey" element={<LivePage />} />
                <Route path="/standings" element={<StandingsPage />} />
                <Route path="/circuits" element={<CircuitsListPage />} />
                <Route path="/circuit/:circuitId" element={<CircuitPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/results/:sessionKey" element={<SessionResultsPage />} />
                <Route path="/driver/:driverId" element={<DriverPage />} />
                <Route path="/constructor/:constructorId" element={<ConstructorPage />} />
                <Route path="/drivers" element={<DriversListPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </div>
    </Router>
  )
}
