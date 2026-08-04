import type {
	BlockId,
	Felt,
} from '$/sources/_shared/interfaces/StarknetJsonRpc/types.ts'

export type {
	BlockId,
	Felt,
}

export type ResourcePrice = {
	price_in_wei: Felt
	price_in_fri: Felt
}

export type BlockWithTxHashes = {
	status: string
	block_hash: Felt
	parent_hash: Felt
	block_number: number
	new_root: Felt
	timestamp: number
	sequencer_address: Felt
	l1_gas_price?: ResourcePrice
	l1_data_gas_price?: ResourcePrice
	starknet_version?: string
	transactions: Felt[]
}

export type TransactionWithHash = {
	transaction_hash: Felt
	type: string
	sender_address?: Felt
	contract_address?: Felt
	nonce?: Felt
	version?: string
	max_fee?: Felt
	calldata?: Felt[]
	signature?: Felt[]
	resource_bounds?: {
		l1_gas?: {
			max_amount: string
			max_price_per_unit: string
		}
		l2_gas?: {
			max_amount: string
			max_price_per_unit: string
		}
		l1_data_gas?: {
			max_amount: string
			max_price_per_unit: string
		}
	}
}

export type FeePayment = {
	amount: Felt
	unit: string
}

export type MessageToL1 = {
	from_address: Felt
	to_address: string
	payload: Felt[]
}

export type TransactionReceiptWithBlockInfo = {
	transaction_hash: Felt
	actual_fee: FeePayment
	finality_status: string
	execution_status?: string
	revert_reason?: string
	messages_sent: MessageToL1[]
	events: unknown[]
	block_hash?: Felt
	block_number: number
}
