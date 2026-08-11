import type { JsonValue } from '$/typescript/JsonValue.ts'

export type NearRpcBlock = {
	author: string
	header: {
		height: number
		hash: string
		prev_hash: string
		epoch_id: string
		timestamp_nanosec: string
	}
	chunks: NearRpcChunkHeader[]
}

export type NearRpcStatus = {
	chain_id: string
	genesis_hash: string
	latest_protocol_version: number
	protocol_version: number
	sync_info: {
		epoch_id: string
		epoch_start_height: number
		latest_block_hash: string
		latest_block_height: number
		latest_block_time: string
		syncing: boolean
	}
	version: {
		version: string
		build?: string
		commit?: string
		rustc_version?: string
	}
}

export type NearRpcGasPrice = {
	gas_price: string
}

export type NearRpcValidatorStake = {
	account_id: string
	public_key: string
	stake: string
	validator_stake_struct_version?: string
}

export type NearRpcNextValidator = {
	account_id: string
	public_key: string
	stake: string
	shards: number[]
}

export type NearRpcCurrentValidator = {
	account_id: string
	public_key: string
	stake: string
	is_slashed: boolean
	shards: number[]
	num_expected_blocks: number
	num_produced_blocks: number
	num_expected_chunks?: number
	num_produced_chunks?: number
	num_expected_endorsements?: number
	num_produced_endorsements?: number
	shards_endorsed?: number[]
}

export type NearRpcValidators = {
	current_fishermen: NearRpcValidatorStake[]
	current_proposals: NearRpcValidatorStake[]
	current_validators: NearRpcCurrentValidator[]
	epoch_height: number
	epoch_start_height: number
	next_fishermen: NearRpcValidatorStake[]
	next_validators: NearRpcNextValidator[]
	prev_epoch_kickout: {
		account_id: string
		reason: JsonValue
	}[]
}

export type NearRpcChunkHeader = {
	chunk_hash: string
	shard_id: number
	gas_used: number
	height_included: number
}

export type NearRpcChunk = {
	author: string
	header: NearRpcChunkHeader
	transactions: NearRpcTransaction[]
}

export type NearRpcTransaction = {
	hash: string
	signer_id: string
	receiver_id: string
	nonce: number
	actions: NearRpcAction[]
}

export type NearRpcAction = {
	CreateAccount?: Record<string, never>
	DeployContract?: {
		code: string
	}
	FunctionCall?: {
		method_name: string
		args: string
		gas: number
		deposit: string
	}
	Transfer?: {
		deposit: string
	}
	Stake?: {
		stake: string
		public_key: string
	}
	AddKey?: {
		public_key: string
		access_key: NearRpcAccessKeyBody
	}
	DeleteKey?: {
		public_key: string
	}
	DeleteAccount?: {
		beneficiary_id: string
	}
	Delegate?: {
		delegate_action: {
			sender_id?: string
			receiver_id?: string
			actions: NearRpcAction[]
			nonce?: number
			max_block_height?: number
			public_key?: string
		}
	}
}

export type NearRpcTransactionStatus = {
	transaction: NearRpcTransaction
	receipts_outcome: NearRpcExecutionOutcome[]
	status: JsonValue
	transaction_outcome: NearRpcExecutionOutcome
	receipts?: NearRpcReceipt[]
}

export type NearRpcReceiptAction = {
	Action: {
		signer_id: string
		signer_public_key: string
		gas_price: string
		actions: NearRpcAction[]
		input_data_ids: string[]
		output_data_receivers: {
			data_id: string
			receiver_id: string
		}[]
	}
}

export type NearRpcReceiptData = {
	Data: {
		data_id: string
		data: string | null
	}
}

export type NearRpcReceipt = {
	predecessor_id: string
	receiver_id: string
	receipt_id: string
	receipt: NearRpcReceiptAction | NearRpcReceiptData
}

export type NearRpcExecutionOutcomeStatus = {
	SuccessValue?: string
	SuccessReceiptId?: string
	Failure?: JsonValue
	Unknown?: JsonValue
}

export type NearRpcExecutionOutcome = {
	id: string
	outcome: {
		gas_burnt: number
		receipt_ids: string[]
		status: NearRpcExecutionOutcomeStatus
		executor_id?: string
		logs?: string[]
		tokens_burnt?: string
	}
	block_hash?: string
}

export type NearRpcAccount = {
	amount: string
	locked: string
	code_hash: string
	storage_usage: number
	storage_paid_at: number
	block_height: number
	block_hash: string
}

export type NearRpcAccessKeyBody = {
	nonce: number
	permission: (
		| 'FullAccess'
		| {
			FunctionCall: {
				allowance: string | null
				receiver_id: string
				method_names: string[]
			}
		}
	)
}

export type NearRpcAccessKey = NearRpcAccessKeyBody & {
	block_height: number
	block_hash: string
}

export type NearRpcAccessKeyList = {
	keys: {
		public_key: string
		access_key: NearRpcAccessKeyBody
	}[]
	block_height: number
	block_hash: string
}

export type NearRpcViewState = {
	block_hash: string
	block_height: number
	values: {
		key: string
		value: string
	}[]
	proof: JsonValue[]
}
