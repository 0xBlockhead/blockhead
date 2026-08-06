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

/**
 * Live Comet tip utilization + per-second supply/borrow rates (raw uint64/uint256 words).
 * Schema APY projection still requires APP enrollment on `CompoundComet`.
 * @see https://docs.compound.finance/interest-rates/
 */
export type CompoundCometTipRates = {
	chainId: number
	cometAddress: `0x${string}`
	blockNumber: bigint
	utilization: string
	supplyRatePerSecond: string
	borrowRatePerSecond: string
}
