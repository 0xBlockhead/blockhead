import { defineEntityResolver } from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { getUsage } from '$/sources/Dune/Rest/queries.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType._Global,
			source: Source.Dune,
			resolve: async (entityId) => {
				try {
					const usage = await getUsage({})
					const period = usage.billingPeriods?.[0] ?? usage.billing_periods?.[0]
					const used = period?.credits_used
					const included = period?.credits_included
					if (used == null && included == null) return {}
					return {
						[EntityMetaKey.Id]: entityId,
						...(used != null ? { duneCreditsUsed: used } : {}),
						...(included != null ? { duneCreditsIncluded: included } : {}),
					}
				} catch {
					return {}
				}
			},
		}),
	],
	entityFieldResolvers: [],
}
