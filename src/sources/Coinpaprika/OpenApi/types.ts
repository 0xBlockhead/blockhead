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
	'market_cap?': 'number',
	'percent_change_24h?': 'number',
})

export const coinpaprikaCoinEnvelope = arktype({
	id: 'string',
	'name?': 'string',
	'symbol?': 'string',
	'logo?': 'string',
})

export const coinpaprikaTickerEnvelope = arktype({
	id: 'string',
	'name?': 'string',
	'symbol?': 'string',
	'rank?': 'number',
	'total_supply?': 'number',
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
	'quote_currency_id?': 'string',
	'market_url?': 'string',
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
