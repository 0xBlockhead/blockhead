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
						const { getExplorerIdentity } = await import('$/sources/ZeroG/ChainScan/Rest/queries.ts')
						const identity = await getExplorerIdentity()
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
										[entityFieldAddressKey(EntityType.ZeroGConsensusNetwork_Timestamp, [], 'sharedStakingStatusSource')]: identity.url,
									},
								},
							],
						}
					},
				},
			},
		})({
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

	],
} satisfies RegisteredSourceResolverModule
