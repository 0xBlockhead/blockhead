import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const cosmosHubRpcUrl = 'https://cosmos-rpc.publicnode.com'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertCosmosHub = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'cosmos' || network.caip2.reference !== 'cosmoshub-4') {
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
				const { getBlock } = await import('$/sources/CometBft/Rest/queries.ts')
				const row = await getBlock({
					restBaseUrl: cosmosHubRpcUrl,
					height: entityId.height,
				})
				return {
					hash: row.result.block_id.hash,
					proposerConsensusAddress: row.result.block.header.proposer_address,
					timestampMs: Date.parse(row.result.block.header.time),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosTransaction,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getTx } = await import('$/sources/CometBft/Rest/queries.ts')
				const row = await getTx({
					restBaseUrl: cosmosHubRpcUrl,
					txHash: entityId.txHash,
				})
				return {
					$block: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							height: BigInt(row.result.height),
						},
					},
					code: row.result.tx_result.code,
					gasWanted: BigInt(row.result.tx_result.gas_wanted),
					gasUsed: BigInt(row.result.tx_result.gas_used),
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
