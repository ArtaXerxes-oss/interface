import { useQuery } from "@tanstack/react-query"
import { fetchTokenPrices } from "../lib/oracle"
import { queryKeys } from "../lib/query-keys"
import type { PriceSource, TokenPrice } from "../lib/oracle"

// TODO: Replace "stellar-mainnet" with real chainId from wallet context
const CHAIN_ID = "stellar-mainnet"

type PricesMap = Record<string, TokenPrice | undefined>

export function useTokenPrices() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.tokenPrices(CHAIN_ID),
    queryFn: fetchTokenPrices,
    staleTime: 3_000,
    refetchInterval: 5_000,
  })

  const pricesMap: PricesMap = data
    ? Object.fromEntries(data.prices.map((p) => [p.symbol, p]))
    : {}

  const priceSource: PriceSource = data?.source ?? "fallback"

  /** True when all live oracle sources failed and we are showing hard-coded dummy prices. */
  const isPriceFallback = priceSource === "fallback"

  return {
    prices: pricesMap,
    priceSource,
    isPriceFallback,
    isLoading,
    error,
    getPrice: (symbol: string): TokenPrice | undefined => pricesMap[symbol],
    getMidPrice: (symbol: string): number => {
      const p = pricesMap[symbol]
      if (!p) return 0
      return (p.minPrice + p.maxPrice) / 2
    },
  }
}
