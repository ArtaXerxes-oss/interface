import assert from "node:assert/strict"
import { describe, it } from "vitest"

import { badgeVariants } from "@workspace/ui/components/badge"

const COLOR_VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
  "long",
  "short",
] as const

const SIZES = ["default", "sm"] as const

describe("badgeVariants", () => {
  for (const variant of COLOR_VARIANTS) {
    for (const size of SIZES) {
      it(`produces a non-empty class string for variant=${variant} size=${size}`, () => {
        const result = badgeVariants({ variant, size })
        assert.ok(result)
        assert.equal(typeof result, "string")
        assert.ok(result.length > 0)
      })
    }
  }

  it("applies size classes correctly", () => {
    const defaultSize = badgeVariants({ variant: "default", size: "default" })
    const smallSize = badgeVariants({ variant: "default", size: "sm" })
    assert.ok(defaultSize.includes("h-5"))
    assert.ok(smallSize.includes("h-4"))
  })

  it("includes semantic token classes for each state variant", () => {
    const asserts: Record<string, string> = {
      neutral: "bg-neutral/10",
      info: "bg-info/10",
      success: "bg-success/10",
      warning: "bg-warning/10",
      danger: "bg-danger/10",
    }
    for (const [variant, tokenClass] of Object.entries(asserts)) {
      const result = badgeVariants({ variant: variant as typeof COLOR_VARIANTS[number] })
      assert.ok(result.includes(tokenClass), `${variant} should include ${tokenClass}`)
    }
  })

  it("long variant includes extended padding", () => {
    const result = badgeVariants({ variant: "long" })
    assert.ok(result.includes("px-3"))
  })

  it("short variant uses dot-like dimensions", () => {
    const result = badgeVariants({ variant: "short" })
    assert.ok(result.includes("size-2.5"))
    assert.ok(result.includes("min-w-0"))
  })

  it("defaults to variant=default size=default", () => {
    const result = badgeVariants({})
    assert.ok(result.includes("bg-primary"))
    assert.ok(result.includes("h-5"))
  })
})
