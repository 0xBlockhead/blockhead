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

						const { getRegistry } = await import('$/sources/BitcoinCashBcmr/Github/queries.ts')
						const registry = await getRegistry(
							{ url: registryUrl }
						)
						const registryIdentity = registry.identities?.[categoryId]
						if (registryIdentity == null)
							throw new Error(`BitcoinCashBcmr_Github: category not found ${categoryId}`)

						const latestRevision = (
							registry.latestRevision != null ?
								registryIdentity[registry.latestRevision]
							:
								Object.entries(registryIdentity).at(-1)?.[1]
						)
						if (latestRevision == null)
							throw new Error(`BitcoinCashBcmr_Github: category has no revisions ${categoryId}`)

						return {
							...(latestRevision.name != null && { name: latestRevision.name }),
							...(latestRevision.description != null && { description: latestRevision.description }),
							...(latestRevision.token?.symbol != null && { symbol: latestRevision.token.symbol }),
							...(latestRevision.token?.decimals != null && { decimals: latestRevision.token.decimals }),
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
