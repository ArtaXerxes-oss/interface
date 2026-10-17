import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render } from "@testing-library/react"
import { FundingRate } from "./FundingRate"

const NOW = new Date("2026-07-25T00:00:00Z").getTime()
let currentTime = NOW

describe("FundingRate", () => {
  beforeEach(() => {
    currentTime = NOW
    vi.useFakeTimers()
    vi.spyOn(Date, "now").mockImplementation(() => currentTime)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it.each([
    [0.001, "+0.100%/h"],
    [-0.001, "-0.100%/h"],
    [0, "+0.000%/h"],
  ])("formats a %s hourly rate", (ratePerHour, expected) => {
    const view = render(
      <FundingRate ratePerHour={ratePerHour} nextEpochTs={NOW + 60_000} />
    )

    expect(view.getByText(expected)).toBeInTheDocument()
  })

  it("updates and rolls over at the funding boundary", () => {
    const view = render(
      <FundingRate ratePerHour={0} nextEpochTs={NOW + 2_000} />
    )

    expect(view.getByText("00:00:02")).toBeInTheDocument()

    currentTime += 1_000
    act(() => vi.advanceTimersByTime(1_000))
    expect(view.getByText("00:00:01")).toBeInTheDocument()

    currentTime += 1_000
    act(() => vi.advanceTimersByTime(1_000))
    expect(view.getByText("08:00:00")).toBeInTheDocument()
  })
})
