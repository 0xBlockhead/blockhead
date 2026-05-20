import type { components } from '$/sources/Coingecko/OpenApi/openapi.d.ts'

export type CoingeckoOpenApiCoinById = components['schemas']['CoinsID']

export type CoingeckoOpenApiCoinsOhlc = components['schemas']['CoinsOHLC']

/** `GET /derivatives` row. */
export type CoingeckoDerivativesTickersListItem = components['schemas']['DerivativesTickersList']

/** `GET /derivatives/exchanges/{id}` ticker row (`include_tickers`). */
export type CoingeckoDerivativesExchangeTicker = components['schemas']['DerivativesTickersItems']

export type CoingeckoDerivativesExchangeById = components['schemas']['DerivativesExchangesID']

export type CoingeckoOpenApiCoinsTickers = components['schemas']['CoinsTickers']

export type CoingeckoOpenApiCoinTicker = NonNullable<
	CoingeckoOpenApiCoinsTickers['tickers']
>[number]
