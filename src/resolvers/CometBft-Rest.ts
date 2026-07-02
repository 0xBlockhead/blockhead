import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { cosmosNetworkBySlug } from '$/constants/CosmosNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { CosmosBlockSelector } from '$/schema/CosmosBlock.ts'
import { CosmosTransactionSelector } from '$/schema/CosmosTransaction.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const assertCosmosHub = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== cosmosNetworkBySlug.cosmos.caip2.namespace
		|| network.caip2.reference !== cosmosNetworkBySlug.cosmos.caip2.reference
	) {
		throw new Error('CometBft_Rest: unsupported network')
	}
}

export default {
	source: Source.CometBft_Rest,

	resolvers: [
		defineResolver(Source.CometBft_Rest, {
			entityType: EntityType.CosmosBlock,
			resolve: {
				[CosmosBlockSelector.NetworkHeight]: async ({ $network, height }) => {
					assertCosmosHub($network)

					const { getBlock } = await import('$/sources/CometBft/Rest/queries.ts')
					const wireBlock = await getBlock({
						restBaseUrl: cosmosNetworkBySlug.cosmos.cometBftRestBaseUrl,
						height,
					})
					return {
						hash: wireBlock.result.block_id.hash,
						proposerConsensusAddress: wireBlock.result.block.header.proposer_address,
						timestampMs: Date.parse(wireBlock.result.block.header.time),
					}
				}
			},
		})({
			fields: {
				hash: (snapshot) => snapshot.hash,
				proposerConsensusAddress: (snapshot) => snapshot.proposerConsensusAddress,
				timestampMs: (snapshot) => snapshot.timestampMs,
			},
		}),

		defineResolver(Source.CometBft_Rest, {
			entityType: EntityType.CosmosTransaction,
			resolve: {
				[CosmosTransactionSelector.NetworkTxHash]: async ({ $network, txHash }) => {
					assertCosmosHub($network)
					const { getTx } = await import('$/sources/CometBft/Rest/queries.ts')
					const wireTransaction = await getTx({
						restBaseUrl: cosmosNetworkBySlug.cosmos.cometBftRestBaseUrl,
						txHash: txHash,
					})
					return {
						$block: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								height: BigInt(wireTransaction.result.height),
							},
						},
						code: wireTransaction.result.tx_result.code,
						gasWanted: BigInt(wireTransaction.result.tx_result.gas_wanted),
						gasUsed: BigInt(wireTransaction.result.tx_result.gas_used),
					}
				}
			},
		})({
			fields: {
				$block: (snapshot) => snapshot.$block,
				code: (snapshot) => snapshot.code,
				gasWanted: (snapshot) => snapshot.gasWanted,
				gasUsed: (snapshot) => snapshot.gasUsed,
			},
		}),
	],
}
