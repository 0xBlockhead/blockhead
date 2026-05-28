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
		access_key: NearRpcAccessKey
	}
	DeleteKey?: {
		public_key: string
	}
	DeleteAccount?: {
		beneficiary_id: string
	}
	Delegate?: {
		delegate_action: {
			actions: NearRpcAction[]
		}
	}
}

export type NearRpcTransactionStatus = {
	transaction: NearRpcTransaction
	receipts_outcome: NearRpcExecutionOutcome[]
	status: JsonValue
	transaction_outcome: NearRpcExecutionOutcome
}

export type NearRpcExecutionOutcome = {
	id: string
	outcome: {
		gas_burnt: number
		receipt_ids: string[]
		status: {
			SuccessValue?: string
			SuccessReceiptId?: string
			Failure?: JsonValue
			Unknown?: JsonValue
		}
	}
}

export type NearRpcAccount = {
	amount: string
	code_hash: string
	storage_usage: number
}

export type NearRpcAccessKey = {
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

export type NearRpcAccessKeyList = {
	keys: {
		public_key: string
		access_key: NearRpcAccessKey
	}[]
}
