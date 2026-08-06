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
import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

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

const assertMarketInfoWire = (
	wire: GmxMarketInfoWire,
	chainId: number
): GmxMarketInfo => {
	if (wire.name == null || wire.name.length < 1)
		throw new Error(`${Source.Gmx_Rest}: market missing name`)

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
	if (!Array.isArray(response))
		throw new Error(`${Source.Gmx_Rest}: markets/info response is not an array`)
	if (response.length > gmxMarketsInfoResponseMax)
		throw new Error(`${Source.Gmx_Rest}: markets/info response exceeds ${String(gmxMarketsInfoResponseMax)} markets`)

	const markets = response.map((wire) => (
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
	if (!Array.isArray(response))
		throw new Error(`${Source.Gmx_Rest}: positions response is not an array`)
	if (response.length > gmxPositionsInfoResponseMax)
		throw new Error(`${Source.Gmx_Rest}: positions response exceeds ${String(gmxPositionsInfoResponseMax)} positions`)

	const positions = response.map((wire) => (
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

	const position = assertPositionInfoWire(response, chainId)
	if (position.contractKey !== normalizedContractKey)
		throw new Error(`${Source.Gmx_Rest}: positions/{key} contractKey mismatch`)

	return position
}
