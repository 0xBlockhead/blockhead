import { type as arktype } from 'arktype'

/**
 * Wire row from GMX API `GET /markets/info`.
 * Enrolled `GmxMarket` projections consume identity + interest/pool/funding scalars.
 * Broader borrowing / impact / pool-value / virtual-inventory surfaces stay transport-only.
 * @see https://docs.gmx.io/docs/api/integration-guide/
 */
export type GmxMarketInfoWire = {
	name?: string
	marketTokenAddress?: string
	indexTokenAddress?: string
	longTokenAddress?: string
	shortTokenAddress?: string
	isSpotOnly?: boolean
	isDisabled?: boolean
	isSameCollaterals?: boolean
	longsPayShorts?: boolean
	longInterestUsd?: string
	shortInterestUsd?: string
	longInterestInTokens?: string
	shortInterestInTokens?: string
	longPoolAmount?: string
	shortPoolAmount?: string
	fundingFactorPerSecond?: string
	borrowingFactorPerSecondForLongs?: string
	borrowingFactorPerSecondForShorts?: string
	poolValueMax?: string
	poolValueMin?: string
	totalBorrowingFees?: string
	virtualInventoryForPositions?: string
	virtualInventoryForPositionsInTokens?: string
	virtualPoolAmountForLongToken?: string
	virtualPoolAmountForShortToken?: string
	positionImpactFactorPositive?: string
	positionImpactFactorNegative?: string
	positionImpactPoolAmount?: string
	maxOpenInterestLong?: string
	maxOpenInterestShort?: string
	maxLongPoolAmount?: string
	maxShortPoolAmount?: string
	minCollateralFactor?: string
	swapImpactPoolAmountLong?: string
	swapImpactPoolAmountShort?: string
	data?: string
}

export type GmxMarketInfo = {
	chainId: number
	name: string
	marketTokenAddress: `0x${string}`
	indexTokenAddress: `0x${string}`
	longTokenAddress: `0x${string}`
	shortTokenAddress: `0x${string}`
	isSpotOnly: boolean
	isDisabled: boolean
	longInterestUsd: string
	shortInterestUsd: string
	longPoolAmount: string
	shortPoolAmount: string
	fundingFactorPerSecond: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	isSameCollaterals?: boolean
	/** Transport-only — not enrolled on `GmxMarket`. */
	longsPayShorts?: boolean
	/** Transport-only — not enrolled on `GmxMarket`. */
	longInterestInTokens?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	shortInterestInTokens?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	borrowingFactorPerSecondForLongs?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	borrowingFactorPerSecondForShorts?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	poolValueMax?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	poolValueMin?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	totalBorrowingFees?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	virtualInventoryForPositions?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	virtualInventoryForPositionsInTokens?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	virtualPoolAmountForLongToken?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	virtualPoolAmountForShortToken?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	positionImpactFactorPositive?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	positionImpactFactorNegative?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	positionImpactPoolAmount?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	maxOpenInterestLong?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	maxOpenInterestShort?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	maxLongPoolAmount?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	maxShortPoolAmount?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	minCollateralFactor?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	swapImpactPoolAmountLong?: string
	/** Transport-only — not enrolled on `GmxMarket`. */
	swapImpactPoolAmountShort?: string
}

/**
 * Wire row from GMX API `GET /positions` / `GET /positions/{key}` (`PositionResponse`).
 * @see https://docs.gmx.io/docs/api/gmx-api/get-positions-info/
 * @see https://docs.gmx.io/docs/api/gmx-api/get-position-by-key/
 * @see https://docs.gmx.io/docs/api/integration-guide/
 */
export type GmxPositionInfoWire = {
	key?: string
	contractKey?: string
	account?: string
	marketAddress?: string
	collateralTokenAddress?: string
	sizeInUsd?: string
	sizeInTokens?: string
	collateralAmount?: string
	pendingBorrowingFeesUsd?: string
	increasedAtTime?: string
	decreasedAtTime?: string
	isLong?: boolean
	fundingFeeAmount?: string
	claimableLongTokenAmount?: string
	claimableShortTokenAmount?: string
	pnl?: string
	positionFeeAmount?: string
	traderDiscountAmount?: string
	uiFeeAmount?: string
	pendingImpactAmount?: string
	positionValueInUsd?: string
	data?: string
	indexName?: string
	poolName?: string
	markPrice?: string
	entryPrice?: string
	liquidationPrice?: string
	collateralUsd?: string
	remainingCollateralUsd?: string
	remainingCollateralAmount?: string
	hasLowCollateral?: boolean
	leverage?: string
	leverageWithPnl?: string
	leverageWithoutPnl?: string
	pnlPercentage?: string
	pnlAfterFees?: string
	pnlAfterFeesPercentage?: string
	netValueAfterAllFees?: string
	pnlAfterAllFees?: string
	pnlAfterAllFeesPercentage?: string
	netValue?: string
	netPriceImapctDeltaUsd?: string
	priceImpactDiffUsd?: string
	pendingImpactUsd?: string
	closePriceImpactDeltaUsd?: string
	closingFeeUsd?: string
	uiFeeUsd?: string
	pendingFundingFeesUsd?: string
	pendingClaimableFundingFeesUsd?: string
}

export type GmxPositionInfo = {
	chainId: number
	key: string
	contractKey: `0x${string}`
	account: `0x${string}`
	marketAddress: `0x${string}`
	collateralTokenAddress: `0x${string}`
	sizeInUsd: string
	sizeInTokens: string
	collateralAmount: string
	pendingBorrowingFeesUsd: string
	increasedAtTime: string
	decreasedAtTime: string
	isLong: boolean
	fundingFeeAmount: string
	claimableLongTokenAmount: string
	claimableShortTokenAmount: string
	pnl: string
	positionFeeAmount: string
	traderDiscountAmount: string
	uiFeeAmount: string
	pendingImpactAmount: string
	positionValueInUsd: string
	indexName: string
	poolName: string
	markPrice: string
	entryPrice: string
	liquidationPrice: string
	collateralUsd: string
	remainingCollateralUsd: string
	remainingCollateralAmount: string
	hasLowCollateral: boolean
	leverage: string
	leverageWithPnl: string
	leverageWithoutPnl: string
	pnlPercentage: string
	pnlAfterFees: string
	pnlAfterFeesPercentage: string
	netValueAfterAllFees: string
	pnlAfterAllFees: string
	pnlAfterAllFeesPercentage: string
	netValue: string
	netPriceImapctDeltaUsd: string
	priceImpactDiffUsd: string
	pendingImpactUsd: string
	closePriceImpactDeltaUsd: string
	closingFeeUsd: string
	uiFeeUsd: string
	pendingFundingFeesUsd: string
	pendingClaimableFundingFeesUsd: string
}

export const gmxMarketInfoEnvelope = arktype({
	name: 'string',
	marketTokenAddress: 'string',
	indexTokenAddress: 'string',
	longTokenAddress: 'string',
	shortTokenAddress: 'string',
	isSpotOnly: 'boolean',
	isDisabled: 'boolean',
	'isSameCollaterals?': 'boolean',
	'longsPayShorts?': 'boolean',
	longInterestUsd: 'string',
	shortInterestUsd: 'string',
	'longInterestInTokens?': 'string',
	'shortInterestInTokens?': 'string',
	longPoolAmount: 'string',
	shortPoolAmount: 'string',
	fundingFactorPerSecond: 'string',
	'borrowingFactorPerSecondForLongs?': 'string',
	'borrowingFactorPerSecondForShorts?': 'string',
	'poolValueMax?': 'string',
	'poolValueMin?': 'string',
	'totalBorrowingFees?': 'string',
	'virtualInventoryForPositions?': 'string',
	'virtualInventoryForPositionsInTokens?': 'string',
	'virtualPoolAmountForLongToken?': 'string',
	'virtualPoolAmountForShortToken?': 'string',
	'positionImpactFactorPositive?': 'string',
	'positionImpactFactorNegative?': 'string',
	'positionImpactPoolAmount?': 'string',
	'maxOpenInterestLong?': 'string',
	'maxOpenInterestShort?': 'string',
	'maxLongPoolAmount?': 'string',
	'maxShortPoolAmount?': 'string',
	'minCollateralFactor?': 'string',
	'swapImpactPoolAmountLong?': 'string',
	'swapImpactPoolAmountShort?': 'string',
	'data?': 'string',
})

export const gmxMarketsInfoEnvelope = gmxMarketInfoEnvelope.array()

export const gmxPositionInfoEnvelope = arktype({
	key: 'string',
	contractKey: 'string',
	account: 'string',
	marketAddress: 'string',
	collateralTokenAddress: 'string',
	sizeInUsd: 'string',
	sizeInTokens: 'string',
	collateralAmount: 'string',
	pendingBorrowingFeesUsd: 'string',
	increasedAtTime: 'string',
	decreasedAtTime: 'string',
	isLong: 'boolean',
	fundingFeeAmount: 'string',
	claimableLongTokenAmount: 'string',
	claimableShortTokenAmount: 'string',
	pnl: 'string',
	positionFeeAmount: 'string',
	traderDiscountAmount: 'string',
	uiFeeAmount: 'string',
	pendingImpactAmount: 'string',
	positionValueInUsd: 'string',
	'data?': 'string',
	indexName: 'string',
	poolName: 'string',
	markPrice: 'string',
	entryPrice: 'string',
	liquidationPrice: 'string',
	collateralUsd: 'string',
	remainingCollateralUsd: 'string',
	remainingCollateralAmount: 'string',
	hasLowCollateral: 'boolean',
	leverage: 'string',
	leverageWithPnl: 'string',
	leverageWithoutPnl: 'string',
	pnlPercentage: 'string',
	pnlAfterFees: 'string',
	pnlAfterFeesPercentage: 'string',
	netValueAfterAllFees: 'string',
	pnlAfterAllFees: 'string',
	pnlAfterAllFeesPercentage: 'string',
	netValue: 'string',
	netPriceImapctDeltaUsd: 'string',
	priceImpactDiffUsd: 'string',
	pendingImpactUsd: 'string',
	closePriceImpactDeltaUsd: 'string',
	closingFeeUsd: 'string',
	uiFeeUsd: 'string',
	pendingFundingFeesUsd: 'string',
	pendingClaimableFundingFeesUsd: 'string',
})

export const gmxPositionsInfoEnvelope = gmxPositionInfoEnvelope.array()
