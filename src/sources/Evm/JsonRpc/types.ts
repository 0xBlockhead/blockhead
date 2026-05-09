export type RpcBlockHeaderWire = {
	number?: string
	hash?: string
	parentHash?: string
	timestamp?: string
	gasUsed?: string
	gasLimit?: string
	baseFeePerGas?: string
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
	input?: string
	nonce?: string
	transactionIndex?: string
	type?: string
	value?: string
}

export type RpcLogWire = {
	address?: string
	topics?: string[]
	data?: string
	blockNumber?: string
	transactionHash?: string
	logIndex?: string
}

export type RpcReceiptWire = {
	status?: string
	gasUsed?: string
	effectiveGasPrice?: string
	logs?: RpcLogWire[]
	contractAddress?: string | null
}
