import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import { ZeroGNetworkSelector } from '$/schema/ZeroGNetwork.ts'
import { ZeroGConsensusNetworkSelector } from '$/schema/ZeroGConsensusNetwork.ts'
import { ZeroGConsensusNetwork_TimestampSelector } from '$/schema/ZeroGConsensusNetwork_Timestamp.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { slug: string }

const zeroGChainScanBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.ZeroGChainScan_Rest
		&& binding.target.kind === SourceTargetKind.Eip155Chain
		&& binding.target.key === '16661'
	))

if (zeroGChainScanBindings.length !== 1)
	throw new Error('ZeroGChainScan_Rest: canonical 0G mainnet source binding is missing or ambiguous')

const zeroGChainScanBinding = zeroGChainScanBindings[0]

const assertZeroGMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== '0g') {
		throw new Error('ZeroGChainScan_Rest: unsupported network')
	}
}

export default {
	source: Source.ZeroGChainScan_Rest,

	resolvers: [
		defineResolver(Source.ZeroGChainScan_Rest, {
			entityType: EntityType.ZeroGConsensusNetwork,
			resolve: {
				[ZeroGConsensusNetworkSelector.NetworkConsensusNetworkId]: {
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
									[entityFieldAddressKey(EntityType.ZeroGConsensusNetwork_Timestamp, [], 'sharedStakingStatusSource')]: getInfo(zeroGChainScanBinding).url,
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

		defineResolver(Source.ZeroGChainScan_Rest, {
			entityType: EntityType.ZeroGConsensusNetwork_Timestamp,
			resolve: {
				[ZeroGConsensusNetwork_TimestampSelector.ConsensusNetworkTimestampMsSource]: {
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
						sharedStakingStatusSource: getInfo(zeroGChainScanBinding).url,
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
}
