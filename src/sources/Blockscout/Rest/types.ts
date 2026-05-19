export type BlockscoutAddressWire = {
	hash?: string
}

export type BlockscoutBlockWire = {
	base_fee_per_gas?: string
	blob_gas_used?: string | number
	excess_blob_gas?: string | number
	gas_limit?: string
	gas_used?: string
	hash?: string
	height: number
	miner?: BlockscoutAddressWire
	parent_hash?: string
	timestamp?: string
	transactions_count?: number
}

export type BlockscoutPaginatedWire<_Item> = {
	items: _Item[]
	next_page_params?: Record<string, string | number>
}

export type BlockscoutTransactionWire = {
	block_hash?: string
	block_number?: number
	created_contract?: BlockscoutAddressWire | null
	from?: BlockscoutAddressWire
	gas_limit?: string
	gas_price?: string
	gas_used?: string
	hash?: string
	max_fee_per_gas?: string
	nonce?: number
	position?: number
	priority_fee?: string
	raw_input?: string
	status?: 'error' | 'ok' | string
	to?: BlockscoutAddressWire | null
	transaction_burnt_fee?: string
	type?: number
	value?: string
}

export type BlockscoutSmartContractForListWire = {
	address_hash?: string | BlockscoutAddressWire
	compiler_version?: string
	language?: string
	verified_at?: string
}

export type BlockscoutTransactionLogWire = {
	address_hash?: BlockscoutAddressWire | string | null
	block_number?: number
	data?: string
	index?: number
	smart_contract?: BlockscoutAddressWire | null
	topics?: string[]
	transaction_hash?: string
}

export type BlockscoutAccountAbstractionSmartAccountWire = {
	address?: BlockscoutAddressWire
	total_ops?: number
}

export type BlockscoutUserOperationListItemWire = {
	address?: BlockscoutAddressWire
	block_number?: string | number | null
	fee?: string
	hash?: string
	status?: boolean
	timestamp?: string
	transaction_hash?: string | null
}
