export type GetBlockJsonRpcError = {
	code: number
	message: string
}

export type GetBlockJsonRpcResponse<_Result> =
	| {
		jsonrpc: '2.0'
		id: number
		result: _Result
	}
	| {
		jsonrpc: '2.0'
		id: number
		error: GetBlockJsonRpcError
	}

export type GetBlockEvmTransaction = {
	hash: string
	blockHash: string | null
	blockNumber: string | null
	transactionIndex: string | null
	from: string
	to: string | null
	value: string
	nonce: string
	gas: string
	gasPrice: string | null
	input: string
	r: string
	s: string
	v: string
}

export type GetBlockEvmLog = {
	logIndex: string
}

export type GetBlockEvmTransactionReceipt = {
	transactionHash: string
	blockHash: string
	blockNumber: string
	transactionIndex: string
	from: string
	to: string | null
	cumulativeGasUsed: string
	gasUsed: string
	effectiveGasPrice: string | null
	status: string | null
	logs: GetBlockEvmLog[]
}
