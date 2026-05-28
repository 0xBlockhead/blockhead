import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
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
			entityType: EntityType.Eip8004Service,
			resolve: async (entityId) => {
				const { fetchEip8004ScanAgentDetail } = await import(
					'$/sources/Eip8004Scan/Rest/queries.ts'
					)
					const detail = await fetchEip8004ScanAgentDetail({
						chainId: Number(entityId.$network.caip2.reference),
						identityId: entityId.identityId,
					})
					if (detail == null) {
						throw new Error(
							`Eip8004Scan_Rest: agent ${entityId.$network.caip2.reference}/${entityId.identityId} not found`,
						)
					}
				return {
					$registry: {
							[EntityMetaKey.Id]: {
								$network: {
									caip2: { namespace: 'eip155' as const, reference: String(detail.chainId) },
								},
								address: EvmAddress.assert(detail.contractAddress),
							},
						},
					registrationUri: detail.registrationUri,
					fetchedAt: detail.fetchedAt,
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
				const { fetchEip8004ScanAgentList } = await import(
					'$/sources/Eip8004Scan/Rest/queries.ts'
				)
				const limit = resolverLoadSubsetRowLimit(context)
				const rows = await fetchEip8004ScanAgentList({ limit })
				return (
					rows.map((row) => ({
							[EntityMetaKey.Id]: {
								$network: {
									caip2: { namespace: 'eip155' as const, reference: String(row.chainId) },
								},
								identityId: row.identityId,
						},
					}))
				)
			},
		}),
	],
}
