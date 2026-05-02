import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import {
	childLayerChainIdsForParent,
	networkFieldBagFromChain,
} from '$/sources/Chainlist/Rest/networkFieldBagFromChain.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Chainlist_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network,
			resolve: async (entityId) => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const { findChainByChainId } = await import('$/sources/Chainlist/Rest/rpcsJsonWire.ts')
				const chains = await fetchRpcsJson()
				const chain = findChainByChainId(chains, entityId.chainId)
				if (chain == null) throw new Error('Chainlist_Rest: chain id not in rpcs.json')
				return networkFieldBagFromChain(chain, chains)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$networks',
			resolve: async (_entityId) => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const chains = await fetchRpcsJson()
				return (
					chains.map((chain) => (
						networkFieldBagFromChain(chain, chains)
					))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$childNetworks',
			resolve: async (entityId) => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const { findChainByChainId } = await import('$/sources/Chainlist/Rest/rpcsJsonWire.ts')
				const chains = await fetchRpcsJson()
				if (findChainByChainId(chains, entityId.chainId) == null) {
					return []
				}
				return (
					childLayerChainIdsForParent(chains, entityId.chainId)
						.map((cid) => {
							const chain = findChainByChainId(chains, cid)
							return (
								chain == null ?
									null
								:	networkFieldBagFromChain(chain, chains)
							)
						})
						.filter((row) => row != null)
				)
			},
		}),
	],
}
