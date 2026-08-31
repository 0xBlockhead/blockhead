/**
 * Pendle REST named operations (official api-v2.pendle.finance).
 * @see https://docs.pendle.finance/pendle-v2-dev/Backend/ApiOverview
 * @see https://docs.pendle.finance/pendle-v2-dev/Quickstart
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Pendle/bindings.ts'
import {
	pendleByChainId,
	pendleMarketsAllDefaultLimit,
	pendleMarketsAllMaxLimit,
} from '$/sources/Pendle/Rest/constants.ts'
import type {
	PendleMarket,
	PendleMarketDetails,
	PendleMarketDetailsWire,
	PendleMarketTokens,
	PendleMarketTokensWire,
	PendleMarketWire,
	PendleMarketsAllResponseWire,
	PendleMarketsPage,
} from '$/sources/Pendle/Rest/types.ts'
import { pendleMarketTokensEnvelope, pendleMarketsAllEnvelope } from '$/sources/Pendle/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const binding = Object.fromEntries(bindings[Source.Pendle_Rest].map((binding) => [binding.target.key, binding]))['pendle-api']

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Pendle_Rest}: invalid chain id ${String(chainId)}`)
	if (pendleByChainId[chainId] == null)
		throw new Error(`${Source.Pendle_Rest}: unsupported chain id ${String(chainId)}`)
}

const assertAddress = (
	value: string,
	label: string
) => {
	const normalized = hexLowerOfByteSize(value, 20)
	if (normalized == null)
		throw new Error(`${Source.Pendle_Rest}: invalid ${label} ${value}`)
	return normalized
}

const assertAssetIdAddress = (
	assetId: string,
	expectedChainId: number,
	label: string
) => {
	const separatorIndex = assetId.indexOf('-0x')
	if (separatorIndex < 1)
		throw new Error(`${Source.Pendle_Rest}: invalid ${label} id ${assetId}`)

	const chainId = Number(assetId.slice(0, separatorIndex))
	if (!Number.isSafeInteger(chainId) || chainId !== expectedChainId)
		throw new Error(`${Source.Pendle_Rest}: ${label} chain mismatch for ${assetId}`)

	return assertAddress(
		assetId.slice(separatorIndex + 1),
		label
	)
}

const assertIsoTimestampMs = (
	value: string,
	label: string
) => {
	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs))
		throw new Error(`${Source.Pendle_Rest}: invalid ${label} ${value}`)
	return timestampMs
}

const assertFiniteNumber = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value))
		throw new Error(`${Source.Pendle_Rest}: market missing ${label}`)
	return value
}

const assertNonNegativeNumber = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value) || value < 0)
		throw new Error(`${Source.Pendle_Rest}: market ${label} must be a finite non-negative number`)
	return value
}

const assertUnitIntervalNumber = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value) || value < 0 || value > 1)
		throw new Error(`${Source.Pendle_Rest}: market ${label} must be a finite number in [0, 1]`)
	return value
}

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => _Value
	},
	value: unknown,
	label: string
) => {
	try {
		return envelope.assert(value)
	} catch {
		throw new Error(`${Source.Pendle_Rest}: invalid ${label} response envelope`)
	}
}

const assertMarketDetailsWire = (
	wire: PendleMarketDetailsWire
): PendleMarketDetails => ({
	liquidityUsd: assertNonNegativeNumber(wire.liquidity, 'details.liquidity'),
	totalTvlUsd: assertNonNegativeNumber(wire.totalTvl, 'details.totalTvl'),
	tradingVolumeUsd: assertNonNegativeNumber(wire.tradingVolume, 'details.tradingVolume'),
	underlyingApy: assertFiniteNumber(wire.underlyingApy, 'details.underlyingApy'),
	swapFeeApy: assertFiniteNumber(wire.swapFeeApy, 'details.swapFeeApy'),
	pendleApy: assertFiniteNumber(wire.pendleApy, 'details.pendleApy'),
	ytFloatingApy: assertFiniteNumber(wire.ytFloatingApy, 'details.ytFloatingApy'),
	impliedApy: assertFiniteNumber(wire.impliedApy, 'details.impliedApy'),
	feeRate: assertUnitIntervalNumber(wire.feeRate, 'details.feeRate'),
	totalPt: assertNonNegativeNumber(wire.totalPt, 'details.totalPt'),
	totalSy: assertNonNegativeNumber(wire.totalSy, 'details.totalSy'),
	totalSupply: assertNonNegativeNumber(wire.totalSupply, 'details.totalSupply'),
	totalActiveSupply: assertNonNegativeNumber(wire.totalActiveSupply, 'details.totalActiveSupply'),
	aggregatedApy: assertFiniteNumber(wire.aggregatedApy, 'details.aggregatedApy'),
	maxBoostedApy: assertFiniteNumber(wire.maxBoostedApy, 'details.maxBoostedApy'),
})

const assertCategoryIds = (
	categoryIds: string[]
) => {
	const normalized = [
		...new Set(
			categoryIds.map((categoryId) => {
				if (categoryId.length < 1)
					throw new Error(`${Source.Pendle_Rest}: market category id must be non-empty`)
				return categoryId
			})
		),
	].sort((left, right) => left.localeCompare(right))
	return normalized
}

const assertMarketWire = (wire: PendleMarketWire): PendleMarket => {
	assertChainId(wire.chainId)
	if (wire.name.length < 1)
		throw new Error(`${Source.Pendle_Rest}: market missing name`)
	if (wire.protocol.length < 1)
		throw new Error(`${Source.Pendle_Rest}: market missing protocol`)

	const marketAddress = assertAddress(wire.address, 'market address')

	return {
		chainId: wire.chainId,
		marketAddress,
		name: wire.name,
		protocol: wire.protocol,
		icon: wire.icon,
		expiryTimestampMs: assertIsoTimestampMs(wire.expiry, 'expiry'),
		ptAddress: assertAssetIdAddress(wire.pt, wire.chainId, 'pt'),
		ytAddress: assertAssetIdAddress(wire.yt, wire.chainId, 'yt'),
		syAddress: assertAssetIdAddress(wire.sy, wire.chainId, 'sy'),
		underlyingAssetAddress: assertAssetIdAddress(wire.underlyingAsset, wire.chainId, 'underlying asset'),
		accountingAssetAddress: assertAssetIdAddress(wire.accountingAsset, wire.chainId, 'accounting asset'),
		categoryIds: assertCategoryIds(wire.categoryIds),
		isNew: wire.isNew === true,
		isPrime: wire.isPrime === true,
		observedAtTimestampMs: assertIsoTimestampMs(wire.timestamp, 'timestamp'),
		details: assertMarketDetailsWire(wire.details),
	}
}

const assertPageMetadata = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`${Source.Pendle_Rest}: markets/all response invalid ${label}`)
	return value
}

/**
 * All Pendle markets for one supported EIP-155 chain (`GET /v2/markets/all`).
 * @see https://api-v2.pendle.finance/core/docs#/Markets/MarketsCrossChainController_getAllMarkets
 */
export const listMarkets = async ({
	chainId,
	marketAddresses,
	skip = 0,
	limit = pendleMarketsAllDefaultLimit,
}: {
	chainId: number
	marketAddresses?: string[]
	skip?: number
	limit?: number
}) => {
	assertChainId(chainId)
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error(`${Source.Pendle_Rest}: invalid skip ${String(skip)}`)
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > pendleMarketsAllMaxLimit)
		throw new Error(`${Source.Pendle_Rest}: invalid limit ${String(limit)}`)

	const normalizedMarketAddresses = marketAddresses?.map((marketAddress) => (
		assertAddress(marketAddress, 'market address')
	))
	if (
		normalizedMarketAddresses != null
		&& new Set(normalizedMarketAddresses).size !== normalizedMarketAddresses.length
	)
		throw new Error(`${Source.Pendle_Rest}: market addresses contains duplicate addresses`)
	const response = assertEnvelope(
		pendleMarketsAllEnvelope,
		await sourceGetJson<PendleMarketsAllResponseWire>(
			binding,
			httpUrl(
				binding,
				`v2/markets/all?chainId=${String(chainId)}${normalizedMarketAddresses == null ? '' : `&ids=${normalizedMarketAddresses.map((marketAddress) => `${String(chainId)}-${marketAddress}`).join(',')}`}&skip=${String(skip)}&limit=${String(limit)}`
			)
		),
		'markets/all'
	)
	if (response.skip !== skip)
		throw new Error(`${Source.Pendle_Rest}: markets/all response skip mismatch`)
	if (response.results.length > limit)
		throw new Error(`${Source.Pendle_Rest}: markets/all response exceeds requested limit`)
	const markets = response.results.map((market) => {
		if (market.chainId !== chainId)
			throw new Error(`${Source.Pendle_Rest}: market chain filter violated`)
		const snapshot = assertMarketWire(market)
		if (normalizedMarketAddresses != null && !normalizedMarketAddresses.includes(snapshot.marketAddress))
			throw new Error(`${Source.Pendle_Rest}: market address filter violated`)
		return snapshot
	})
	if (new Set(markets.map((market) => market.marketAddress)).size !== markets.length)
		throw new Error(`${Source.Pendle_Rest}: markets/all response contains duplicate market addresses`)

	return {
		total: assertPageMetadata(response.total, 'total'),
		limit: assertPageMetadata(response.limit, 'limit'),
		skip: assertPageMetadata(response.skip, 'skip'),
		markets,
	} satisfies PendleMarketsPage
}

const assertTokenAddressList = (
	values: string[],
	label: string
) => {
	const normalized = values.map((value) => assertAddress(value, label))
	const unique = [
		...new Set(normalized),
	]
	if (unique.length !== normalized.length)
		throw new Error(`${Source.Pendle_Rest}: ${label} contains duplicate addresses`)
	return unique
}

/**
 * Single Pendle market by chain + address (`GET /v2/markets/all` filtered by id).
 * Keeps accounting-asset + extra APY surfaces on the transport market snapshot.
 */
export const getMarket = async ({
	chainId,
	marketAddress,
}: {
	chainId: number
	marketAddress: string
}) => {
	const normalizedMarketAddress = assertAddress(marketAddress, 'market address')
	const page = await listMarkets({
		chainId,
		marketAddresses: [
			normalizedMarketAddress,
		],
		limit: 1,
	})
	if (page.total > 1 || page.markets.length > 1)
		throw new Error(`${Source.Pendle_Rest}: ambiguous market ${normalizedMarketAddress}`)
	const market = page.markets.at(0)
	if (market == null)
		throw new Error(`${Source.Pendle_Rest}: market not found ${normalizedMarketAddress}`)
	return market
}

/**
 * SY mint/redeem + swap token sets for one market (`GET /v1/sdk/{chainId}/markets/{market}/tokens`).
 * @see https://api-v2.pendle.finance/core/docs#/SDK/SdkController_getMarketTokens
 */
export const getMarketTokens = async ({
	chainId,
	marketAddress,
}: {
	chainId: number
	marketAddress: string
}) => {
	assertChainId(chainId)
	const normalizedMarketAddress = assertAddress(marketAddress, 'market address')
	const response = assertEnvelope(
		pendleMarketTokensEnvelope,
		await sourceGetJson<PendleMarketTokensWire>(
			binding,
			httpUrl(binding, `v1/sdk/${String(chainId)}/markets/${normalizedMarketAddress}/tokens`)
		),
		'market tokens'
	)
	return {
		chainId,
		marketAddress: normalizedMarketAddress,
		tokensMintSy: assertTokenAddressList(response.tokensMintSy, 'tokensMintSy').toSorted(),
		tokensRedeemSy: assertTokenAddressList(response.tokensRedeemSy, 'tokensRedeemSy').toSorted(),
		tokensIn: assertTokenAddressList(response.tokensIn, 'tokensIn').toSorted(),
		tokensOut: assertTokenAddressList(response.tokensOut, 'tokensOut').toSorted(),
	} satisfies PendleMarketTokens
}
