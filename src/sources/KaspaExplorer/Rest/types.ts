export type KaspaExplorerBalance = {
	address: string
	balance: number
}

export type KaspaExplorerOutpoint = {
	transactionId: string
	index: number
}

export type KaspaExplorerUtxo = {
	address: string
	outpoint: KaspaExplorerOutpoint
	utxoEntry: {
		amount?: string
		scriptPublicKey: {
			scriptPublicKey?: string
		}
		blockDaaScore?: string
		isCoinbase?: boolean
	}
}

export type KaspaExplorerTransactionInput = {
	previous_outpoint_address?: string
	previous_outpoint_amount?: number
}

export type KaspaExplorerTransactionOutput = {
	amount: number
	script_public_key_address?: string
}

export type KaspaExplorerTransaction = {
	transaction_id?: string
	mass?: string
	block_time?: number
	inputs?: KaspaExplorerTransactionInput[]
	outputs?: KaspaExplorerTransactionOutput[]
}

export type KaspaExplorerTransactionCount = {
	total: number
}

export type KaspaExplorerUtxoCount = {
	count: number
}
