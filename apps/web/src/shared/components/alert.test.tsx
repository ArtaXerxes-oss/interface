import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Alert } from "@workspace/ui/components/alert"

afterEach(() => {
  cleanup()
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRoot(container: HTMLElement) {
  return container.querySelector("[data-slot='alert']") as HTMLElement
}

// ---------------------------------------------------------------------------
// Rendering basics
// ---------------------------------------------------------------------------

describe("Alert – rendering", () => {
  it("renders title and description", () => {
    render(<Alert title="Heads up" description="Your session expires soon." />)

    expect(screen.getByText("Heads up")).toBeTruthy()
    expect(screen.getByText("Your session expires soon.")).toBeTruthy()
  })

  it("renders children when no title/description props are given", () => {
    render(<Alert>Plain message text</Alert>)

    expect(screen.getByText("Plain message text")).toBeTruthy()
  })

  it("renders a custom icon when provided", () => {
    render(
      <Alert
        icon={<span data-testid="custom-icon" />}
        title="Custom icon"
      />,
    )

    expect(screen.getByTestId("custom-icon")).toBeTruthy()
  })

  it("suppresses the icon when icon={null}", () => {
    const { container } = render(
      <Alert icon={null} title="No icon" />,
    )

    expect(container.querySelector("[data-slot='alert-icon']")).toBeNull()
  })

  it("renders an action when provided", () => {
    render(
      <Alert
        title="Update available"
        action={<button type="button">Refresh</button>}
      />,
    )

    expect(screen.getByRole("button", { name: "Refresh" })).toBeTruthy()
  })

  it("renders an action as a link", () => {
    render(
      <Alert
        title="New feature"
        action={<a href="/docs">Learn more</a>}
      />,
    )

    const link = screen.getByRole("link", { name: "Learn more" })
    expect(link).toBeTruthy()
    expect(link.getAttribute("href")).toBe("/docs")
  })

  it("does not render the action slot when no action prop is given", () => {
    const { container } = render(<Alert title="No action" />)

    expect(container.querySelector("[data-slot='alert-action']")).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Layout variants
// ---------------------------------------------------------------------------

describe("Alert – layout variants", () => {
  it("defaults to the inline layout", () => {
    const { container } = render(<Alert title="Inline" />)

    expect(getRoot(container).getAttribute("data-layout")).toBe("inline")
  })

  it("applies the banner layout", () => {
    const { container } = render(<Alert layout="banner" title="Site notice" />)

    expect(getRoot(container).getAttribute("data-layout")).toBe("banner")
  })

  it("inline and banner share the same severity prop API", () => {
    const { container: c1 } = render(
      <Alert layout="inline" severity="error" title="Inline error" />,
    )
    const { container: c2 } = render(
      <Alert layout="banner" severity="error" title="Banner error" />,
    )

    expect(getRoot(c1).getAttribute("data-severity")).toBe("error")
    expect(getRoot(c2).getAttribute("data-severity")).toBe("error")
  })
})

// ---------------------------------------------------------------------------
// ARIA / live-region semantics
// ---------------------------------------------------------------------------

describe("Alert – ARIA semantics", () => {
  it("info uses role=status and aria-live=polite", () => {
    const { container } = render(<Alert severity="info" title="Info" />)
    const root = getRoot(container)

    expect(root.getAttribute("role")).toBe("status")
    expect(root.getAttribute("aria-live")).toBe("polite")
    expect(root.getAttribute("aria-atomic")).toBe("false")
  })

  it("success uses role=status and aria-live=polite", () => {
    const { container } = render(<Alert severity="success" title="Done" />)
    const root = getRoot(container)

    expect(root.getAttribute("role")).toBe("status")
    expect(root.getAttribute("aria-live")).toBe("polite")
    expect(root.getAttribute("aria-atomic")).toBe("false")
  })

  it("warning uses role=alert and aria-live=assertive", () => {
    const { container } = render(<Alert severity="warning" title="Warning" />)
    const root = getRoot(container)

    expect(root.getAttribute("role")).toBe("alert")
    expect(root.getAttribute("aria-live")).toBe("assertive")
    expect(root.getAttribute("aria-atomic")).toBe("true")
  })

  it("error uses role=alert and aria-live=assertive", () => {
    const { container } = render(<Alert severity="error" title="Error" />)
    const root = getRoot(container)

    expect(root.getAttribute("role")).toBe("alert")
    expect(root.getAttribute("aria-live")).toBe("assertive")
    expect(root.getAttribute("aria-atomic")).toBe("true")
  })

  it("banner warning carries the same assertive semantics as inline", () => {
    const { container } = render(
      <Alert layout="banner" severity="warning" title="Urgent notice" />,
    )
    const root = getRoot(container)

    expect(root.getAttribute("role")).toBe("alert")
    expect(root.getAttribute("aria-live")).toBe("assertive")
    expect(root.getAttribute("aria-atomic")).toBe("true")
  })

  it("severity defaults to info when not specified", () => {
    const { container } = render(<Alert title="Default" />)
    const root = getRoot(container)

    expect(root.getAttribute("data-severity")).toBe("info")
    expect(root.getAttribute("role")).toBe("status")
  })
})

// ---------------------------------------------------------------------------
// Dismiss control
// ---------------------------------------------------------------------------

describe("Alert – dismiss", () => {
  it("does not render a dismiss button without onDismiss", () => {
    const { container } = render(<Alert title="No dismiss" />)

    expect(
      container.querySelector("[data-slot='alert-dismiss']"),
    ).toBeNull()
  })

  it("renders a dismiss button when onDismiss is provided", () => {
    render(
      <Alert title="Dismissible" onDismiss={vi.fn()} />,
    )

    expect(screen.getByRole("button", { name: "Dismiss" })).toBeTruthy()
  })

  it("uses a custom dismissLabel when provided", () => {
    render(
      <Alert
        title="Dismissible"
        onDismiss={vi.fn()}
        dismissLabel="Close notification"
      />,
    )

    expect(
      screen.getByRole("button", { name: "Close notification" }),
    ).toBeTruthy()
  })

  it("calls onDismiss when the dismiss button is clicked", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(<Alert title="Click to dismiss" onDismiss={onDismiss} />)

    await user.click(screen.getByRole("button", { name: "Dismiss" }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it("does not call onDismiss before the button is clicked", () => {
    const onDismiss = vi.fn()

    render(<Alert title="Not yet dismissed" onDismiss={onDismiss} />)

    expect(onDismiss).not.toHaveBeenCalled()
  })

  it("dismiss button is keyboard-activatable", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(<Alert title="Keyboard dismiss" onDismiss={onDismiss} />)

    const btn = screen.getByRole("button", { name: "Dismiss" })
    btn.focus()
    await user.keyboard("{Enter}")

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it("dismiss works on a banner-layout error alert", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(
      <Alert
        layout="banner"
        severity="error"
        title="Critical error"
        onDismiss={onDismiss}
      />,
    )

    await user.click(screen.getByRole("button", { name: "Dismiss" }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})

// ---------------------------------------------------------------------------
// Severity + layout combinations (smoke)
// ---------------------------------------------------------------------------

describe("Alert – severity × layout combinations", () => {
  const severities = ["info", "success", "warning", "error"] as const
  const layouts = ["inline", "banner"] as const

  for (const severity of severities) {
    for (const layout of layouts) {
      it(`renders ${severity} ${layout} without crashing`, () => {
        const { container } = render(
          <Alert
            severity={severity}
            layout={layout}
            title={`${severity} ${layout}`}
            description="Supporting text."
          />,
        )

        const root = getRoot(container)
        expect(root.getAttribute("data-severity")).toBe(severity)
        expect(root.getAttribute("data-layout")).toBe(layout)
      })
    }
  }
})
