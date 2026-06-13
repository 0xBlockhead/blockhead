import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertQuilibriumMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== 'quilibrium') {
		throw new Error('QuilibriumNodeRpc_Grpc: unsupported network')
	}
}

export default {
	source: Source.QuilibriumNodeRpc_Grpc,

	resolvers: [
		defineResolver(Source.QuilibriumNodeRpc_Grpc, {
			entityType: EntityType.QuilibriumFrame,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertQuilibriumMainnet(entityId.$network)
				return {
					$shard: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							shardKey: entityId.shardKey,
						},
					},
				}
			}
			}
		})({
				fields: {
			$shard: (snapshot) => snapshot.$shard,
		},
			}),

		defineResolver(Source.QuilibriumNodeRpc_Grpc, {
			entityType: EntityType.QuilibriumShard,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertQuilibriumMainnet(entityId.$network)
				return {
					...(entityId.shardKey === 'master' && { shardKind: 'master' }),
				}
			}
			}
		})({
				fields: {
			shardKind: (snapshot) => snapshot.shardKind,
		},
			}),

		defineResolver(Source.QuilibriumNodeRpc_Grpc, {
			entityType: EntityType.QuilibriumAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertQuilibriumMainnet(entityId.$network)
				return {
					accountKind: entityId.accountAddress.startsWith('0x') ? 'implicit' : 'originated',
				}
			}
			}
		})({
				fields: {
			accountKind: (snapshot) => snapshot.accountKind,
		},
			}),

		defineResolver(Source.QuilibriumNodeRpc_Grpc, {
			entityType: EntityType.QuilibriumPendingTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertQuilibriumMainnet(entityId.$network)
				return {
					transactionType: 'pending',
				}
			}
			}
		})({
				fields: {
			transactionType: (snapshot) => snapshot.transactionType,
		},
			}),

		defineResolver(Source.QuilibriumNodeRpc_Grpc, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertQuilibriumMainnet(entityId)
				return {
					[EntityMetaKey.Id]: {
						$network: {
							networkSlug: entityId.networkSlug,
						},
						shardKey: 'master',
					},
				}
			}
			}
		})({
				fields: {
			$masterShard: (snapshot) => snapshot,
		},
			}),
	],
}
