import { describe, expect, it } from "vitest"
import { referralCodeToScVal, scValToReferralCode } from "./referral-code"

function roundTrip(code: string): string | null {
  const scVal = referralCodeToScVal(code)
  const bytes = scVal.bytes()
  return scValToReferralCode(bytes)
}

describe("referral code round-trip", () => {
  it.each([
    ["abc123", "ABC123"],
    ["REFERRAL", "REFERRAL"],
    ["hello world", "HELLO WORLD"],
    ["a1b2c3d4e5", "A1B2C3D4E5"],
    ["  spaces  ", "SPACES"],
    ["MixedCase99", "MIXEDCASE99"],
    ["1234567890", "1234567890"],
  ])("round-trips %j → %j", (input, expected) => {
    expect(roundTrip(input)).toBe(expected)
  })

  it("preserves a 32-character code exactly (uppercase)", () => {
    const code = "A".repeat(32)
    expect(roundTrip(code)).toBe(code)
  })

  it("truncates codes longer than 32 characters", () => {
    const code = "B".repeat(40)
    expect(roundTrip(code)).toBe("B".repeat(32))
  })

  it("returns null for empty string", () => {
    expect(roundTrip("")).toBeNull()
  })
})
