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
 * Live Comet tip utilization, per-second supply/borrow rates, base totals, and pause flags.
 * Schema projects utilization / APY only; totals + pause flags stay transport-side until APP enrollment.
 * @see https://docs.compound.finance/interest-rates/
 * @see https://docs.compound.finance/helper-functions/
 */
export type CompoundCometTipRates = {
	chainId: number
	cometAddress: `0x${string}`
	blockNumber: bigint
	utilization: string
	supplyRatePerSecond: string
	borrowRatePerSecond: string
	totalSupplyBase: string
	totalBorrowBase: string
	isSupplyPaused: boolean
	isTransferPaused: boolean
	isWithdrawPaused: boolean
	isAbsorbPaused: boolean
	isBuyPaused: boolean
}
