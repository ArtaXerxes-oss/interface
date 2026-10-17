import assert from "node:assert/strict"
import { describe, it } from "vitest"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

describe("DropdownMenu component exports", () => {
  it("exports all expected parts", () => {
    assert.equal(typeof DropdownMenu, "function")
    assert.equal(typeof DropdownMenuTrigger, "function")
    assert.equal(typeof DropdownMenuContent, "function")
    assert.equal(typeof DropdownMenuItem, "function")
    assert.equal(typeof DropdownMenuCheckboxItem, "function")
    assert.equal(typeof DropdownMenuRadioGroup, "function")
    assert.equal(typeof DropdownMenuRadioItem, "function")
    assert.equal(typeof DropdownMenuGroup, "function")
    assert.equal(typeof DropdownMenuGroupLabel, "function")
    assert.equal(typeof DropdownMenuSeparator, "function")
    assert.equal(typeof DropdownMenuShortcut, "function")
  })
})

describe("DropdownMenuItem", () => {
  it("renders without destructive prop", () => {
    const item = DropdownMenuItem({ children: "Item" })
    assert.ok(item)
  })

  it("renders with destructive prop", () => {
    const item = DropdownMenuItem({ destructive: true, children: "Delete" })
    assert.ok(item)
  })

  it("renders with disabled state", () => {
    const item = DropdownMenuItem({ disabled: true, children: "Item" })
    assert.ok(item)
  })
})

describe("DropdownMenuCheckboxItem", () => {
  it("renders in unchecked state", () => {
    const item = DropdownMenuCheckboxItem({ children: "Option" })
    assert.ok(item)
  })

  it("renders in checked state", () => {
    const item = DropdownMenuCheckboxItem({ checked: true, children: "Option" })
    assert.ok(item)
  })

  it("renders with defaultChecked", () => {
    const item = DropdownMenuCheckboxItem({
      defaultChecked: true,
      children: "Option",
    })
    assert.ok(item)
  })
})

describe("DropdownMenuRadioGroup and RadioItem", () => {
  it("renders a radio group with items", () => {
    const group = DropdownMenuRadioGroup({
      value: "a",
      children: [
        DropdownMenuRadioItem({ value: "a", key: "a", children: "Option A" }),
        DropdownMenuRadioItem({ value: "b", key: "b", children: "Option B" }),
      ],
    })
    assert.ok(group)
  })

  it("renders a radio item with value", () => {
    const item = DropdownMenuRadioItem({ value: "a", children: "Option A" })
    assert.ok(item)
  })
})

describe("DropdownMenuContent", () => {
  it("accepts positioning props", () => {
    const content = DropdownMenuContent({
      side: "bottom",
      align: "start",
      children: "Content",
    })
    assert.ok(content)
  })
})

describe("DropdownMenuGroup and GroupLabel", () => {
  it("renders a group with label", () => {
    const label = DropdownMenuGroupLabel({ children: "Group" })
    assert.ok(label)
  })

  it("renders a group wrapper", () => {
    const group = DropdownMenuGroup({ children: "Content" })
    assert.ok(group)
  })
})

describe("DropdownMenuSeparator", () => {
  it("renders a separator", () => {
    const separator = DropdownMenuSeparator({})
    assert.ok(separator)
  })
})

describe("DropdownMenuShortcut", () => {
  it("renders a shortcut hint", () => {
    const shortcut = DropdownMenuShortcut({ children: "⌘K" })
    assert.ok(shortcut)
  })
})
