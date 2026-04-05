// Types/constants
import type { EntityFieldResolver } from '$/resolvers/$EntityFieldResolver.ts'
import type { EntityResolver } from '$/resolvers/$EntityResolver.ts'
import { sliceRowsForResolverSubset } from '$/data/tanstackDb/resolverLoadSubset.ts'
import type { Entity } from '$/schema/$schema.ts'
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
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'


// Functions
const networkEntityFromChainlist = (
	chain: ChainlistRpcsJsonChain,
): Entity<EntityType.Network> => {
	const rpcUrls = rpcUrlsWithoutHeavyTracking(chain).filter(isPublicRpcUrl)
	const rpcUrl = rpcUrls[0]
	const explorer = chainPrimaryExplorerUrl(chain)
	return {
		$id: { chainId: chain.chainId },
		name: chain.title ?? chain.name,
		nativeSymbol: chain.nativeCurrency.symbol,
		...(explorer != null ? { explorerOrigin: explorer } : {}),
		...(rpcUrl != null ? { rpcUrl } : {}),
	}
}

const chainlistNetworkResolver: EntityResolver<EntityType.Network> = {
	entityType: EntityType.Network,
	resolve: async (entityId) => {
		const chains = await fetchRpcsJson()
		const chain = findChainByChainId(chains, entityId.chainId)
		return (
			chain != null ?
				networkEntityFromChainlist(chain)
			:	{}
		)
	},
}

const globalNetworksFromChainlist: EntityFieldResolver<EntityType._Global, '$$networks'> = {
	entityType: EntityType._Global,
	field: '$$networks',
	resolve: async (_entityId, context) => {
		const chains = await fetchRpcsJson()
		const rows = chains.map((chain) => networkEntityFromChainlist(chain))
		return sliceRowsForResolverSubset(
			rows,
			context?.loadSubset,
		)
	},
}

export default {
	source: Source.ChainList,
	entityResolvers: [chainlistNetworkResolver],
	entityFieldResolvers: [globalNetworksFromChainlist],
} satisfies {
	source: Source
	entityResolvers: readonly [typeof chainlistNetworkResolver]
	entityFieldResolvers: readonly [typeof globalNetworksFromChainlist]
}
