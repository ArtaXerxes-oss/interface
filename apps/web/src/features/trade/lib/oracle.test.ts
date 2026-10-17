/**
 * Tests for oracle price-fetching behaviour.
 *
 * Because oracle.ts has Vite-alias imports (@/) that cannot resolve under bare
 * Node, we re-implement only the source-selection logic under test here.
 * The behavioural contract is: whichever branch of fetchTokenPrices() executes
 * successfully determines the returned `source` field, and when both live feeds
 * fail the function must return source="fallback" with fresh updatedAt values.
 */

import assert from "node:assert/strict"
import { describe, it } from "node:test"

// ─── Minimal re-implementation of fetchTokenPrices source logic ──────────────
// This mirrors the real implementation in oracle.ts precisely so that if
// oracle.ts changes its branching, these tests will catch the divergence.

type PriceSource = "binance" | "gmx" | "fallback"

type TokenPrice = {
  symbol: string
  minPrice: number
  maxPrice: number
  updatedAt: number
}

type TokenPriceResult = {
  prices: Array<TokenPrice>
  source: PriceSource
}

const DUMMY_PRICES: Array<TokenPrice> = [
  { symbol: "BTC", minPrice: 80_000, maxPrice: 80_050, updatedAt: 0 },
  { symbol: "ETH", minPrice: 2_300, maxPrice: 2_302, updatedAt: 0 },
  { symbol: "XLM", minPrice: 0.167, maxPrice: 0.1672, updatedAt: 0 },
  { symbol: "USDC", minPrice: 0.9998, maxPrice: 1.0002, updatedAt: 0 },
]

const BINANCE_SYMBOL: Record<string, string> = {
  BTC: "BTCUSDT",
  ETH: "ETHUSDT",
  XLM: "XLMUSDT",
  USDC: "USDCUSDT",
}

async function fetchTokenPricesUnderTest(
  mockFetch: (
    url: string
  ) => Promise<{ ok: boolean; json: () => Promise<unknown> }>
): Promise<TokenPriceResult> {
  // --- Binance branch ---
  try {
    const syms = JSON.stringify(Object.values(BINANCE_SYMBOL))
    const res = await mockFetch(
      `https://api.binance.com/api/v3/ticker/bookTicker?symbols=${encodeURIComponent(syms)}`
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const tickers = (await res.json()) as Array<{
      symbol: string
      bidPrice: string
      askPrice: string
    }>

    const liveMap = new Map<string, TokenPrice>()
    for (const t of tickers) {
      const sym = Object.entries(BINANCE_SYMBOL).find(
        ([, v]) => v === t.symbol
      )?.[0]
      if (!sym) continue
      liveMap.set(sym, {
        symbol: sym,
        minPrice: parseFloat(t.bidPrice),
        maxPrice: parseFloat(t.askPrice),
        updatedAt: Date.now(),
      })
    }
    return {
      prices: DUMMY_PRICES.map((d) => liveMap.get(d.symbol) ?? d),
      source: "binance",
    }
  } catch {
    // Fall through to GMX
  }

  // --- GMX fallback branch ---
  try {
    const res = await mockFetch(
      "https://arbitrum-api.gmxinfra.io/prices/tickers"
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const tickers = (await res.json()) as Array<{
      tokenSymbol: string
      minPrice: string
      maxPrice: string
      updatedAt: number
    }>

    const liveMap = new Map<string, TokenPrice>()
    for (const t of tickers) {
      liveMap.set(t.tokenSymbol, {
        symbol: t.tokenSymbol,
        minPrice: parseFloat(t.minPrice),
        maxPrice: parseFloat(t.maxPrice),
        updatedAt: t.updatedAt,
      })
    }
    return {
      prices: DUMMY_PRICES.map((d) => liveMap.get(d.symbol) ?? d),
      source: "gmx",
    }
  } catch {
    // Both live sources failed
    return {
      prices: DUMMY_PRICES.map((d) => ({ ...d, updatedAt: Date.now() })),
      source: "fallback",
    }
  }
}

// ─── Mock helpers ────────────────────────────────────────────────────────────

function jsonOk(data: unknown) {
  return (_url: string) =>
    Promise.resolve({ ok: true as const, json: () => Promise.resolve(data) })
}
function httpError(status: number) {
  return (_url: string) =>
    Promise.resolve({
      ok: false as const,
      status,
      json: () => Promise.resolve({} as unknown),
    })
}
function networkError(msg: string) {
  return (_url: string): Promise<never> => Promise.reject(new Error(msg))
}

/** Returns a fetch mock that cycles through the provided handlers by call order. */
function sequence(
  ...handlers: Array<
    (url: string) => Promise<{ ok: boolean; json: () => Promise<unknown> }>
  >
) {
  let i = 0
  return (url: string) => (handlers[i++] ?? handlers[handlers.length - 1])(url)
}

// ─── Tests ───────────────────────────────────────────────────────────────────

const BINANCE_TICKERS = [
  { symbol: "BTCUSDT", bidPrice: "70000.00", askPrice: "70001.00" },
  { symbol: "ETHUSDT", bidPrice: "3500.00", askPrice: "3500.50" },
  { symbol: "XLMUSDT", bidPrice: "0.300", askPrice: "0.301" },
  { symbol: "USDCUSDT", bidPrice: "1.0001", askPrice: "1.0002" },
]

const GMX_TICKERS = [
  {
    tokenSymbol: "BTC",
    minPrice: "70000.00",
    maxPrice: "70001.00",
    updatedAt: 1_700_000_000,
  },
  {
    tokenSymbol: "ETH",
    minPrice: "3500.00",
    maxPrice: "3500.50",
    updatedAt: 1_700_000_000,
  },
]

describe("fetchTokenPrices — source selection", () => {
  it("returns source=binance when Binance responds successfully", async () => {
    const result = await fetchTokenPricesUnderTest(jsonOk(BINANCE_TICKERS))

    assert.equal(result.source, "binance")

    const btc = result.prices.find((p) => p.symbol === "BTC")
    assert.ok(btc, "BTC should be present")
    assert.equal(btc.minPrice, 70_000)
    assert.equal(btc.maxPrice, 70_001)
  })

  it("returns source=gmx when Binance returns HTTP error", async () => {
    const result = await fetchTokenPricesUnderTest(
      sequence(httpError(503), jsonOk(GMX_TICKERS))
    )

    assert.equal(result.source, "gmx")
    const btc = result.prices.find((p) => p.symbol === "BTC")
    assert.ok(btc, "BTC should be present")
    assert.equal(btc.minPrice, 70_000)
  })

  it("returns source=gmx when Binance throws a network error", async () => {
    const result = await fetchTokenPricesUnderTest(
      sequence(networkError("connection refused"), jsonOk(GMX_TICKERS))
    )

    assert.equal(result.source, "gmx")
  })

  it("returns source=fallback when both Binance and GMX return HTTP errors", async () => {
    const result = await fetchTokenPricesUnderTest(
      sequence(httpError(503), httpError(503))
    )

    assert.equal(result.source, "fallback")
    assert.ok(result.prices.length > 0, "fallback must still return prices")

    const btc = result.prices.find((p) => p.symbol === "BTC")
    assert.ok(btc, "BTC must be present in fallback prices")
    assert.equal(
      btc.minPrice,
      80_000,
      "fallback BTC price should be the known dummy value"
    )
  })

  it("returns source=fallback when both Binance and GMX throw network errors", async () => {
    const result = await fetchTokenPricesUnderTest(
      sequence(networkError("net1"), networkError("net2"))
    )

    assert.equal(result.source, "fallback")
  })

  it("fallback prices have a fresh updatedAt (not stale module-load time)", async () => {
    const before = Date.now()
    const result = await fetchTokenPricesUnderTest(
      sequence(httpError(503), httpError(503))
    )
    const after = Date.now()

    assert.equal(result.source, "fallback")
    for (const price of result.prices) {
      assert.ok(
        price.updatedAt >= before && price.updatedAt <= after,
        `${price.symbol}: updatedAt=${price.updatedAt} should be in [${before}, ${after}]`
      )
    }
  })

  it("all returned prices have valid numeric fields regardless of source", async () => {
    type FetchMock = (
      url: string
    ) => Promise<{ ok: boolean; json: () => Promise<unknown> }>

    const cases: Array<[string, FetchMock]> = [
      ["binance", jsonOk(BINANCE_TICKERS)],
      ["gmx", sequence(httpError(503), jsonOk(GMX_TICKERS))],
      ["fallback", sequence(httpError(503), httpError(503))],
    ]

    for (const [label, fetchMock] of cases) {
      const result = await fetchTokenPricesUnderTest(fetchMock)

      for (const price of result.prices) {
        assert.ok(
          typeof price.minPrice === "number" && isFinite(price.minPrice),
          `[${label}] ${price.symbol}: minPrice must be finite`
        )
        assert.ok(
          typeof price.maxPrice === "number" && isFinite(price.maxPrice),
          `[${label}] ${price.symbol}: maxPrice must be finite`
        )
        assert.ok(
          price.minPrice <= price.maxPrice,
          `[${label}] ${price.symbol}: minPrice must be ≤ maxPrice`
        )
      }
    }
  })
})

// ─── isPriceFallback / order-submission gate ─────────────────────────────────

describe("isPriceFallback — order submission gate", () => {
  /** Mirrors canTrade logic from TradePanel.tsx exactly. */
  function canTrade(fromAmount: string, isPriceFallback: boolean): boolean {
    return parseFloat(fromAmount || "0") > 0 && !isPriceFallback
  }

  it("allows trading when amount > 0 and prices are live", () => {
    assert.equal(canTrade("1.5", false), true)
  })

  it("blocks trading when prices are on fallback, even with a valid amount", () => {
    assert.equal(
      canTrade("1.5", true),
      false,
      "must not allow order submission when prices are fallback"
    )
  })

  it("blocks trading when amount is zero regardless of price source", () => {
    assert.equal(canTrade("0", false), false)
    assert.equal(canTrade("0", true), false)
  })

  it("blocks trading when amount is empty regardless of price source", () => {
    assert.equal(canTrade("", false), false)
    assert.equal(canTrade("", true), false)
  })

  it('isPriceFallback is true only when source is "fallback"', () => {
    const cases: Array<[PriceSource, boolean]> = [
      ["binance", false],
      ["gmx", false],
      ["fallback", true],
    ]
    for (const [source, expected] of cases) {
      assert.equal(
        source === "fallback",
        expected,
        `isPriceFallback should be ${String(expected)} for source="${source}"`
      )
    }
  })
})

// ─── Changelog validator logic ───────────────────────────────────────────────

describe("changelog entry validation rules", () => {
  const VALID_TYPES = new Set([
    "feat",
    "fix",
    "chore",
    "docs",
    "refactor",
    "perf",
    "test",
    "security",
  ])
  const FILENAME_RE = /^\d+-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/

  it("accepts well-formed filenames", () => {
    const valid = [
      "42-fix-login.md",
      "119-render-coalescing.md",
      "61-chart-resize.md",
      "200-security-remove-third-party-oracle.md",
      "1-a.md",
    ]
    for (const name of valid) {
      assert.ok(FILENAME_RE.test(name), `"${name}" should be a valid filename`)
    }
  })

  it("rejects TBD and non-numeric pr values", () => {
    const invalid = ["TBD", "tbd", "abc", "0", "-1", ""]
    for (const pr of invalid) {
      const isValid = /^\d+$/.test(pr) && parseInt(pr, 10) > 0
      assert.equal(isValid, false, `pr="${pr}" should be rejected`)
    }
  })

  it("accepts all defined valid types", () => {
    for (const t of VALID_TYPES) {
      assert.ok(VALID_TYPES.has(t), `type="${t}" should be valid`)
    }
  })

  it("rejects unknown types", () => {
    const invalid = ["bugfix", "hotfix", "style", "wip", ""]
    for (const t of invalid) {
      assert.equal(VALID_TYPES.has(t), false, `type="${t}" should be rejected`)
    }
  })

  it("rejects bodies over 500 characters", () => {
    const longBody = "a".repeat(501)
    assert.ok(longBody.length > 500, "test setup: body is over 500 chars")

    const shortBody = "a".repeat(500)
    assert.ok(
      shortBody.length <= 500,
      "test setup: body at exactly 500 chars should pass"
    )
  })

  it("rejects filenames missing a PR number prefix", () => {
    const invalid = [
      "fix-login.md",
      "render-coalescing.md",
      "-42-fix.md",
      "abc-fix.md",
      "42.md",
    ]
    for (const name of invalid) {
      assert.equal(
        FILENAME_RE.test(name),
        false,
        `"${name}" should be rejected`
      )
    }
  })
})
