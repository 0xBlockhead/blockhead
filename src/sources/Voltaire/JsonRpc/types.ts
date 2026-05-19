import type { RpcLogWire } from '$/sources/Evm/JsonRpc/types.ts'

export type VoltaireBlockRpc = {
	number: string
	hash: string
	parentHash: string
	timestamp: string | number
	miner: string
	gasUsed: string
	gasLimit: string
	baseFeePerGas?: string
	transactions?: readonly (string | VoltaireTxRpc)[]
	blobGasUsed?: string
	excessBlobGas?: string
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
	blobVersionedHashes?: readonly string[]
}

export type VoltaireReceiptRpc = {
	status?: string
	gasUsed?: string
	contractAddress?: string | null
	effectiveGasPrice?: string
	logs?: RpcLogWire[]
}
