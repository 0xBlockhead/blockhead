export type RpcBlockHeader = {
	number?: string
	hash?: string
	parentHash?: string
	timestamp?: string
	gasUsed?: string
	gasLimit?: string
	baseFeePerGas?: string
	blobGasUsed?: string
	excessBlobGas?: string
	miner?: string
	difficulty?: string
	transactions?: (string | RpcTransaction)[]
}

export type RpcTransaction = {
	blockHash?: string
	blockNumber?: string
	hash?: string
	from?: string
	to?: string | null
	gas?: string
	gasPrice?: string
	maxFeePerGas?: string
	maxPriorityFeePerGas?: string
	input?: string
	nonce?: string
	transactionIndex?: string
	type?: string
	value?: string
	maxFeePerBlobGas?: string
}

export type RpcLog = {
	address?: string
	topics?: string[]
	data?: string
	blockNumber?: string
	blockHash?: string
	transactionHash?: string
	transactionIndex?: string
	logIndex?: string
	removed?: boolean
}

export type RpcReceipt = {
	status?: string
	gasUsed?: string
	cumulativeGasUsed?: string
	effectiveGasPrice?: string
	blobGasUsed?: string
	logs?: RpcLog[]
	contractAddress?: string | null
}

/** `eth_feeHistory` result — @see https://github.com/ethereum/execution-apis/blob/main/src/eth/fee_market.yaml */
export type RpcFeeHistory = {
	oldestBlock: string
	baseFeePerGas: string[]
	baseFeePerBlobGas?: string[]
	blobGasUsedRatio?: number[]
	gasUsedRatio: number[]
	reward?: string[][]
}

export type RpcTxpoolStatus = {
	pending: string
	queued: string
}
