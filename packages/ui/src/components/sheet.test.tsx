import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet"

describe("Sheet accessibility", () => {
  it("has no accessibility violations when closed", async () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Test Sheet</SheetTitle>
          </SheetHeader>
          <p>Sheet content</p>
        </SheetContent>
      </Sheet>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no accessibility violations when open", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Sheet open>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Test Sheet</SheetTitle>
          </SheetHeader>
          <p>Sheet content</p>
        </SheetContent>
      </Sheet>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports keyboard escape to close", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Test Sheet</SheetTitle>
          </SheetHeader>
          <p>Sheet content</p>
        </SheetContent>
      </Sheet>
    )

    const trigger = screen.getByRole("button", { name: "Open" })
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByText("Sheet content")).toBeInTheDocument()
    })

    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(screen.queryByText("Sheet content")).not.toBeInTheDocument()
    })

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
