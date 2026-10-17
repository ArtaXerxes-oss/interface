import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Checkbox } from "./checkbox"

describe("Checkbox accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <label className="flex items-center gap-2">
        <Checkbox id="terms" />
        Accept terms
      </label>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Checkbox interaction", () => {
  it("toggles checked state on click", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox onCheckedChange={onCheckedChange} />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("aria-checked", "false")

    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    expect(checkbox).toHaveAttribute("aria-checked", "true")

    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything())
  })

  it("toggles via keyboard (Space)", async () => {
    const user = userEvent.setup()
    render(<Checkbox />)

    const checkbox = screen.getByRole("checkbox")
    checkbox.focus()
    await user.keyboard(" ")

    expect(checkbox).toHaveAttribute("aria-checked", "true")
  })

  it("renders an indeterminate state", () => {
    render(<Checkbox indeterminate checked={false} />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("data-indeterminate")
    expect(checkbox).toHaveAttribute("aria-checked", "mixed")
  })

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox disabled onCheckedChange={onCheckedChange} />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("aria-disabled", "true")

    await user.click(checkbox)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
