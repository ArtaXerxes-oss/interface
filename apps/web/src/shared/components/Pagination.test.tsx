import { describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Pagination } from "./Pagination"

describe("Pagination", () => {
  it("navigates to the previous and next pages", async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const view = render(
      <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />
    )

    await user.click(view.getByRole("button", { name: "Previous" }))
    await user.click(view.getByRole("button", { name: "Next" }))

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3)
  })

  it("disables navigation at the first and last pages", () => {
    const onPageChange = vi.fn()
    const view = render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
    )

    expect(view.getByRole("button", { name: "Previous" })).toBeDisabled()

    view.rerender(
      <Pagination currentPage={3} totalPages={3} onPageChange={onPageChange} />
    )
    expect(view.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it.each([
    [1, "Page 1 of 1"],
    [0, "Page 0 of 0"],
  ])(
    "disables single and empty states with %s total pages",
    (totalPages, label) => {
      const view = render(
        <Pagination
          currentPage={1}
          totalPages={totalPages}
          onPageChange={vi.fn()}
        />
      )

      expect(view.getByText(label)).toBeInTheDocument()
      expect(view.getByRole("button", { name: "Previous" })).toBeDisabled()
      expect(view.getByRole("button", { name: "Next" })).toBeDisabled()
    }
  )
})
