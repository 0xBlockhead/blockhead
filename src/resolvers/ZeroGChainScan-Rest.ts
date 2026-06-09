import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertZeroGMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== '0g') {
		throw new Error('ZeroGChainScan_Rest: unsupported network')
	}
}

export default {
	source: Source.ZeroGChainScan_Rest,

	resolvers: [
		defineResolver(Source.ZeroGChainScan_Rest, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertZeroGMainnet(entityId)
				return {
					$consensusNetwork: {
						[EntityMetaKey.Id]: {
							$network: entityId,
							consensusNetworkId: '0g-chain',
						},
					},
				}
			}
			}
		})({
				fields: {
			$consensusNetwork: (snapshot) => snapshot.$consensusNetwork,
		},
			}),

		defineResolver(Source.ZeroGChainScan_Rest, {
			entityType: EntityType.ZeroGConsensusNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				if (entityId.consensusNetworkId !== '0g-chain' && entityId.consensusNetworkId !== ('networkSlug' in entityId.$network ? entityId.$network.networkSlug : entityId.$network.caip2.reference)) {
					throw new Error(`ZeroGChainScan_Rest: unsupported consensus network ${entityId.consensusNetworkId}`)
				}
				const { getInfo } = await import('$/sources/ZeroG/ChainScan/Rest/queries.ts')
				return {
					sharedStakingStatusSource: getInfo().url,
				}
			}
			}
		})({
				fields: {
			sharedStakingStatusSource: (snapshot) => snapshot.sharedStakingStatusSource,
		},
			}),
	],
}
