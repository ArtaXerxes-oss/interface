import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

describe("Tabs accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    )

    const tab1 = screen.getByRole("tab", { name: "Tab 1" })
    const tab2 = screen.getByRole("tab", { name: "Tab 2" })

    expect(tab1).toHaveAttribute("aria-selected", "true")

    await user.click(tab2)
    expect(tab2).toHaveAttribute("aria-selected", "true")
    expect(tab1).toHaveAttribute("aria-selected", "false")

    expect(screen.getByText("Content 2")).toBeInTheDocument()
  })

  it("has proper ARIA attributes", async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    const tab1 = screen.getByRole("tab", { name: "Tab 1" })
    expect(tab1).toHaveAttribute("aria-selected")
  })

  it("moves focus and selection with arrow keys", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    )

    const tab1 = screen.getByRole("tab", { name: "Tab 1" })
    const tab2 = screen.getByRole("tab", { name: "Tab 2" })

    tab1.focus()
    await user.keyboard("{ArrowRight}")
    expect(tab2).toHaveFocus()

    await user.keyboard("{Enter}")
    expect(tab2).toHaveAttribute("aria-selected", "true")
  })
})

describe("Tabs variants", () => {
  it("defaults to the segmented (default) variant", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    )

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-variant",
      "default"
    )
  })

  it("supports an explicit segmented variant", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList variant="segmented">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    )

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-variant",
      "segmented"
    )
  })

  it("supports the line variant", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList variant="line">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    const tablist = screen.getByRole("tablist")
    expect(tablist).toHaveAttribute("data-variant", "line")

    const tab2 = screen.getByRole("tab", { name: "Tab 2" })
    await user.click(tab2)
    expect(tab2).toHaveAttribute("aria-selected", "true")
  })
})
