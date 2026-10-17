import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"
import { Field } from "./field"
import { Input } from "./input"

describe("Field accessibility", () => {
  it("has no accessibility violations in the normal state", async () => {
    const { container } = render(
      <Field label="Email" description="We'll never share it">
        <Input />
      </Field>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no accessibility violations when required", async () => {
    const { container } = render(
      <Field label="Email" required>
        <Input />
      </Field>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no accessibility violations when disabled", async () => {
    const { container } = render(
      <Field label="Email" disabled>
        <Input />
      </Field>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no accessibility violations when invalid with an error", async () => {
    const { container } = render(
      <Field label="Email" invalid error="Enter a valid email address">
        <Input />
      </Field>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Field label association", () => {
  it("links the label to the control via a native label/id relationship", () => {
    render(
      <Field label="Email">
        <Input />
      </Field>
    )
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument()
  })

  it("respects a control-provided id instead of generating a mismatched one", () => {
    render(
      <Field label="Email">
        <Input id="custom-email-id" />
      </Field>
    )
    const input = screen.getByRole("textbox", { name: "Email" })
    expect(input).toHaveAttribute("id", "custom-email-id")
  })
})

describe("Field required state", () => {
  it("renders a required indicator and marks the control required", () => {
    render(
      <Field label="Email" required>
        <Input />
      </Field>
    )
    const input = screen.getByRole("textbox", { name: "Email" })
    expect(input).toBeRequired()
  })

  it("does not render a required indicator by default", () => {
    render(
      <Field label="Email">
        <Input />
      </Field>
    )
    expect(screen.getByRole("textbox", { name: "Email" })).not.toBeRequired()
  })
})

describe("Field disabled state", () => {
  it("disables the control", () => {
    render(
      <Field label="Email" disabled>
        <Input />
      </Field>
    )
    expect(screen.getByRole("textbox", { name: "Email" })).toBeDisabled()
  })
})

describe("Field invalid state", () => {
  it("marks the control invalid and exposes the error as an assertive live region", () => {
    render(
      <Field label="Email" invalid error="Enter a valid email address">
        <Input />
      </Field>
    )
    const input = screen.getByRole("textbox", { name: "Email" })
    expect(input).toHaveAttribute("aria-invalid", "true")

    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent("Enter a valid email address")
    expect(input).toHaveAccessibleDescription("Enter a valid email address")
  })

  it("does not render the error slot while not invalid", () => {
    render(
      <Field label="Email" error="Enter a valid email address">
        <Input />
      </Field>
    )
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("links the description via aria-describedby when there is no error", () => {
    render(
      <Field label="Email" description="We'll never share it">
        <Input />
      </Field>
    )
    const input = screen.getByRole("textbox", { name: "Email" })
    expect(input).toHaveAccessibleDescription("We'll never share it")
  })
})

describe("Field layout", () => {
  it("renders leading and trailing controls", () => {
    render(
      <Field label="Amount" leading={<span>$</span>} trailing={<button type="button">Max</button>}>
        <Input />
      </Field>
    )
    expect(screen.getByText("$")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Max" })).toBeInTheDocument()
  })

  it("renders a character counter alongside maxLength", () => {
    render(
      <Field label="Bio" characterCount={12} maxLength={140}>
        <Input />
      </Field>
    )
    expect(screen.getByText("12/140")).toBeInTheDocument()
  })
})
