/**
 * HTTP Client with retry logic, rate-limiting, and request queuing
 * Used as the base for all API communications (OpenF1, Jolpica)
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'

interface RetryConfig {
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
}

interface RequestQueueItem {
  config: AxiosRequestConfig
  resolve: (value: AxiosResponse) => void
  reject: (reason?: AxiosError) => void
}

/**
 * Creates a preconfigured Axios instance with:
 * - Exponential backoff retry (3x)
 * - 5s timeout
 * - Request queuing for rate limit handling
 * - Cache headers respect
 */
export function createApiClient(
  baseURL: string,
  retryConfig: Partial<RetryConfig> = {}
): AxiosInstance {
  const finalRetryConfig: RetryConfig = {
    maxRetries: 3,
    initialDelayMs: 500,
    maxDelayMs: 16000,
    ...retryConfig,
  }

  const client = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent':
        'F1-Live-Dashboard/1.0 (Unofficial fan project, not affiliated with F1)',
    },
  })

  let requestQueue: RequestQueueItem[] = []
  let isProcessing = false
  let lastRequestTime = 0
  const minRequestInterval = 100 // 100ms between requests to respect rate limits

  /**
   * Process queued requests with rate limiting
   */
  const processQueue = async (): Promise<void> => {
    if (isProcessing || requestQueue.length === 0) return

    isProcessing = true

    while (requestQueue.length > 0) {
      const item = requestQueue.shift()
      if (!item) break

      const now = Date.now()
      const timeSinceLastRequest = now - lastRequestTime
      if (timeSinceLastRequest < minRequestInterval) {
        await new Promise((r) => setTimeout(r, minRequestInterval - timeSinceLastRequest))
      }

      try {
        const response = await client.request(item.config)
        lastRequestTime = Date.now()
        item.resolve(response)
      } catch (error) {
        item.reject(error as AxiosError)
      }
    }

    isProcessing = false
  }

  /**
   * Retry interceptor with exponential backoff
   */
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as AxiosRequestConfig & { _retryCount?: number }

      if (!config) {
        return Promise.reject(error)
      }

      config._retryCount = config._retryCount || 0

      // Don't retry on 4xx errors (except 429) or non-network errors
      if (
        error.response &&
        error.response.status < 500 &&
        error.response.status !== 429
      ) {
        return Promise.reject(error)
      }

      // Max retries exceeded
      if (config._retryCount >= finalRetryConfig.maxRetries) {
        return Promise.reject(error)
      }

      config._retryCount++

      // Calculate exponential backoff delay
      const delay = Math.min(
        finalRetryConfig.initialDelayMs *
          Math.pow(2, config._retryCount - 1),
        finalRetryConfig.maxDelayMs
      )

      await new Promise((r) => setTimeout(r, delay))

      return client.request(config)
    }
  )

  /**
   * Add request to queue and process
   */
  client.request = (async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
    return new Promise((resolve, reject) => {
      requestQueue.push({
        config,
        resolve,
        reject,
      })
      processQueue()
    }) as Promise<AxiosResponse>
  }) as any

  return client
}

/**
 * Handle common API errors with user-friendly messages
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Network error. Please check your connection.'
    }

    switch (error.response.status) {
      case 400:
        return 'Bad request. Please try again.'
      case 401:
        return 'Unauthorized access.'
      case 403:
        return 'Access forbidden.'
      case 404:
        return 'Resource not found.'
      case 429:
        return 'Too many requests. Please wait a moment.'
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later.'
      default:
        return error.message || 'An unexpected error occurred.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}
