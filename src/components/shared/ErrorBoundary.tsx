/**
 * Error Boundary Component
 * Catches unhandled React errors and displays fallback UI
 */

import { ReactNode, Component, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-8 bg-black border border-f1-red rounded-sm">
            <h2 className="text-xl font-black text-f1-red mb-2 uppercase tracking-widest italic">
              System Alert 500
            </h2>
            <p className="text-sm text-text-muted mb-4 uppercase font-bold tracking-tight">
              A system error occurred.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.reload()
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition"
            >
              Reload Page
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
