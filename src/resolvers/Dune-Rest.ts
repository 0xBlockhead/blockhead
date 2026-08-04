import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.Dune_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const {
							getUsage,
							readUsageCredits,
						} = await import('$/sources/Dune/Rest/queries.ts')

						const billingPeriod = readUsageCredits(
							await getUsage(
								context.publicEnv,
								{}
							)
						)
						return {
							...(billingPeriod.credits_used != null && { duneCreditsUsed: billingPeriod.credits_used }),
							...(billingPeriod.credits_included != null && { duneCreditsIncluded: billingPeriod.credits_included }),
						}
					},
				},
			},
		})({
			duneCreditsUsed: (snapshot) => snapshot.duneCreditsUsed,
			duneCreditsIncluded: (snapshot) => snapshot.duneCreditsIncluded,
		}),
	],
} satisfies RegisteredSourceResolverModule
