import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import type { Tier } from "../../data/tiers"

/**
 * Tier pill. Wraps the shared `Badge` so every tier chip in the referrals
 * feature shares one shape, size and focus treatment.
 */
export function TierBadge({ tier, className }: { tier: Tier; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-semibold", tier.badgeClass, className)}>
      {tier.label}
    </Badge>
  )
}
