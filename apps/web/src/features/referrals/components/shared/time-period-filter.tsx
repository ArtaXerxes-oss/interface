import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { TimePeriod } from "../../hooks/use-referrals-data"

const PERIODS: Array<{ value: TimePeriod; label: string }> = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "total", label: "Total" },
]

type Props = {
  value: TimePeriod
  onChange: (p: TimePeriod) => void
}

export function TimePeriodFilter({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Time period"
      className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5"
    >
      {PERIODS.map((p) => (
        <Button
          key={p.value}
          variant="ghost"
          size="sm"
          aria-pressed={value === p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-11 font-medium transition-colors",
            value === p.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground",
          )}
        >
          {p.label}
        </Button>
      ))}
    </div>
  )
}
