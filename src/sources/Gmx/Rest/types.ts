import { type as arktype } from 'arktype'

/** Wire row from GMX API `GET /markets/info` (fields consumed for a market snapshot). */
export type GmxMarketInfoWire = {
	name?: string
	marketTokenAddress?: string
	indexTokenAddress?: string
	longTokenAddress?: string
	shortTokenAddress?: string
	isSpotOnly?: boolean
	isDisabled?: boolean
	longInterestUsd?: string
	shortInterestUsd?: string
	longPoolAmount?: string
	shortPoolAmount?: string
	fundingFactorPerSecond?: string
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
	longInterestUsd: 'string',
	shortInterestUsd: 'string',
	longPoolAmount: 'string',
	shortPoolAmount: 'string',
	fundingFactorPerSecond: 'string',
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
