import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertZeroGMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== '0g')
		throw new Error('ZeroGChainScan_Rest: unsupported network')
}

export default {
	source: Source.ZeroGChainScan_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.ZeroGConsensusNetwork,
			resolve: {
				NetworkConsensusNetworkId: {
					resolve: async ({ $network, consensusNetworkId }) => {
					assertZeroGMainnet($network)
					if (consensusNetworkId !== '0g-chain' && consensusNetworkId !== ('slug' in $network ? $network.slug : $network.caip2.reference)) {
						throw new Error(`ZeroGChainScan_Rest: unsupported consensus network ${consensusNetworkId}`)
					}
					const { getInfo } = await import('$/sources/ZeroG/ChainScan/Rest/queries.ts')
					return {
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$consensusNetwork: {
										$network,
										consensusNetworkId,
									},
									timestampMs: Date.now(),
									source: Source.ZeroGChainScan_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.ZeroGConsensusNetwork_Timestamp, [], 'sharedStakingStatusSource')]: getInfo().url,
								},
							},
						],
					}
				},
				}
			}
		})({
		$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.ZeroGConsensusNetwork_Timestamp,
			resolve: {
				ConsensusNetworkTimestampMsSource: {
					resolve: async ({ $consensusNetwork, timestampMs, source }) => {
					if (source !== Source.ZeroGChainScan_Rest) throw new Error(`ZeroGChainScan_Rest: unsupported source ${source}`)
					assertZeroGMainnet($consensusNetwork.$network)
					const { getInfo } = await import('$/sources/ZeroG/ChainScan/Rest/queries.ts')
					return {
						$consensusNetwork: {
							[EntityMetaKey.Selector]: $consensusNetwork,
						},
						timestampMs,
						source: Source.ZeroGChainScan_Rest,
						sharedStakingStatusSource: getInfo().url,
					}
				},
				},
			}
		})({
			$consensusNetwork: (timestamp) => timestamp.$consensusNetwork,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			sharedStakingStatusSource: (timestamp) => timestamp.sharedStakingStatusSource,
		}),
	],
} satisfies RegisteredSourceResolverModule
