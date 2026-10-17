---
pr: 119
type: perf
breaking: false
---
Coalesce redundant React renders in the trade panel by stabilising selector
references returned from useTradeState, reducing unnecessary re-renders on
each price-feed tick.
