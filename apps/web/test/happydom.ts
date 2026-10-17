/**
 * apps/web/test/happydom.ts
 *
 * Bun test preload — registers a happy-dom global environment so React
 * components can render, and polyfills the handful of browser APIs that
 * Base UI relies on but happy-dom does not ship.
 *
 * Wired via bunfig.toml → [test].preload.
 */

import { GlobalRegistrator } from "@happy-dom/global-registrator"

GlobalRegistrator.register()

// ── Base UI needs ResizeObserver (Slider) and matchMedia (responsive hooks) ──
if (!("ResizeObserver" in globalThis)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverStub
}

if (typeof globalThis.matchMedia !== "function") {
  globalThis.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false
    },
  })
}
