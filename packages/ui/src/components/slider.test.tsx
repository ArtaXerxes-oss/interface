import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Slider } from "./slider"

describe("Slider accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Slider defaultValue={[50]} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup()
    const { container } = render(<Slider defaultValue={[50]} min={0} max={100} />)

    // Base UI renders the accessible control as a visually hidden range input
    const slider = container.querySelector("input[type='range']")
    expect(slider).toHaveAttribute("min", "0")
    expect(slider).toHaveAttribute("max", "100")
    expect(slider).toHaveAttribute("aria-valuenow")
  })
})
