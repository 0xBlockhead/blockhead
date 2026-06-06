import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { cosmosHubCaip2, cosmosHubRpcUrl } from '$/constants/CosmosNetwork.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertCosmosHub = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== cosmosHubCaip2.namespace
		|| network.caip2.reference !== cosmosHubCaip2.reference
	) {
		throw new Error('CometBft_Rest: unsupported network')
	}
}

export default {
	source: Source.CometBft_Rest,

	entityResolvers: [
		defineEntityResolver({
				entityType: EntityType.CosmosBlock,
				resolve: async (entityId) => {
					assertCosmosHub(entityId.$network)
					if (!('height' in entityId))
						throw new Error('CometBft_Rest: CosmosBlock hash lookup is unsupported')

					const { getBlock } = await import('$/sources/CometBft/Rest/queries.ts')
				const wireBlock = await getBlock({
					restBaseUrl: cosmosHubRpcUrl,
					height: entityId.height,
				})
				return {
					hash: wireBlock.result.block_id.hash,
					proposerConsensusAddress: wireBlock.result.block.header.proposer_address,
					timestampMs: Date.parse(wireBlock.result.block.header.time),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosTransaction,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getTx } = await import('$/sources/CometBft/Rest/queries.ts')
				const wireTransaction = await getTx({
					restBaseUrl: cosmosHubRpcUrl,
					txHash: entityId.txHash,
				})
				return {
					$block: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							height: BigInt(wireTransaction.result.height),
						},
					},
					code: wireTransaction.result.tx_result.code,
					gasWanted: BigInt(wireTransaction.result.tx_result.gas_wanted),
					gasUsed: BigInt(wireTransaction.result.tx_result.gas_used),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.CosmosTransaction,
			fieldName: '$block',
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getTx } = await import('$/sources/CometBft/Rest/queries.ts')
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						height: BigInt((await getTx({
							restBaseUrl: cosmosHubRpcUrl,
							txHash: entityId.txHash.replace(/^0x/i, '').toUpperCase(),
						})).result.height),
					},
				}
			},
		}),
	],
}
