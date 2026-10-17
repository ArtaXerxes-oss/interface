import { describe, expect, it } from "vitest"
import { expectTypeOf } from "vitest"
import { referralCodeToScVal, scValToReferralCode } from "./referral-code"

describe("referralCodeToScVal validation", () => {
  it("handles empty string without throwing", () => {
    const scVal = referralCodeToScVal("")
    expect(scVal.bytes()).toEqual(Buffer.alloc(32, 0))
  })

  it("trims whitespace and produces empty bytes", () => {
    const scVal = referralCodeToScVal("   ")
    expect(scVal.bytes()).toEqual(Buffer.alloc(32, 0))
  })

  it("truncates to 32 bytes for oversized input", () => {
    const code = "X".repeat(100)
    const scVal = referralCodeToScVal(code)
    const bytes = scVal.bytes()
    expect(bytes.length).toBe(32)
    expect(bytes.every((b: number) => b === 0x58)).toBe(true)
  })
})

describe("scValToReferralCode edge cases", () => {
  it("returns null for falsy inputs", () => {
    expect(scValToReferralCode(null)).toBeNull()
    expect(scValToReferralCode(undefined)).toBeNull()
    expect(scValToReferralCode(0)).toBeNull()
    expect(scValToReferralCode(false)).toBeNull()
  })

  it("returns null for unsupported types", () => {
    expect(scValToReferralCode(42)).toBeNull()
    expect(scValToReferralCode(true)).toBeNull()
    expect(scValToReferralCode([1, 2, 3])).toBeNull()
    expect(scValToReferralCode({})).toBeNull()
  })

  it("returns null for empty Uint8Array", () => {
    expect(scValToReferralCode(new Uint8Array(0))).toBeNull()
  })

  it("returns null for Uint8Array of only null bytes", () => {
    expect(scValToReferralCode(new Uint8Array([0, 0, 0]))).toBeNull()
  })

  it("returns null for empty string", () => {
    expect(scValToReferralCode("")).toBeNull()
  })

  it("returns null for whitespace-only string", () => {
    expect(scValToReferralCode("   ")).toBeNull()
  })

  it("returns null for null-byte-only string", () => {
    expect(scValToReferralCode("\0\0\0")).toBeNull()
  })

  it("strips trailing null bytes from string", () => {
    expect(scValToReferralCode("ABC\0\0\0")).toBe("ABC")
  })

  it("preserves symbols in string", () => {
    expect(scValToReferralCode("A-B_C.D")).toBe("A-B_C.D")
  })

  it("preserves unicode in string", () => {
    expect(scValToReferralCode("CAFE\u0301")).toBe("CAFE\u0301")
  })

  it("unwraps {code} objects", () => {
    expect(scValToReferralCode({ code: "HELLO" })).toBe("HELLO")
  })

  it("returns null when {code} wraps null", () => {
    expect(scValToReferralCode({ code: null })).toBeNull()
  })

  it("returns null when {code} wraps empty string", () => {
    expect(scValToReferralCode({ code: "" })).toBeNull()
  })
})

describe("type-level: scValToReferralCode return type", () => {
  it("returns string | null", () => {
    const result = scValToReferralCode("test")
    expectTypeOf(result).toEqualTypeOf<string | null>()
  })
})
