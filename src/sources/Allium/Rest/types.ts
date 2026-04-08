export type AlliumToken = {
	chain: string
	address: string
	type?: string | null
	price?: number | null
	decimals?: number | null
	info?: {
		name: string
		symbol: string
	} | null
	attributes?: {
		image_url?: string | null
		total_liquidity_usd?: {
			amount?: number | null
			details?: string | null
		} | null
	} | null
}

export type AlliumWalletBalance = {
	chain: string
	address: string
	token?: AlliumToken
	raw_balance?: number
	raw_balance_str?: string
	block_timestamp?: string
	block_number?: number | null
}

export type AlliumLatestWalletBalancesEnvelope = {
	items: AlliumWalletBalance[]
	cursor?: string | null
}
