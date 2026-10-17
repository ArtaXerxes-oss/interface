import { describe, it, expect } from "vitest";
import { toProtocolAmount, fromProtocolAmount } from "./scaling";

describe("scaling", () => {
  it("round-trips standard token amounts", () => {
    const cases = [
      { human: "1.5", decimals: 7, protocol: 15000000n },
      { human: "0.0000001", decimals: 7, protocol: 1n },
      { human: "100", decimals: 7, protocol: 1000000000n },
      { human: "0", decimals: 7, protocol: 0n },
    ];
    for (const c of cases) {
      expect(toProtocolAmount(c.human, c.decimals)).toBe(c.protocol);
      expect(fromProtocolAmount(c.protocol, c.decimals)).toBe(c.human);
    }
  });

  it("covers 1e30 USD scale and token decimal boundaries", () => {
    // 1e30 USD scale => USD is typically scaled to 30 decimals for prices
    const maxValHuman = "1000000000000000000000.12345678901234567890123456789";
    const protocolVal = toProtocolAmount(maxValHuman, 30);
    expect(protocolVal.toString()).toBe("1000000000000000000000123456789012345678901234567890");
    
    // round-trips never downcast through JavaScript number
    expect(fromProtocolAmount(protocolVal, 30)).toBe(maxValHuman);
  });
});
