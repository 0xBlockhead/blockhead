import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertZeroGMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== '0g') {
		throw new Error('ZeroGChainScan_Rest: unsupported network')
	}
}

export default {
	source: Source.ZeroGChainScan_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.ZeroGNetwork,
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId)
				return {
					$consensusNetwork: {
						[EntityMetaKey.Id]: {
							$network: entityId,
							consensusNetworkId: '0g-chain',
						},
					},
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ZeroGConsensusNetwork,
				resolve: async (entityId) => {
					assertZeroGMainnet(entityId.$network)
					if (entityId.consensusNetworkId !== '0g-chain' && entityId.consensusNetworkId !== ('networkSlug' in entityId.$network ? entityId.$network.networkSlug : entityId.$network.caip2.reference)) {
						throw new Error(`ZeroGChainScan_Rest: unsupported consensus network ${entityId.consensusNetworkId}`)
					}
				const { zeroGChainScanInfo } = await import('$/sources/ZeroG/ChainScan/Rest/queries.ts')
				return {
					sharedStakingStatusSource: zeroGChainScanInfo.url,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.ZeroGNetwork,
			fieldName: '$consensusNetwork',
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId)
				return {
					[EntityMetaKey.Id]: {
						$network: entityId,
						consensusNetworkId: '0g-chain',
					},
				}
			},
		}),
	],
}
