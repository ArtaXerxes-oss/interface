import { describe, expect, it, vi } from "vitest"
import {
  CHART_PALETTE_FALLBACKS,
  CHART_TOKENS,
  buildCandleOptions,
  buildChartOptions,
  buildChartPalette,
  positionLineColor,
  resolveChartTheme,
  toChartColor,
} from "./chart-theme"
import type { ChartPalette, ChartTheme, TokenResolver } from "./chart-theme"

/**
 * Stand-in for `getComputedStyle(document.documentElement)` after the resolver
 * has converted each `oklch()` token into a chart-safe colour — the values the
 * browser produces for the tokens declared in `@workspace/ui/globals.css`.
 */
const TOKEN_VALUES: Record<ChartTheme, Record<string, string>> = {
  light: {
    "--chart-surface": "rgb(255, 255, 255)",
    "--chart-text": "rgb(115, 115, 115)",
    "--chart-grid": "rgb(229, 229, 229)",
    "--chart-crosshair": "rgb(161, 161, 161)",
    "--chart-crosshair-label": "rgb(240, 240, 240)",
    "--chart-border": "rgb(229, 229, 229)",
    "--chart-up": "rgb(0, 153, 102)",
    "--chart-down": "rgb(231, 0, 11)",
    "--long": "rgb(0, 153, 102)",
    "--short": "rgb(231, 0, 11)",
    "--chart-liquidation": "rgb(208, 135, 0)",
  },
  dark: {
    "--chart-surface": "rgb(10, 10, 10)",
    "--chart-text": "rgb(161, 161, 161)",
    "--chart-grid": "rgb(38, 38, 38)",
    "--chart-crosshair": "rgb(82, 82, 82)",
    "--chart-crosshair-label": "rgb(38, 38, 38)",
    "--chart-border": "rgb(38, 38, 38)",
    "--chart-up": "rgb(0, 221, 142)",
    "--chart-down": "rgb(255, 100, 103)",
    "--long": "rgb(0, 221, 142)",
    "--short": "rgb(255, 100, 103)",
    "--chart-liquidation": "rgb(249, 187, 46)",
  },
}

function resolverFor(theme: ChartTheme): TokenResolver {
  return (token) => TOKEN_VALUES[theme][token] ?? ""
}

/** Colour notations `lightweight-charts` can paint without conversion. */
const CHART_SAFE = /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i

const ROLES = Object.keys(CHART_TOKENS) as Array<keyof ChartPalette>
const THEMES: Array<ChartTheme> = ["light", "dark"]

describe("chart-theme — token map", () => {
  it("maps every palette role to a CSS custom property", () => {
    expect(ROLES).toHaveLength(11)
    for (const role of ROLES) {
      expect(CHART_TOKENS[role].startsWith("--")).toBe(true)
    }
  })

  it("declares a fallback for every role in both themes", () => {
    for (const theme of THEMES) {
      for (const role of ROLES) {
        expect(CHART_PALETTE_FALLBACKS[theme][role]).toBeTruthy()
      }
    }
  })

  it("keeps every fallback in a notation lightweight-charts can parse", () => {
    for (const theme of THEMES) {
      for (const role of ROLES) {
        expect(CHART_PALETTE_FALLBACKS[theme][role]).toMatch(CHART_SAFE)
      }
    }
  })
})

describe("chart-theme — toChartColor", () => {
  it("passes through notations the chart already understands", () => {
    const convert = vi.fn(() => "rgb(0, 0, 0)")
    for (const value of ["#0a0a0a", "rgb(1, 2, 3)", "rgba(1, 2, 3, 0.5)", "hsl(0 0% 0%)"]) {
      expect(toChartColor(value, convert)).toBe(value)
    }
    expect(convert).not.toHaveBeenCalled()
  })

  it("converts colour notations the chart cannot parse", () => {
    const convert = vi.fn(() => "rgb(0, 153, 102)")
    expect(toChartColor("oklch(0.596 0.145 163.225)", convert)).toBe("rgb(0, 153, 102)")
    expect(convert).toHaveBeenCalledWith("oklch(0.596 0.145 163.225)")
  })

  it("returns an empty string for blank values without converting", () => {
    const convert = vi.fn(() => "rgb(0, 0, 0)")
    expect(toChartColor("   ", convert)).toBe("")
    expect(convert).not.toHaveBeenCalled()
  })

  it("returns an empty string when conversion fails, so the fallback wins", () => {
    expect(toChartColor("oklch(0.5 0 0)", () => "")).toBe("")
  })
})

describe.each(THEMES)("chart-theme — %s palette", (theme) => {
  const palette = buildChartPalette(theme, resolverFor(theme))

  it("reads every role from its CSS token", () => {
    for (const role of ROLES) {
      expect(palette[role]).toBe(TOKEN_VALUES[theme][CHART_TOKENS[role]])
    }
  })

  it("resolves every role to a colour the chart can paint", () => {
    for (const role of ROLES) {
      expect(palette[role]).not.toBe("")
      expect(palette[role]).toMatch(CHART_SAFE)
    }
  })

  it("uses the same colour for candles and position lines", () => {
    expect(palette.up).toBe(palette.long)
    expect(palette.down).toBe(palette.short)
  })

  it("distinguishes long, short and liquidation colours", () => {
    expect(new Set([palette.long, palette.short, palette.liquidation]).size).toBe(3)
  })

  it("falls back to the literal token values when nothing resolves", () => {
    expect(buildChartPalette(theme)).toEqual(CHART_PALETTE_FALLBACKS[theme])
  })

  it("falls back per-role when a single token is missing", () => {
    const partial = buildChartPalette(theme, (token) =>
      token === CHART_TOKENS.grid ? "" : (TOKEN_VALUES[theme][token] ?? ""),
    )
    expect(partial.grid).toBe(CHART_PALETTE_FALLBACKS[theme].grid)
    expect(partial.background).toBe(TOKEN_VALUES[theme]["--chart-surface"])
  })

  it("falls back when the resolver throws", () => {
    const thrown = buildChartPalette(theme, () => {
      throw new Error("detached node")
    })
    expect(thrown).toEqual(CHART_PALETTE_FALLBACKS[theme])
  })

  it("builds chart options from the palette", () => {
    const options = buildChartOptions(palette)

    expect(options.layout?.background).toMatchObject({ color: palette.background })
    expect(options.layout?.textColor).toBe(palette.text)
    expect(options.grid?.vertLines?.color).toBe(palette.grid)
    expect(options.grid?.horzLines?.color).toBe(palette.grid)
    expect(options.crosshair?.vertLine?.color).toBe(palette.crosshair)
    expect(options.crosshair?.horzLine?.color).toBe(palette.crosshair)
    expect(options.crosshair?.vertLine?.labelBackgroundColor).toBe(palette.crosshairLabel)
    expect(options.crosshair?.horzLine?.labelBackgroundColor).toBe(palette.crosshairLabel)
    expect(options.rightPriceScale?.borderColor).toBe(palette.border)
    expect(options.timeScale?.borderColor).toBe(palette.border)
  })

  it("builds candle options from the palette", () => {
    expect(buildCandleOptions(palette)).toMatchObject({
      upColor: palette.up,
      downColor: palette.down,
      wickUpColor: palette.up,
      wickDownColor: palette.down,
      borderVisible: false,
    })
  })

  it("colours position lines by side", () => {
    expect(positionLineColor(palette, true)).toBe(palette.long)
    expect(positionLineColor(palette, false)).toBe(palette.short)
  })
})

describe("chart-theme — light vs dark", () => {
  const light = buildChartPalette("light", resolverFor("light"))
  const dark = buildChartPalette("dark", resolverFor("dark"))

  it("generates a distinct palette per theme", () => {
    for (const role of ROLES) {
      expect(light[role]).not.toBe(dark[role])
    }
  })

  it("produces chart options that differ between themes", () => {
    expect(buildChartOptions(light)).not.toEqual(buildChartOptions(dark))
    expect(buildCandleOptions(light)).not.toEqual(buildCandleOptions(dark))
  })
})

describe("chart-theme — resolveChartTheme", () => {
  it("reports dark when the root carries the dark class", () => {
    const root = document.createElement("html")
    root.classList.add("dark")
    expect(resolveChartTheme(root)).toBe("dark")
  })

  it("reports light for the light class", () => {
    const root = document.createElement("html")
    root.classList.add("light")
    expect(resolveChartTheme(root)).toBe("light")
  })

  it("defaults to light when no root is available", () => {
    expect(resolveChartTheme(null)).toBe("light")
  })
})
