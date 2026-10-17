import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Field } from "./field"
import { Textarea } from "./textarea"

describe("Textarea accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Textarea aria-label="Notes" placeholder="Enter notes" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("renders a native textarea and forwards typing", async () => {
    const user = userEvent.setup()
    render(<Textarea aria-label="Notes" />)

    const textarea = screen.getByRole("textbox")
    expect(textarea.tagName).toBe("TEXTAREA")

    await user.type(textarea, "hello world")
    expect(textarea).toHaveValue("hello world")
  })

  it("supports disabled state without violations", async () => {
    const { container } = render(<Textarea aria-label="Notes" disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports invalid state", async () => {
    const { container } = render(<Textarea aria-label="Notes" aria-invalid="true" />)
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true")

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Textarea resize", () => {
  it("defaults to vertical resizing", () => {
    render(<Textarea aria-label="Notes" />)
    expect(screen.getByRole("textbox")).toHaveClass("resize-y")
  })

  it("supports fixed (non-resizable) sizing", () => {
    render(<Textarea aria-label="Notes" resize="none" />)
    expect(screen.getByRole("textbox")).toHaveClass("resize-none")
  })
})

describe("Textarea inside Field", () => {
  it("wires up id, label association, and aria-describedby automatically", () => {
    render(
      <Field label="Notes" description="Shown to your team">
        <Textarea />
      </Field>
    )

    const textarea = screen.getByRole("textbox", { name: "Notes" })
    const description = screen.getByText("Shown to your team")
    expect(textarea).toHaveAccessibleDescription("Shown to your team")
    expect(description.id).toBeTruthy()
  })

  it("has no accessibility violations when composed with Field", async () => {
    const { container } = render(
      <Field label="Notes" description="Shown to your team">
        <Textarea />
      </Field>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
