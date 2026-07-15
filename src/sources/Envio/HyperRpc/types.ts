// https://docs.envio.dev/docs/HyperRPC-LLM/hyperrpc-complete
export type EnvioHyperRpcTransaction = {
	blockHash: string | null
	blockNumber: string | null
	hash: string
	from: string
	to: string | null
	gas: string
	gasPrice?: string
	maxFeePerGas?: string
	maxPriorityFeePerGas?: string
	maxFeePerBlobGas?: string
	input: string
	nonce: string
	r: string
	s: string
	v: string
	transactionIndex: string | null
	type?: string
	value: string
}

export type EnvioHyperRpcLog = {
	address: string
	blockHash: string
	blockNumber: string
	data: string
	logIndex: string
	removed: boolean
	topics: string[]
	transactionHash: string
	transactionIndex: string
}

export type EnvioHyperRpcTransactionReceipt = {
	blockHash: string
	blockNumber: string
	contractAddress: string | null
	cumulativeGasUsed: string
	effectiveGasPrice: string
	gasUsed: string
	blobGasUsed?: string
	logs: EnvioHyperRpcLog[]
	status: string
	transactionHash: string
	transactionIndex: string
}
