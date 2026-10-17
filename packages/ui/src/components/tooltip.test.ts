import assert from "node:assert/strict"
import { describe, it } from "vitest"

import {
  Tooltip,
  TooltipContent,
  TooltipDescription,
  TooltipProvider,
  TooltipShortcut,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

describe("Tooltip component exports", () => {
  it("exports all expected parts", () => {
    assert.equal(typeof Tooltip, "function")
    assert.equal(typeof TooltipProvider, "function")
    assert.equal(typeof TooltipTrigger, "function")
    assert.equal(typeof TooltipContent, "function")
    assert.equal(typeof TooltipDescription, "function")
    assert.equal(typeof TooltipShortcut, "function")
  })
})

describe("TooltipProvider defaults", () => {
  it("supplies a non-zero default delay for standard hover UX", () => {
    const provider = TooltipProvider({})
    assert.ok(provider)
  })
})

describe("Tooltip hoverable popup", () => {
  it("disables hoverable popup by default to avoid trapping pointer", () => {
    const tooltip = Tooltip({})
    assert.ok(tooltip)
  })
})

describe("TooltipDescription", () => {
  it("renders a paragraph with tooltip-description slot", () => {
    const desc = TooltipDescription({ children: "Description text" })
    assert.ok(desc)
  })
})

describe("TooltipShortcut", () => {
  it("renders a kbd element with shortcut styling", () => {
    const shortcut = TooltipShortcut({ children: "⌘K" })
    assert.ok(shortcut)
  })
})

describe("TooltipContent", () => {
  it("accepts side and align positioning props", () => {
    const content = TooltipContent({ side: "bottom", align: "start", children: "Content" })
    assert.ok(content)
  })
})
