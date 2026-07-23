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
