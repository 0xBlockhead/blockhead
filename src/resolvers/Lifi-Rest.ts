import { defineEntityResolver } from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { fetchLifiChainsCatalog } from '$/sources/Lifi/Rest/queries.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network,
			source: Source.LiFi,
			resolve: async (entityId) => {
				const { chains } = await fetchLifiChainsCatalog()
				const row = chains.find((c) => c.id === entityId.chainId)
				if (row == null) return {}
				return {
					[EntityMetaKey.Id]: entityId,
					lifiKey: row.key,
				}
			},
		}),
	],
	entityFieldResolvers: [],
}
