/**
 * GMX API REST named operations.
 * @see https://docs.gmx.io/docs/api/integration-guide/
 * @see https://docs.gmx.io/docs/api/overview/
 * @see https://docs.gmx.io/docs/api/gmx-api/get-positions-info/
 * @see https://docs.gmx.io/docs/api/gmx-api/get-position-by-key/
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	gmxApiByChainId,
	gmxMarketsInfoResponseMax,
	gmxPositionsInfoResponseMax,
	gmxRestBindingByChainId,
} from '$/sources/Gmx/Rest/constants.ts'
import type {
	GmxMarketInfo,
	GmxMarketInfoWire,
	GmxPositionInfo,
	GmxPositionInfoWire,
} from '$/sources/Gmx/Rest/types.ts'
import {
	gmxMarketsInfoEnvelope,
	gmxPositionInfoEnvelope,
	gmxPositionsInfoEnvelope,
} from '$/sources/Gmx/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.Gmx_Rest}: invalid ${label} response envelope`)
	}
}

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Gmx_Rest}: invalid chain id ${String(chainId)}`)
	if (gmxApiByChainId[chainId] == null || gmxRestBindingByChainId[chainId] == null)
		throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)
}

const assertAddress = (
	value: string | undefined,
	label: string,
	scope: 'market' | 'position' | 'request' = 'request'
) => {
	if (value == null || value.length < 1)
		throw new Error(
			scope === 'request' ?
				`${Source.Gmx_Rest}: missing ${label}`
			:
				`${Source.Gmx_Rest}: ${scope} missing ${label}`
		)

	const normalized = hexLowerOfByteSize(value, 20)
	if (normalized == null)
		throw new Error(`${Source.Gmx_Rest}: invalid ${label} ${value}`)
	return normalized
}

const assertBytes32 = (
	value: string | undefined,
	label: string,
	scope: 'position' | 'request' = 'request'
) => {
	if (value == null || value.length < 1)
		throw new Error(
			scope === 'request' ?
				`${Source.Gmx_Rest}: missing ${label}`
			:
				`${Source.Gmx_Rest}: ${scope} missing ${label}`
		)

	const normalized = hexLowerOfByteSize(value, 32)
	if (normalized == null)
		throw new Error(`${Source.Gmx_Rest}: invalid ${label} ${value}`)
	return normalized
}

const assertNonEmptyString = (
	value: string | undefined,
	label: string,
	scope: 'market' | 'position'
) => {
	if (value == null || value.length < 1)
		throw new Error(`${Source.Gmx_Rest}: ${scope} missing ${label}`)
	return value
}

const assertNonEmptyDecimalString = (
	value: string | undefined,
	label: string,
	scope: 'market' | 'position'
) => {
	if (value == null || value.length < 1 || !/^(?:0|[1-9]\d*)$/.test(value))
		throw new Error(`${Source.Gmx_Rest}: ${scope} missing ${label}`)
	return value
}

const assertSignedDecimalString = (
	value: string | undefined,
	label: string,
	scope: 'position'
) => {
	if (value == null || value.length < 1 || !/^-?(?:0|[1-9]\d*)$/.test(value))
		throw new Error(`${Source.Gmx_Rest}: ${scope} missing ${label}`)
	return value
}

const assertBoolean = (
	value: boolean | undefined,
	label: string,
	scope: 'market' | 'position'
) => {
	if (value !== true && value !== false)
		throw new Error(`${Source.Gmx_Rest}: ${scope} missing ${label}`)
	return value
}

const optionalNonEmptyDecimalString = (
	value: string | undefined
) => (
	value != null && value.length > 0 && /^(?:0|[1-9]\d*)$/.test(value) ?
		value
	:
		undefined
)

const optionalSignedDecimalString = (
	value: string | undefined
) => (
	value != null && value.length > 0 && /^-?(?:0|[1-9]\d*)$/.test(value) ?
		value
	:
		undefined
)

const assertMarketInfoWire = (
	wire: GmxMarketInfoWire,
	chainId: number
): GmxMarketInfo => {
	if (wire.name == null || wire.name.length < 1)
		throw new Error(`${Source.Gmx_Rest}: market missing name`)

	const longInterestInTokens = optionalNonEmptyDecimalString(wire.longInterestInTokens)
	const shortInterestInTokens = optionalNonEmptyDecimalString(wire.shortInterestInTokens)
	const borrowingFactorPerSecondForLongs = optionalNonEmptyDecimalString(wire.borrowingFactorPerSecondForLongs)
	const borrowingFactorPerSecondForShorts = optionalNonEmptyDecimalString(wire.borrowingFactorPerSecondForShorts)
	const poolValueMax = optionalNonEmptyDecimalString(wire.poolValueMax)
	const poolValueMin = optionalNonEmptyDecimalString(wire.poolValueMin)
	const totalBorrowingFees = optionalNonEmptyDecimalString(wire.totalBorrowingFees)
	const virtualInventoryForPositions = optionalSignedDecimalString(wire.virtualInventoryForPositions)
	const virtualInventoryForPositionsInTokens = optionalSignedDecimalString(wire.virtualInventoryForPositionsInTokens)
	const virtualPoolAmountForLongToken = optionalNonEmptyDecimalString(wire.virtualPoolAmountForLongToken)
	const virtualPoolAmountForShortToken = optionalNonEmptyDecimalString(wire.virtualPoolAmountForShortToken)
	const positionImpactFactorPositive = optionalNonEmptyDecimalString(wire.positionImpactFactorPositive)
	const positionImpactFactorNegative = optionalNonEmptyDecimalString(wire.positionImpactFactorNegative)
	const positionImpactPoolAmount = optionalNonEmptyDecimalString(wire.positionImpactPoolAmount)
	const maxOpenInterestLong = optionalNonEmptyDecimalString(wire.maxOpenInterestLong)
	const maxOpenInterestShort = optionalNonEmptyDecimalString(wire.maxOpenInterestShort)
	const maxLongPoolAmount = optionalNonEmptyDecimalString(wire.maxLongPoolAmount)
	const maxShortPoolAmount = optionalNonEmptyDecimalString(wire.maxShortPoolAmount)
	const minCollateralFactor = optionalNonEmptyDecimalString(wire.minCollateralFactor)
	const swapImpactPoolAmountLong = optionalNonEmptyDecimalString(wire.swapImpactPoolAmountLong)
	const swapImpactPoolAmountShort = optionalNonEmptyDecimalString(wire.swapImpactPoolAmountShort)
	const maxCollateralSumLongTokenLong = optionalNonEmptyDecimalString(wire.maxCollateralSumLongTokenLong)
	const maxCollateralSumLongTokenShort = optionalNonEmptyDecimalString(wire.maxCollateralSumLongTokenShort)
	const maxCollateralSumShortTokenLong = optionalNonEmptyDecimalString(wire.maxCollateralSumShortTokenLong)
	const maxCollateralSumShortTokenShort = optionalNonEmptyDecimalString(wire.maxCollateralSumShortTokenShort)
	const minFundingIncreaseRatePerSecond = optionalNonEmptyDecimalString(wire.minFundingIncreaseRatePerSecond)
	const minFundingFactorPerSecondLong = optionalNonEmptyDecimalString(wire.minFundingFactorPerSecondLong)
	const minFundingFactorPerSecondShort = optionalNonEmptyDecimalString(wire.minFundingFactorPerSecondShort)
	const maxFundingFactorPerSecondLong = optionalNonEmptyDecimalString(wire.maxFundingFactorPerSecondLong)
	const maxFundingFactorPerSecondShort = optionalNonEmptyDecimalString(wire.maxFundingFactorPerSecondShort)
	const fundingIncreaseFactorPerSecond = optionalNonEmptyDecimalString(wire.fundingIncreaseFactorPerSecond)
	const fundingDecreaseFactorPerSecond = optionalNonEmptyDecimalString(wire.fundingDecreaseFactorPerSecond)
	const minCollateralFactorForLiquidation = optionalNonEmptyDecimalString(wire.minCollateralFactorForLiquidation)
	const reserveFactorLong = optionalNonEmptyDecimalString(wire.reserveFactorLong)
	const reserveFactorShort = optionalNonEmptyDecimalString(wire.reserveFactorShort)
	const virtualIndexTokenId = (
		wire.virtualIndexTokenId != null && wire.virtualIndexTokenId.length > 0 ?
			wire.virtualIndexTokenId
		:
			undefined
	)
	const virtualMarketId = (
		wire.virtualMarketId != null && wire.virtualMarketId.length > 0 ?
			wire.virtualMarketId
		:
			undefined
	)
	const virtualLongTokenId = (
		wire.virtualLongTokenId != null && wire.virtualLongTokenId.length > 0 ?
			wire.virtualLongTokenId
		:
			undefined
	)
	const virtualShortTokenId = (
		wire.virtualShortTokenId != null && wire.virtualShortTokenId.length > 0 ?
			wire.virtualShortTokenId
		:
			undefined
	)
	const maxLongPoolUsdForDeposit = optionalNonEmptyDecimalString(wire.maxLongPoolUsdForDeposit)
	const maxShortPoolUsdForDeposit = optionalNonEmptyDecimalString(wire.maxShortPoolUsdForDeposit)
	const openInterestReserveFactorLong = optionalNonEmptyDecimalString(wire.openInterestReserveFactorLong)
	const openInterestReserveFactorShort = optionalNonEmptyDecimalString(wire.openInterestReserveFactorShort)
	const fundingFactor = optionalNonEmptyDecimalString(wire.fundingFactor)
	const fundingExponentFactor = optionalNonEmptyDecimalString(wire.fundingExponentFactor)
	const minFundingFactorPerSecond = optionalNonEmptyDecimalString(wire.minFundingFactorPerSecond)
	const maxFundingFactorPerSecond = optionalNonEmptyDecimalString(wire.maxFundingFactorPerSecond)
	const thresholdForDecreaseFunding = optionalNonEmptyDecimalString(wire.thresholdForDecreaseFunding)
	const thresholdForStableFunding = optionalNonEmptyDecimalString(wire.thresholdForStableFunding)
	const borrowingFactorLong = optionalNonEmptyDecimalString(wire.borrowingFactorLong)
	const borrowingFactorShort = optionalNonEmptyDecimalString(wire.borrowingFactorShort)
	const borrowingExponentFactorLong = optionalNonEmptyDecimalString(wire.borrowingExponentFactorLong)
	const borrowingExponentFactorShort = optionalNonEmptyDecimalString(wire.borrowingExponentFactorShort)
	const maxPnlFactorForTradersLong = optionalNonEmptyDecimalString(wire.maxPnlFactorForTradersLong)
	const maxPnlFactorForTradersShort = optionalNonEmptyDecimalString(wire.maxPnlFactorForTradersShort)
	const minCollateralFactorForOpenInterestLong = optionalNonEmptyDecimalString(wire.minCollateralFactorForOpenInterestLong)
	const minCollateralFactorForOpenInterestShort = optionalNonEmptyDecimalString(wire.minCollateralFactorForOpenInterestShort)
	const swapFeeFactorForBalanceWasImproved = optionalNonEmptyDecimalString(wire.swapFeeFactorForBalanceWasImproved)
	const swapFeeFactorForBalanceWasNotImproved = optionalNonEmptyDecimalString(wire.swapFeeFactorForBalanceWasNotImproved)
	const atomicSwapFeeFactor = optionalNonEmptyDecimalString(wire.atomicSwapFeeFactor)
	const swapImpactFactorPositive = optionalNonEmptyDecimalString(wire.swapImpactFactorPositive)
	const swapImpactFactorNegative = optionalNonEmptyDecimalString(wire.swapImpactFactorNegative)
	const swapImpactExponentFactor = optionalNonEmptyDecimalString(wire.swapImpactExponentFactor)
	const positionFeeFactorForBalanceWasImproved = optionalNonEmptyDecimalString(wire.positionFeeFactorForBalanceWasImproved)
	const positionFeeFactorForBalanceWasNotImproved = optionalNonEmptyDecimalString(wire.positionFeeFactorForBalanceWasNotImproved)
	const maxPositionImpactFactorPositive = optionalNonEmptyDecimalString(wire.maxPositionImpactFactorPositive)
	const maxPositionImpactFactorNegative = optionalNonEmptyDecimalString(wire.maxPositionImpactFactorNegative)
	const maxPositionImpactFactorForLiquidations = optionalNonEmptyDecimalString(wire.maxPositionImpactFactorForLiquidations)
	const positionImpactExponentFactorPositive = optionalNonEmptyDecimalString(wire.positionImpactExponentFactorPositive)
	const positionImpactExponentFactorNegative = optionalNonEmptyDecimalString(wire.positionImpactExponentFactorNegative)
	const lentPositionImpactPoolAmount = optionalNonEmptyDecimalString(wire.lentPositionImpactPoolAmount)
	const maxLendableImpactUsd = optionalNonEmptyDecimalString(wire.maxLendableImpactUsd)
	const maxLendableImpactFactor = optionalNonEmptyDecimalString(wire.maxLendableImpactFactor)
	const maxLendableImpactFactorForWithdrawals = optionalNonEmptyDecimalString(wire.maxLendableImpactFactorForWithdrawals)
	const positionImpactPoolDistributionRate = optionalNonEmptyDecimalString(wire.positionImpactPoolDistributionRate)
	const minPositionImpactPoolAmount = optionalNonEmptyDecimalString(wire.minPositionImpactPoolAmount)

	return {
		chainId,
		name: wire.name,
		marketTokenAddress: assertAddress(wire.marketTokenAddress, 'market token', 'market'),
		indexTokenAddress: assertAddress(wire.indexTokenAddress, 'index token', 'market'),
		longTokenAddress: assertAddress(wire.longTokenAddress, 'long token', 'market'),
		shortTokenAddress: assertAddress(wire.shortTokenAddress, 'short token', 'market'),
		isSpotOnly: assertBoolean(wire.isSpotOnly, 'isSpotOnly', 'market'),
		isDisabled: assertBoolean(wire.isDisabled, 'isDisabled', 'market'),
		longInterestUsd: assertNonEmptyDecimalString(wire.longInterestUsd, 'longInterestUsd', 'market'),
		shortInterestUsd: assertNonEmptyDecimalString(wire.shortInterestUsd, 'shortInterestUsd', 'market'),
		longPoolAmount: assertNonEmptyDecimalString(wire.longPoolAmount, 'longPoolAmount', 'market'),
		shortPoolAmount: assertNonEmptyDecimalString(wire.shortPoolAmount, 'shortPoolAmount', 'market'),
		fundingFactorPerSecond: assertNonEmptyDecimalString(wire.fundingFactorPerSecond, 'fundingFactorPerSecond', 'market'),
		...(wire.isSameCollaterals === true || wire.isSameCollaterals === false) && {
			isSameCollaterals: wire.isSameCollaterals,
		},
		...(wire.longsPayShorts === true || wire.longsPayShorts === false) && {
			longsPayShorts: wire.longsPayShorts,
		},
		...(longInterestInTokens != null && {
			longInterestInTokens,
		}),
		...(shortInterestInTokens != null && {
			shortInterestInTokens,
		}),
		...(borrowingFactorPerSecondForLongs != null && {
			borrowingFactorPerSecondForLongs,
		}),
		...(borrowingFactorPerSecondForShorts != null && {
			borrowingFactorPerSecondForShorts,
		}),
		...(poolValueMax != null && {
			poolValueMax,
		}),
		...(poolValueMin != null && {
			poolValueMin,
		}),
		...(totalBorrowingFees != null && {
			totalBorrowingFees,
		}),
		...(virtualInventoryForPositions != null && {
			virtualInventoryForPositions,
		}),
		...(virtualInventoryForPositionsInTokens != null && {
			virtualInventoryForPositionsInTokens,
		}),
		...(virtualPoolAmountForLongToken != null && {
			virtualPoolAmountForLongToken,
		}),
		...(virtualPoolAmountForShortToken != null && {
			virtualPoolAmountForShortToken,
		}),
		...(positionImpactFactorPositive != null && {
			positionImpactFactorPositive,
		}),
		...(positionImpactFactorNegative != null && {
			positionImpactFactorNegative,
		}),
		...(positionImpactPoolAmount != null && {
			positionImpactPoolAmount,
		}),
		...(maxOpenInterestLong != null && {
			maxOpenInterestLong,
		}),
		...(maxOpenInterestShort != null && {
			maxOpenInterestShort,
		}),
		...(maxLongPoolAmount != null && {
			maxLongPoolAmount,
		}),
		...(maxShortPoolAmount != null && {
			maxShortPoolAmount,
		}),
		...(minCollateralFactor != null && {
			minCollateralFactor,
		}),
		...(swapImpactPoolAmountLong != null && {
			swapImpactPoolAmountLong,
		}),
		...(swapImpactPoolAmountShort != null && {
			swapImpactPoolAmountShort,
		}),
		...(maxCollateralSumLongTokenLong != null && {
			maxCollateralSumLongTokenLong,
		}),
		...(maxCollateralSumLongTokenShort != null && {
			maxCollateralSumLongTokenShort,
		}),
		...(maxCollateralSumShortTokenLong != null && {
			maxCollateralSumShortTokenLong,
		}),
		...(maxCollateralSumShortTokenShort != null && {
			maxCollateralSumShortTokenShort,
		}),
		...(minFundingIncreaseRatePerSecond != null && {
			minFundingIncreaseRatePerSecond,
		}),
		...(minFundingFactorPerSecondLong != null && {
			minFundingFactorPerSecondLong,
		}),
		...(minFundingFactorPerSecondShort != null && {
			minFundingFactorPerSecondShort,
		}),
		...(maxFundingFactorPerSecondLong != null && {
			maxFundingFactorPerSecondLong,
		}),
		...(maxFundingFactorPerSecondShort != null && {
			maxFundingFactorPerSecondShort,
		}),
		...(fundingIncreaseFactorPerSecond != null && {
			fundingIncreaseFactorPerSecond,
		}),
		...(fundingDecreaseFactorPerSecond != null && {
			fundingDecreaseFactorPerSecond,
		}),
		...(minCollateralFactorForLiquidation != null && {
			minCollateralFactorForLiquidation,
		}),
		...(reserveFactorLong != null && {
			reserveFactorLong,
		}),
		...(reserveFactorShort != null && {
			reserveFactorShort,
		}),
		...(virtualIndexTokenId != null && {
			virtualIndexTokenId,
		}),
		...(virtualMarketId != null && {
			virtualMarketId,
		}),
		...(virtualLongTokenId != null && {
			virtualLongTokenId,
		}),
		...(virtualShortTokenId != null && {
			virtualShortTokenId,
		}),
		...(maxLongPoolUsdForDeposit != null && {
			maxLongPoolUsdForDeposit,
		}),
		...(maxShortPoolUsdForDeposit != null && {
			maxShortPoolUsdForDeposit,
		}),
		...(openInterestReserveFactorLong != null && {
			openInterestReserveFactorLong,
		}),
		...(openInterestReserveFactorShort != null && {
			openInterestReserveFactorShort,
		}),
		...(fundingFactor != null && {
			fundingFactor,
		}),
		...(fundingExponentFactor != null && {
			fundingExponentFactor,
		}),
		...(minFundingFactorPerSecond != null && {
			minFundingFactorPerSecond,
		}),
		...(maxFundingFactorPerSecond != null && {
			maxFundingFactorPerSecond,
		}),
		...(thresholdForDecreaseFunding != null && {
			thresholdForDecreaseFunding,
		}),
		...(thresholdForStableFunding != null && {
			thresholdForStableFunding,
		}),
		...(borrowingFactorLong != null && {
			borrowingFactorLong,
		}),
		...(borrowingFactorShort != null && {
			borrowingFactorShort,
		}),
		...(borrowingExponentFactorLong != null && {
			borrowingExponentFactorLong,
		}),
		...(borrowingExponentFactorShort != null && {
			borrowingExponentFactorShort,
		}),
		...(maxPnlFactorForTradersLong != null && {
			maxPnlFactorForTradersLong,
		}),
		...(maxPnlFactorForTradersShort != null && {
			maxPnlFactorForTradersShort,
		}),
		...(minCollateralFactorForOpenInterestLong != null && {
			minCollateralFactorForOpenInterestLong,
		}),
		...(minCollateralFactorForOpenInterestShort != null && {
			minCollateralFactorForOpenInterestShort,
		}),
		...(swapFeeFactorForBalanceWasImproved != null && {
			swapFeeFactorForBalanceWasImproved,
		}),
		...(swapFeeFactorForBalanceWasNotImproved != null && {
			swapFeeFactorForBalanceWasNotImproved,
		}),
		...(atomicSwapFeeFactor != null && {
			atomicSwapFeeFactor,
		}),
		...(swapImpactFactorPositive != null && {
			swapImpactFactorPositive,
		}),
		...(swapImpactFactorNegative != null && {
			swapImpactFactorNegative,
		}),
		...(swapImpactExponentFactor != null && {
			swapImpactExponentFactor,
		}),
		...(positionFeeFactorForBalanceWasImproved != null && {
			positionFeeFactorForBalanceWasImproved,
		}),
		...(positionFeeFactorForBalanceWasNotImproved != null && {
			positionFeeFactorForBalanceWasNotImproved,
		}),
		...(maxPositionImpactFactorPositive != null && {
			maxPositionImpactFactorPositive,
		}),
		...(maxPositionImpactFactorNegative != null && {
			maxPositionImpactFactorNegative,
		}),
		...(maxPositionImpactFactorForLiquidations != null && {
			maxPositionImpactFactorForLiquidations,
		}),
		...(positionImpactExponentFactorPositive != null && {
			positionImpactExponentFactorPositive,
		}),
		...(positionImpactExponentFactorNegative != null && {
			positionImpactExponentFactorNegative,
		}),
		...(lentPositionImpactPoolAmount != null && {
			lentPositionImpactPoolAmount,
		}),
		...(maxLendableImpactUsd != null && {
			maxLendableImpactUsd,
		}),
		...(maxLendableImpactFactor != null && {
			maxLendableImpactFactor,
		}),
		...(maxLendableImpactFactorForWithdrawals != null && {
			maxLendableImpactFactorForWithdrawals,
		}),
		...(positionImpactPoolDistributionRate != null && {
			positionImpactPoolDistributionRate,
		}),
		...(minPositionImpactPoolAmount != null && {
			minPositionImpactPoolAmount,
		}),
		...(wire.useOpenInterestInTokensForBalance === true || wire.useOpenInterestInTokensForBalance === false) && {
			useOpenInterestInTokensForBalance: wire.useOpenInterestInTokensForBalance,
		},
	}
}

const assertPositionInfoWire = (
	wire: GmxPositionInfoWire,
	chainId: number
): GmxPositionInfo => ({
	chainId,
	key: assertNonEmptyString(wire.key, 'key', 'position'),
	contractKey: assertBytes32(wire.contractKey, 'contractKey', 'position'),
	account: assertAddress(wire.account, 'account', 'position'),
	marketAddress: assertAddress(wire.marketAddress, 'marketAddress', 'position'),
	collateralTokenAddress: assertAddress(wire.collateralTokenAddress, 'collateralTokenAddress', 'position'),
	sizeInUsd: assertNonEmptyDecimalString(wire.sizeInUsd, 'sizeInUsd', 'position'),
	sizeInTokens: assertNonEmptyDecimalString(wire.sizeInTokens, 'sizeInTokens', 'position'),
	collateralAmount: assertNonEmptyDecimalString(wire.collateralAmount, 'collateralAmount', 'position'),
	pendingBorrowingFeesUsd: assertNonEmptyDecimalString(wire.pendingBorrowingFeesUsd, 'pendingBorrowingFeesUsd', 'position'),
	increasedAtTime: assertNonEmptyDecimalString(wire.increasedAtTime, 'increasedAtTime', 'position'),
	decreasedAtTime: assertNonEmptyDecimalString(wire.decreasedAtTime, 'decreasedAtTime', 'position'),
	isLong: assertBoolean(wire.isLong, 'isLong', 'position'),
	fundingFeeAmount: assertNonEmptyDecimalString(wire.fundingFeeAmount, 'fundingFeeAmount', 'position'),
	claimableLongTokenAmount: assertNonEmptyDecimalString(wire.claimableLongTokenAmount, 'claimableLongTokenAmount', 'position'),
	claimableShortTokenAmount: assertNonEmptyDecimalString(wire.claimableShortTokenAmount, 'claimableShortTokenAmount', 'position'),
	pnl: assertSignedDecimalString(wire.pnl, 'pnl', 'position'),
	positionFeeAmount: assertNonEmptyDecimalString(wire.positionFeeAmount, 'positionFeeAmount', 'position'),
	traderDiscountAmount: assertNonEmptyDecimalString(wire.traderDiscountAmount, 'traderDiscountAmount', 'position'),
	uiFeeAmount: assertNonEmptyDecimalString(wire.uiFeeAmount, 'uiFeeAmount', 'position'),
	pendingImpactAmount: assertSignedDecimalString(wire.pendingImpactAmount, 'pendingImpactAmount', 'position'),
	positionValueInUsd: assertNonEmptyDecimalString(wire.positionValueInUsd, 'positionValueInUsd', 'position'),
	indexName: assertNonEmptyString(wire.indexName, 'indexName', 'position'),
	poolName: assertNonEmptyString(wire.poolName, 'poolName', 'position'),
	markPrice: assertNonEmptyDecimalString(wire.markPrice, 'markPrice', 'position'),
	entryPrice: assertNonEmptyDecimalString(wire.entryPrice, 'entryPrice', 'position'),
	liquidationPrice: assertNonEmptyDecimalString(wire.liquidationPrice, 'liquidationPrice', 'position'),
	collateralUsd: assertNonEmptyDecimalString(wire.collateralUsd, 'collateralUsd', 'position'),
	remainingCollateralUsd: assertNonEmptyDecimalString(wire.remainingCollateralUsd, 'remainingCollateralUsd', 'position'),
	remainingCollateralAmount: assertNonEmptyDecimalString(wire.remainingCollateralAmount, 'remainingCollateralAmount', 'position'),
	hasLowCollateral: assertBoolean(wire.hasLowCollateral, 'hasLowCollateral', 'position'),
	leverage: assertNonEmptyDecimalString(wire.leverage, 'leverage', 'position'),
	leverageWithPnl: assertNonEmptyDecimalString(wire.leverageWithPnl, 'leverageWithPnl', 'position'),
	leverageWithoutPnl: assertNonEmptyDecimalString(wire.leverageWithoutPnl, 'leverageWithoutPnl', 'position'),
	pnlPercentage: assertSignedDecimalString(wire.pnlPercentage, 'pnlPercentage', 'position'),
	pnlAfterFees: assertSignedDecimalString(wire.pnlAfterFees, 'pnlAfterFees', 'position'),
	pnlAfterFeesPercentage: assertSignedDecimalString(wire.pnlAfterFeesPercentage, 'pnlAfterFeesPercentage', 'position'),
	netValueAfterAllFees: assertNonEmptyDecimalString(wire.netValueAfterAllFees, 'netValueAfterAllFees', 'position'),
	pnlAfterAllFees: assertSignedDecimalString(wire.pnlAfterAllFees, 'pnlAfterAllFees', 'position'),
	pnlAfterAllFeesPercentage: assertSignedDecimalString(wire.pnlAfterAllFeesPercentage, 'pnlAfterAllFeesPercentage', 'position'),
	netValue: assertNonEmptyDecimalString(wire.netValue, 'netValue', 'position'),
	netPriceImapctDeltaUsd: assertSignedDecimalString(wire.netPriceImapctDeltaUsd, 'netPriceImapctDeltaUsd', 'position'),
	priceImpactDiffUsd: assertSignedDecimalString(wire.priceImpactDiffUsd, 'priceImpactDiffUsd', 'position'),
	pendingImpactUsd: assertSignedDecimalString(wire.pendingImpactUsd, 'pendingImpactUsd', 'position'),
	closePriceImpactDeltaUsd: assertSignedDecimalString(wire.closePriceImpactDeltaUsd, 'closePriceImpactDeltaUsd', 'position'),
	closingFeeUsd: assertNonEmptyDecimalString(wire.closingFeeUsd, 'closingFeeUsd', 'position'),
	uiFeeUsd: assertNonEmptyDecimalString(wire.uiFeeUsd, 'uiFeeUsd', 'position'),
	pendingFundingFeesUsd: assertNonEmptyDecimalString(wire.pendingFundingFeesUsd, 'pendingFundingFeesUsd', 'position'),
	pendingClaimableFundingFeesUsd: assertNonEmptyDecimalString(wire.pendingClaimableFundingFeesUsd, 'pendingClaimableFundingFeesUsd', 'position'),
})
/** Composite market snapshots from official `GET /markets/info`. */
export const getMarketsInfo = async ({
	chainId,
}: {
	chainId: number
}) => {
	assertChainId(chainId)
	const binding = gmxRestBindingByChainId[chainId]
	if (binding == null)
		throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)

	const response = await sourceGetJson<GmxMarketInfoWire[]>(
		binding,
		httpUrl(binding, '/markets/info')
	)
	const wires = assertEnvelope('markets/info', gmxMarketsInfoEnvelope, response)
	if (wires.length > gmxMarketsInfoResponseMax)
		throw new Error(`${Source.Gmx_Rest}: markets/info response exceeds ${String(gmxMarketsInfoResponseMax)} markets`)

	const markets = wires.map((wire) => (
		assertMarketInfoWire(wire, chainId)
	))
	if (new Set(markets.map((market) => market.marketTokenAddress)).size !== markets.length)
		throw new Error(`${Source.Gmx_Rest}: markets/info response contains duplicate market tokens`)

	return markets
}

/**
 * Account open-position snapshots from official `GET /positions`.
 * Path key for detail is `contractKey` (bytes32), not the composite `key`.
 */
export const getPositionsInfo = async ({
	chainId,
	address,
	includeRelatedOrders,
}: {
	chainId: number
	address: string
	includeRelatedOrders?: boolean
}) => {
	assertChainId(chainId)
	const binding = gmxRestBindingByChainId[chainId]
	if (binding == null)
		throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)

	const account = assertAddress(address, 'account')
	const response = await sourceGetJson<GmxPositionInfoWire[]>(
		binding,
		httpUrl(binding, '/positions', {
			address: account,
			includeRelatedOrders,
		})
	)
	const wires = assertEnvelope('positions', gmxPositionsInfoEnvelope, response)
	if (wires.length > gmxPositionsInfoResponseMax)
		throw new Error(`${Source.Gmx_Rest}: positions response exceeds ${String(gmxPositionsInfoResponseMax)} positions`)

	const positions = wires.map((wire) => (
		assertPositionInfoWire(wire, chainId)
	))
	for (const position of positions)
		if (position.account !== account)
			throw new Error(`${Source.Gmx_Rest}: positions response account mismatch`)

	if (new Set(positions.map((position) => position.contractKey)).size !== positions.length)
		throw new Error(`${Source.Gmx_Rest}: positions response contains duplicate contract keys`)

	return positions
}

/** Single position snapshot from official `GET /positions/{contractKey}`. */
export const getPositionByKey = async ({
	chainId,
	contractKey,
	includeRelatedOrders,
}: {
	chainId: number
	contractKey: string
	includeRelatedOrders?: boolean
}) => {
	assertChainId(chainId)
	const binding = gmxRestBindingByChainId[chainId]
	if (binding == null)
		throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)

	const normalizedContractKey = assertBytes32(contractKey, 'contractKey')
	const response = await sourceGetJson<GmxPositionInfoWire>(
		binding,
		httpUrl(binding, `/positions/${normalizedContractKey}`, {
			includeRelatedOrders,
		})
	)
	if (Array.isArray(response))
		throw new Error(`${Source.Gmx_Rest}: positions/{key} response is not an object`)

	const wire = assertEnvelope('positions/{key}', gmxPositionInfoEnvelope, response)
	const position = assertPositionInfoWire(wire, chainId)
	if (position.contractKey !== normalizedContractKey)
		throw new Error(`${Source.Gmx_Rest}: positions/{key} contractKey mismatch`)

	return position
}
