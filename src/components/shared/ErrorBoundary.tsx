/**
 * Error Boundary Component
 * Catches unhandled React errors and displays fallback UI
 * Luxury Editorial Edition
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
          <div className="flex flex-col items-center justify-center p-12 bg-[#F9F8F6] border-t border-[#1A1A1A]">
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">
              Something went wrong
            </h2>
            <p className="font-sans text-sm text-[#6C6863] mb-8">
              An unexpected error occurred.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.reload()
              }}
              className="btn-primary"
            >
              <span>Reload</span>
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
