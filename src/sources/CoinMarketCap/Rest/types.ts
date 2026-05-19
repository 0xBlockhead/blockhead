export type CoinMarketCapStatus = {
	timestamp?: string
	error_code?: number
	error_message?: string | null
	credit_count?: number
}

export type CoinMarketCapUsdQuote = {
	price?: number
	market_cap?: number
	volume_24h?: number
	last_updated?: string
}

export type CoinMarketCapQuote = {
	id?: number
	name?: string
	symbol?: string
	slug?: string
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
