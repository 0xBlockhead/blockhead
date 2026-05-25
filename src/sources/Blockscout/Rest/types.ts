export type BlockscoutAddress = {
	hash?: string
}

/** Nested token summary on address detail (`GET /addresses/{address}`). */
export type BlockscoutAddressDetailToken = {
	address_hash?: string
	bridge_type?: string | null
	circulating_market_cap?: string | null
	decimals?: string | null
	exchange_rate?: string | null
	foreign_address?: string | null
	holders_count?: string | null
	icon_url?: string | null
	name?: string | null
	origin_chain_id?: string | null
	reputation?: string | null
	symbol?: string | null
	total_supply?: string | null
	type?: string | null
	volume_24h?: string | null
}

/** Blockscout `GET /addresses/{address}` — balance, flags, ENS, embedded token metadata. */
export type BlockscoutAddressDetails = {
	block_number_balance_updated_at?: number | null
	coin_balance?: string | null
	creation_status?: string | null
	creation_transaction_hash?: string | null
	creator_address_hash?: string | null
	ens_domain_name?: string | null
	exchange_rate?: string | null
	has_beacon_chain_withdrawals?: boolean
	has_logs?: boolean
	has_token_transfers?: boolean
	has_tokens?: boolean
	has_validated_blocks?: boolean
	hash?: string
	implementations?: {
		address_hash?: string
		name?: string | null
	}[]
	is_contract?: boolean | null
	is_scam?: boolean
	is_verified?: boolean | null
	metadata?: { tags?: unknown[] } | null
	name?: string | null
	private_tags?: unknown[]
	proxy_type?: string | null
	public_tags?: unknown[]
	reputation?: string
	token?: BlockscoutAddressDetailToken | null
	watchlist_address_id?: number | null
	watchlist_names?: unknown[]
}

/** Blockscout `GET /addresses/{address}/counters`. */
export type BlockscoutAddressCounters = {
	gas_usage_count?: string
	token_transfers_count?: string
	transactions_count?: string
	validations_count?: string
}

/** Token metadata on a token-transfer row (`GET …/token-transfers`). */
export type BlockscoutTokenTransferToken = {
	address_hash?: string
	circulating_market_cap?: string
	decimals?: string
	exchange_rate?: string
	holders_count?: string
	icon_url?: string
	name?: string
	symbol?: string
	total_supply?: string
	type?: string
}

/** `total` payload varies by ERC standard on token-transfer rows. */
export type BlockscoutTokenTransferTotal = {
	decimals?: string | null
	token_id?: string
	token_instance?: unknown
	value?: string
}

/** Blockscout `GET /addresses/{address}/token-transfers` item. */
export type BlockscoutTokenTransfer = {
	block_hash?: string
	block_number?: number
	from?: BlockscoutAddress
	log_index?: number
	method?: string
	timestamp?: string
	to?: BlockscoutAddress
	token?: BlockscoutTokenTransferToken
	token_type?: string
	total?: BlockscoutTokenTransferTotal
	transaction_hash?: string
	type?: string
}

/** Blockscout `GET /addresses/{address}/internal-transactions` item. */
export type BlockscoutInternalTransaction = {
	block_number?: number
	created_contract?: BlockscoutAddress | null
	error?: string
	from?: BlockscoutAddress
	gas_limit?: string
	index?: number
	success?: boolean
	timestamp?: string
	to?: BlockscoutAddress
	transaction_hash?: string
	type?: string
	value?: string
}

export type BlockscoutBlock = {
	base_fee_per_gas?: string
	blob_gas_used?: string | number
	excess_blob_gas?: string | number
	gas_limit?: string
	gas_used?: string
	hash?: string
	height: number
	miner?: BlockscoutAddress
	parent_hash?: string
	timestamp?: string
	transactions_count?: number
}

export type BlockscoutPaginated<_Item> = {
	items: _Item[]
	next_page_params?: Record<string, string | number>
}

export type BlockscoutTransaction = {
	block_hash?: string
	block_number?: number
	created_contract?: BlockscoutAddress | null
	from?: BlockscoutAddress
	gas_limit?: string
	gas_price?: string
	gas_used?: string
	hash?: string
	max_fee_per_gas?: string
	max_priority_fee_per_gas?: string
	nonce?: number
	position?: number
	priority_fee?: string
	raw_input?: string
	status?: 'error' | 'ok' | string
	to?: BlockscoutAddress | null
	transaction_burnt_fee?: string
	type?: number
	value?: string
}

export type BlockscoutSmartContractForList = {
	address?: BlockscoutAddress
	address_hash?: string | BlockscoutAddress
	compiler_version?: string
	language?: string
	verified_at?: string
}

export type BlockscoutTransactionLog = {
	address_hash?: BlockscoutAddress | string | null
	block_number?: number
	data?: string
	index?: number
	smart_contract?: BlockscoutAddress | null
	topics?: string[]
	transaction_hash?: string
}

export type BlockscoutErc4337RegistryEntry = {
	address?: BlockscoutAddress
	total_ops?: number
	total_accounts?: number
	factory?: BlockscoutAddress | null
}

export type BlockscoutErc4337Bundle = {
	bundler?: BlockscoutAddress
	total_ops?: number
}

export type BlockscoutErc4337SmartAccountListItem = BlockscoutErc4337RegistryEntry

export type BlockscoutUserOperationRaw = {
	call_data?: string
	call_gas_limit?: string
	init_code?: string
	max_fee_per_gas?: string
	max_priority_fee_per_gas?: string
	nonce?: string
	paymaster_and_data?: string
	pre_verification_gas?: string
	sender?: string
	signature?: string
	verification_gas_limit?: string
}

export type BlockscoutUserOperationDetail = BlockscoutUserOperationListItem & {
	bundle_index?: number
	call_gas_limit?: string
	consensus?: boolean
	gas?: string
	gas_price?: string
	gas_used?: string
	index?: number
	max_fee_per_gas?: string
	max_priority_fee_per_gas?: string
	nonce?: string
	paymaster?: BlockscoutAddress | null
	pre_verification_gas?: string
	raw?: BlockscoutUserOperationRaw
	sender?: BlockscoutAddress
	sponsor_type?: string
	verification_gas_limit?: string
}

export type BlockscoutUserOperationListItem = {
	address?: BlockscoutAddress
	block_number?: string | number | null
	bundler?: BlockscoutAddress | null
	entry_point?: BlockscoutAddress
	entry_point_version?: string
	fee?: string
	hash?: string
	status?: boolean
	timestamp?: string
	transaction_hash?: string | null
}

/** Blockscout `GET /api/v2/stats` when the instance exposes it. */
export type BlockscoutStats = {
	average_block_time?: number
	coin_price?: string
	coin_price_change_percentage?: number
	gas_price_updated_at?: string
	gas_prices?: {
		slow?: number
		average?: number
		fast?: number
	}
	gas_used_today?: string
	market_cap?: string
	network_utilization_percentage?: number
	total_addresses?: string
	total_blocks?: string
	total_transactions?: string
	transactions_today?: string
}

/** Blockscout legacy RPC API `module=contract` status envelope. */
export type BlockscoutLegacyContractStatus = {
	status?: string
	message?: string
	result?: string | BlockscoutLegacyContractSource[]
}

export type BlockscoutLegacyContractSource = {
	SourceCode?: string
	ABI?: string
	ContractName?: string
	CompilerVersion?: string
	Implementation?: string
	Proxy?: string
}
