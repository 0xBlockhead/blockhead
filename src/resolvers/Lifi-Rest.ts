import type { ChainId } from '$/constants/ChainId.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { defineEntityResolver } from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const transportTypeForUrl = (url: string) => (
	url.toLowerCase().startsWith('ws') ?
		TransportType.WebSocket
	:
		TransportType.Http
)

const lifiChainForNetwork = async (entityId: { chainId: number }) => {
	const { fetchLifiChainsCatalog } = await import('$/sources/Lifi/Rest/queries.ts')
	return (await fetchLifiChainsCatalog()).chains.find((chain) => chain.id === entityId.chainId)
}

export default {
	source: Source.Lifi_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network,
			resolve: async (entityId) => {
				const lifiChain = await lifiChainForNetwork(entityId)
				if (lifiChain == null) throw new Error('Lifi_Rest: chain not in LiFi catalog')
				const chainId = entityId.chainId as ChainId
				return {
					[EntityMetaKey.Id]: entityId,
					lifiKey: lifiChain.key,
					explorers: (
						(lifiChain.metamask?.blockExplorerUrls ?? [])
							.map((u) => u.trim())
							.filter((u) => u.length > 0)
					),
					executionEndpoints: (
						(lifiChain.metamask?.rpcUrls ?? [])
							.map((u) => u.trim())
							.filter((u) => u.length > 0)
							.map((url) => (
								{
									chainId,
									url,
									serviceProvider: ExecutionRpcProvider.Unknown,
									transportType: transportTypeForUrl(url),
								}
							))
					),
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
