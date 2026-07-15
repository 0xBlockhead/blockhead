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

export type GoldRushTransactionResult = {
	transaction: GoldRushTransactionItem
	updatedAt: string
	chainId: number
	chainName: string
}
