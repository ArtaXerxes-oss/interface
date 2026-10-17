import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import { EmptyState } from "@workspace/ui/components/empty-state"

afterEach(() => {
  cleanup()
})

// ---------------------------------------------------------------------------
// Minimal SVG icon fixture used across several tests
// ---------------------------------------------------------------------------
function FolderIcon() {
  return (
    <svg
      data-testid="folder-icon"
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M2 5a2 2 0 012-2h3l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// No-data empty state
// ---------------------------------------------------------------------------
describe("EmptyState – no-data", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        title="No data yet"
        description="Once records are created they will appear here."
      />,
    )

    expect(screen.getByText("No data yet")).toBeTruthy()
    expect(
      screen.getByText("Once records are created they will appear here."),
    ).toBeTruthy()
  })

  it("renders the icon when provided", () => {
    render(
      <EmptyState
        icon={<FolderIcon />}
        title="No data yet"
      />,
    )

    expect(screen.getByTestId("folder-icon")).toBeTruthy()
  })

  it("renders without icon or actions (layout-only)", () => {
    const { container } = render(
      <EmptyState title="No data yet" description="Nothing here." />,
    )

    const root = container.querySelector("[data-slot='empty-state']")
    expect(root).toBeTruthy()
    // Icon wrapper must not be present
    expect(container.querySelector("[aria-hidden='true']")).toBeNull()
    // Action slot must not be present
    expect(
      container.querySelector("[data-slot='empty-state-actions']"),
    ).toBeNull()
  })

  it("renders a primary button action", () => {
    render(
      <EmptyState
        title="No data yet"
        actions={{
          primary: <button type="button">Add record</button>,
        }}
      />,
    )

    expect(screen.getByRole("button", { name: "Add record" })).toBeTruthy()
  })

  it("renders a primary link action", () => {
    render(
      <EmptyState
        title="No data yet"
        actions={{
          primary: <a href="/new">Create your first record</a>,
        }}
      />,
    )

    const link = screen.getByRole("link", { name: "Create your first record" })
    expect(link).toBeTruthy()
    expect(link.getAttribute("href")).toBe("/new")
  })

  it("renders both primary and secondary actions together", () => {
    render(
      <EmptyState
        title="No data yet"
        actions={{
          primary: <button type="button">Add record</button>,
          secondary: <button type="button">Learn more</button>,
        }}
      />,
    )

    expect(screen.getByRole("button", { name: "Add record" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Learn more" })).toBeTruthy()
  })

  it("applies the compact variant by default", () => {
    const { container } = render(<EmptyState title="No data yet" />)

    const root = container.querySelector("[data-slot='empty-state']")
    expect(root?.getAttribute("data-variant")).toBe("compact")
  })

  it("applies the page variant when specified", () => {
    const { container } = render(
      <EmptyState variant="page" title="No data yet" />,
    )

    const root = container.querySelector("[data-slot='empty-state']")
    expect(root?.getAttribute("data-variant")).toBe("page")
  })

  it("renders with no props at all without crashing", () => {
    const { container } = render(<EmptyState />)

    const root = container.querySelector("[data-slot='empty-state']")
    expect(root).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Filtered-empty state
// ---------------------------------------------------------------------------
describe("EmptyState – filtered-empty", () => {
  it("renders the filtered-empty title and description", () => {
    render(
      <EmptyState
        title="No results found"
        description='No pools match "XYZ". Try a different filter or clear your search.'
      />,
    )

    expect(screen.getByText("No results found")).toBeTruthy()
    expect(
      screen.getByText(
        'No pools match "XYZ". Try a different filter or clear your search.',
      ),
    ).toBeTruthy()
  })

  it("renders a clear-filters action", () => {
    render(
      <EmptyState
        title="No results found"
        description="Try adjusting your filters."
        actions={{
          primary: <button type="button">Clear filters</button>,
        }}
      />,
    )

    expect(screen.getByRole("button", { name: "Clear filters" })).toBeTruthy()
  })

  it("renders secondary dismiss action alongside primary", () => {
    render(
      <EmptyState
        title="No results found"
        actions={{
          primary: <button type="button">Clear filters</button>,
          secondary: <button type="button">Cancel</button>,
        }}
      />,
    )

    expect(screen.getByRole("button", { name: "Clear filters" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy()
  })

  it("works without an icon in page variant (filtered-empty full-page)", () => {
    const { container } = render(
      <EmptyState
        variant="page"
        title="No results found"
        description="Try adjusting your search or filters."
        actions={{
          primary: <button type="button">Reset filters</button>,
        }}
      />,
    )

    const root = container.querySelector("[data-slot='empty-state']")
    expect(root?.getAttribute("data-variant")).toBe("page")
    // No icon rendered
    expect(container.querySelector("[aria-hidden='true']")).toBeNull()
    // Action present
    expect(screen.getByRole("button", { name: "Reset filters" })).toBeTruthy()
  })

  it("renders icon, title, description, and action together (page)", () => {
    render(
      <EmptyState
        variant="page"
        icon={<FolderIcon />}
        title="No matching pools"
        description="Your filters returned no pools. Clear them to see all pools."
        actions={{
          primary: <button type="button">Clear filters</button>,
          secondary: <a href="/pools">Browse all pools</a>,
        }}
      />,
    )

    expect(screen.getByTestId("folder-icon")).toBeTruthy()
    expect(screen.getByText("No matching pools")).toBeTruthy()
    expect(
      screen.getByText(
        "Your filters returned no pools. Clear them to see all pools.",
      ),
    ).toBeTruthy()
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Browse all pools" })).toBeTruthy()
  })
})
