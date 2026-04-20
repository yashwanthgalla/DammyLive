import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/queryClient'
import { useUIStore } from './store/uiStore'
import App from './App'
import './index.css'

/**
 * Theme initialization on mount
 */
function InitializeTheme() {
  const theme = useUIStore((state) => state.theme)

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return null
}

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InitializeTheme />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)

