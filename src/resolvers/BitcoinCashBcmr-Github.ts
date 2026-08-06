import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.BitcoinCashBcmr_Github,

	resolvers: [
		defineResolver({
			entityType: EntityType.BitcoinCashBcmrMetadata,
			resolve: {
				NetworkCategoryIdRegistryUrl: {
					resolve: async ({ $network, categoryId, registryUrl }) => {
						if (
							!(
								('caip2' in $network
									&& $network.caip2.namespace === networkBySlug['bitcoin-cash'].caip2.namespace
									&& $network.caip2.reference === networkBySlug['bitcoin-cash'].caip2.reference)
								|| ('slug' in $network
									&& $network.slug === networkBySlug['bitcoin-cash'].slug)
							)
						)
							throw new Error('BitcoinCashBcmr_Github: unsupported network')

						const { getCategoryMetadata } = await import('$/sources/BitcoinCashBcmr/Github/queries.ts')
						const { snapshot } = await getCategoryMetadata({
							url: registryUrl,
							categoryId,
						})

						return {
							...(snapshot.name != null && { name: snapshot.name }),
							...(snapshot.description != null && { description: snapshot.description }),
							...(snapshot.token?.symbol != null && { symbol: snapshot.token.symbol }),
							...(snapshot.token?.decimals != null && { decimals: snapshot.token.decimals }),
						}
					},
				},
			},
		})({
			name: (snapshot) => snapshot.name,
			description: (snapshot) => snapshot.description,
			symbol: (snapshot) => snapshot.symbol,
			decimals: (snapshot) => snapshot.decimals,
		}),
	],
} satisfies RegisteredSourceResolverModule
