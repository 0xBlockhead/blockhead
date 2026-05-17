import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { urlEntitiesDeduplicatedSortedFromFaucetUrlStrings } from '$/resolvers/_networkCatalogUrlEntities.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/$Source.ts'
import type { LifiChain } from '$/sources/Lifi/Rest/types.ts'

const networkEntityFieldsFromLifiChain = (lifiChain: LifiChain) => {
	const metamaskRpcUrls = (
		(lifiChain.metamask?.rpcUrls ?? [])
			.map((u) => u.trim())
			.filter((u) => u.length > 0)
	)
	return {
		[EntityMetaKey.Id]: { chainId: lifiChain.id },
		...((
			iconMedia,
		) => (
			iconMedia != null && {
				$icon: iconMedia,
			}
		))(mediaFromUrl(lifiChain.logoURI, MediaType.Image)),
		executionEndpoints: (
			metamaskRpcUrls
				.map((url) => (
					{
						url,
						serviceProvider: ExecutionRpcProvider.Unknown,
						transportType: (
							url.toLowerCase().startsWith('ws') ?
								TransportType.WebSocket
							:
								TransportType.Http
						),
					}
				))
		),
		$$rpcUrls: urlEntitiesDeduplicatedSortedFromFaucetUrlStrings(metamaskRpcUrls),
	}
}

const globalNetworkEntitiesFieldResolver = defineEntityFieldResolver({
	entityType: EntityType._Global,
	fieldName: '$$networks',
	resolve: async () => {
		const { fetchLifiChainsCatalog } = await import('$/sources/Lifi/Rest/queries.ts')
		return (await fetchLifiChainsCatalog()).chains.map(networkEntityFieldsFromLifiChain)
	},
})

export default {
	source: Source.Lifi_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network,
			resolve: async (entityId, context) => {
				const network = (await globalNetworkEntitiesFieldResolver.resolve({}, context)).find((row) => row[EntityMetaKey.Id].chainId === entityId.chainId)
				if (network == null) throw new Error('Lifi_Rest: chain not in LiFi catalog')
				return network
			},
		}),
	],

	entityFieldResolvers: [
		globalNetworkEntitiesFieldResolver,

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$blockExplorerUrls',
			resolve: async (entityId, _context) => {
				const {
					blockExplorerCatalogWireFromExplorersAndInfoUrl,
					urlEntitiesDeduplicatedSortedFromBlockExplorerCatalog,
				} = await import('$/resolvers/_networkCatalogUrlEntities.ts')
				const { fetchLifiChainsCatalog } = await import('$/sources/Lifi/Rest/queries.ts')
				const lifiChain = (await fetchLifiChainsCatalog()).chains.find((row) => row.id === entityId.chainId)
				if (lifiChain == null) throw new Error('Lifi_Rest: chain not in LiFi catalog for block explorer URLs')
				return urlEntitiesDeduplicatedSortedFromBlockExplorerCatalog(
					blockExplorerCatalogWireFromExplorersAndInfoUrl({
						explorers: (
							(lifiChain.metamask?.blockExplorerUrls ?? [])
								.map((u) => u.trim())
								.filter((u) => u.length > 0)
								.map((url) => ({ name: '', url }))
						),
						infoURL: undefined,
					}),
				)
			},
		}),
	],
}
