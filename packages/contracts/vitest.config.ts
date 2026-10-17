import { defineConfig, mergeConfig } from "vitest/config"
import { nodeConfig } from "@repo/vitest-config/node"

export default mergeConfig(
  nodeConfig,
  defineConfig({
    test: {
      coverage: {
        thresholds: { statements: 80, branches: 85, functions: 65, lines: 85 },
      },
    },
  })
)
