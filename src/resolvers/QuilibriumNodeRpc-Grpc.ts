import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertQuilibriumMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== 'quilibrium') {
		throw new Error('QuilibriumNodeRpc_Grpc: unsupported network')
	}
}

export default {
	source: Source.QuilibriumNodeRpc_Grpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.QuilibriumFrame,
			resolve: async (entityId) => {
				assertQuilibriumMainnet(entityId.$network)
				return {
					$shard: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							shardKey: entityId.shardKey,
						},
					},
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.QuilibriumShard,
			resolve: async (entityId) => {
				assertQuilibriumMainnet(entityId.$network)
				return {
					...(entityId.shardKey === 'master' && { shardKind: 'master' }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.QuilibriumAccount,
			resolve: async (entityId) => {
				assertQuilibriumMainnet(entityId.$network)
				return {
					accountKind: entityId.accountAddress.startsWith('0x') ? 'implicit' : 'originated',
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.QuilibriumPendingTransaction,
			resolve: async (entityId) => {
				assertQuilibriumMainnet(entityId.$network)
				return {
					transactionType: 'pending',
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.QuilibriumNetwork,
			fieldName: '$masterShard',
			resolve: async (entityId) => {
				assertQuilibriumMainnet(entityId)
				return {
					[EntityMetaKey.Id]: {
						$network: {
							networkSlug: entityId.networkSlug,
						},
						shardKey: 'master',
					},
				}
			},
		}),
	],
}
