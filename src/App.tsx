/**
 * F1 Live Dashboard - Main App Component
 * Luxury Editorial Edition
 * Includes paper noise texture overlay and visible editorial grid lines
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
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
                <Route
                  path="*"
                  element={
                    <div className="px-8 md:px-16 py-32 max-w-[1600px] mx-auto">
                      <h1 className="font-serif text-5xl md:text-7xl text-[#1A1A1A] leading-[0.9] mb-6">
                        Page <em className="text-[#D4AF37]">Not Found</em>
                      </h1>
                      <p className="text-[#6C6863] font-sans text-lg leading-relaxed max-w-md">
                        The page you're looking for doesn't exist. Return to the editorial.
                      </p>
                    </div>
                  }
                />
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
