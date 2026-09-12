import { type as arktype } from 'arktype'

import type { paths } from '$/sources/Coinpaprika/OpenApi/openapi.d.ts'

export type CoinpaprikaCoin = paths['/coins/{coin_id}']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaCoinPath = paths['/coins/{coin_id}']['get']['parameters']['path']

export type CoinpaprikaCoinMarkets = paths['/coins/{coin_id}/markets']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaCoinMarket = CoinpaprikaCoinMarkets[number]

export type CoinpaprikaExchangeMarkets = paths['/exchanges/{exchange_id}/markets']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaExchangeMarket = CoinpaprikaExchangeMarkets[number]
export type CoinpaprikaExchangeMarketsPath = paths['/exchanges/{exchange_id}/markets']['get']['parameters']['path']

/** Common input accepted by the resolver's market normalization. */
export type CoinpaprikaMarket = CoinpaprikaCoinMarket | CoinpaprikaExchangeMarket

export type CoinpaprikaOhlcvTodayRows = paths['/coins/{coin_id}/ohlcv/today']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaOhlcvHistoricalRows = paths['/coins/{coin_id}/ohlcv/historical']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaOhlcvHistoricalQuery = paths['/coins/{coin_id}/ohlcv/historical']['get']['parameters']['query']
export type CoinpaprikaOhlcv = CoinpaprikaOhlcvTodayRows[number] | CoinpaprikaOhlcvHistoricalRows[number]

export type CoinpaprikaTicker = paths['/tickers/{coin_id}']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaTickers = paths['/tickers']['get']['responses'][200]['content']['application/json']


const coinpaprikaUsdQuoteWire = arktype({
	'price?': 'number',
	'volume_24h?': 'number',
	'volume_24h_change_24h?': 'number',
	'market_cap?': 'number',
	'market_cap_change_24h?': 'number',
	'percent_change_15m?': 'number',
	'percent_change_30m?': 'number',
	'percent_change_1h?': 'number',
	'percent_change_6h?': 'number',
	'percent_change_12h?': 'number',
	'percent_change_24h?': 'number',
	'percent_change_7d?': 'number',
	'percent_change_30d?': 'number',
	'percent_change_1y?': 'number',
	'ath_price?': 'number',
	'ath_date?': 'string',
	'percent_from_price_ath?': 'number',
})

export const coinpaprikaCoinEnvelope = arktype({
	id: 'string',
	'name?': 'string',
	'symbol?': 'string',
	'rank?': 'number',
	'is_new?': 'boolean',
	'is_active?': 'boolean',
	'type?': 'string',
	'logo?': 'string',
	'description?': 'string | null',
	'message?': 'string',
	'open_source?': 'boolean',
	'started_at?': 'string | null',
	'development_status?': 'string | null',
	'hardware_wallet?': 'boolean',
	'proof_type?': 'string | null',
	'org_structure?': 'string | null',
	'hash_algorithm?': 'string | null',
	'first_data_at?': 'string',
	'last_data_at?': 'string',
})

export const coinpaprikaTickerEnvelope = arktype({
	id: 'string',
	'name?': 'string',
	'symbol?': 'string',
	'rank?': 'number',
	'circulating_supply?': 'number',
	'total_supply?': 'number',
	'max_supply?': 'number',
	'beta_value?': 'number',
	'first_data_at?': 'string',
	'last_updated?': 'string',
	'quotes?': {
		'USD?': coinpaprikaUsdQuoteWire,
	},
})

export const coinpaprikaTickersEnvelope = coinpaprikaTickerEnvelope.array()

export const coinpaprikaMarketEnvelope = arktype({
	'exchange_id?': 'string',
	'exchange_name?': 'string',
	'pair?': 'string',
	'base_currency_id?': 'string',
	'base_currency_name?': 'string',
	'quote_currency_id?': 'string',
	'quote_currency_name?': 'string',
	'market_url?': 'string',
	'category?': 'string',
	'fee_type?': 'string',
	'outlier?': 'boolean',
	'adjusted_volume_24h_share?': 'number',
	'reported_volume_24h_share?': 'number',
	'last_updated?': 'string',
	'quotes?': {
		'USD?': {
			'price?': 'number',
			'volume_24h?': 'number',
		},
	},
})

export const coinpaprikaMarketsEnvelope = coinpaprikaMarketEnvelope.array()

export const coinpaprikaOhlcvRowEnvelope = arktype({
	'time_open?': 'string',
	'time_close?': 'string',
	'open?': 'number',
	'high?': 'number',
	'low?': 'number',
	'close?': 'number',
	'volume?': 'number',
	'market_cap?': 'number',
})

export const coinpaprikaOhlcvRowsEnvelope = coinpaprikaOhlcvRowEnvelope.array()
