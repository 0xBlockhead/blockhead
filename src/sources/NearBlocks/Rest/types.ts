export type NearBlocksAccount = {
	account_id?: string
	amount?: string
	block_hash?: string
	block_height?: number
	created?: {
		block_timestamp?: string
		transaction_hash?: string
	} | null
	locked?: string
	storage_usage?: number
}

export type NearBlocksAccountResponse = {
	account?: NearBlocksAccount[]
}

export type NearBlocksBlock = {
	block_hash?: string
	block_height?: number
	block_timestamp?: string
	chunks_agg?: {
		chunks?: number
		gas_used?: string
	}
	epoch_id?: string
	prev_block_hash?: string
}

export type NearBlocksBlockResponse = {
	blocks?: NearBlocksBlock[]
}

export type NearBlocksAction = {
	action?: string
	args?: string
	deposit?: string | number
	fee?: string | number
	method?: string
}

export type NearBlocksTransaction = {
	actions?: NearBlocksAction[]
	block?: {
		block_height?: number
	}
	block_hash?: string
	block_timestamp?: string
	included_in_block_hash?: string
	nonce?: number | string
	outcomes?: {
		status?: boolean
	}
	outcomes_agg?: {
		transaction_fee?: string | number
	}
	receiver_account_id?: string
	signer_account_id?: string
	transaction_hash?: string
}

export type NearBlocksTransactionResponse = {
	txns?: NearBlocksTransaction[]
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
