import { type as arktype } from 'arktype'

export type CoinMarketCapStatus = {
	timestamp?: string
	error_code?: number
	error_message?: string | null
	credit_count?: number
}

export type CoinMarketCapUsdQuote = {
	price?: number | string
	market_cap?: number
	fully_diluted_market_cap?: number
	volume_24h?: number
	volume_change_24h?: number
	percent_change_1h?: number
	percent_change_24h?: number
	percent_change_7d?: number
	percent_change_30d?: number
	percent_change_60d?: number
	percent_change_90d?: number
	last_updated?: string
}

export type CoinMarketCapQuote = {
	id?: number
	name?: string
	symbol?: string
	slug?: string
	cmc_rank?: number
	num_market_pairs?: number
	circulating_supply?: number
	total_supply?: number
	max_supply?: number | null
	quote?: {
		USD?: CoinMarketCapUsdQuote
	}
}

export type CoinMarketCapQuotesLatestResponse = {
	status?: CoinMarketCapStatus
	data?: Record<string, CoinMarketCapQuote>
}

export type CoinMarketCapPlatform = {
	id?: number
	name?: string
	symbol?: string
	slug?: string
	token_address?: string
}

export type CoinMarketCapInfo = {
	id?: number
	name?: string
	symbol?: string
	slug?: string
	logo?: string
	platform?: CoinMarketCapPlatform | null
}

export type CoinMarketCapInfoLatestResponse = {
	status?: CoinMarketCapStatus
	data?: Record<string, CoinMarketCapInfo>
}

export type CoinMarketCapOhlcvUsdQuote = {
	open?: number
	high?: number
	low?: number
	close?: number
	volume?: number
	market_cap?: number
	timestamp?: string
}

export type CoinMarketCapOhlcvQuote = {
	time_open?: string
	time_close?: string
	time_high?: string
	time_low?: string
	quote?: {
		USD?: CoinMarketCapOhlcvUsdQuote
	}
}

export type CoinMarketCapOhlcvHistoricalCoin = {
	id?: number
	name?: string
	symbol?: string
	quotes?: CoinMarketCapOhlcvQuote[]
}

export type CoinMarketCapOhlcvHistoricalResponse = {
	status?: CoinMarketCapStatus
	data?: Record<string, CoinMarketCapOhlcvHistoricalCoin>
}


const coinMarketCapStatusWire = arktype({
	'timestamp?': 'string',
	'error_code?': 'number',
	'error_message?': 'string | null',
	'credit_count?': 'number',
})

const coinMarketCapUsdQuoteWire = arktype({
	'price?': 'number',
	'market_cap?': 'number',
	'fully_diluted_market_cap?': 'number',
	'volume_24h?': 'number',
	'volume_change_24h?': 'number',
	'percent_change_1h?': 'number',
	'percent_change_24h?': 'number',
	'percent_change_7d?': 'number',
	'percent_change_30d?': 'number',
	'percent_change_60d?': 'number',
	'percent_change_90d?': 'number',
	'last_updated?': 'string',
})

const coinMarketCapQuoteWire = arktype({
	'id?': 'number',
	'name?': 'string',
	'symbol?': 'string',
	'slug?': 'string',
	'cmc_rank?': 'number',
	'num_market_pairs?': 'number',
	'circulating_supply?': 'number',
	'total_supply?': 'number',
	'max_supply?': 'number | null',
	'quote?': {
		'USD?': coinMarketCapUsdQuoteWire,
	},
})

export const coinMarketCapQuotesLatestEnvelope = arktype({
	'status?': coinMarketCapStatusWire,
	'data?': {
		'[string]': coinMarketCapQuoteWire,
	},
})

const coinMarketCapPlatformWire = arktype({
	'id?': 'number',
	'name?': 'string',
	'symbol?': 'string',
	'slug?': 'string',
	'token_address?': 'string',
})

const coinMarketCapInfoWire = arktype({
	'id?': 'number',
	'name?': 'string',
	'symbol?': 'string',
	'slug?': 'string',
	'logo?': 'string',
	'platform?': coinMarketCapPlatformWire.or(arktype.null),
})

export const coinMarketCapInfoLatestEnvelope = arktype({
	'status?': coinMarketCapStatusWire,
	'data?': {
		'[string]': coinMarketCapInfoWire,
	},
})

const coinMarketCapOhlcvUsdQuoteWire = arktype({
	'open?': 'number',
	'high?': 'number',
	'low?': 'number',
	'close?': 'number',
	'volume?': 'number',
	'market_cap?': 'number',
	'timestamp?': 'string',
})

const coinMarketCapOhlcvQuoteWire = arktype({
	'time_open?': 'string',
	'time_close?': 'string',
	'time_high?': 'string',
	'time_low?': 'string',
	'quote?': {
		'USD?': coinMarketCapOhlcvUsdQuoteWire,
	},
})

const coinMarketCapOhlcvHistoricalCoinWire = arktype({
	'id?': 'number',
	'name?': 'string',
	'symbol?': 'string',
	'quotes?': coinMarketCapOhlcvQuoteWire.array(),
})

export const coinMarketCapOhlcvHistoricalEnvelope = arktype({
	'status?': coinMarketCapStatusWire,
	'data?': {
		'[string]': coinMarketCapOhlcvHistoricalCoinWire,
	},
})
