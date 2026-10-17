import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select"

function BasicSelect(
  props: Partial<React.ComponentProps<typeof Select<string>>> = {}
) {
  return (
    <Select {...props}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectGroupLabel>Fruits</SelectGroupLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry" disabled>
            Cherry
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="date">Date</SelectItem>
      </SelectContent>
    </Select>
  )
}

describe("Select accessibility", () => {
  it("has no accessibility violations when closed", async () => {
    const { container } = render(<BasicSelect />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no accessibility violations when open", async () => {
    const { container } = render(<BasicSelect defaultOpen />)
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument()
    })
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Select selection", () => {
  it("selects an item on click and updates the trigger value", async () => {
    const user = userEvent.setup()
    render(<BasicSelect />)

    const trigger = screen.getByRole("combobox", { name: "Fruit" })
    await user.click(trigger)

    const banana = await screen.findByRole("option", { name: "Banana" })
    await user.click(banana)

    await waitFor(() => {
      expect(trigger).toHaveTextContent("banana")
    })
  })

  it("calls onValueChange with the selected value", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<BasicSelect onValueChange={onValueChange} />)

    await user.click(screen.getByRole("combobox", { name: "Fruit" }))
    const apple = await screen.findByRole("option", { name: "Apple" })
    await user.click(apple)

    expect(onValueChange).toHaveBeenCalledWith("apple", expect.anything())
  })

  it("does not select a disabled item", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<BasicSelect onValueChange={onValueChange} />)

    await user.click(screen.getByRole("combobox", { name: "Fruit" }))
    const cherry = await screen.findByRole("option", { name: "Cherry" })
    expect(cherry).toHaveAttribute("aria-disabled", "true")

    await user.click(cherry)
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe("Select keyboard navigation", () => {
  it("opens with Enter and closes with Escape", async () => {
    const user = userEvent.setup()
    render(<BasicSelect />)

    const trigger = screen.getByRole("combobox", { name: "Fruit" })
    trigger.focus()
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument()
    })

    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(
        screen.queryByRole("option", { name: "Apple" })
      ).not.toBeInTheDocument()
    })
  })

  it("navigates items with arrow keys and selects with Enter", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<BasicSelect onValueChange={onValueChange} />)

    const trigger = screen.getByRole("combobox", { name: "Fruit" })
    trigger.focus()
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument()
    })

    await user.keyboard("{ArrowDown}")
    await user.keyboard("{Enter}")

    expect(onValueChange).toHaveBeenCalledWith("banana", expect.anything())
  })

  it("supports typeahead to jump to a matching item", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<BasicSelect onValueChange={onValueChange} />)

    const trigger = screen.getByRole("combobox", { name: "Fruit" })
    trigger.focus()
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument()
    })

    await user.keyboard("d")
    await user.keyboard("{Enter}")

    expect(onValueChange).toHaveBeenCalledWith("date", expect.anything())
  })
})
