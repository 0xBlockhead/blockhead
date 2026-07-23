export type DydxDecimal = string

export type DydxIndexerObservation<_Value> = {
	value: _Value
	indexedAtHeight: string
	indexedAtTime: string
	resolvedAtMs: number
}

export type DydxIndexerHeight = {
	height: string
	time: string
}

export type DydxPerpetualMarket = {
	clobPairId: string
	ticker: string
	status:
		| 'ACTIVE'
		| 'PAUSED'
		| 'CANCEL_ONLY'
		| 'POST_ONLY'
		| 'INITIALIZING'
		| 'FINAL_SETTLEMENT'
	oraclePrice: DydxDecimal | null
	priceChange24H: DydxDecimal
	volume24H: DydxDecimal
	trades24H: number
	nextFundingRate: DydxDecimal
	initialMarginFraction: DydxDecimal
	maintenanceMarginFraction: DydxDecimal
	openInterest: DydxDecimal
	atomicResolution: number
	quantumConversionExponent: number
	tickSize: DydxDecimal
	stepSize: DydxDecimal
	stepBaseQuantums: number
	subticksPerTick: number
	marketType: 'CROSS' | 'ISOLATED'
	openInterestLowerCap: DydxDecimal | null
	openInterestUpperCap: DydxDecimal | null
	baseOpenInterest: DydxDecimal
	defaultFundingRate1H: DydxDecimal | null
}

export type DydxPerpetualMarkets = {
	markets: Record<string, DydxPerpetualMarket>
}

export type DydxPerpetualPosition = {
	market: string
	status: 'OPEN' | 'CLOSED' | 'LIQUIDATED'
	side: 'LONG' | 'SHORT'
	size: DydxDecimal
	maxSize: DydxDecimal
	entryPrice: DydxDecimal
	realizedPnl: DydxDecimal
	unrealizedPnl: DydxDecimal
	createdAt: string
	createdAtHeight: string
	closedAt: string | null
	exitPrice: DydxDecimal | null
	sumOpen: DydxDecimal
	sumClose: DydxDecimal
	netFunding: DydxDecimal
	subaccountNumber: number
}

export type DydxSubaccount = {
	address: string
	subaccountNumber: number
	equity: DydxDecimal
	freeCollateral: DydxDecimal
	openPerpetualPositions: Record<string, DydxPerpetualPosition>
	assetPositions: Record<string, {
		symbol: string
		side: 'LONG' | 'SHORT'
		size: DydxDecimal
		subaccountNumber: number
		assetId: string
	}>
	marginEnabled: boolean
	updatedAtHeight: string
	latestProcessedBlockHeight: string
}

export type DydxSubaccountResponse = {
	subaccount: DydxSubaccount
}

export type DydxOrder = {
	id: string
	subaccountId: string
	subaccountNumber: number
	clientId: string
	clientMetadata: string
	clobPairId: string
	ticker: string
	side: 'BUY' | 'SELL'
	type: string
	status: string
	timeInForce: 'GTT' | 'FOK' | 'IOC'
	orderFlags: string
	price: DydxDecimal
	size: DydxDecimal
	totalFilled: DydxDecimal
	postOnly: boolean
	reduceOnly: boolean
	createdAtHeight: string | null
	updatedAtHeight: string | null
	updatedAt: string | null
	goodTilBlock: string | null
	goodTilBlockTime: string | null
	triggerPrice: DydxDecimal | null
	feePpm?: DydxDecimal | null
}

export type DydxFill = {
	id: string
	orderId: string | null
	subaccountNumber: number
	side: 'BUY' | 'SELL'
	liquidity: 'MAKER' | 'TAKER'
	type:
		| 'LIMIT'
		| 'LIQUIDATED'
		| 'LIQUIDATION'
		| 'DELEVERAGED'
		| 'OFFSETTING'
	market: string
	marketType: 'PERPETUAL' | 'SPOT'
	price: DydxDecimal
	size: DydxDecimal
	fee: DydxDecimal
	affiliateRevShare: DydxDecimal
	createdAt: string
	createdAtHeight: string
	clientMetadata: string | null
	builderFee?: DydxDecimal | null
	orderRouterFee?: DydxDecimal | null
}

export type DydxFills = {
	fills: DydxFill[]
}

export type DydxPositions = {
	positions: DydxPerpetualPosition[]
}

export type DydxValidatorLatestBlock = {
	block: {
		header: {
			chain_id: string
			height: string
			time: string
		}
	}
}
