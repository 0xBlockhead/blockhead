import { coinBridgeCapabilityFieldsForToolKey } from '$/constants/Bridge.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { urlEntitiesDeduplicatedSortedFromFaucetUrlStrings } from '$/resolvers/_networkCatalogUrlEntities.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/$Source.ts'
import type { EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
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

const coinBridgeCapabilityRowsForCoin = async (
	entityId: EntityId<typeof schema, EntityType.Coin>,
	context: Parameters<typeof sourcePublicEnv>[0],
) => {
	const { fetchCoinBridgeCapabilityRowsForCoin } = await import(
		'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
	)
	return fetchCoinBridgeCapabilityRowsForCoin(
		entityId.coinId,
		sourcePublicEnv(context, Source.Coingecko_Rest),
	)
}

export default {
	source: Source.Lifi_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network,
			resolve: async (entityId, context) => {
				const { findLifiChainByChainId } = await import('$/sources/Lifi/Rest/queries.ts')
				const lifiChain = await findLifiChainByChainId(entityId.chainId)
				if (lifiChain == null) throw new Error('Lifi_Rest: chain not in LiFi catalog')
				return networkEntityFieldsFromLifiChain(lifiChain)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CoinBridgeCapability,
			resolve: async (entityId) => ({
				toolKey: entityId.toolKey,
				...coinBridgeCapabilityFieldsForToolKey(entityId.toolKey),
			}),
		}),

		defineEntityResolver({
			entityType: EntityType.BridgeRoute,
			resolve: async (entityId) => {
				const { resolveBridgeRouteBundleForQuoteId } = await import(
					'$/sources/Lifi/Rest/routes.ts'
				)
				return (await resolveBridgeRouteBundleForQuoteId(entityId)).routeFields
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BridgeRouteStep,
			resolve: async (entityId) => {
				const { resolveBridgeRouteStepRowForEntityId } = await import(
					'$/sources/Lifi/Rest/routes.ts'
				)
				const { [EntityMetaKey.Id]: _id, ...fields } = await resolveBridgeRouteStepRowForEntityId(entityId)
				return fields
			},
		}),

	],

	entityFieldResolvers: [
		globalNetworkEntitiesFieldResolver,

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$bridgeCapabilities',
			resolve: async (entityId, context) => (
				coinBridgeCapabilityRowsForCoin(entityId, context)
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$outboundBridgeCapabilities',
			resolve: async (entityId, context) => {
				const { resolveCoinIdForCoinInstanceEntityId } = await import(
					'$/sources/Coingecko/Rest/coinInstances.ts'
				)
				const { filterCoinBridgeCapabilityRowsForInstance } = await import(
					'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
				)
				const coinId = await resolveCoinIdForCoinInstanceEntityId(
					entityId,
					sourcePublicEnv(context, Source.Coingecko_Rest),
				)
				if (coinId == null) {
					throw new Error('Lifi_Rest: coin instance not mapped to catalog coin')
				}
				const rows = await coinBridgeCapabilityRowsForCoin({ coinId }, context)
				return filterCoinBridgeCapabilityRowsForInstance(rows, entityId, 'outbound')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$inboundBridgeCapabilities',
			resolve: async (entityId, context) => {
				const { resolveCoinIdForCoinInstanceEntityId } = await import(
					'$/sources/Coingecko/Rest/coinInstances.ts'
				)
				const { filterCoinBridgeCapabilityRowsForInstance } = await import(
					'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
				)
				const coinId = await resolveCoinIdForCoinInstanceEntityId(
					entityId,
					sourcePublicEnv(context, Source.Coingecko_Rest),
				)
				if (coinId == null) {
					throw new Error('Lifi_Rest: coin instance not mapped to catalog coin')
				}
				const rows = await coinBridgeCapabilityRowsForCoin({ coinId }, context)
				return filterCoinBridgeCapabilityRowsForInstance(rows, entityId, 'inbound')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.BridgeRoute,
			fieldName: '$$steps',
			resolve: async (entityId) => {
				const { resolveBridgeRouteBundleForQuoteId } = await import(
					'$/sources/Lifi/Rest/routes.ts'
				)
				return (await resolveBridgeRouteBundleForQuoteId(entityId)).steps
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$blockExplorerUrls',
			resolve: async (entityId, _context) => {
				const {
					blockExplorerCatalogWireFromExplorersAndInfoUrl,
					urlEntitiesDeduplicatedSortedFromBlockExplorerCatalog,
				} = await import('$/resolvers/_networkCatalogUrlEntities.ts')
				const { findLifiChainByChainId } = await import('$/sources/Lifi/Rest/queries.ts')
				const lifiChain = await findLifiChainByChainId(entityId.chainId)
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
