import { type } from 'arktype'

import { bridgeToolByKey } from '$/constants/Bridge.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { Entity } from '$/schema/$schema.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { UrlString } from '$/schema/$Url.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	LifiBlockExplorerUrlLike,
	LifiChain,
} from '$/sources/Lifi/Rest/types.ts'

const canonicalPublicHttpUrlFromCatalogString = (raw: string): string => {
	const trimmed = raw.trim()
	const absolute = (
		trimmed.startsWith('http://')
		|| trimmed.startsWith('https://') ?
			trimmed
		: trimmed.startsWith('//') ?
			`https:${trimmed}`
		:	`https://${trimmed}`
	)
	return new URL(absolute).toString()
}

const blockExplorerLikeFromExplorersAndInfoUrl = ({
	explorers,
	infoURL,
}: {
	explorers: LifiBlockExplorerUrlLike[] | undefined
	infoURL: string | undefined | null
}) => {
	const infoUrlTrimmed = infoURL?.trim() ?? ''
	return [
		...(explorers ?? []).flatMap((explorer) => {
			const url = explorer.url.trim()
			if (url === '') return []
			const name = explorer.name.trim()
			const standard = explorer.standard == null ? '' : String(explorer.standard).trim()
			const icon = explorer.icon == null ? '' : String(explorer.icon).trim()
			return [{
				origin: url,
				...(name !== '' && { name }),
				...(standard !== '' && { standard }),
				...(icon !== '' && { icon }),
			}]
		}),
		...(
			infoUrlTrimmed !== ''
			&& !(explorers ?? []).some((explorer) => explorer.url.trim() === infoUrlTrimmed) ?
				[{ origin: infoUrlTrimmed }]
			:
				[]
		),
	]
}

const urlEntitiesFromBlockExplorerCatalog = (
	blockExplorers: ReturnType<typeof blockExplorerLikeFromExplorersAndInfoUrl>,
): Entity<typeof schema, EntityType.Url>[] =>
	blockExplorers.flatMap((explorer) => {
		if (explorer.origin === '') return []
		const url = canonicalPublicHttpUrlFromCatalogString(explorer.origin)
		const hrefAsUrlString = UrlString(url)
		if (hrefAsUrlString instanceof type.errors) return []
		const catalogIconResolved = (
			explorer.icon == null || explorer.icon === '' ?
				undefined
			:	resolveMediaUrlTransport(explorer.icon)?.url
		)
		let catalogIconAsUrlString: typeof hrefAsUrlString | undefined
		if (catalogIconResolved != null) {
			const iconParsed = UrlString(catalogIconResolved)
			if (!(iconParsed instanceof type.errors)) catalogIconAsUrlString = iconParsed
		}
		return [{
			[EntityMetaKey.Id]: { url: hrefAsUrlString },
			...(explorer.name != null && explorer.name !== '' && { catalogName: explorer.name }),
			...(explorer.standard != null && explorer.standard !== '' && { catalogStandard: explorer.standard }),
			...(catalogIconAsUrlString != null && { catalogIcon: catalogIconAsUrlString }),
		} as Entity<typeof schema, EntityType.Url>]
	})

const urlEntitiesFromFaucetUrlStrings = (
	faucetUrls: string[],
): Entity<typeof schema, EntityType.Url>[] =>
	faucetUrls.flatMap((raw) => {
		const trimmed = raw.trim()
		if (trimmed === '') return []
		const url = canonicalPublicHttpUrlFromCatalogString(trimmed)
		const hrefAsUrlString = UrlString(url)
		if (hrefAsUrlString instanceof type.errors) return []
		return [{ [EntityMetaKey.Id]: { url: hrefAsUrlString } } as Entity<typeof schema, EntityType.Url>]
	})


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
		$$rpcUrls: urlEntitiesFromFaucetUrlStrings(metamaskRpcUrls),
	}
}

const globalNetworkEntitiesFieldResolver = defineEntityFieldResolver({
	entityType: EntityType._Global,
	fieldName: '$$networks',
	resolve: async () => {
		const { fetchLifiChains } = await import('$/sources/Lifi/Rest/queries.ts')
		return (await singleFlight(fetchLifiChains)()).chains.map(networkEntityFieldsFromLifiChain)
	},
})

const coinBridgeCapabilityRowsForCoin = async (
	entityId: EntityId<typeof schema, EntityType.Coin>,
	context: Parameters<typeof sourcePublicEnv>[0],
) => {
	const { fetchLifiTools } = await import('$/sources/Lifi/Rest/queries.ts')
	const { fetchCoinBridgeCapabilityRowsForCoin } = await import(
		'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
	)
	return fetchCoinBridgeCapabilityRowsForCoin(
		entityId.coinId,
		sourcePublicEnv(context, Source.Coingecko_Rest),
		await singleFlight(fetchLifiTools)(),
	)
}

export default {
	source: Source.Lifi_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network,
			resolve: async (entityId, context) => {
				const { fetchLifiChains } = await import('$/sources/Lifi/Rest/queries.ts')
				const lifiChain = (await singleFlight(fetchLifiChains)()).chains.find((row) => row.id === entityId.chainId)
				if (lifiChain == null) throw new Error('Lifi_Rest: chain not in LiFi catalog')
				return networkEntityFieldsFromLifiChain(lifiChain)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CoinBridgeCapability,
			resolve: async (entityId) => {
				const coinBridgeCapabilityFields = bridgeToolByKey[entityId.toolKey]
				if (coinBridgeCapabilityFields == null) {
					throw new Error(`Bridge: unknown LI.FI tool key ${entityId.toolKey}`)
				}
				return {
					toolKey: entityId.toolKey,
					...coinBridgeCapabilityFields,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BridgeRoute,
			resolve: async (entityId) => {
				const { fetchBridgeRouteBundleForQuoteId } = await import(
					'$/sources/Lifi/Rest/routes.ts'
				)
				return (await singleFlight(fetchBridgeRouteBundleForQuoteId)(entityId)).routeFields
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BridgeRouteStep,
			resolve: async (entityId) => {
				const { fetchBridgeRouteBundleForQuoteId } = await import(
					'$/sources/Lifi/Rest/routes.ts'
				)
				const bundle = await singleFlight(fetchBridgeRouteBundleForQuoteId)(entityId.$route)
				const step = bundle.steps[entityId.index]
				if (step == null) {
					throw new Error(
						`Lifi_Rest: BridgeRouteStep index ${entityId.index} missing on quote route`,
					)
				}
				const { [EntityMetaKey.Id]: _id, ...fields } = step
				return fields
			},
		}),

	],

	entityFieldResolvers: [
		globalNetworkEntitiesFieldResolver,

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$bridgeCapabilities',
			resolve: async (entityId, context) => {
				const rows = await coinBridgeCapabilityRowsForCoin(entityId, context)
				if (rows.length === 0) {
					throw new Error(`Lifi_Rest: no bridge capabilities for coin ${entityId.coinId}`)
				}
				return rows
			},
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
				const { fetchBridgeRouteBundleForQuoteId } = await import(
					'$/sources/Lifi/Rest/routes.ts'
				)
				return (await singleFlight(fetchBridgeRouteBundleForQuoteId)(entityId)).steps
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$blockExplorerUrls',
			resolve: async (entityId, _context) => {
				const { fetchLifiChains } = await import('$/sources/Lifi/Rest/queries.ts')
				const lifiChain = (await singleFlight(fetchLifiChains)()).chains.find((row) => row.id === entityId.chainId)
				if (lifiChain == null) throw new Error('Lifi_Rest: chain not in LiFi catalog for block explorer URLs')
				return urlEntitiesFromBlockExplorerCatalog(
					blockExplorerLikeFromExplorersAndInfoUrl({
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
