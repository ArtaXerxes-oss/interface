import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"
import { LoadingButton } from "./loading-button"

describe("LoadingButton", () => {
  it("is disabled and aria-busy while loading, with text content", async () => {
    const { container } = render(
      <LoadingButton isLoading loadingText="Confirming...">
        Stake
      </LoadingButton>
    )
    const button = screen.getByRole("button", { name: "Confirming..." })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(await axe(container)).toHaveNoViolations()
  })

  it("falls back to children as the loading label when loadingText is omitted", () => {
    render(<LoadingButton isLoading>Stake</LoadingButton>)
    expect(screen.getByRole("button", { name: "Stake" })).toBeInTheDocument()
  })

  it("is not disabled and not aria-busy when not loading", () => {
    render(<LoadingButton>Stake</LoadingButton>)
    const button = screen.getByRole("button", { name: "Stake" })
    expect(button).not.toBeDisabled()
    expect(button).not.toHaveAttribute("aria-busy")
  })

  it("keeps the width-reserving spinner slot present (but hidden) when not loading", () => {
    const { container } = render(<LoadingButton>Stake</LoadingButton>)
    const slot = container.querySelector('[aria-hidden="true"]')
    expect(slot).toBeInTheDocument()
    expect(slot).toHaveClass("invisible")
  })

  it("supports an icon-only loading button, keeping its accessible name", async () => {
    const { container } = render(
      <LoadingButton isLoading size="icon" aria-label="Stake">
        <svg viewBox="0 0 24 24" />
      </LoadingButton>
    )
    const button = screen.getByRole("button", { name: "Stake" })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(await axe(container)).toHaveNoViolations()
  })
})
