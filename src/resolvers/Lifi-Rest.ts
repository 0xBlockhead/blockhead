import { type } from 'arktype'

import { bridgeToolByKey } from '$/constants/Bridge.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineResolver,
	type SourceResolverContext,
} from '$/resolvers/$resolvers.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
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
		:
			`https://${trimmed}`
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
			:
				resolveMediaUrlTransport(explorer.icon)?.url
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
		[EntityMetaKey.Id]: { caip2: { namespace: 'eip155' as const, reference: String(lifiChain.id) } },
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

const coinBridgeCapabilityRowsForCoin = async (
	entityId: EntityId<typeof schema, EntityType.Coin>,
	context: SourceResolverContext<Source.Lifi_Rest>,
) => {
	const { fetchTools } = await import('$/sources/Lifi/Rest/queries.ts')
	const { fetchCoinBridgeCapabilityRowsForCoin } = await import(
		'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
	)
	return fetchCoinBridgeCapabilityRowsForCoin(
		entityId.coinId,
		context.publicEnv,
		await singleFlight(fetchTools)(),
	)
}

export default {
	source: Source.Lifi_Rest,

	resolvers: [
		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
					const lifiChain = (await singleFlight(fetchChains)()).chains.find((lifiChainEntry) => lifiChainEntry.id === Number(entityId.caip2.reference))
				if (lifiChain == null) throw new Error('Lifi_Rest: chain not in LiFi catalog')
				return networkEntityFieldsFromLifiChain(lifiChain)
			}
			},
			fields: {
				$icon: (network) => network.$icon,
				executionEndpoints: (network) => network.executionEndpoints,
				$$rpcUrls: (network) => network.$$rpcUrls,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.CoinBridgeCapability,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const coinBridgeCapabilityFields = bridgeToolByKey[entityId.toolKey]
				if (coinBridgeCapabilityFields == null) {
					throw new Error(`Lifi_Rest: unknown LI.FI tool key ${entityId.toolKey}`)
				}
				return {
					toolKey: entityId.toolKey,
					...coinBridgeCapabilityFields,
				}
			}
			},
			fields: {
				toolKey: (capability) => capability.toolKey,
				railId: (capability) => capability.railId,
				settlementModel: (capability) => capability.settlementModel,
				verificationModel: (capability) => capability.verificationModel,
				assetOutcome: (capability) => capability.assetOutcome,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.BridgeRoute,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBridgeRouteBundleForQuoteId } = await import(
					'$/sources/Lifi/Rest/routes.ts'
				)
				return (await singleFlight(fetchBridgeRouteBundleForQuoteId)(entityId)).routeFields
			}
			},
			fields: {
				$$steps: (route) => route.$$steps,
				$fromNetwork: (route) => route.$fromNetwork,
				$toNetwork: (route) => route.$toNetwork,
				fromAmount: (route) => route.fromAmount,
				toAmount: (route) => route.toAmount,
				toAmountMin: (route) => route.toAmountMin,
				estimatedCostUsd: (route) => route.estimatedCostUsd,
				estimatedDurationSeconds: (route) => route.estimatedDurationSeconds,
				tags: (route) => route.tags,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.BridgeRouteStep,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
				stepType: (step) => step.stepType,
				tool: (step) => step.tool,
				$fromNetwork: (step) => step.$fromNetwork,
				$toNetwork: (step) => step.$toNetwork,
				$fromToken: (step) => step.$fromToken,
				$toToken: (step) => step.$toToken,
				railId: (step) => step.railId,
				settlementModel: (step) => step.settlementModel,
				verificationModel: (step) => step.verificationModel,
				assetOutcome: (step) => step.assetOutcome,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
				return (await singleFlight(fetchChains)()).chains.map(networkEntityFieldsFromLifiChain)
			}
			},
			fields: {
				$$evmNetworks: (networks) => networks,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				return coinBridgeCapabilityRowsForCoin(entityId, context)
			}
			},
			fields: {
				$$bridgeCapabilities: (capabilities) => capabilities,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { resolveCoinIdForCoinInstanceEntityId } = await import(
					'$/sources/Coingecko/Rest/coinInstances.ts'
				)
				const { filterCoinBridgeCapabilityRowsForInstance } = await import(
					'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
				)
				const coinId = await resolveCoinIdForCoinInstanceEntityId(
					entityId,
					context.publicEnv,
				)
				if (coinId == null) {
					throw new Error('Lifi_Rest: coin instance not mapped to catalog coin')
				}
				const bridgeCapabilities = await coinBridgeCapabilityRowsForCoin({ coinId }, context)
				return filterCoinBridgeCapabilityRowsForInstance(bridgeCapabilities, entityId, 'outbound')
			}
			},
			fields: {
				$$outboundBridgeCapabilities: (capabilities) => capabilities,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { resolveCoinIdForCoinInstanceEntityId } = await import(
					'$/sources/Coingecko/Rest/coinInstances.ts'
				)
				const { filterCoinBridgeCapabilityRowsForInstance } = await import(
					'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
				)
				const coinId = await resolveCoinIdForCoinInstanceEntityId(
					entityId,
					context.publicEnv,
				)
				if (coinId == null) {
					throw new Error('Lifi_Rest: coin instance not mapped to catalog coin')
				}
				const bridgeCapabilities = await coinBridgeCapabilityRowsForCoin({ coinId }, context)
				return filterCoinBridgeCapabilityRowsForInstance(bridgeCapabilities, entityId, 'inbound')
			}
			},
			fields: {
				$$inboundBridgeCapabilities: (capabilities) => capabilities,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.BridgeRoute,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBridgeRouteBundleForQuoteId } = await import(
					'$/sources/Lifi/Rest/routes.ts'
				)
				return (await singleFlight(fetchBridgeRouteBundleForQuoteId)(entityId)).steps
			}
			},
			fields: {
				$$steps: (steps) => steps,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, _context) => {
				const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
					const lifiChain = (await singleFlight(fetchChains)()).chains.find((lifiChainEntry) => lifiChainEntry.id === Number(entityId.caip2.reference))
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
			}
			},
			fields: {
				$$blockExplorerUrls: (urls) => urls,
			},
		}),
	],
}
