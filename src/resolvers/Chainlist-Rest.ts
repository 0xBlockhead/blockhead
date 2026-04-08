import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import {
	chainPrimaryExplorerUrl,
	fetchRpcsJson,
	isPublicRpcUrl,
} from '$/sources/Chainlist/Rest/queries.ts'
import {
	findChainByChainId,
	rpcUrlsWithoutHeavyTracking,
} from '$/sources/Chainlist/Rest/rpcsJsonWire.ts'
import { Source } from '$/sources/$Sources.ts'

const networkFieldsFromChain = (chain: (Awaited<ReturnType<typeof fetchRpcsJson>>)[number]) => {
	const rpcUrl = rpcUrlsWithoutHeavyTracking(chain).find(isPublicRpcUrl)
	const explorer = chainPrimaryExplorerUrl(chain)
	return {
		name: chain.title ?? chain.name,
		nativeSymbol: chain.nativeCurrency.symbol,
		...(explorer != null ? { explorerOrigin: explorer } : {}),
		...(rpcUrl != null ? { rpcUrl } : {}),
	}
}

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network,
			source: Source.ChainList,
			resolve: async (entityId) => {
				const chains = await fetchRpcsJson()
				const chain = findChainByChainId(chains, entityId.chainId)
				if (chain == null) return {}
				return {
					[EntityMetaKey.Id]: { chainId: chain.chainId },
					...networkFieldsFromChain(chain),
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$networks',
			source: Source.ChainList,
			resolve: async (_entityId) => {
				const chains = await fetchRpcsJson()
				return (
					chains.map((chain) => ({
						[EntityMetaKey.Id]: { chainId: chain.chainId },
						...networkFieldsFromChain(chain),
					}))
				)
			},
		}),
	],
}
