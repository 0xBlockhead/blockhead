export type PendleAccountPosition = {
	protocol: 'Pendle V2'
	chainId: number
	marketAddress: `0x${string}`
	marketName: string
	expiryTimestampMs: number
	ptAddress: `0x${string}`
	ytAddress: `0x${string}`
	syAddress: `0x${string}`
	underlyingAssetAddress: `0x${string}`
	balances: {
		kind: 'PT' | 'YT' | 'SY' | 'LP'
		address: `0x${string}`
		balance: string
	}[]
}

export type PendleAccountPositions = {
	blockNumber: bigint
	positions: PendleAccountPosition[]
}
