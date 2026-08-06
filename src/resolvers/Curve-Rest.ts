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
import type { CurvePoolSnapshot } from '$/sources/Curve/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type CurvePoolId = EntitySelector<typeof schema, EntityType.CurvePool>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Curve_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Curve_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapCurvePoolSnapshot = (
	network: NetworkId,
	pool: CurvePoolSnapshot
) => ({
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
		gaugeAddress: pool.gaugeAddress,
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
			gaugeAddress: (pool) => pool.gaugeAddress,
			assetTypeName: (pool) => pool.assetTypeName,
			creationBlockNumber: (pool) => pool.creationBlockNumber,
			creationTs: (pool) => pool.creationTs,
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
						return (await listPools({
							chainId,
						}))
							.slice(0, resolverContextRowLimit(context))
							.map((pool) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									poolAddress: pool.poolAddress,
								},
							}))
					},
				},
			},
		})({
			Evm: {
				$$curvePools: (pools) => pools,
			},
		}),
	],
}
