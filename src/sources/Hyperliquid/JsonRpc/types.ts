export type HyperliquidEvmBlock = {
	hash: string
	number: string
	timestamp: string
	transactions: HyperliquidEvmTransaction[]
}

export type HyperliquidEvmTransaction = {
	hash: string
	blockNumber?: string | null
	from?: string
}

export type HyperliquidEvmTransactionReceipt = {
	blockNumber?: string | null
	status?: string
}
