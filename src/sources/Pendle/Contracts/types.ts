export type PendleAccountPosition = {
	protocol: 'Pendle V2'
	chainId: number
	marketAddress: `0x${string}`
	marketName: string
	expiryTimestampMs: number
	balances: {
		kind: 'PT' | 'YT' | 'LP'
		address: `0x${string}`
		balance: string
	}[]
}

export type PendleAccountPositions = {
	blockNumber: bigint
	positions: PendleAccountPosition[]
}
