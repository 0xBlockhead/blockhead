import type * as VoltaireTransaction from '@tevm/voltaire/Transaction'

export type VoltaireBlockRpc = {
	number: string
	hash: string
	parentHash: string
	timestamp: string | number
	miner: string
	gasUsed: string
	gasLimit: string
	baseFeePerGas?: string
	transactions?: readonly (string | VoltaireTransaction.Any)[]
}

export type VoltaireTxRpc = {
	hash?: string
	blockNumber?: string
	blockHash?: string
	transactionIndex?: string
	from?: string
	to?: string | null
	value?: string
	nonce?: string
	input?: string
	gas?: string
	gasPrice?: string
	type?: string
}

export type VoltaireReceiptRpc = {
	status?: string
	gasUsed?: string
	contractAddress?: string | null
	effectiveGasPrice?: string
	logs?: unknown[]
}
