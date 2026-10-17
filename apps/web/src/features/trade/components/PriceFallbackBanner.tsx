import { AlertTriangle } from "lucide-react"

/**
 * Blocking banner shown when all live oracle sources (Binance, GMX) have
 * failed and the UI is displaying hard-coded dummy prices.
 *
 * Intentionally does NOT have a dismiss button — the banner must stay visible
 * until the oracle recovers, because users cannot safely trade on stale data.
 */
export function PriceFallbackBanner() {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200"
      data-testid="price-fallback-banner"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" aria-hidden="true" />
      <div className="space-y-0.5">
        <p className="font-medium text-yellow-100">Price feeds unavailable</p>
        <p className="text-xs text-yellow-300/80">
          All live oracle sources are offline. Displayed prices are estimates only
          and order submission is disabled until feeds recover.
        </p>
      </div>
    </div>
  )
}
