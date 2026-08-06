/**
 * Curve Finance REST named operations (`api.curve.finance/v1`).
 * @see https://api.curve.finance/v1/documentation/
 * @see https://api.curve.finance/v1/getPoolList/{blockchainId}
 * @see https://api.curve.finance/v1/getPools/{blockchainId}/{registryId}
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { curveGetJson } from '$/sources/Curve/Rest/client.ts'
import { curvePlatformByChainId } from '$/sources/Curve/Rest/constants.ts'
import type {
	CurvePoolListItem,
	CurvePoolListResponse,
	CurvePoolsResponse,
	CurvePoolSnapshot,
	CurvePoolWire,
} from '$/sources/Curve/Rest/types.ts'
import {
	curvePoolListEnvelope,
	curvePoolsEnvelope,
} from '$/sources/Curve/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const maximumPoolsPerChain = 50_000

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Curve_Rest}: invalid chain id ${String(chainId)}`)
	const platform = curvePlatformByChainId[chainId]
	if (platform == null)
		throw new Error(`${Source.Curve_Rest}: unsupported chain id ${String(chainId)}`)
	return platform
}

const assertPoolAddress = (poolAddress: string) => {
	const normalized = hexLowerOfByteSize(poolAddress, 20)
	if (normalized == null)
		throw new Error(`${Source.Curve_Rest}: invalid pool address ${poolAddress}`)
	return normalized
}

/**
 * `getPoolList` renames the stable `factory` registry to `stable-factory` for
 * backward compatibility; `getPools` / `getPlatforms` still use `factory`.
 * @see https://api.curve.finance/v1/documentation/
 */
const normalizeRegistryId = (registryId: string) => (
	registryId === 'stable-factory' ?
		'factory'
	:
		registryId
)

const assertRegistryId = (
	registryId: string,
	registries: readonly string[]
) => {
	const normalized = normalizeRegistryId(registryId)
	if (!registries.includes(normalized))
		throw new Error(`${Source.Curve_Rest}: unsupported registry ${registryId}`)
	return normalized
}

const assertAddress = (
	value: string,
	label: string
) => {
	const normalized = hexLowerOfByteSize(value, 20)
	if (normalized == null)
		throw new Error(`${Source.Curve_Rest}: invalid ${label} ${value}`)
	return normalized
}

const assertNonEmptyString = (
	value: string | null | undefined,
	label: string
) => {
	if (value == null || value.trim() === '')
		throw new Error(`${Source.Curve_Rest}: pool missing ${label}`)
	return value
}

const assertNonNegativeDecimalString = (
	value: string,
	label: string
) => {
	if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value))
		throw new Error(`${Source.Curve_Rest}: pool has invalid ${label}`)
	return value
}

const assertFiniteNumber = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value))
		throw new Error(`${Source.Curve_Rest}: pool has invalid ${label}`)
	return value
}

const assertSafeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value))
		throw new Error(`${Source.Curve_Rest}: pool has invalid ${label}`)
	return value
}

const assertEnvelope = (
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`${Source.Curve_Rest}: invalid ${label} response envelope`)
	}
}

const mapPoolWire = (
	wire: CurvePoolWire,
	{
		blockchainId,
		chainId,
		registryId,
	}: {
		blockchainId: string
		chainId: number
		registryId: string
	}
): CurvePoolSnapshot => {
	assertNonEmptyString(wire.id, 'id')
	const poolAddress = assertAddress(wire.address, 'pool address')
	if (wire.coinsAddresses.length !== wire.decimals.length)
		throw new Error(`${Source.Curve_Rest}: pool ${poolAddress} has mismatched coin metadata`)
	const coinAddresses = wire.coinsAddresses
		.map((address) => assertAddress(address, 'coin address'))
		.filter((address) => address !== '0x0000000000000000000000000000000000000000')

	if (coinAddresses.length < 1)
		throw new Error(`${Source.Curve_Rest}: pool ${poolAddress} has no coins`)

	return {
		blockchainId,
		chainId,
		registryId,
		poolAddress,
		name: assertNonEmptyString(wire.name, 'name'),
		symbol: assertNonEmptyString(wire.symbol, 'symbol'),
		lpTokenAddress: assertAddress(wire.lpTokenAddress, 'lp token address'),
		coinAddresses,
		...(wire.virtualPrice != null && {
			virtualPrice: assertNonNegativeDecimalString(wire.virtualPrice, 'virtual price'),
		}),
		...(wire.amplificationCoefficient != null && {
			amplificationCoefficient: assertNonNegativeDecimalString(wire.amplificationCoefficient, 'amplification coefficient'),
		}),
		...(wire.totalSupply != null && {
			totalSupply: assertNonNegativeDecimalString(wire.totalSupply, 'total supply'),
		}),
		...(wire.usdTotal != null && {
			usdTotal: assertFiniteNumber(wire.usdTotal, 'USD total'),
		}),
		...(wire.isMetaPool != null && {
			isMetaPool: wire.isMetaPool,
		}),
		...(wire.gaugeAddress != null && {
			gaugeAddress: assertAddress(wire.gaugeAddress, 'gauge address'),
		}),
		...(wire.assetTypeName != null && {
			assetTypeName: assertNonEmptyString(wire.assetTypeName, 'asset type name'),
		}),
		...(wire.creationBlockNumber != null && {
			creationBlockNumber: assertSafeInteger(wire.creationBlockNumber, 'creation block number'),
		}),
		...(wire.creationTs != null && {
			creationTs: assertSafeInteger(wire.creationTs, 'creation timestamp'),
		}),
	}
}

/** `GET /getPoolList/{blockchainId}` — pool addresses across registries for a chain. */
export const listPools = async ({
	chainId,
}: {
	chainId: number
}): Promise<CurvePoolListItem[]> => {
	const platform = assertChainId(chainId)
	const response = await curveGetJson<CurvePoolListResponse>(
		`/v1/getPoolList/${platform.blockchainId}`
	)
	assertEnvelope(curvePoolListEnvelope, response, 'pool list')
	if (response.data.poolList.length > maximumPoolsPerChain)
		throw new Error(`${Source.Curve_Rest}: excessive pool list`)

	const pools = response.data.poolList.map((item) => {
		const type = assertNonEmptyString(item.type, 'registry')
		return {
			blockchainId: platform.blockchainId,
			chainId: platform.chainId,
			registryId: assertRegistryId(type, platform.registries),
			poolAddress: assertPoolAddress(item.address),
		}
	})
	if (new Set(pools.map((pool) => pool.poolAddress)).size !== pools.length)
		throw new Error(`${Source.Curve_Rest}: pool list contains duplicate pool addresses`)
	return pools
}

/** `GET /getPools/{blockchainId}/{registryId}` — full pool rows for one registry. */
export const listPoolsByRegistry = async ({
	chainId,
	registryId,
}: {
	chainId: number
	registryId: string
}): Promise<CurvePoolSnapshot[]> => {
	const platform = assertChainId(chainId)
	const registry = assertRegistryId(registryId, platform.registries)
	const response = await curveGetJson<CurvePoolsResponse>(
		`/v1/getPools/${platform.blockchainId}/${registry}`
	)
	assertEnvelope(curvePoolsEnvelope, response, 'pools')
	if (response.data.poolData.length > maximumPoolsPerChain)
		throw new Error(`${Source.Curve_Rest}: excessive pools response`)

	const pools = response.data.poolData.map((wire) => (
		mapPoolWire(wire, {
			blockchainId: platform.blockchainId,
			chainId: platform.chainId,
			registryId: registry,
		})
	))
	if (new Set(pools.map((pool) => pool.poolAddress)).size !== pools.length)
		throw new Error(`${Source.Curve_Rest}: pools response contains duplicate pool addresses`)
	return pools
}

/**
 * Pool detail by chain + address.
 * Resolves the pool's registry from `getPoolList`, then reads that registry's full rows.
 */
export const getPool = async ({
	chainId,
	poolAddress,
}: {
	chainId: number
	poolAddress: string
}): Promise<CurvePoolSnapshot> => {
	const platform = assertChainId(chainId)
	const address = assertPoolAddress(poolAddress)
	const registryId = (await listPools({
		chainId,
	}))
		.find((item) => item.poolAddress === address)
		?.registryId
	if (registryId == null)
		throw new Error(`${Source.Curve_Rest}: pool ${address} not found on chain ${String(chainId)}`)

	const pool = (await listPoolsByRegistry({
		chainId,
		registryId,
	}))
		.find((item) => item.poolAddress === address)
	if (pool == null)
		throw new Error(`${Source.Curve_Rest}: pool ${address} missing from registry ${registryId} on ${platform.blockchainId}`)

	return pool
}
