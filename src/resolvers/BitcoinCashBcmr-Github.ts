import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { bitcoinNetworkBySlug } from '$/constants/BitcoinNetwork.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { BitcoinCashBcmrMetadataSelector } from '$/schema/BitcoinCashBcmrMetadata.ts'

export default {
	source: Source.BitcoinCashBcmr_Github,

	resolvers: [
		defineResolver(Source.BitcoinCashBcmr_Github, {
			entityType: EntityType.BitcoinCashBcmrMetadata,
			resolve: {
				[BitcoinCashBcmrMetadataSelector.NetworkCategoryIdRegistryUrl]: async ({ $network, categoryId, registryUrl }) => {
					if (
						!(
							('caip2' in $network
								&& $network.caip2.namespace === bitcoinNetworkBySlug['bitcoin-cash'].caip2.namespace
								&& $network.caip2.reference === bitcoinNetworkBySlug['bitcoin-cash'].caip2.reference)
							|| ('slug' in $network
								&& $network.slug === bitcoinNetworkBySlug['bitcoin-cash'].slug)
						)
					)
						throw new Error('BitcoinCashBcmr_Github: unsupported network')

					const { getRegistry } = await import('$/sources/BitcoinCashBcmr/Github/queries.ts')
					const registry = await getRegistry({ url: registryUrl })
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
		})({
			fields: {
				name: (snapshot) => snapshot.name,
				description: (snapshot) => snapshot.description,
				symbol: (snapshot) => snapshot.symbol,
				decimals: (snapshot) => snapshot.decimals,
			},
		}),
	],
}
