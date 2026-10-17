---
pr: 200
type: security
breaking: false
---
Removed unowned third-party oracle worker introduced in a previous commit.
Added a blocking PriceFallbackBanner and order-submission gate so users
cannot trade on stale hard-coded dummy prices when all live oracle sources
(Binance, GMX) are offline.
