import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { RadioGroup, RadioGroupItem } from "./radio-group"

function BasicRadioGroup(
  props: Partial<React.ComponentProps<typeof RadioGroup>> = {}
) {
  return (
    <RadioGroup aria-label="Plan" {...props}>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="free" />
        Free
      </label>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="pro" />
        Pro
      </label>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="enterprise" disabled />
        Enterprise
      </label>
    </RadioGroup>
  )
}

describe("RadioGroup accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<BasicRadioGroup />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("RadioGroup interaction", () => {
  it("selects an item on click", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<BasicRadioGroup onValueChange={onValueChange} />)

    const free = screen.getByRole("radio", { name: "Free" })
    await user.click(free)

    expect(onValueChange).toHaveBeenCalledWith("free", expect.anything())
    expect(free).toHaveAttribute("aria-checked", "true")
  })

  it("supports keyboard navigation with arrow keys", async () => {
    const user = userEvent.setup()
    render(<BasicRadioGroup defaultValue="free" />)

    const free = screen.getByRole("radio", { name: "Free" })
    const pro = screen.getByRole("radio", { name: "Pro" })

    free.focus()
    await user.keyboard("{ArrowDown}")

    expect(pro).toHaveFocus()
    expect(pro).toHaveAttribute("aria-checked", "true")
    expect(free).toHaveAttribute("aria-checked", "false")
  })

  it("does not select a disabled item", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<BasicRadioGroup onValueChange={onValueChange} />)

    const enterprise = screen.getByRole("radio", { name: "Enterprise" })
    expect(enterprise).toHaveAttribute("aria-disabled", "true")

    await user.click(enterprise)
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
