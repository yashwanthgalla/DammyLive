/**
 * Loading Spinner Component — Luxury Editorial
 * Elegant, minimal spinner with gold accent
 */

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-10 h-10 border border-[#1A1A1A]/10 border-t-[#D4AF37] animate-spin" />
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#6C6863]">Loading</p>
    </div>
  )
}
