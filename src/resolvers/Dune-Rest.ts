import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Dune_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType._Global,
			resolve: async (entityId, loadSubset) => {
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { getUsage } = await import('$/sources/Dune/Rest/queries.ts')

				const usage = await getUsage(
					sourcePublicEnv(loadSubset, Source.Dune_Rest),
					{},
				)
				const billingPeriod = usage.billingPeriods?.[0] ?? usage.billing_periods?.[0]
				if (
					billingPeriod == null
					|| (billingPeriod.credits_used == null && billingPeriod.credits_included == null)
				) throw new Error('Dune_Rest: usage response missing billing credits')
				return {
					[EntityMetaKey.Id]: entityId,
					...(billingPeriod.credits_used != null ? { duneCreditsUsed: billingPeriod.credits_used } : {}),
					...(billingPeriod.credits_included != null ? { duneCreditsIncluded: billingPeriod.credits_included } : {}),
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
