import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"

describe("Dialog accessibility", () => {
  it("has no accessibility violations when closed", async () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no accessibility violations when open", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports keyboard escape to close", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    )

    const trigger = screen.getByRole("button", { name: "Open" })
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByText("Dialog content")).toBeInTheDocument()
    })

    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(screen.queryByText("Dialog content")).not.toBeInTheDocument()
    })

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
