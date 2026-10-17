import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Switch } from "./switch"

describe("Switch accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <label className="flex items-center gap-2">
        <Switch />
        Enable notifications
      </label>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Switch interaction", () => {
  it("works uncontrolled with defaultChecked", async () => {
    const user = userEvent.setup()
    render(<Switch defaultChecked={false} />)

    const toggle = screen.getByRole("switch")
    expect(toggle).toHaveAttribute("aria-checked", "false")

    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-checked", "true")
  })

  it("works controlled via checked and onCheckedChange", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    function Controlled() {
      const [checked, setChecked] = React.useState(false)
      return (
        <Switch
          checked={checked}
          onCheckedChange={(value, details) => {
            onCheckedChange(value, details)
            setChecked(value)
          }}
        />
      )
    }
    render(<Controlled />)

    const toggle = screen.getByRole("switch")
    await user.click(toggle)

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    expect(toggle).toHaveAttribute("aria-checked", "true")
  })

  it("toggles via keyboard (Space)", async () => {
    const user = userEvent.setup()
    render(<Switch />)

    const toggle = screen.getByRole("switch")
    toggle.focus()
    await user.keyboard(" ")

    expect(toggle).toHaveAttribute("aria-checked", "true")
  })

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch disabled onCheckedChange={onCheckedChange} />)

    const toggle = screen.getByRole("switch")
    expect(toggle).toHaveAttribute("aria-disabled", "true")

    await user.click(toggle)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
