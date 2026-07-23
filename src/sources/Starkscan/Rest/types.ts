export type StarkscanAddressTransaction = {
	blockNumber: number
	timestampIso: string | null
	txIndex: number
	txHash: string
	kinds: string[]
	counterparty: string | null
	txType: string | null
	executionStatus: string | null
	finalityStatus: string | null
	fromAddress: string | null
	toAddress: string | null
	primaryMethod: string | null
	callCount: number | null
	methodsDiffer: boolean | null
	transferCount: number | null
	topTransferTokenAddress: string | null
	topTransferAmount: string | null
	topTransferStandard: string | null
}

export type StarkscanAddressTransactionPage = {
	items: StarkscanAddressTransaction[]
	nextCursor: string | null
}

export type StarkscanTokenHolding = {
	tokenAddress: string
	normalizedTokenAddress: string
	indexedBalanceRaw: string
	symbol: string | null
	name: string | null
	decimals: number | null
}

export type StarkscanTokenHoldings = {
	chainId: string
	ownerAddress: string
	items: StarkscanTokenHolding[]
	exact: boolean
	truncated: boolean
	completeness: {
		exact: boolean
		truncated: boolean
		complete: boolean
		reasonCode:
			| 'complete'
			| 'indexLag'
			| 'boundedComputation'
			| 'responseCap'
			| 'metadataPending'
			| 'degradedFallback'
			| 'unknown'
		reason: string
		lagBlocks: number | null
		capped: boolean
		cap: number | null
	}
}
