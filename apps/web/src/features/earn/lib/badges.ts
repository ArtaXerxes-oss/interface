import type { BadgeVariant } from "@workspace/ui/components/badge"

/**
 * Asset-kind → shared Badge variant.
 *
 * Keeps the three earn products visually distinct without any feature-local
 * colour classes: every hue comes from a semantic token.
 */
export const ASSET_KIND_BADGE = {
  Staking: "info",
  GM: "success",
  GLV: "secondary",
} as const satisfies Record<string, BadgeVariant>

/** Badge variant for a pool row keyed by its `kind` discriminator. */
export const POOL_KIND_BADGE = {
  gm: ASSET_KIND_BADGE.GM,
  glv: ASSET_KIND_BADGE.GLV,
} as const satisfies Record<"gm" | "glv", BadgeVariant>

export type { BadgeVariant }
