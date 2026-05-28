import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertBitcoinCashMainnet = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'bip122' || network.caip2.reference !== '000000000000000000651ef99cb9fcbe') {
		throw new Error('BitcoinCashBcmr_Github: unsupported network')
	}
}

export default {
	source: Source.BitcoinCashBcmr_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.BitcoinCashBcmrMetadata,
			resolve: async (entityId) => {
				assertBitcoinCashMainnet(entityId.$network)
				const { getBcmrRegistry } = await import('$/sources/BitcoinCashBcmr/Github/queries.ts')
				const registry = await getBcmrRegistry({ url: entityId.registryUrl })
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
			},
		}),
	],

	entityFieldResolvers: [],
}
