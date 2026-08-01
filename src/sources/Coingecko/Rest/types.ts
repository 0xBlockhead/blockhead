import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type { paths } from '$/sources/Coingecko/OpenApi/openapi.d.ts'

type CoinOperation = paths['/coins/{id}']['get']
type CoinByContractOperation = paths['/coins/{id}/contract/{contract_address}']['get']
type AssetPlatformsOperation = paths['/asset_platforms']['get']
type CoinsMarketsOperation = paths['/coins/markets']['get']
type CoinOhlcOperation = paths['/coins/{id}/ohlc']['get']
type CoinTickersOperation = paths['/coins/{id}/tickers']['get']
type DerivativesExchangeOperation = paths['/derivatives/exchanges/{id}']['get']

type CoinResponse = CoinOperation['responses'][200]['content']['application/json']
type CoinByContractResponse = (
	CoinByContractOperation['responses'][200]['content']['application/json']
)
type AssetPlatformsResponse = (
	AssetPlatformsOperation['responses'][200]['content']['application/json']
)
type CoinsMarketsResponse = (
	CoinsMarketsOperation['responses'][200]['content']['application/json']
)
type CoinOhlcWireDays = (
	CoinOhlcOperation['parameters']['query']['days']
)
type CoinTickersResponse = (
	CoinTickersOperation['responses'][200]['content']['application/json']
)
type DerivativesExchangeResponse = (
	DerivativesExchangeOperation['responses'][200]['content']['application/json']
)

export type CoingeckoCoin = CoinResponse
export type CoingeckoCoinByContract = CoinByContractResponse
export type CoingeckoAssetPlatform = AssetPlatformsResponse[number]
export type CoingeckoCoinsMarket = CoinsMarketsResponse[number]
export type CoingeckoCoinTickers = CoinTickersResponse
export type CoingeckoCoinTicker = NonNullable<CoinTickersResponse['tickers']>[number]
export type CoingeckoDerivativesExchange = DerivativesExchangeResponse
export type CoingeckoDerivativesExchangeTicker = NonNullable<
	DerivativesExchangeResponse['tickers']
>[number]

/** Exact five-value OHLC wire row; the official schema widens each row to `number[]`. */
export type CoingeckoOhlc = [
	timestampMs: number,
	open: number,
	high: number,
	low: number,
	close: number,
][]

export type CoingeckoOhlcDayCount = (
	CoinOhlcWireDays extends `${infer _DayCount extends number}` ?
		_DayCount
	:
		never
)

export type GetCoingeckoCoinArgs = (
	& CoinOperation['parameters']['path']
	& NonNullable<CoinOperation['parameters']['query']>
	& { publicEnv: SourcePublicEnv }
)

export type GetCoingeckoCoinByContractArgs = (
	& CoinByContractOperation['parameters']['path']
	& { publicEnv: SourcePublicEnv }
)

export type GetCoingeckoAssetPlatformsArgs = (
	& NonNullable<AssetPlatformsOperation['parameters']['query']>
	& { publicEnv: SourcePublicEnv }
)

export type GetCoingeckoCoinsMarketsArgs = (
	& CoinsMarketsOperation['parameters']['query']
	& { publicEnv: SourcePublicEnv }
)

export type GetCoingeckoCoinOhlcArgs = (
	& CoinOhlcOperation['parameters']['path']
	& Omit<CoinOhlcOperation['parameters']['query'], 'days'>
	& {
		days: CoingeckoOhlcDayCount
		publicEnv: SourcePublicEnv
	}
)

export type GetCoingeckoCoinTickersArgs = (
	& CoinTickersOperation['parameters']['path']
	& NonNullable<CoinTickersOperation['parameters']['query']>
	& { publicEnv: SourcePublicEnv }
)

export type GetCoingeckoDerivativesExchangeArgs = (
	& DerivativesExchangeOperation['parameters']['path']
	& NonNullable<DerivativesExchangeOperation['parameters']['query']>
	& { publicEnv: SourcePublicEnv }
)
