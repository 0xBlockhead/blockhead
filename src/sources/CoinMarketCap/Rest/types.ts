export type CoinMarketCapStatus = {
	timestamp?: string
	error_code?: number
	error_message?: string | null
	credit_count?: number
}

export type CoinMarketCapUsdQuote = {
	price?: number
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

export type CoinMarketCapInfo = {
	id?: number
	name?: string
	symbol?: string
	slug?: string
	logo?: string
}

export type CoinMarketCapInfoLatestResponse = {
	status?: CoinMarketCapStatus
	data?: Record<string, CoinMarketCapInfo>
}
