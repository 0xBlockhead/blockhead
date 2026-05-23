export type RpcBlockHeaderWire = {
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
	transactions?: (string | RpcTxWire)[]
}

export type RpcTxWire = {
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

export type RpcLogWire = {
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

export type RpcReceiptWire = {
	status?: string
	gasUsed?: string
	cumulativeGasUsed?: string
	effectiveGasPrice?: string
	blobGasUsed?: string
	logs?: RpcLogWire[]
	contractAddress?: string | null
}

/** `eth_feeHistory` result — @see https://github.com/ethereum/execution-apis/blob/main/src/eth/fee_market.yaml */
export type RpcFeeHistoryWire = {
	oldestBlock: string
	baseFeePerGas: string[]
	gasUsedRatio: number[]
	reward?: string[][]
}

export type RpcTxpoolStatusWire = {
	pending: string
	queued: string
}
