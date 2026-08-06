/**
 * Curve Finance REST named operations (`api.curve.finance/v1`).
 * @see https://api.curve.finance/v1/documentation/
 * @see https://api.curve.finance/v1/getPoolList/{blockchainId}
 * @see https://api.curve.finance/v1/getPools/{blockchainId}/{registryId}
 * @see https://api.curve.finance/v1/getPools/all/{blockchainId}
 * @see https://api.curve.finance/v1/getAllGauges
 * @see https://api.curve.finance/v1/getAllGaugesStatus
 * @see https://api.curve.finance/v1/getLendingVaults/all/{blockchainId}
 *
 * Official Curve API has no account LP / gauge staking position endpoints —
 * do not invent user-balance queries here.
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { curveGetJson } from '$/sources/Curve/Rest/client.ts'
import {
	curvePlatformByBlockchainId,
	curvePlatformByChainId,
} from '$/sources/Curve/Rest/constants.ts'
import type {
	CurveAllGaugesResponse,
	CurveAllGaugesStatusResponse,
	CurveGaugeScopeStatus,
	CurveGaugeSnapshot,
	CurveLendingVaultSnapshot,
	CurveLendingVaultsResponse,
	CurveLendingVaultWire,
	CurvePoolCoinSnapshot,
	CurvePoolCoinWire,
	CurvePoolListItem,
	CurvePoolListResponse,
	CurvePoolsResponse,
	CurvePoolSnapshot,
	CurvePoolWire,
} from '$/sources/Curve/Rest/types.ts'
import {
	curveAllGaugesEnvelope,
	curveAllGaugesStatusEnvelope,
	curveGaugeEnvelope,
	curveLendingVaultsEnvelope,
	curvePoolListEnvelope,
	curvePoolsEnvelope,
} from '$/sources/Curve/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const maximumPoolsPerChain = 50_000
const maximumGauges = 50_000
const maximumLendingVaultsPerChain = 10_000
const zeroAddress = '0x0000000000000000000000000000000000000000'

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Curve_Rest}: invalid chain id ${String(chainId)}`)
	const platform = curvePlatformByChainId[chainId]
	if (platform == null)
		throw new Error(`${Source.Curve_Rest}: unsupported chain id ${String(chainId)}`)
	return platform
}

const assertBlockchainId = (blockchainId: string) => {
	const platform = curvePlatformByBlockchainId[blockchainId]
	if (platform == null)
		throw new Error(`${Source.Curve_Rest}: unsupported blockchain id ${blockchainId}`)
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

const assertLabeledNonEmptyString = (
	value: string | null | undefined,
	label: string
) => {
	if (value == null || value.trim() === '')
		throw new Error(`${Source.Curve_Rest}: missing ${label}`)
	return value
}

const assertNonNegativeDecimalString = (
	value: string,
	label: string
) => {
	if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value))
		throw new Error(`${Source.Curve_Rest}: invalid ${label}`)
	return value
}

const assertFiniteNumber = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value))
		throw new Error(`${Source.Curve_Rest}: invalid ${label}`)
	return value
}

const assertSafeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value))
		throw new Error(`${Source.Curve_Rest}: invalid ${label}`)
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

const optionalDecimalString = (
	value: string | number | null | undefined,
	label: string
) => {
	if (value == null)
		return undefined
	const asString = typeof value === 'number' ? String(value) : value
	if (asString.trim() === '')
		throw new Error(`${Source.Curve_Rest}: invalid ${label}`)
	if (!/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(asString))
		throw new Error(`${Source.Curve_Rest}: invalid ${label}`)
	return asString
}

const optionalFiniteNumber = (
	value: number | null | undefined,
	label: string
) => {
	if (value == null)
		return undefined
	if (!Number.isFinite(value))
		throw new Error(`${Source.Curve_Rest}: invalid ${label}`)
	return value
}

const optionalApyPair = (
	value: number[] | null | undefined,
	label: string
) => {
	if (value == null)
		return undefined
	if (value.length !== 2)
		throw new Error(`${Source.Curve_Rest}: invalid ${label}`)
	const low = assertFiniteNumber(value[0]!, label)
	const high = assertFiniteNumber(value[1]!, label)
	return [
		low,
		high,
	] as const
}

const mapPoolCoin = (
	wire: CurvePoolCoinWire
): CurvePoolCoinSnapshot | undefined => {
	const address = assertAddress(wire.address, 'coin address')
	if (address === zeroAddress)
		return undefined
	return {
		address,
		symbol: assertLabeledNonEmptyString(wire.symbol, 'coin symbol'),
		name: assertLabeledNonEmptyString(wire.name, 'coin name'),
		decimals: assertLabeledNonEmptyString(wire.decimals, 'coin decimals'),
		...(wire.poolBalance != null && {
			poolBalance: assertNonNegativeDecimalString(wire.poolBalance, 'coin pool balance'),
		}),
		...(wire.usdPrice != null && {
			usdPrice: assertFiniteNumber(wire.usdPrice, 'coin usd price'),
		}),
		...(wire.isBasePoolLpToken != null && {
			isBasePoolLpToken: wire.isBasePoolLpToken,
		}),
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
		.filter((address) => address !== zeroAddress)

	if (coinAddresses.length < 1)
		throw new Error(`${Source.Curve_Rest}: pool ${poolAddress} has no coins`)

	const coins = wire.coins.flatMap((coin) => {
		const mapped = mapPoolCoin(coin)
		return mapped == null ? [] : [mapped]
	})
	if (coins.length > 0) {
		const coinAddressSet = new Set(coins.map((coin) => coin.address))
		if (coinAddressSet.size !== coins.length)
			throw new Error(`${Source.Curve_Rest}: pool ${poolAddress} has duplicate coin legs`)
		for (const address of coinAddresses) {
			if (!coinAddressSet.has(address))
				throw new Error(`${Source.Curve_Rest}: pool ${poolAddress} coin legs missing ${address}`)
		}
	}

	const gaugeAddress = (
		wire.gaugeAddress == null || wire.gaugeAddress === '' || wire.gaugeAddress === zeroAddress ?
			undefined
		:
			assertAddress(wire.gaugeAddress, 'gauge address')
	)

	return {
		blockchainId,
		chainId,
		registryId,
		poolAddress,
		name: assertNonEmptyString(wire.name, 'name'),
		symbol: assertNonEmptyString(wire.symbol, 'symbol'),
		lpTokenAddress: assertAddress(wire.lpTokenAddress, 'lp token address'),
		coinAddresses,
		coins,
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
		...(gaugeAddress != null && {
			gaugeAddress,
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

const mapGaugeWire = (
	key: string,
	rawWire: unknown
): CurveGaugeSnapshot => {
	let wire
	try {
		wire = curveGaugeEnvelope.assert(rawWire)
	} catch {
		throw new Error(`${Source.Curve_Rest}: invalid gauge response envelope`)
	}
	const platform = assertBlockchainId(wire.blockchainId)
	const gaugeAddress = assertAddress(wire.gauge, 'gauge address')
	const poolAddressRaw = wire.poolAddress ?? wire.swap
	const poolAddress = (
		poolAddressRaw == null || poolAddressRaw === '' ?
			undefined
		:
			assertAddress(poolAddressRaw, 'pool address')
	)
	const lpTokenAddress = (
		wire.swap_token == null || wire.swap_token === '' ?
			undefined
		:
			assertAddress(wire.swap_token, 'lp token address')
	)
	const lendingVaultAddress = (
		wire.lendingVaultAddress == null || wire.lendingVaultAddress === '' ?
			undefined
		:
			assertAddress(wire.lendingVaultAddress, 'lending vault address')
	)
	const rootGaugeAddress = (
		wire.rootGauge == null || wire.rootGauge === '' ?
			undefined
		:
			assertAddress(wire.rootGauge, 'root gauge address')
	)
	const workingSupply = optionalDecimalString(wire.gauge_data?.working_supply, 'working supply')
	const inflationRate = optionalDecimalString(wire.gauge_data?.inflation_rate, 'inflation rate')
	const gaugeRelativeWeight = optionalDecimalString(wire.gauge_controller?.gauge_relative_weight, 'gauge relative weight')
	const gaugeFutureRelativeWeight = optionalDecimalString(wire.gauge_controller?.gauge_future_relative_weight, 'gauge future relative weight')
	const gaugeWeight = optionalDecimalString(wire.gauge_controller?.get_gauge_weight, 'gauge weight')
	const lpTokenPrice = optionalFiniteNumber(wire.lpTokenPrice, 'lp token price')
	const gaugeCrvApy = optionalApyPair(wire.gaugeCrvApy, 'gaugeCrvApy')
	const gaugeFutureCrvApy = optionalApyPair(wire.gaugeFutureCrvApy, 'gaugeFutureCrvApy')

	if (wire.isPool && poolAddress == null)
		throw new Error(`${Source.Curve_Rest}: gauge ${gaugeAddress} missing pool address`)
	if (!wire.isPool && lendingVaultAddress == null && poolAddress == null)
		throw new Error(`${Source.Curve_Rest}: gauge ${gaugeAddress} missing pool or lending vault address`)

	return {
		key: assertLabeledNonEmptyString(key, 'gauge key'),
		blockchainId: platform.blockchainId,
		chainId: platform.chainId,
		gaugeAddress,
		name: assertLabeledNonEmptyString(wire.name, 'gauge name'),
		...(wire.shortName != null && wire.shortName !== '' && {
			shortName: wire.shortName,
		}),
		isPool: wire.isPool,
		isFactory: wire.factory === true,
		isSideChain: wire.side_chain === true,
		isKilled: wire.is_killed === true,
		hasNoCrv: wire.hasNoCrv === true,
		...(poolAddress != null && {
			poolAddress,
		}),
		...(lpTokenAddress != null && {
			lpTokenAddress,
		}),
		...(lendingVaultAddress != null && {
			lendingVaultAddress,
		}),
		...(rootGaugeAddress != null && {
			rootGaugeAddress,
		}),
		...(wire.type != null && wire.type !== '' && {
			type: wire.type,
		}),
		...(wire.gaugeType != null && wire.gaugeType !== '' && {
			gaugeType: wire.gaugeType,
		}),
		...(workingSupply != null && {
			workingSupply,
		}),
		...(inflationRate != null && {
			inflationRate,
		}),
		...(gaugeRelativeWeight != null && {
			gaugeRelativeWeight,
		}),
		...(gaugeFutureRelativeWeight != null && {
			gaugeFutureRelativeWeight,
		}),
		...(gaugeWeight != null && {
			gaugeWeight,
		}),
		...(lpTokenPrice != null && {
			lpTokenPrice,
		}),
		...(gaugeCrvApy != null && {
			gaugeCrvApy,
		}),
		...(gaugeFutureCrvApy != null && {
			gaugeFutureCrvApy,
		}),
		...(wire.gaugeStatus?.areCrvRewardsStuckInBridge != null && {
			areCrvRewardsStuckInBridge: wire.gaugeStatus.areCrvRewardsStuckInBridge,
		}),
		...(wire.gaugeStatus?.rewardsNeedNudging != null && {
			rewardsNeedNudging: wire.gaugeStatus.rewardsNeedNudging,
		}),
	}
}

const mapLendingVaultAsset = (
	wire: CurveLendingVaultWire['assets']['borrowed'],
	label: string
) => {
	if (!Number.isSafeInteger(wire.decimals) || wire.decimals < 0)
		throw new Error(`${Source.Curve_Rest}: invalid ${label} decimals`)
	return {
		symbol: assertLabeledNonEmptyString(wire.symbol, `${label} symbol`),
		decimals: wire.decimals,
		address: assertAddress(wire.address, `${label} address`),
		blockchainId: assertLabeledNonEmptyString(wire.blockchainId, `${label} blockchain id`),
		...(optionalFiniteNumber(wire.usdPrice, `${label} usd price`) != null && {
			usdPrice: optionalFiniteNumber(wire.usdPrice, `${label} usd price`),
		}),
	}
}

const mapLendingVaultWire = (
	wire: CurveLendingVaultWire
): CurveLendingVaultSnapshot => {
	const platform = assertBlockchainId(wire.blockchainId)
	const vaultAddress = assertAddress(wire.address, 'lending vault address')
	const gaugeAddress = (
		wire.gaugeAddress == null || wire.gaugeAddress === '' || wire.gaugeAddress === zeroAddress ?
			undefined
		:
			assertAddress(wire.gaugeAddress, 'gauge address')
	)
	const borrowApr = optionalFiniteNumber(wire.rates?.borrowApr, 'borrow APR')
	const borrowApy = optionalFiniteNumber(wire.rates?.borrowApy, 'borrow APY')
	const lendApr = optionalFiniteNumber(wire.rates?.lendApr, 'lend APR')
	const lendApy = optionalFiniteNumber(wire.rates?.lendApy, 'lend APY')
	const pricePerShare = optionalFiniteNumber(wire.vaultShares?.pricePerShare, 'price per share')
	const totalShares = optionalFiniteNumber(wire.vaultShares?.totalShares, 'total shares')
	const totalSupplied = optionalFiniteNumber(wire.totalSupplied?.total, 'total supplied')
	const totalSuppliedUsd = optionalFiniteNumber(wire.totalSupplied?.usdTotal, 'total supplied usd')
	const totalBorrowed = optionalFiniteNumber(wire.borrowed?.total, 'total borrowed')
	const totalBorrowedUsd = optionalFiniteNumber(wire.borrowed?.usdTotal, 'total borrowed usd')
	const availableToBorrow = optionalFiniteNumber(wire.availableToBorrow?.total, 'available to borrow')
	const availableToBorrowUsd = optionalFiniteNumber(wire.availableToBorrow?.usdTotal, 'available to borrow usd')
	const usdTotal = optionalFiniteNumber(wire.usdTotal, 'usd total')

	return {
		id: assertLabeledNonEmptyString(wire.id, 'lending vault id'),
		name: assertLabeledNonEmptyString(wire.name, 'lending vault name'),
		blockchainId: platform.blockchainId,
		chainId: platform.chainId,
		registryId: assertLabeledNonEmptyString(wire.registryId, 'lending registry'),
		vaultAddress,
		controllerAddress: assertAddress(wire.controllerAddress, 'controller address'),
		ammAddress: assertAddress(wire.ammAddress, 'amm address'),
		monetaryPolicyAddress: assertAddress(wire.monetaryPolicyAddress, 'monetary policy address'),
		borrowedAsset: mapLendingVaultAsset(wire.assets.borrowed, 'borrowed asset'),
		collateralAsset: mapLendingVaultAsset(wire.assets.collateral, 'collateral asset'),
		...(gaugeAddress != null && {
			gaugeAddress,
		}),
		...(borrowApr != null && {
			borrowApr,
		}),
		...(borrowApy != null && {
			borrowApy,
		}),
		...(lendApr != null && {
			lendApr,
		}),
		...(lendApy != null && {
			lendApy,
		}),
		...(pricePerShare != null && {
			pricePerShare,
		}),
		...(totalShares != null && {
			totalShares,
		}),
		...(totalSupplied != null && {
			totalSupplied,
		}),
		...(totalSuppliedUsd != null && {
			totalSuppliedUsd,
		}),
		...(totalBorrowed != null && {
			totalBorrowed,
		}),
		...(totalBorrowedUsd != null && {
			totalBorrowedUsd,
		}),
		...(availableToBorrow != null && {
			availableToBorrow,
		}),
		...(availableToBorrowUsd != null && {
			availableToBorrowUsd,
		}),
		...(usdTotal != null && {
			usdTotal,
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

/** `GET /getPools/all/{blockchainId}` — full pool rows across registries for one chain. */
export const listPoolsOnChain = async ({
	chainId,
}: {
	chainId: number
}): Promise<CurvePoolSnapshot[]> => {
	const platform = assertChainId(chainId)
	const response = await curveGetJson<CurvePoolsResponse>(
		`/v1/getPools/all/${platform.blockchainId}`
	)
	assertEnvelope(curvePoolsEnvelope, response, 'pools')
	if (response.data.poolData.length > maximumPoolsPerChain)
		throw new Error(`${Source.Curve_Rest}: excessive pools response`)

	const pools = response.data.poolData.map((wire) => {
		const registryId = assertRegistryId(
			assertLabeledNonEmptyString(wire.registryId, 'registry'),
			platform.registries
		)
		return mapPoolWire(wire, {
			blockchainId: platform.blockchainId,
			chainId: platform.chainId,
			registryId,
		})
	})
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

/** `GET /getAllGauges` — all gauges across chains/registries; optional chain filter. */
export const listGauges = async ({
	chainId,
}: {
	chainId?: number
} = {}): Promise<CurveGaugeSnapshot[]> => {
	const platform = chainId == null ? undefined : assertChainId(chainId)
	const response = await curveGetJson<CurveAllGaugesResponse>('/v1/getAllGauges')
	assertEnvelope(curveAllGaugesEnvelope, response, 'gauges')
	const entries = Object.entries(response.data)
	if (entries.length > maximumGauges)
		throw new Error(`${Source.Curve_Rest}: excessive gauges response`)

	const gauges = entries
		.map(([key, wire]) => mapGaugeWire(key, wire))
		.filter((gauge) => (
			platform == null
			|| gauge.chainId === platform.chainId
		))
	if (new Set(gauges.map((gauge) => `${gauge.chainId}:${gauge.gaugeAddress}`)).size !== gauges.length)
		throw new Error(`${Source.Curve_Rest}: gauges response contains duplicate gauge addresses`)
	return gauges
}

/** Gauge detail by address (optional chain), from `getAllGauges`. */
export const getGauge = async ({
	chainId,
	gaugeAddress,
}: {
	chainId?: number
	gaugeAddress: string
}): Promise<CurveGaugeSnapshot> => {
	const address = assertAddress(gaugeAddress, 'gauge address')
	const gauge = (await listGauges({
		...(chainId != null && {
			chainId,
		}),
	}))
		.find((item) => item.gaugeAddress === address)
	if (gauge == null)
		throw new Error(
			chainId == null ?
				`${Source.Curve_Rest}: gauge ${address} not found`
			:
				`${Source.Curve_Rest}: gauge ${address} not found on chain ${String(chainId)}`
		)
	return gauge
}

/** `GET /getAllGaugesStatus` — per-scope cache freshness for the gauges catalog. */
export const getGaugesStatus = async (): Promise<{
	scopes: CurveGaugeScopeStatus[]
	staleScopes: CurveGaugeScopeStatus[]
	failedScopes: CurveGaugeScopeStatus[]
	scopesWithMissingRequiredGauges: CurveGaugeScopeStatus[]
}> => {
	const response = await curveGetJson<CurveAllGaugesStatusResponse>('/v1/getAllGaugesStatus')
	assertEnvelope(curveAllGaugesStatusEnvelope, response, 'gauges status')

	const mapScope = (wire: CurveAllGaugesStatusResponse['data']['scopes'][number]): CurveGaugeScopeStatus => ({
		scopeId: assertLabeledNonEmptyString(wire.scopeId, 'scope id'),
		blockchainId: assertLabeledNonEmptyString(wire.blockchainId, 'blockchain id'),
		source: assertLabeledNonEmptyString(wire.source, 'source'),
		cacheStatus: assertLabeledNonEmptyString(wire.cacheStatus, 'cache status'),
		isStale: wire.isStale,
		gaugeCount: assertSafeInteger(wire.gaugeCount, 'gauge count'),
		missingRequiredGaugeCount: assertSafeInteger(wire.missingRequiredGaugeCount, 'missing required gauge count'),
		generatedTimeMs: assertSafeInteger(wire.generatedTimeMs, 'generated time'),
		cachedAt: assertSafeInteger(wire.cachedAt, 'cached at'),
		staleAt: assertSafeInteger(wire.staleAt, 'stale at'),
		expireAt: assertSafeInteger(wire.expireAt, 'expire at'),
		...(wire.lastSuccessTimeMs != null && {
			lastSuccessTimeMs: assertSafeInteger(wire.lastSuccessTimeMs, 'last success time'),
		}),
		...(wire.lastErrorTimeMs != null && {
			lastErrorTimeMs: assertSafeInteger(wire.lastErrorTimeMs, 'last error time'),
		}),
		...(wire.lastError != null && wire.lastError !== '' && {
			lastError: wire.lastError,
		}),
	})

	return {
		scopes: response.data.scopes.map(mapScope),
		staleScopes: response.data.staleScopes.map(mapScope),
		failedScopes: response.data.failedScopes.map(mapScope),
		scopesWithMissingRequiredGauges: response.data.scopesWithMissingRequiredGauges.map(mapScope),
	}
}

/** `GET /getLendingVaults/all/{blockchainId}` — Curve Lend vault rows for one chain. */
export const listLendingVaults = async ({
	chainId,
}: {
	chainId: number
}): Promise<CurveLendingVaultSnapshot[]> => {
	const platform = assertChainId(chainId)
	const response = await curveGetJson<CurveLendingVaultsResponse>(
		`/v1/getLendingVaults/all/${platform.blockchainId}`
	)
	assertEnvelope(curveLendingVaultsEnvelope, response, 'lending vaults')
	if (response.data.lendingVaultData.length > maximumLendingVaultsPerChain)
		throw new Error(`${Source.Curve_Rest}: excessive lending vaults response`)

	const vaults = response.data.lendingVaultData.map(mapLendingVaultWire)
	if (new Set(vaults.map((vault) => vault.vaultAddress)).size !== vaults.length)
		throw new Error(`${Source.Curve_Rest}: lending vaults response contains duplicate vault addresses`)
	return vaults
}

/** Lending vault detail by chain + vault address. */
export const getLendingVault = async ({
	chainId,
	vaultAddress,
}: {
	chainId: number
	vaultAddress: string
}): Promise<CurveLendingVaultSnapshot> => {
	const address = assertAddress(vaultAddress, 'lending vault address')
	const vault = (await listLendingVaults({
		chainId,
	}))
		.find((item) => item.vaultAddress === address)
	if (vault == null)
		throw new Error(`${Source.Curve_Rest}: lending vault ${address} not found on chain ${String(chainId)}`)
	return vault
}
