import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/$Source.ts'
import type { LifiChain } from '$/sources/Lifi/Rest/types.ts'

const networkEntityFieldsFromLifiChain = (lifiChain: LifiChain) => {
	const logoUri = lifiChain.logoURI?.trim()
	return {
		[EntityMetaKey.Id]: { chainId: lifiChain.id },
		...((
			t,
		) => (
			t == null ?
				{}
			:	{
					$icon: {
						[EntityMetaKey.Id]: { url: t },
						type: MediaType.Image,
					},
				}
		))(logoUri != null && logoUri.length > 0 ? logoUri : undefined),
		blockExplorers: (
			(lifiChain.metamask?.blockExplorerUrls ?? [])
				.map((u) => u.trim())
				.filter((u) => u.length > 0)
				.map((origin) => ({ origin }))
		),
		executionEndpoints: (
			(lifiChain.metamask?.rpcUrls ?? [])
				.map((u) => u.trim())
				.filter((u) => u.length > 0)
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
	],
}
