import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const assertBitcoinCashMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.BitcoinCash || network.reference !== '000000000000000000651ef99cb9fcbe') {
		throw new Error(`BitcoinCashBcmr_Github: unsupported network ${network.namespace}:${network.reference}`)
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
