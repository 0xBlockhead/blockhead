import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const assertQuilibriumMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Quilibrium || network.reference !== 'mainnet') {
		throw new Error(`QuilibriumNodeRpc_Grpc: unsupported network ${network.namespace}:${network.reference}`)
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

	entityFieldResolvers: [],
}
