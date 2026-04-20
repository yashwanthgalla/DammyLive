/**
 * TanStack React Query Client
 * Configured with optimal defaults for F1 data:
 * - staleTime: 10 minutes for historical data
 * - cacheTime: 1 hour for background refetching
 * - retries: 3 with exponential backoff
 */

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 60 * 60 * 1000, // 1 hour (formerly cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * Math.pow(2, attemptIndex), 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
})
