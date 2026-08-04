/**
 * GMX API REST named operations.
 * @see https://docs.gmx.io/docs/api/integration-guide/
 * @see https://docs.gmx.io/docs/api/overview/
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Gmx/bindings.ts'
import {
	gmxApiByChainId,
	gmxMarketsInfoResponseMax,
} from '$/sources/Gmx/Rest/constants.ts'
import type {
	GmxMarketInfo,
	GmxMarketInfoWire,
} from '$/sources/Gmx/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const bindingByChainId = new Map(
	bindings[Source.Gmx_Rest].map((binding) => [
		Number(binding.target.key),
		binding,
	] as const)
)

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Gmx_Rest}: invalid chain id ${String(chainId)}`)
	if (gmxApiByChainId[chainId] == null || bindingByChainId.get(chainId) == null)
		throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)
}

const assertAddress = (
	value: string,
	label: string
) => {
	const normalized = hexLowerOfByteSize(value, 20)
	if (normalized == null)
		throw new Error(`${Source.Gmx_Rest}: invalid ${label} ${value}`)
	return normalized
}

const assertNonEmptyDecimalString = (
	value: string,
	label: string
) => {
	if (value.length < 1 || !/^(?:0|[1-9]\d*)$/.test(value))
		throw new Error(`${Source.Gmx_Rest}: market missing ${label}`)
	return value
}

const assertBoolean = (
	value: boolean,
	label: string
) => {
	if (value !== true && value !== false)
		throw new Error(`${Source.Gmx_Rest}: market missing ${label}`)
	return value
}

const assertMarketInfoWire = (
	wire: GmxMarketInfoWire,
	chainId: number
): GmxMarketInfo => {
	if (wire.name.length < 1)
		throw new Error(`${Source.Gmx_Rest}: market missing name`)

	return {
		chainId,
		name: wire.name,
		marketTokenAddress: assertAddress(wire.marketTokenAddress, 'market token'),
		indexTokenAddress: assertAddress(wire.indexTokenAddress, 'index token'),
		longTokenAddress: assertAddress(wire.longTokenAddress, 'long token'),
		shortTokenAddress: assertAddress(wire.shortTokenAddress, 'short token'),
		isSpotOnly: assertBoolean(wire.isSpotOnly, 'isSpotOnly'),
		isDisabled: assertBoolean(wire.isDisabled, 'isDisabled'),
		longInterestUsd: assertNonEmptyDecimalString(wire.longInterestUsd, 'longInterestUsd'),
		shortInterestUsd: assertNonEmptyDecimalString(wire.shortInterestUsd, 'shortInterestUsd'),
		longPoolAmount: assertNonEmptyDecimalString(wire.longPoolAmount, 'longPoolAmount'),
		shortPoolAmount: assertNonEmptyDecimalString(wire.shortPoolAmount, 'shortPoolAmount'),
		fundingFactorPerSecond: assertNonEmptyDecimalString(wire.fundingFactorPerSecond, 'fundingFactorPerSecond'),
	}
}

/** Composite market snapshots from official `GET /markets/info`. */
export const getMarketsInfo = async ({
	chainId,
}: {
	chainId: number
}) => {
	assertChainId(chainId)
	const binding = bindingByChainId.get(chainId)
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
