/**
 * Loading Spinner Component
 * Displays an animated spinner for loading states
 */

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}
