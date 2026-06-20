import { type } from 'arktype'

import {
	bridgeToolByKey,
	type BridgeToolRow,
} from '$/constants/Bridge.ts'
import { CoinId } from '$/constants/Coin.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	defineResolver,
	type SourceResolverContext,
} from '$/resolvers/defineResolver.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { Entity } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/Source.ts'
import type {
	LifiBlockExplorerUrlLike,
	LifiChain,
} from '$/sources/Lifi/Rest/types.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { CoinBridgeCapabilitySelector } from '$/schema/CoinBridgeCapability.ts'
import { BridgeRouteSelector } from '$/schema/BridgeRoute.ts'
import { BridgeRouteStepSelector } from '$/schema/BridgeRouteStep.ts'
import type { BridgeRouteStepFields } from '$/sources/Lifi/Rest/routes.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import {
	CoinInstanceType,
	EvmCoinInstanceSelector,
} from '$/schema/EvmCoinInstance.ts'

const canonicalPublicHttpUrlFromCatalogString = (raw: string): string => {
	const trimmed = raw.trim()
	const absolute = (
		trimmed.startsWith('http://')
		|| trimmed.startsWith('https://') ?
			trimmed
		:
			trimmed.startsWith('//') ?
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
	blockExplorers: ReturnType<typeof blockExplorerLikeFromExplorersAndInfoUrl>
) =>
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
			[EntityMetaKey.Selector]: { url: hrefAsUrlString },
			...(explorer.name != null && explorer.name !== '' && { catalogName: explorer.name }),
			...(explorer.standard != null && explorer.standard !== '' && { catalogStandard: explorer.standard }),
			...(catalogIconAsUrlString != null && { catalogIcon: catalogIconAsUrlString }),
		} satisfies Entity<typeof schema, EntityType.Url>]
	})

const urlEntitiesFromFaucetUrlStrings = (
	faucetUrls: string[]
) =>
	faucetUrls.flatMap((raw) => {
		const trimmed = raw.trim()
		if (trimmed === '') return []
		const url = canonicalPublicHttpUrlFromCatalogString(trimmed)
		const hrefAsUrlString = UrlString(url)
		if (hrefAsUrlString instanceof type.errors) return []
		return [({ [EntityMetaKey.Selector]: { url: hrefAsUrlString } }) satisfies Entity<typeof schema, EntityType.Url>]
	})


const networkEntityFieldsFromLifiChain = (lifiChain: LifiChain) => {
	const metamaskRpcUrls = (
		(lifiChain.metamask?.rpcUrls ?? [])
			.map((u) => u.trim())
			.filter((u) => u.length > 0)
	)
	return {
		[EntityMetaKey.Selector]: { caip2: {
			namespace: 'eip155' as const,
			reference: String(lifiChain.id),
		} },
		...((
			iconMedia
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
	{ coinId }: EntitySelector<typeof schema, EntityType.Coin>,
	context: SourceResolverContext<Source.Lifi_Rest>
) => {
	const { fetchTools } = await import('$/sources/Lifi/Rest/queries.ts')
	const { fetchCoinInstanceStubsForCoin } = await import(
		'$/sources/Coingecko/Rest/coinInstances.ts'
	)
	const { coinBridgeCapabilityRowsFromInstancesAndTools } = await import(
		'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
	)
	return coinBridgeCapabilityRowsFromInstancesAndTools(
		await fetchCoinInstanceStubsForCoin(coinId, context.publicEnv),
		await fetchTools()
	)
}

const coinIdForBridgeInstanceSelector = async (
	entitySelector: EntitySelector<typeof schema, EntityType.EvmCoinInstance>,
	context: SourceResolverContext<Source.Lifi_Rest>
) => {
	if (
		entitySelector.type === CoinInstanceType.NativeCurrency
		&& entitySelector.$network.caip2.reference === '1'
	)
		return CoinId.ETH

	const { resolveCoinIdForCoinInstanceEntitySelector } = await import(
		'$/sources/Coingecko/Rest/coinInstances.ts'
	)
	const coinId = await resolveCoinIdForCoinInstanceEntitySelector(
		entitySelector,
		context.publicEnv
	)
	if (coinId == null)
		throw new Error('Lifi_Rest: coin instance not mapped to catalog coin')
	return coinId
}

export default {
	source: Source.Lifi_Rest,

	resolvers: [
		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
					const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
					const lifiChain = (await fetchChains()).chains.find((lifiChainEntry) => lifiChainEntry.id === Number(caip2.reference))
					if (lifiChain == null) throw new Error('Lifi_Rest: chain not in LiFi catalog')
					return networkEntityFieldsFromLifiChain(lifiChain)
				}
			},
		})({
			fields: {
				$icon: (network) => network.$icon,
				executionEndpoints: (network) => network.executionEndpoints,
				$$rpcUrls: (network) => network.$$rpcUrls,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.CoinBridgeCapability,
			resolve: {
				[CoinBridgeCapabilitySelector.EvmCoinInstanceEvmCoinInstanceToolKey]: async ({ toolKey }): Promise<{ toolKey: string } & Omit<BridgeToolRow, 'key'>> => {
					const coinBridgeCapabilityFields = bridgeToolByKey[toolKey]
					if (coinBridgeCapabilityFields == null)
						throw new Error(`Lifi_Rest: unknown LI.FI tool key ${toolKey}`)
					return {
						toolKey: coinBridgeCapabilityFields.key,
						...coinBridgeCapabilityFields,
					}
				}
			},
		})({
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
				[BridgeRouteSelector.Quote]: async (entitySelector) => {
					const { fetchBridgeRouteBundleForQuoteId } = await import(
						'$/sources/Lifi/Rest/routes.ts'
					)
					const bundle = await fetchBridgeRouteBundleForQuoteId(entitySelector)
					return {
						...bundle.routeFields,
						$$steps: bundle.steps,
					}
				}
			},
		})({
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
				[BridgeRouteStepSelector.BridgeRouteIndex]: async ({ $route, index }): Promise<Omit<BridgeRouteStepFields, typeof EntityMetaKey.Selector>> => {
					const { fetchBridgeRouteBundleForQuoteId } = await import(
						'$/sources/Lifi/Rest/routes.ts'
					)
					const bundle = await fetchBridgeRouteBundleForQuoteId($route)
					const step = bundle.steps[index]
					if (step == null)
						throw new Error(
							`Lifi_Rest: BridgeRouteStep index ${index} missing on quote route`
					)
					const { [EntityMetaKey.Selector]: _id, ...fields } = step
					return fields
				}
			},
		})({
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
				[_GlobalSelector.Scope]: async () => {
					const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
					return (await fetchChains()).chains.map(networkEntityFieldsFromLifiChain)
				}
			},
		})({
			fields: {
				$$evmNetworks: (networks) => networks,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async (entitySelector, context) => {
					return coinBridgeCapabilityRowsForCoin(entitySelector, context)
				}
			},
		})({
			fields: {
				$$bridgeCapabilities: (capabilities) => capabilities,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async (entitySelector, context) => {
					const { filterCoinBridgeCapabilityRowsForInstance } = await import(
						'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
					)
					const coinId = await coinIdForBridgeInstanceSelector(entitySelector, context)
					const bridgeCapabilities = await coinBridgeCapabilityRowsForCoin({ coinId }, context)
					return filterCoinBridgeCapabilityRowsForInstance(bridgeCapabilities, entitySelector, 'outbound')
				},
				[EvmCoinInstanceSelector.NetworkTypeContract]: async (entitySelector, context) => {
					const { filterCoinBridgeCapabilityRowsForInstance } = await import(
						'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
					)
					const coinId = await coinIdForBridgeInstanceSelector(entitySelector, context)
					const bridgeCapabilities = await coinBridgeCapabilityRowsForCoin({ coinId }, context)
					return filterCoinBridgeCapabilityRowsForInstance(bridgeCapabilities, entitySelector, 'outbound')
				},
			},
		})({
			fields: {
				$$outboundBridgeCapabilities: (capabilities) => capabilities,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async (entitySelector, context) => {
					const { filterCoinBridgeCapabilityRowsForInstance } = await import(
						'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
					)
					const coinId = await coinIdForBridgeInstanceSelector(entitySelector, context)
					const bridgeCapabilities = await coinBridgeCapabilityRowsForCoin({ coinId }, context)
					return filterCoinBridgeCapabilityRowsForInstance(bridgeCapabilities, entitySelector, 'inbound')
				},
				[EvmCoinInstanceSelector.NetworkTypeContract]: async (entitySelector, context) => {
					const { filterCoinBridgeCapabilityRowsForInstance } = await import(
						'$/sources/Lifi/Rest/coinBridgeCapabilities.ts'
					)
					const coinId = await coinIdForBridgeInstanceSelector(entitySelector, context)
					const bridgeCapabilities = await coinBridgeCapabilityRowsForCoin({ coinId }, context)
					return filterCoinBridgeCapabilityRowsForInstance(bridgeCapabilities, entitySelector, 'inbound')
				},
			},
		})({
			fields: {
				$$inboundBridgeCapabilities: (capabilities) => capabilities,
			},
		}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, _context) => {
					const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
					const lifiChain = (await fetchChains()).chains.find((lifiChainEntry) => lifiChainEntry.id === Number(caip2.reference))
					if (lifiChain == null) throw new Error('Lifi_Rest: chain not in LiFi catalog for block explorer URLs')
					return urlEntitiesFromBlockExplorerCatalog(
						blockExplorerLikeFromExplorersAndInfoUrl({
							explorers: (
							(lifiChain.metamask?.blockExplorerUrls ?? [])
								.map((u) => u.trim())
								.filter((u) => u.length > 0)
								.map((url) => ({
									name: '',
									url,
								}))
							),
							infoURL: undefined,
						})
					)
				}
			},
		})({
			fields: {
				$$blockExplorerUrls: (urls) => urls,
			},
		}),
	],
}
