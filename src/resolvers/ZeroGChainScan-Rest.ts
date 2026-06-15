import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { ZeroGNetworkSelector } from '$/schema/ZeroGNetwork.ts'
import { ZeroGConsensusNetworkSelector } from '$/schema/ZeroGConsensusNetwork.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { slug: string }

const assertZeroGMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== '0g') {
		throw new Error('ZeroGChainScan_Rest: unsupported network')
	}
}

export default {
	source: Source.ZeroGChainScan_Rest,

	resolvers: [
		defineResolver(Source.ZeroGChainScan_Rest, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.Slug]: async (entitySelector) => {
				assertZeroGMainnet(entitySelector)
				return {
					$consensusNetwork: {
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
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
				[ZeroGConsensusNetworkSelector.NetworkConsensusNetworkId]: async ({ $network, consensusNetworkId }) => {
				assertZeroGMainnet($network)
				if (consensusNetworkId !== '0g-chain' && consensusNetworkId !== ('slug' in $network ? $network.slug : $network.caip2.reference)) {
					throw new Error(`ZeroGChainScan_Rest: unsupported consensus network ${consensusNetworkId}`)
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
