/**
 * F1 Live Dashboard - Main App Component
 * Sets up routing, error boundaries, and layout
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ErrorBoundary from './components/shared/ErrorBoundary'
import LoadingOverlay from './components/shared/LoadingOverlay'

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

/**
 * Page Loader Component
 */
function PageLoader() {
  return <LoadingOverlay message="Racing Feed..." subMessage="Initializing Hub" />
}

/**
 * Main App Component with Router
 */
export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white text-text-primary transition-colors">
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
                <Route
                  path="*"
                  element={
                    <div className="p-8 text-center">
                      <h1 className="text-3xl font-bold mb-4">
                        Page Not Found
                      </h1>
                      <p className="text-muted-foreground">
                        The page you're looking for doesn't exist.
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

