import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { QuilibriumFrameSelector } from '$/schema/QuilibriumFrame.ts'
import { QuilibriumShardSelector } from '$/schema/QuilibriumShard.ts'
import { QuilibriumAccountSelector } from '$/schema/QuilibriumAccount.ts'
import { QuilibriumPendingTransactionSelector } from '$/schema/QuilibriumPendingTransaction.ts'
import { QuilibriumNetworkSelector } from '$/schema/QuilibriumNetwork.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { slug: string }

const assertQuilibriumMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'quilibrium') {
		throw new Error('QuilibriumNodeRpc_Grpc: unsupported network')
	}
}

export default {
	source: Source.QuilibriumNodeRpc_Grpc,

	resolvers: [
		defineResolver(Source.QuilibriumNodeRpc_Grpc, {
			entityType: EntityType.QuilibriumFrame,
			resolve: {
				[QuilibriumFrameSelector.NetworkFrameNumberShardKey]: async ({ $network, shardKey }) => {
				assertQuilibriumMainnet($network)
				return {
					$shard: {
						[EntityMetaKey.Selector]: {
							$network: $network,
							shardKey: shardKey,
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
				[QuilibriumShardSelector.NetworkShardKey]: async ({ $network, shardKey }) => {
				assertQuilibriumMainnet($network)
				return {
					...(shardKey === 'master' && { shardKind: 'master' }),
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
				[QuilibriumAccountSelector.NetworkAccountAddress]: async ({ $network, accountAddress }) => {
				assertQuilibriumMainnet($network)
				return {
					accountKind: accountAddress.startsWith('0x') ? 'implicit' : 'originated',
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
				[QuilibriumPendingTransactionSelector.NetworkTransactionHash]: async ({ $network }) => {
				assertQuilibriumMainnet($network)
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
				[QuilibriumNetworkSelector.Slug]: async (entitySelector) => {
				assertQuilibriumMainnet(entitySelector)
				return {
					[EntityMetaKey.Selector]: {
						$network: {
							slug: entitySelector.slug,
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
