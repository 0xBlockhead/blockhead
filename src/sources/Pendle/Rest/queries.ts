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
	PendleMarketWire,
	PendleMarketsAllResponseWire,
	PendleMarketsPage,
} from '$/sources/Pendle/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const binding = bindings[Source.Pendle_Rest][0]

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

const assertMarketDetailsWire = (
	wire: PendleMarketDetailsWire
): PendleMarketDetails => ({
	liquidityUsd: assertFiniteNumber(wire.liquidity, 'details.liquidity'),
	totalTvlUsd: assertFiniteNumber(wire.totalTvl, 'details.totalTvl'),
	tradingVolumeUsd: assertFiniteNumber(wire.tradingVolume, 'details.tradingVolume'),
	underlyingApy: assertFiniteNumber(wire.underlyingApy, 'details.underlyingApy'),
	swapFeeApy: assertFiniteNumber(wire.swapFeeApy, 'details.swapFeeApy'),
	pendleApy: assertFiniteNumber(wire.pendleApy, 'details.pendleApy'),
	ytFloatingApy: assertFiniteNumber(wire.ytFloatingApy, 'details.ytFloatingApy'),
	impliedApy: assertFiniteNumber(wire.impliedApy, 'details.impliedApy'),
	feeRate: assertFiniteNumber(wire.feeRate, 'details.feeRate'),
	totalPt: assertFiniteNumber(wire.totalPt, 'details.totalPt'),
	totalSy: assertFiniteNumber(wire.totalSy, 'details.totalSy'),
	totalSupply: assertFiniteNumber(wire.totalSupply, 'details.totalSupply'),
	totalActiveSupply: assertFiniteNumber(wire.totalActiveSupply, 'details.totalActiveSupply'),
	aggregatedApy: assertFiniteNumber(wire.aggregatedApy, 'details.aggregatedApy'),
	maxBoostedApy: assertFiniteNumber(wire.maxBoostedApy, 'details.maxBoostedApy'),
})

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
		categoryIds: wire.categoryIds,
		isNew: wire.isNew === true,
		isPrime: wire.isPrime === true,
		observedAtTimestampMs: assertIsoTimestampMs(wire.timestamp, 'timestamp'),
		details: assertMarketDetailsWire(wire.details),
	}
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

	const response = await sourceGetJson<PendleMarketsAllResponseWire>(
		binding,
		httpUrl(
			binding,
			`/v2/markets/all?chainId=${String(chainId)}${marketAddresses == null ? '' : `&ids=${marketAddresses.map((marketAddress) => `${String(chainId)}-${assertAddress(marketAddress, 'market address')}`).join(',')}`}&skip=${String(skip)}&limit=${String(limit)}`
		)
	)
	if (!Array.isArray(response.results))
		throw new Error(`${Source.Pendle_Rest}: markets/all response missing results`)
	if (!Number.isSafeInteger(response.total) || response.total < 0)
		throw new Error(`${Source.Pendle_Rest}: markets/all response missing total`)

	return {
		total: response.total,
		limit: response.limit,
		skip: response.skip,
		markets: response.results.map(assertMarketWire),
	} satisfies PendleMarketsPage
}
