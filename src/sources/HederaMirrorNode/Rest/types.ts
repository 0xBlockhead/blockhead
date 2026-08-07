// https://docs.hedera.com/api-reference/blocks/get-block-by-hash-or-number
export type HederaMirrorNodeBlock = {
	count: number
	gas_used: number | null
	hapi_version: string | null
	hash: string
	logs_bloom: string | null
	name: string
	number: number
	previous_hash: string
	size: number | null
	timestamp: {
		from: string
		to: string
	}
}

export type HederaMirrorNodeBlocks = {
	blocks: HederaMirrorNodeBlock[]
	links: {
		next: string | null
	}
}

// https://docs.hedera.com/api-reference/accounts/get-account-by-alias-id-or-evm-address
export type HederaMirrorNodeAccount = {
	account: string | null
	alias: string | null
	auto_renew_period: number | null
	balance: {
		timestamp: string
		balance: string
		tokens: {
			token_id: string
			balance: string
		}[]
	}
	created_timestamp: string | null
	decline_reward: boolean
	deleted: boolean | null
	ethereum_nonce: number | null
	evm_address: string | null
	expiry_timestamp: string | null
	key: object | null
	max_automatic_token_associations: number | null
	memo: string | null
	pending_reward: string
	receiver_sig_required: boolean | null
	staked_account_id: string | null
	staked_node_id: number | null
	stake_period_start: string | null
}

// https://docs.hedera.com/api-reference/accounts/list-account-entities-on-network
export type HederaMirrorNodeAccounts = {
	accounts: HederaMirrorNodeAccount[]
	links: {
		next: string | null
	}
}

// https://docs.hedera.com/api-reference/accounts/get-crypto-allowances-for-an-account-info
export type HederaMirrorNodeCryptoAllowance = {
	amount: string
	amount_granted: string
	owner: string
	spender: string
	timestamp: {
		from: string
		to: string
	}
}

export type HederaMirrorNodeCryptoAllowances = {
	allowances: HederaMirrorNodeCryptoAllowance[]
	links: {
		next: string | null
	}
}

// https://docs.hedera.com/api-reference/accounts/get-fungible-token-allowances-for-an-account
export type HederaMirrorNodeTokenAllowance = HederaMirrorNodeCryptoAllowance & {
	token_id: string
}

export type HederaMirrorNodeTokenAllowances = {
	allowances: HederaMirrorNodeTokenAllowance[]
	links: {
		next: string | null
	}
}

// https://docs.hedera.com/api-reference/accounts/get-non-fungible-token-allowances-for-an-account
export type HederaMirrorNodeNftAllowance = {
	approved_for_all: boolean
	owner: string
	payer_account_id: string
	spender: string
	timestamp: {
		from: string
		to: string
	}
	token_id: string
}

export type HederaMirrorNodeNftAllowances = {
	allowances: HederaMirrorNodeNftAllowance[]
	links: {
		next: string | null
	}
}

// https://docs.hedera.com/api-reference/accounts/get-token-relationships-info-for-an-account
export type HederaMirrorNodeAccountToken = {
	automatic_association: boolean
	balance: string
	created_timestamp: string
	decimals: number
	freeze_status: string
	kyc_status: string
	token_id: string
}

export type HederaMirrorNodeAccountTokens = {
	tokens: HederaMirrorNodeAccountToken[]
	links: {
		next: string | null
	}
}

// https://docs.hedera.com/api-reference/accounts/get-nfts-for-an-account-info
export type HederaMirrorNodeNft = {
	account_id: string
	created_timestamp: string
	delegating_spender: string | null
	deleted: boolean
	metadata: string
	modified_timestamp: string
	serial_number: string
	spender_id: string | null
	token_id: string
}

export type HederaMirrorNodeNfts = {
	nfts: HederaMirrorNodeNft[]
	links: {
		next: string | null
	}
}

// https://docs.hedera.com/api-reference/transactions/list-transactions
export type HederaMirrorNodeTransaction = {
	batch_key: {
		_type: string
		key: string
	} | null
	bytes: string | null
	charged_tx_fee: string
	consensus_timestamp: string
	entity_id: string | null
	high_volume: boolean
	high_volume_pricing_multiplier: number
	max_custom_fees: {
		account_id: string
		amount: string
		denominating_token_id: string | null
	}[]
	max_fee: string
	memo_base64: string | null
	name: string
	nft_transfers: {
		is_approval: boolean
		receiver_account_id: string | null
		serial_number: string
		sender_account_id: string | null
		token_id: string
	}[]
	node: string | null
	nonce: number
	parent_consensus_timestamp: string | null
	result: string
	scheduled: boolean
	staking_reward_transfers: {
		account: number
		amount: string
	}[]
	transaction_hash: string
	token_transfers: {
		account: string | null
		amount: string
		is_approval: boolean
		token_id: string
	}[]
	transaction_id: string
	transfers: {
		account: string | null
		amount: string
		is_approval: boolean
	}[]
	valid_duration_seconds: string | null
	valid_start_timestamp: string | null
}

export type HederaMirrorNodeTransactions = {
	transactions: HederaMirrorNodeTransaction[]
	links: {
		next: string | null
	}
}

export type HederaMirrorNodeTransactionResponse = {
	transactions: HederaMirrorNodeTransaction[]
}

// https://docs.hedera.com/api-reference/network/get-the-network-address-book-nodes
export type HederaMirrorNodeNode = {
	admin_key: {
		_type: string
		key: string
	} | null
	associated_registered_nodes: string[]
	decline_reward: boolean
	description: string
	file_id: string
	max_stake: string
	memo: string
	min_stake: string
	node_account_id: string
	node_cert_hash: string
	node_id: string
	public_key: string
	reward_rate_start: string
	service_endpoints: {
		domain_name?: string
		ip_address_v4?: string
		port: number
	}[]
	stake: string
	stake_not_rewarded: string
	stake_rewarded: string
	staking_period: {
		from: string
		to: string | null
	}
	timestamp: {
		from: string
		to: string | null
	}
}

export type HederaMirrorNodeNodes = {
	nodes: HederaMirrorNodeNode[]
	links: {
		next: string | null
	}
}

// https://docs.hedera.com/hedera/sdks-and-apis/rest-api/network/get-network-supply
export type HederaMirrorNodeNetworkSupply = {
	released_supply: string
	timestamp: string
	total_supply: string
}

// https://docs.hedera.com/hedera/sdks-and-apis/rest-api/network/get-network-stake
export type HederaMirrorNodeNetworkStake = {
	max_stake_rewarded: string
	max_staking_reward_rate_per_hbar: number
	max_total_reward: string
	node_reward_fee_fraction: number
	reserved_staking_rewards: string
	reward_balance_threshold: string
	stake_total: string
	staking_period: {
		from: string
		to: string | null
	}
	staking_period_duration: number
	staking_periods_stored: number
	staking_reward_fee_fraction: number
	staking_reward_rate: number
	staking_reward_start_threshold: string
	unreserved_staking_reward_balance: string
}

// https://docs.hedera.com/hedera/sdks-and-apis/rest-api/network/get-exchange-rate
export type HederaMirrorNodeNetworkExchangeRate = {
	current_rate: {
		cent_equivalent: number
		expiration_time: number
		hbar_equivalent: number
	}
	next_rate: {
		cent_equivalent: number
		expiration_time: number
		hbar_equivalent: number
	}
	timestamp: string
}

// https://docs.hedera.com/hedera/sdks-and-apis/rest-api/network/get-network-fees
export type HederaMirrorNodeNetworkFee = {
	gas?: number
	transaction_type: string
	fees?: {
		base?: number
		node?: number
		network?: number
		service?: number
		total?: number
	}
}

export type HederaMirrorNodeNetworkFees = {
	fees: HederaMirrorNodeNetworkFee[]
	timestamp: string
}

// https://docs.hedera.com/api-reference/schedules/get-schedule-by-id
export type HederaMirrorNodeSchedule = {
	admin_key: {
		_type: string
		key: string
	} | null
	consensus_timestamp: string
	creator_account_id: string | null
	deleted: boolean
	executed_timestamp: string | null
	expiration_time: string | null
	memo: string
	payer_account_id: string | null
	schedule_id: string
	signatures: {
		consensus_timestamp: string
		public_key_prefix: string
		signature: string
		type: string
	}[]
	transaction_body: string
	wait_for_expiry: boolean
}

// https://docs.hedera.com/api-reference/contracts/get-the-contract-result-from-a-contract-on-the-network-for-a-given-transactionid-or-ethereum-transaction-hash
export type HederaMirrorNodeContractResult = {
	access_list: unknown
	address: string | null
	amount: string | null
	authorization_list?: unknown
	block_gas_used: number | null
	block_hash: string | null
	block_number: number | null
	bloom: string | null
	call_result: string | null
	chain_id: string | null
	contract_id: string | null
	created_contract_ids: string[] | null
	error_message: string | null
	failed_initcode: string | null
	from: string | null
	function_parameters: string | null
	gas_consumed: number | null
	gas_limit: number
	gas_price: string | null
	gas_used: number | null
	hash: string
	logs: unknown
	max_fee_per_gas: string | null
	max_priority_fee_per_gas: string | null
	nonce: number | null
	r: string | null
	result: string
	s: string | null
	state_changes: unknown
	status: string
	timestamp: string
	to: string | null
	transaction_index: number | null
	type: number | null
	v: number | null
}
