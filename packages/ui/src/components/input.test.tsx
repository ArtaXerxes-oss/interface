import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Input } from "./input"

describe("Input accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Input placeholder="Enter text" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports typing without violations", async () => {
    const user = userEvent.setup()
    const { container } = render(<Input placeholder="Enter text" />)

    const input = screen.getByRole("textbox")
    await user.type(input, "test")

    expect(input).toHaveValue("test")

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports disabled state", async () => {
    const { container } = render(<Input placeholder="Disabled input" disabled />)
    const input = screen.getByRole("textbox")

    expect(input).toBeDisabled()

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports invalid state", async () => {
    const { container } = render(<Input aria-invalid="true" aria-label="Amount" />)
    const input = screen.getByRole("textbox")

    expect(input).toHaveAttribute("aria-invalid", "true")

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
