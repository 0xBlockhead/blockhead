import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'

export default {
	source: Source.Dune_Rest,

	resolvers: [
		defineResolver(Source.Dune_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_entitySelector, context) => {
				const { getUsage } = await import('$/sources/Dune/Rest/queries.ts')

				const billingPeriod = ((usage) => (
					usage.billingPeriods?.[0] ?? usage.billing_periods?.[0]
				))(
					await getUsage(
						context.publicEnv,
						{},
					),
				)
				if (
					billingPeriod == null
					|| (billingPeriod.credits_used == null && billingPeriod.credits_included == null)
				) throw new Error('Dune_Rest: usage response missing billing credits')
				return {
					...(billingPeriod.credits_used != null && { duneCreditsUsed: billingPeriod.credits_used }),
					...(billingPeriod.credits_included != null && { duneCreditsIncluded: billingPeriod.credits_included }),
				}
			}
			}
		})({
				fields: {
			duneCreditsUsed: (snapshot) => snapshot.duneCreditsUsed,
			duneCreditsIncluded: (snapshot) => snapshot.duneCreditsIncluded,
		},
			}),
	],
}
