import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertCosmosHub = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== networkBySlug.cosmos.caip2.namespace
		|| network.caip2.reference !== networkBySlug.cosmos.caip2.reference
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
				NetworkHeight: {
					resolve: async ({ $network, height }) => {
						assertCosmosHub($network)

						const { getBlock } = await import('$/sources/CometBft/Rest/queries.ts')
						const wireBlock = await getBlock({
							height,
						})
						return {
							hash: wireBlock.result.block_id.hash,
							proposerConsensusAddress: wireBlock.result.block.header.proposer_address,
							timestampMs: Date.parse(wireBlock.result.block.header.time),
						}
					},
				}
			},
		})({
				hash: (snapshot) => snapshot.hash,
				proposerConsensusAddress: (snapshot) => snapshot.proposerConsensusAddress,
				timestampMs: (snapshot) => snapshot.timestampMs,
			}),

		defineResolver(Source.CometBft_Rest, {
			entityType: EntityType.CosmosTransaction,
			resolve: {
				NetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						assertCosmosHub($network)
						const { getTx } = await import('$/sources/CometBft/Rest/queries.ts')
						const wireTransaction = await getTx({
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
					},
				}
			},
		})({
				$block: (snapshot) => snapshot.$block,
				code: (snapshot) => snapshot.code,
				gasWanted: (snapshot) => snapshot.gasWanted,
				gasUsed: (snapshot) => snapshot.gasUsed,
			}),
	],
}
