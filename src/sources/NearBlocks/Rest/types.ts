export type NearBlocksAccount = {
	account_id: string
	amount: string
	block_hash: string
	block_height: string
	created?: {
		block_timestamp?: number | string | null
		transaction_hash?: string | null
	} | null
	deleted?: {
		block_timestamp?: number | string | null
		transaction_hash?: string | null
	} | null
	locked?: string
	storage_usage?: string | number
}

export type NearBlocksAccountResponse = {
	account: NearBlocksAccount[]
}

export type NearBlocksBlock = {
	author_account_id?: string
	block_hash: string
	block_height: string | number
	block_timestamp: string
	chunks_agg?: {
		gas_limit?: number
		gas_used?: number
		shards?: number
	}
	epoch_id: string
	gas_price?: string
	prev_block_hash: string
	receipts_agg?: {
		count?: number
	}
	transactions_agg?: {
		count?: number
	}
}

export type NearBlocksBlockResponse = {
	blocks: NearBlocksBlock[]
}

export type NearBlocksAction = {
	action: string
	args?: string | null
	deposit?: string | number
	fee?: string | number
	method?: string | null
}

export type NearBlocksTransaction = {
	actions: NearBlocksAction[]
	actions_agg?: {
		deposit?: string | number
		gas_attached?: string | number
	}
	block?: {
		block_height?: number | string
	}
	block_timestamp: string
	included_in_block_hash: string
	nonce?: number | string
	outcomes?: {
		status?: boolean
	}
	outcomes_agg?: {
		gas_used?: string | number
		transaction_fee?: string | number
	}
	receipt_conversion_gas_burnt?: string
	receipt_conversion_tokens_burnt?: string
	receiver_account_id: string
	shard_id?: number | string
	signer_account_id: string
	transaction_hash: string
}

export type NearBlocksTransactionResponse = {
	txns: NearBlocksTransaction[]
}

export type NearBlocksV3Error = {
	message: string
	path?: string
}

export type NearBlocksV3AccountBalance = {
	account_id: string
	amount: string
	amount_staked: string
	storage_usage: string
}

export type NearBlocksV3Transaction = {
	actions: {
		action: string
		method?: string
	}[]
	actions_agg: {
		deposit: string
		gas_attached?: string
	}
	block: {
		block_hash: string
		block_height: string
		block_timestamp: string
	}
	block_timestamp?: string
	index_in_chunk: number
	outcomes: {
		status: boolean
		status_key?: string
	}
	outcomes_agg: {
		gas_used?: string
		transaction_fee: string
	}
	receipt_conversion_gas_burnt?: string
	receipt_conversion_tokens_burnt?: string
	receiver_account_id: string
	shard_id: number
	signer_account_id: string
	transaction_hash: string
}

export type NearBlocksV3Response<_Data> = {
	data: _Data | null
	errors?: NearBlocksV3Error[]
	meta?: {
		next_page?: string
		prev_page?: string
	}
}
