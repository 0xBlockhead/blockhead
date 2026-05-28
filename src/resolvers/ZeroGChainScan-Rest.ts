import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const assertZeroGMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.ZeroG || network.reference !== 'mainnet') {
		throw new Error(`ZeroGChainScan_Rest: unsupported network ${network.namespace}:${network.reference}`)
	}
}

export default {
	source: Source.ZeroGChainScan_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.ZeroGConsensusNetwork,
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				if (entityId.consensusNetworkId !== '0g-chain' && entityId.consensusNetworkId !== entityId.$network.reference) {
					throw new Error(`ZeroGChainScan_Rest: unsupported consensus network ${entityId.consensusNetworkId}`)
				}
				const { zeroGChainScanInfo } = await import('$/sources/ZeroG/ChainScan/Rest/queries.ts')
				return {
					sharedStakingStatusSource: zeroGChainScanInfo.url,
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
