// https://goldrush.dev/docs/api-reference/transactions/get-a-transaction/
export type GoldRushTransactionResponse = {
	data: GoldRushTransactionData | null
	error: boolean
	error_message: string | null
	error_code: number | null
}

export type GoldRushTransactionData = {
	updated_at: string
	chain_id: number
	chain_name: string
	items: GoldRushTransactionItem[]
}

export type GoldRushTransactionItem = {
	block_signed_at: string
	block_height: number
	block_hash: string
	tx_hash: string
	tx_offset: number
	successful: boolean
	from_address: string
	to_address: string | null
	value: string
	gas_offered: number
	gas_spent: number
	gas_price: number
	log_events: GoldRushLogEvent[]
	internal_transfers?: GoldRushInternalTransfer[] | null
	state_changes?: GoldRushStateChange[] | null
	input_data?: GoldRushInputData | null
}

export type GoldRushLogEvent = {
	block_signed_at: string
	block_height: number
	tx_offset: number
	log_offset: number
	tx_hash: string
	raw_log_topics: string[]
	sender_address: string
	raw_log_data: string | null
}

export type GoldRushInternalTransfer = {
	from_address: string
	to_address: string | null
	value: string
	gas_limit: number
}

export type GoldRushStateChange = {
	address: string
	balance_before: string
	balance_after: string
	storage_changes: GoldRushStorageChange[]
	nonce_before: number
	nonce_after: number
}

export type GoldRushStorageChange = {
	storage_address: string
	value_before: string
	value_after: string
}

export type GoldRushInputData = {
	method_id: string
}

export type GoldRushTransactionExpansions = {
	withInternal?: boolean
	withState?: boolean
	withInputData?: boolean
}

export type GoldRushTokenBalancesResponse = {
	data: GoldRushTokenBalancesData | null
	error: boolean
	error_message: string | null
	error_code: number | null
}

export type GoldRushTokenBalancesData = {
	address: string
	chain_id: number
	chain_name: string
	chain_tip_height: number
	chain_tip_signed_at: string
	quote_currency: string
	updated_at: string
	items: GoldRushTokenBalanceItem[]
}

export type GoldRushTokenBalanceItem = {
	contract_decimals: number
	contract_name: string
	contract_ticker_symbol: string
	contract_address: string
	contract_display_name: string
	supports_erc: string[]
	last_transferred_at: string | null
	block_height: number
	is_native_token: boolean
	type: string
	is_spam: boolean
	balance: string
	balance_24h: string | null
	quote_rate: number | null
	quote_rate_24h: number | null
	quote: number | null
	quote_24h: number | null
	pretty_quote: string | null
	pretty_quote_24h: string | null
}

export type GoldRushAddressTransactionsResponse = {
	data: GoldRushAddressTransactionsData | null
	error: boolean
	error_message: string | null
	error_code: number | null
}

export type GoldRushAddressTransactionsData = {
	address: string
	updated_at: string
	quote_currency: string
	chain_id: number
	chain_name: string
	chain_tip_height: number
	chain_tip_signed_at: string
	current_page: number
	links: {
		prev: string | null
		next: string | null
	}
	items: GoldRushTransactionItem[]
}
