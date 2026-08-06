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
	CurvePoolCoinSnapshot,
	CurvePoolSnapshot,
} from '$/sources/Curve/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type CurvePoolId = EntitySelector<typeof schema, EntityType.CurvePool>
type CurveGaugeId = EntitySelector<typeof schema, EntityType.CurveGauge>
type CurvePoolCoinId = EntitySelector<typeof schema, EntityType.CurvePoolCoin>

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
		...(pool.creationTs != null && {
			creationTs: pool.creationTs,
		}),
		coins: pool.coins.map((coin) => (
			mapCurvePoolCoin(poolSelector, coin)
		)),
	}
}

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
			creationTs: (pool) => pool.creationTs,
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
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { curvePlatformByChainId } = await import('$/sources/Curve/Rest/constants.ts')
						if (curvePlatformByChainId[chainId] == null)
							throw new Error(`${Source.Curve_Rest}: unsupported chain id ${String(chainId)}`)

						const { listPools } = await import('$/sources/Curve/Rest/queries.ts')
						const pools = await listPools({
							chainId,
						})
						return {
							pools: pools
								.slice(0, resolverContextRowLimit(context))
								.map((pool) => ({
									[EntityMetaKey.Selector]: {
										$network: network,
										poolAddress: pool.poolAddress,
									},
								})),
							totalCount: pools.length,
						}
					},
				},
			},
		})({
			Evm: {
				$$curvePools: {
					select: (snapshot) => snapshot.pools,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),
	],
}
