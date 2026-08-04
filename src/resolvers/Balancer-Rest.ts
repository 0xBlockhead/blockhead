import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { BalancerPool } from '$/sources/Balancer/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type BalancerPoolId = EntitySelector<typeof schema, EntityType.BalancerPool>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Balancer_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Balancer_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapBalancerPoolSnapshot = (
	network: NetworkId,
	pool: BalancerPool
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	poolId: pool.id,
	address: pool.address,
	name: pool.name,
	poolType: pool.type,
	version: pool.version,
	protocolVersion: pool.protocolVersion,
	vaultAddress: pool.vaultAddress,
	swapFee: pool.swapFee,
	totalLiquidity: pool.totalLiquidity,
	totalShares: pool.totalShares,
})

export default {
	source: Source.Balancer_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.BalancerPool,
			resolve: {
				NetworkPoolId: {
					resolve: async ({
						$network,
						poolId,
					}: BalancerPoolId) => {
						const chainId = eip155ChainId($network)
						const { getPool } = await import('$/sources/Balancer/Rest/queries.ts')
						return mapBalancerPoolSnapshot(
							$network,
							await getPool({
								chainId,
								poolId,
							})
						)
					},
				},
			},
		})({
			$network: (pool) => pool.$network,
			poolId: (pool) => pool.poolId,
			address: (pool) => pool.address,
			name: (pool) => pool.name,
			poolType: (pool) => pool.poolType,
			version: (pool) => pool.version,
			protocolVersion: (pool) => pool.protocolVersion,
			vaultAddress: (pool) => pool.vaultAddress,
			swapFee: (pool) => pool.swapFee,
			totalLiquidity: (pool) => pool.totalLiquidity,
			totalShares: (pool) => pool.totalShares,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { listPools } = await import('$/sources/Balancer/Rest/queries.ts')
						return (await listPools({
							chainId,
							limit: resolverContextRowLimit(context),
						}))
							.map((pool) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									poolId: pool.id,
								},
							}))
					},
				},
			},
		})({
			Evm: {
				$$balancerPools: (pools) => pools,
			},
		}),
	],
} as const satisfies RegisteredSourceResolverModule<Source.Balancer_Rest>
