import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	EvmNftFormat,
	EvmNftStandard,
} from '$/constants/Evm.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Eip8004Scan_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmNft,
			resolve: async (entityId) => {
				const { fetchAgentDetail } = await import(
					'$/sources/Eip8004Scan/Rest/queries.ts'
					)
					const detail = await fetchAgentDetail({
					chainId: Number(entityId.$contract.$network.caip2.reference),
					tokenId: entityId.tokenId,
					})
					if (detail == null) {
						throw new Error(
						`Eip8004Scan_Rest: agent ${entityId.$contract.$network.caip2.reference}/${entityId.tokenId} not found`,
						)
					}
				if (detail.contractAddress !== entityId.$contract.address.toLowerCase()) {
						throw new Error(
						`Eip8004Scan_Rest: agent ${entityId.$contract.$network.caip2.reference}/${entityId.$contract.address}/${entityId.tokenId} not found`,
					)
				}
				return {
					standard: EvmNftStandard.Erc721,
					format: EvmNftFormat.Eip8004Registration,
					tokenUri: detail.agentUri,
					agentRegistry: `eip155:${String(detail.chainId)}:${detail.contractAddress}`,
					agentId: detail.tokenId,
					agentUri: detail.agentUri,
					fetchedAt: detail.fetchedAt,
					...(detail.agentWallet != null && {
						$agentWallet: {
							[EntityMetaKey.Id]: {
								address: EvmAddress.assert(detail.agentWallet),
							},
						},
					}),
					...(detail.name != null && { name: detail.name }),
					...(detail.description != null && { description: detail.description }),
					...(detail.image != null && { image: detail.image }),
					...(detail.registrationTypeIri != null && {
						registrationTypeIri: detail.registrationTypeIri,
					}),
					...(detail.x402Support != null && { x402Support: detail.x402Support }),
					...(detail.active != null && { active: detail.active }),
					...(detail.supportedTrust != null && { supportedTrust: detail.supportedTrust }),
					...(detail.contactEndpoint != null && { contactEndpoint: detail.contactEndpoint }),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$eip8004Services',
			resolve: async (
				_scopedEntityId: EntityId<typeof schema, EntityType._Global>,
				context,
			) => {
				const { fetchAgentList } = await import(
					'$/sources/Eip8004Scan/Rest/queries.ts'
				)
				const limit = resolverLoadSubsetRowLimit(context)
				const agents = await fetchAgentList({ limit })
				return (
					agents.map((agent) => ({
							[EntityMetaKey.Id]: {
							$contract: {
								$network: {
									caip2: { namespace: 'eip155' as const, reference: String(agent.chainId) },
								},
								address: EvmAddress.assert(agent.contractAddress),
						},
							tokenId: agent.tokenId,
						},
					}))
				)
			},
		}),
	],
}
