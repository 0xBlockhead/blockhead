import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	CurveGaugeSnapshot,
	CurveLendingVaultSnapshot,
	CurvePoolCoinSnapshot,
	CurvePoolSnapshot,
} from '$/sources/Curve/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type CurvePoolId = EntitySelector<typeof schema, EntityType.CurvePool>
type CurveGaugeId = EntitySelector<typeof schema, EntityType.CurveGauge>
type CurvePoolCoinId = EntitySelector<typeof schema, EntityType.CurvePoolCoin>
type CurveLendingVaultId = EntitySelector<typeof schema, EntityType.CurveLendingVault>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Curve_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Curve_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapCurvePoolCoin = (
	pool: CurvePoolId,
	coin: CurvePoolCoinSnapshot
) => ({
	$pool: {
		[EntityMetaKey.Selector]: pool,
	},
	coinAddress: coin.address,
	symbol: coin.symbol,
	name: coin.name,
	decimals: coin.decimals,
	...(coin.poolBalance != null && {
		poolBalance: coin.poolBalance,
	}),
	...(coin.usdPrice != null && {
		usdPrice: coin.usdPrice,
	}),
	...(coin.isBasePoolLpToken != null && {
		isBasePoolLpToken: coin.isBasePoolLpToken,
	}),
})

const mapCurveGaugeSnapshot = (
	network: NetworkId,
	gauge: CurveGaugeSnapshot
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	gaugeAddress: gauge.gaugeAddress,
	...(gauge.poolAddress != null && {
		$pool: {
			[EntityMetaKey.Selector]: {
				$network: network,
				poolAddress: gauge.poolAddress,
			},
		},
	}),
	name: gauge.name,
	isKilled: gauge.isKilled,
	hasNoCrv: gauge.hasNoCrv,
	...(gauge.gaugeRelativeWeight != null && {
		relativeWeight: gauge.gaugeRelativeWeight,
	}),
	...(gauge.workingSupply != null && {
		workingSupply: gauge.workingSupply,
	}),
	...(gauge.inflationRate != null && {
		inflationRate: gauge.inflationRate,
	}),
	...(gauge.gaugeCrvApy != null && {
		gaugeCrvApyMin: gauge.gaugeCrvApy[0],
		gaugeCrvApyMax: gauge.gaugeCrvApy[1],
	}),
})

const mapCurvePoolSnapshot = (
	network: NetworkId,
	pool: CurvePoolSnapshot
) => {
	const poolSelector = {
		$network: network,
		poolAddress: pool.poolAddress,
	}
	return {
		$network: {
			[EntityMetaKey.Selector]: network,
		},
		poolAddress: pool.poolAddress,
		name: pool.name,
		symbol: pool.symbol,
		registryId: pool.registryId,
		lpTokenAddress: pool.lpTokenAddress,
		...(pool.virtualPrice != null && {
			virtualPrice: pool.virtualPrice,
		}),
		...(pool.amplificationCoefficient != null && {
			amplificationCoefficient: pool.amplificationCoefficient,
		}),
		...(pool.totalSupply != null && {
			totalSupply: pool.totalSupply,
		}),
		...(pool.usdTotal != null && {
			usdTotal: pool.usdTotal,
		}),
		...(pool.isMetaPool != null && {
			isMetaPool: pool.isMetaPool,
		}),
		...(pool.gaugeAddress != null && {
			$gauge: {
				[EntityMetaKey.Selector]: {
					$network: network,
					gaugeAddress: pool.gaugeAddress,
				},
			},
		}),
		...(pool.assetTypeName != null && {
			assetTypeName: pool.assetTypeName,
		}),
		...(pool.creationBlockNumber != null && {
			creationBlockNumber: pool.creationBlockNumber,
		}),
		...(pool.creationTimestampMs != null && {
			creationTimestampMs: pool.creationTimestampMs,
		}),
		coins: pool.coins.map((coin) => (
			mapCurvePoolCoin(poolSelector, coin)
		)),
	}
}

const mapCurveLendingVaultSnapshot = (
	network: NetworkId,
	vault: CurveLendingVaultSnapshot
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	vaultAddress: vault.vaultAddress,
	name: vault.name,
	registryId: vault.registryId,
	controllerAddress: vault.controllerAddress,
	ammAddress: vault.ammAddress,
	monetaryPolicyAddress: vault.monetaryPolicyAddress,
	borrowedAssetAddress: vault.borrowedAsset.address,
	borrowedAssetSymbol: vault.borrowedAsset.symbol,
	borrowedAssetDecimals: vault.borrowedAsset.decimals,
	...(vault.borrowedAsset.usdPrice != null && {
		borrowedAssetUsdPrice: vault.borrowedAsset.usdPrice,
	}),
	collateralAssetAddress: vault.collateralAsset.address,
	collateralAssetSymbol: vault.collateralAsset.symbol,
	collateralAssetDecimals: vault.collateralAsset.decimals,
	...(vault.collateralAsset.usdPrice != null && {
		collateralAssetUsdPrice: vault.collateralAsset.usdPrice,
	}),
	...(vault.gaugeAddress != null && {
		$gauge: {
			[EntityMetaKey.Selector]: {
				$network: network,
				gaugeAddress: vault.gaugeAddress,
			},
		},
	}),
	...(vault.borrowApr != null && {
		borrowApr: vault.borrowApr,
	}),
	...(vault.borrowApy != null && {
		borrowApy: vault.borrowApy,
	}),
	...(vault.lendApr != null && {
		lendApr: vault.lendApr,
	}),
	...(vault.lendApy != null && {
		lendApy: vault.lendApy,
	}),
	...(vault.pricePerShare != null && {
		pricePerShare: vault.pricePerShare,
	}),
	...(vault.totalShares != null && {
		totalShares: vault.totalShares,
	}),
	...(vault.totalSupplied != null && {
		totalSupplied: vault.totalSupplied,
	}),
	...(vault.totalSuppliedUsd != null && {
		totalSuppliedUsd: vault.totalSuppliedUsd,
	}),
	...(vault.totalBorrowed != null && {
		totalBorrowed: vault.totalBorrowed,
	}),
	...(vault.totalBorrowedUsd != null && {
		totalBorrowedUsd: vault.totalBorrowedUsd,
	}),
	...(vault.availableToBorrow != null && {
		availableToBorrow: vault.availableToBorrow,
	}),
	...(vault.availableToBorrowUsd != null && {
		availableToBorrowUsd: vault.availableToBorrowUsd,
	}),
	...(vault.usdTotal != null && {
		usdTotal: vault.usdTotal,
	}),
})

export default {
	source: Source.Curve_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.CurvePool,
			resolve: {
				NetworkPoolAddress: {
					resolve: async ({
						$network,
						poolAddress,
					}: CurvePoolId) => {
						const chainId = eip155ChainId($network)
						const { curvePlatformByChainId } = await import('$/sources/Curve/Rest/constants.ts')
						if (curvePlatformByChainId[chainId] == null)
							throw new Error(`${Source.Curve_Rest}: unsupported chain id ${String(chainId)}`)

						const { getPool } = await import('$/sources/Curve/Rest/queries.ts')
						return mapCurvePoolSnapshot(
							$network,
							await getPool({
								chainId,
								poolAddress,
							})
						)
					},
				},
			},
		})({
			$network: (pool) => pool.$network,
			poolAddress: (pool) => pool.poolAddress,
			name: (pool) => pool.name,
			symbol: (pool) => pool.symbol,
			registryId: (pool) => pool.registryId,
			lpTokenAddress: (pool) => pool.lpTokenAddress,
			virtualPrice: (pool) => pool.virtualPrice,
			amplificationCoefficient: (pool) => pool.amplificationCoefficient,
			totalSupply: (pool) => pool.totalSupply,
			usdTotal: (pool) => pool.usdTotal,
			isMetaPool: (pool) => pool.isMetaPool,
			$gauge: (pool) => pool.$gauge,
			assetTypeName: (pool) => pool.assetTypeName,
			creationBlockNumber: (pool) => pool.creationBlockNumber,
			creationTimestampMs: (pool) => pool.creationTimestampMs,
			$$coins: (pool) => (
				pool.coins.map((coin) => ({
					[EntityMetaKey.Selector]: {
						$pool: coin.$pool[EntityMetaKey.Selector],
						coinAddress: coin.coinAddress,
					},
				}))
			),
		}),

		defineResolver({
			entityType: EntityType.CurvePoolCoin,
			resolve: {
				PoolCoinAddress: {
					resolve: async ({
						$pool,
						coinAddress,
					}: CurvePoolCoinId) => {
						const chainId = eip155ChainId($pool.$network)
						const address = hexLowerOfByteSize(coinAddress, 20)
						if (address == null)
							throw new Error(`${Source.Curve_Rest}: invalid coin address ${coinAddress}`)

						const { getPool } = await import('$/sources/Curve/Rest/queries.ts')
						const pool = await getPool({
							chainId,
							poolAddress: $pool.poolAddress,
						})
						const coin = pool.coins.find((candidate) => candidate.address === address)
						if (coin == null)
							throw new Error(`${Source.Curve_Rest}: pool ${$pool.poolAddress} has no coin ${address}`)

						return mapCurvePoolCoin($pool, coin)
					},
				},
			},
		})({
			$pool: (coin) => coin.$pool,
			coinAddress: (coin) => coin.coinAddress,
			symbol: (coin) => coin.symbol,
			name: (coin) => coin.name,
			decimals: (coin) => coin.decimals,
			poolBalance: (coin) => coin.poolBalance,
			usdPrice: (coin) => coin.usdPrice,
			isBasePoolLpToken: (coin) => coin.isBasePoolLpToken,
		}),

		defineResolver({
			entityType: EntityType.CurveGauge,
			resolve: {
				NetworkGaugeAddress: {
					resolve: async ({
						$network,
						gaugeAddress,
					}: CurveGaugeId) => {
						const chainId = eip155ChainId($network)
						const { getGauge } = await import('$/sources/Curve/Rest/queries.ts')
						return mapCurveGaugeSnapshot(
							$network,
							await getGauge({
								chainId,
								gaugeAddress,
							})
						)
					},
				},
			},
		})({
			$network: (gauge) => gauge.$network,
			gaugeAddress: (gauge) => gauge.gaugeAddress,
			$pool: (gauge) => gauge.$pool,
			name: (gauge) => gauge.name,
			isKilled: (gauge) => gauge.isKilled,
			hasNoCrv: (gauge) => gauge.hasNoCrv,
			relativeWeight: (gauge) => gauge.relativeWeight,
			workingSupply: (gauge) => gauge.workingSupply,
			inflationRate: (gauge) => gauge.inflationRate,
			gaugeCrvApyMin: (gauge) => gauge.gaugeCrvApyMin,
			gaugeCrvApyMax: (gauge) => gauge.gaugeCrvApyMax,
		}),

		defineResolver({
			entityType: EntityType.CurveLendingVault,
			resolve: {
				NetworkVaultAddress: {
					resolve: async ({
						$network,
						vaultAddress,
					}: CurveLendingVaultId) => {
						const chainId = eip155ChainId($network)
						const { curvePlatformByChainId } = await import('$/sources/Curve/Rest/constants.ts')
						if (curvePlatformByChainId[chainId] == null)
							throw new Error(`${Source.Curve_Rest}: unsupported chain id ${String(chainId)}`)

						const { getLendingVault } = await import('$/sources/Curve/Rest/queries.ts')
						return mapCurveLendingVaultSnapshot(
							$network,
							await getLendingVault({
								chainId,
								vaultAddress,
							})
						)
					},
				},
			},
		})({
			$network: (vault) => vault.$network,
			vaultAddress: (vault) => vault.vaultAddress,
			name: (vault) => vault.name,
			registryId: (vault) => vault.registryId,
			controllerAddress: (vault) => vault.controllerAddress,
			ammAddress: (vault) => vault.ammAddress,
			monetaryPolicyAddress: (vault) => vault.monetaryPolicyAddress,
			borrowedAssetAddress: (vault) => vault.borrowedAssetAddress,
			borrowedAssetSymbol: (vault) => vault.borrowedAssetSymbol,
			borrowedAssetDecimals: (vault) => vault.borrowedAssetDecimals,
			borrowedAssetUsdPrice: (vault) => vault.borrowedAssetUsdPrice,
			collateralAssetAddress: (vault) => vault.collateralAssetAddress,
			collateralAssetSymbol: (vault) => vault.collateralAssetSymbol,
			collateralAssetDecimals: (vault) => vault.collateralAssetDecimals,
			collateralAssetUsdPrice: (vault) => vault.collateralAssetUsdPrice,
			$gauge: (vault) => vault.$gauge,
			borrowApr: (vault) => vault.borrowApr,
			borrowApy: (vault) => vault.borrowApy,
			lendApr: (vault) => vault.lendApr,
			lendApy: (vault) => vault.lendApy,
			pricePerShare: (vault) => vault.pricePerShare,
			totalShares: (vault) => vault.totalShares,
			totalSupplied: (vault) => vault.totalSupplied,
			totalSuppliedUsd: (vault) => vault.totalSuppliedUsd,
			totalBorrowed: (vault) => vault.totalBorrowed,
			totalBorrowedUsd: (vault) => vault.totalBorrowedUsd,
			availableToBorrow: (vault) => vault.availableToBorrow,
			availableToBorrowUsd: (vault) => vault.availableToBorrowUsd,
			usdTotal: (vault) => vault.usdTotal,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { curvePlatformByChainId } = await import('$/sources/Curve/Rest/constants.ts')
						if (curvePlatformByChainId[chainId] == null)
							throw new Error(`${Source.Curve_Rest}: unsupported chain id ${String(chainId)}`)

						const {
							listLendingVaults,
							listPools,
						} = await import('$/sources/Curve/Rest/queries.ts')
						if (
							context.providerContinuationToken != null
							&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
						)
							throw new Error(`${Source.Curve_Rest}: invalid pagination continuation`)

						const limit = resolverContextRowLimit(context)
						const offset = context.providerContinuationToken == null ?
							context.pagination.offset ?? 0
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error(`${Source.Curve_Rest}: invalid pagination offset`)
						const [
							pools,
							lendingVaults,
						] = await Promise.all([
							listPools({
								chainId,
							}),
							listLendingVaults({
								chainId,
							}),
						])
						return {
							offset,
							pools: pools
								.slice(offset, offset + limit)
								.map((pool) => ({
									[EntityMetaKey.Selector]: {
										$network: network,
										poolAddress: pool.poolAddress,
									},
								})),
							poolCount: pools.length,
							lendingVaults: lendingVaults
								.slice(offset, offset + limit)
								.map((vault) => ({
									[EntityMetaKey.Selector]: {
										$network: network,
										vaultAddress: vault.vaultAddress,
									},
								})),
							lendingVaultCount: lendingVaults.length,
						}
					},
				},
			},
		})({
			Evm: {
				$$curvePools: {
					select: (snapshot) => snapshot.pools,
					resolveCount: (snapshot) => snapshot.poolCount,
					continuation: (snapshot) => {
						const nextOffset = snapshot.offset + snapshot.pools.length

						return {
							operation: 'network-curve-pools',
							target: 'curve',
							terminal: nextOffset >= snapshot.poolCount,
							...(nextOffset < snapshot.poolCount && {
								token: String(nextOffset),
							}),
						}
					},
				},
				$$curveLendingVaults: {
					select: (snapshot) => snapshot.lendingVaults,
					resolveCount: (snapshot) => snapshot.lendingVaultCount,
					continuation: (snapshot) => {
						const nextOffset = snapshot.offset + snapshot.lendingVaults.length

						return {
							operation: 'network-curve-lending-vaults',
							target: 'curve',
							terminal: nextOffset >= snapshot.lendingVaultCount,
							...(nextOffset < snapshot.lendingVaultCount && {
								token: String(nextOffset),
							}),
						}
					},
				},
			},
		}),
	],
}
