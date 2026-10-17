import { useEffect, useState } from "react"
import { formatPct } from "@/shared/lib/format"

const EPOCH_MS = 8 * 60 * 60 * 1000

type Props = {
  ratePerHour: number
  nextEpochTs: number
}

function formatCountdown(nextEpochTs: number, now: number): string {
  if (!Number.isFinite(nextEpochTs)) return "—"

  const delta = nextEpochTs - now
  const remaining = ((((delta - 1) % EPOCH_MS) + EPOCH_MS) % EPOCH_MS) + 1
  const seconds = Math.ceil(remaining / 1000)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return [hours, minutes, seconds % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":")
}

export function FundingRate({ ratePerHour, nextEpochTs }: Props) {
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="inline-flex gap-2 font-mono">
      <span>{formatPct(ratePerHour * 100, { decimals: 3 })}/h</span>
      <span className="text-muted-foreground">
        {formatCountdown(nextEpochTs, now)}
      </span>
    </span>
  )
}
