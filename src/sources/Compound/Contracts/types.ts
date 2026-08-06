export type CompoundCometAccountPosition = {
	protocol: 'Compound III'
	chainId: number
	marketSlug: string
	cometAddress: `0x${string}`
	baseToken: {
		symbol: string
		address: `0x${string}`
		suppliedBalance: string
		borrowedBalance: string
	}
	collateral: {
		symbol: string
		address: `0x${string}`
		balance: string
	}[]
}

export type CompoundAccountPositions = {
	blockNumber: bigint
	positions: CompoundCometAccountPosition[]
}
