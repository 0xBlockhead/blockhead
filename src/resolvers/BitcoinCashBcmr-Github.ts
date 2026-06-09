import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EntityIdProjection } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertBitcoinCashMainnet = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'bip122' || network.caip2.reference !== '000000000000000000651ef99cb9fcbe') {
		throw new Error('BitcoinCashBcmr_Github: unsupported network')
	}
}

export default {
	source: Source.BitcoinCashBcmr_Github,

	resolvers: [
		defineResolver(Source.BitcoinCashBcmr_Github, {
			entityType: EntityType.BitcoinCashBcmrMetadata,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertBitcoinCashMainnet(entityId.$network)
				const { getRegistry } = await import('$/sources/BitcoinCashBcmr/Github/queries.ts')
				const registry = await getRegistry({ url: entityId.registryUrl })
				const identity = registry.identities?.[entityId.categoryId]
				if (identity == null) throw new Error(`BitcoinCashBcmr_Github: category not found ${entityId.categoryId}`)
				const latestRevision = (
					registry.latestRevision != null ?
						identity[registry.latestRevision]
					:
						Object.entries(identity).at(-1)?.[1]
				)
				if (latestRevision == null) throw new Error(`BitcoinCashBcmr_Github: category has no revisions ${entityId.categoryId}`)
				return {
					...(latestRevision.name != null && { name: latestRevision.name }),
					...(latestRevision.description != null && { description: latestRevision.description }),
					...(latestRevision.token?.symbol != null && { symbol: latestRevision.token.symbol }),
					...(latestRevision.token?.decimals != null && { decimals: latestRevision.token.decimals }),
				}
			}
			}
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
