import { type as arktype } from 'arktype'

import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type { paths } from '$/sources/Coingecko/OpenApi/openapi.d.ts'

type CoinOperation = paths['/coins/{id}']['get']
type CoinByContractOperation = paths['/coins/{id}/contract/{contract_address}']['get']
type AssetPlatformsOperation = paths['/asset_platforms']['get']
type CoinsMarketsOperation = paths['/coins/markets']['get']
type CoinOhlcOperation = paths['/coins/{id}/ohlc']['get']
type CoinTickersOperation = paths['/coins/{id}/tickers']['get']
type DerivativesExchangeOperation = paths['/derivatives/exchanges/{id}']['get']
type SimplePriceOperation = paths['/simple/price']['get']

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
type SimplePriceResponse = (
	SimplePriceOperation['responses'][200]['content']['application/json']
)

const coingeckoUsdAmountWire = arktype({
	'usd?': 'number | null',
})

const coingeckoMarketDataWire = arktype({
	'last_updated?': 'string | null',
	'market_cap_rank?': 'number | null',
	'market_cap?': coingeckoUsdAmountWire,
	'fully_diluted_valuation?': coingeckoUsdAmountWire,
	'total_volume?': coingeckoUsdAmountWire,
	'current_price?': coingeckoUsdAmountWire,
	'ath?': coingeckoUsdAmountWire,
	'ath_change_percentage?': coingeckoUsdAmountWire,
	'ath_date?': {
		'usd?': 'string | null',
	},
	'price_change_percentage_24h?': 'number | null',
	'price_change_percentage_7d?': 'number | null',
	'price_change_percentage_14d?': 'number | null',
	'price_change_percentage_30d?': 'number | null',
	'price_change_percentage_60d?': 'number | null',
	'price_change_percentage_200d?': 'number | null',
	'price_change_percentage_1y?': 'number | null',
	'circulating_supply?': 'number | null',
	'total_supply?': 'number | null',
	'max_supply?': 'number | null',
})

const coingeckoDetailPlatformWire = arktype({
	'decimal_place?': 'number | null',
	'contract_address?': 'string',
})

const coingeckoImageWire = arktype({
	'thumb?': 'string',
	'small?': 'string',
	'large?': 'string',
})

/** Fail-closed coin / contract-coin envelope for fields resolvers already project. */
export const coingeckoCoinEnvelope = arktype({
	id: 'string',
	'name?': 'string',
	'symbol?': 'string',
	'asset_platform_id?': 'string | null',
	'image?': coingeckoImageWire,
	'market_data?': coingeckoMarketDataWire,
	'detail_platforms?': {
		'[string]': coingeckoDetailPlatformWire,
	},
})

export const coingeckoCoinsMarketEnvelope = arktype({
	id: 'string',
	'symbol?': 'string',
	'name?': 'string',
	'image?': 'string',
	'current_price?': 'number | null',
	'market_cap?': 'number | null',
	'market_cap_rank?': 'number | null',
	'fully_diluted_valuation?': 'number | null',
	'total_volume?': 'number | null',
	'high_24h?': 'number | null',
	'low_24h?': 'number | null',
	'price_change_percentage_24h?': 'number | null',
	'circulating_supply?': 'number | null',
	'total_supply?': 'number | null',
	'max_supply?': 'number | null',
	'ath?': 'number | null',
	'ath_change_percentage?': 'number | null',
	'ath_date?': 'string | null',
	'last_updated?': 'string | null',
}).array()

export const coingeckoAssetPlatformEnvelope = arktype({
	id: 'string',
	'name?': 'string',
	'shortname?': 'string',
	'chain_identifier?': 'number | null',
	'native_coin_id?': 'string | null',
	'image?': coingeckoImageWire,
})

export const coingeckoAssetPlatformsEnvelope = coingeckoAssetPlatformEnvelope.array()

export const coingeckoCoinTickersEnvelope = arktype({
	'name?': 'string',
	tickers: arktype({
		coin_id: 'string',
		base: 'string',
		target: 'string',
		'target_coin_id?': 'string',
		'last?': 'number | null',
		'volume?': 'number | null',
		'bid_ask_spread_percentage?': 'number | null',
		'timestamp?': 'string | null',
		'last_traded_at?': 'string | null',
		'converted_last?': {
			'usd?': 'number | null',
		},
		'converted_volume?': {
			'usd?': 'number | null',
		},
		'is_anomaly?': 'boolean',
		'is_stale?': 'boolean',
		'trade_url?': 'string | null',
		market: {
			identifier: 'string',
			'name?': 'string',
		},
	}).array(),
})

export const coingeckoDerivativesExchangeEnvelope = arktype({
	'name?': 'string',
	'open_interest_btc?': 'number | null',
	'trade_volume_24h_btc?': 'number | null',
	'number_of_perpetual_pairs?': 'number | null',
	'number_of_futures_pairs?': 'number | null',
	tickers: arktype({
		coin_id: 'string',
		target_coin_id: 'string',
		symbol: 'string',
		last: 'number',
		index: 'number',
		last_traded: 'number',
		open_interest_usd: 'number',
		index_basis_percentage: 'number',
		funding_rate: 'number',
		'bid_ask_spread?': 'number | null',
		'volume_24h?': 'number | null',
		'contract_type?': 'string',
		'expired_at?': 'number | null',
	}).array(),
})

export const coingeckoOhlcCandleEnvelope = arktype([
	'number',
	'number',
	'number',
	'number',
	'number',
])

export const coingeckoOhlcEnvelope = coingeckoOhlcCandleEnvelope.array()

export const coingeckoSimplePriceRowEnvelope = arktype({
	'usd?': 'number',
	'last_updated_at?': 'number',
	'usd_market_cap?': 'number',
	'usd_24h_vol?': 'number',
	'usd_24h_change?': 'number',
})

export const coingeckoSimplePriceEnvelope = arktype('Record<string, unknown>')

/** Live `/coins/{id}` payloads sometimes omit `image` despite the checked-in OpenAPI required shape. */
export type CoingeckoCoin = Omit<CoinResponse, 'image'> & {
	image?: CoinResponse['image']
}
/** Live contract lookups can omit `image` the same way as `/coins/{id}`. */
export type CoingeckoCoinByContract = Omit<CoinByContractResponse, 'image'> & {
	image?: CoinByContractResponse['image']
}
export type CoingeckoAssetPlatform = AssetPlatformsResponse[number]
export type CoingeckoCoinsMarket = CoinsMarketsResponse[number]
export type CoingeckoCoinTickers = CoinTickersResponse
export type CoingeckoCoinTicker = NonNullable<CoinTickersResponse['tickers']>[number]
export type CoingeckoDerivativesExchangeWire = DerivativesExchangeResponse
type CoingeckoDerivativesExchangeTickerWire = NonNullable<
	DerivativesExchangeResponse['tickers']
>[number]
export type CoingeckoDerivativesExchangeTicker = Omit<
	CoingeckoDerivativesExchangeTickerWire,
	| 'last'
	| 'index'
	| 'open_interest_usd'
	| 'index_basis_percentage'
	| 'funding_rate'
> & {
	last: string
	index: string
	open_interest_usd: string
	index_basis_percentage: string
	funding_rate: string
}
export type CoingeckoDerivativesExchange = Omit<
	CoingeckoDerivativesExchangeWire,
	'tickers'
> & {
	tickers: CoingeckoDerivativesExchangeTicker[]
}
export type CoingeckoSimplePrice = SimplePriceResponse
export type CoingeckoSimplePriceRow = CoingeckoSimplePrice[string]

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

export type GetCoingeckoSimplePriceArgs = (
	& Omit<SimplePriceOperation['parameters']['query'], 'ids' | 'vs_currencies'>
	& Required<Pick<SimplePriceOperation['parameters']['query'], 'ids' | 'vs_currencies'>>
	& { publicEnv: SourcePublicEnv }
)
