import { type } from 'arktype'

import {
	bridgeToolByKey,
	type BridgeToolRow,
} from '$/constants/Bridge.ts'
import { CoinId } from '$/constants/Coin.ts'
import {
	defineResolver,
	type SourceResolverContext,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	parseEntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { Entity } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { entityDefinitionByType, schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/Source.ts'
import type {
	LifiBlockExplorerUrlLike,
	LifiChain,
} from '$/sources/Lifi/Rest/types.ts'
import type { BridgeRouteStepFields } from '$/resolvers/Lifi/Rest/routes.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'

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
		return [{
			[EntityMetaKey.Selector]: { url: hrefAsUrlString },
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
		[EntityMetaKey.Fields]: {
			...((
				iconMedia
			) => (
				iconMedia != null && {
					[entityFieldAddressKey(EntityType.Network, [], '$icon')]: iconMedia,
				}
			))(mediaFromUrl(lifiChain.logoURI, MediaType.Image)),
			[entityFieldAddressKey(EntityType.Network, ['Evm'], '$$rpcUrls')]: urlEntitiesFromFaucetUrlStrings(metamaskRpcUrls),
		},
	}
}

const coinBridgeCapabilityRowsForCoin = async (
	{ coinId }: EntitySelector<typeof schema, EntityType.Coin>
) => {
	const { fetchTokens, fetchTools } = await import('$/sources/Lifi/Rest/queries.ts')
	const { coinInstanceRefFromLifiToken } = await import(
		'$/resolvers/Lifi/Rest/bridgeRouteSteps.ts'
	)
	const { coinBridgeCapabilityRowsFromInstancesAndTools } = await import(
		'$/resolvers/Lifi/Rest/coinBridgeCapabilities.ts'
	)
	return coinBridgeCapabilityRowsFromInstancesAndTools(
		Object.values((await fetchTokens()).tokens)
			.flat()
			.filter((token) => token.coinKey === coinId)
			.flatMap((token) => {
				const coinInstance = coinInstanceRefFromLifiToken(token)
				if (coinInstance == null)
					return []

				const parsedSelector = parseEntitySelector(
					schema,
					entityDefinitionByType[EntityType.EvmCoinInstance],
					coinInstance[EntityMetaKey.Selector]
				)
				return parsedSelector instanceof type.errors ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: parsedSelector,
					}]
			}),
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
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
						const lifiChain = (await fetchChains()).chains.find((lifiChainEntry) => lifiChainEntry.id === Number(caip2.reference))
						if (lifiChain == null) throw new Error('Lifi_Rest: chain not in LiFi catalog')
						return networkEntityFieldsFromLifiChain(lifiChain)
					},
				}
			},
		})({
				$icon: (network) => network[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.Network, [], '$icon')],
				Evm: {
					$$rpcUrls: (network) => network[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.Network, ['Evm'], '$$rpcUrls')],
				},
			}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.CoinBridgeCapability,
			resolve: {
				EvmCoinInstanceEvmCoinInstanceToolKey: {
					resolve: async ({ toolKey }): Promise<{ toolKey: string } & Omit<BridgeToolRow, 'key'>> => {
						const coinBridgeCapabilityFields = bridgeToolByKey[toolKey]
						if (coinBridgeCapabilityFields == null)
							throw new Error(`Lifi_Rest: unknown LI.FI tool key ${toolKey}`)
						return {
							toolKey: coinBridgeCapabilityFields.key,
							...coinBridgeCapabilityFields,
						}
					},
				}
			},
		})({
				toolKey: (capability) => capability.toolKey,
				railId: (capability) => capability.railId,
				settlementModel: (capability) => capability.settlementModel,
				verificationModel: (capability) => capability.verificationModel,
				assetOutcome: (capability) => capability.assetOutcome,
			}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.BridgeRoute,
			resolve: {
				Quote: {
					resolve: async (entitySelector) => {
						const { fetchBridgeRouteBundleForQuoteId } = await import(
							'$/resolvers/Lifi/Rest/routes.ts'
						)
						const bundle = await fetchBridgeRouteBundleForQuoteId(
							entitySelector
						)
						return {
							...bundle.routeFields,
							$$steps: bundle.steps,
						}
					},
				}
			},
		})({
				$$steps: (route) => route.$$steps,
				$fromNetwork: (route) => route.$fromNetwork,
				$toNetwork: (route) => route.$toNetwork,
				fromAmount: (route) => route.fromAmount,
				toAmount: (route) => route.toAmount,
				toAmountMin: (route) => route.toAmountMin,
				estimatedCostUsd: (route) => route.estimatedCostUsd,
				estimatedDurationSeconds: (route) => route.estimatedDurationSeconds,
				tags: (route) => route.tags,
			}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.BridgeRouteStep,
			resolve: {
				RouteIndexInRoute: {
					resolve: async ({ $route, indexInRoute }): Promise<Omit<BridgeRouteStepFields, typeof EntityMetaKey.Selector>> => {
						const { fetchBridgeRouteBundleForQuoteId } = await import(
							'$/resolvers/Lifi/Rest/routes.ts'
						)
						const bundle = await fetchBridgeRouteBundleForQuoteId(
							$route
						)
						const step = bundle.steps[indexInRoute]
						const { [EntityMetaKey.Selector]: _id, ...fields } = step
						return fields
					},
				}
			},
		})({
				stepType: (step) => step[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'stepType')],
				tool: (step) => step[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'tool')],
				$fromNetwork: (step) => step[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BridgeRouteStep, [], '$fromNetwork')],
				$toNetwork: (step) => step[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BridgeRouteStep, [], '$toNetwork')],
				$fromToken: (step) => step[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BridgeRouteStep, [], '$fromToken')],
				$toToken: (step) => step[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BridgeRouteStep, [], '$toToken')],
				railId: (step) => step[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'railId')],
				settlementModel: (step) => step[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'settlementModel')],
				verificationModel: (step) => step[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'verificationModel')],
				assetOutcome: (step) => step[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'assetOutcome')],
			}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
						return (await fetchChains()).chains.map(networkEntityFieldsFromLifiChain)
					},
				}
			},
		})({
				$$evmNetworks: (networks) => networks,
			}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async (entitySelector) => {
						return coinBridgeCapabilityRowsForCoin(entitySelector)
					},
				}
			},
		})({
				$$bridgeCapabilities: (capabilities) => capabilities,
			}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkType: {
					resolve: async (entitySelector, context) => {
						const { filterCoinBridgeCapabilityRowsForInstance } = await import(
							'$/resolvers/Lifi/Rest/coinBridgeCapabilities.ts'
						)
						const coinId = await coinIdForBridgeInstanceSelector(entitySelector, context)
						const bridgeCapabilities = await coinBridgeCapabilityRowsForCoin({ coinId })
						return filterCoinBridgeCapabilityRowsForInstance(bridgeCapabilities, entitySelector, 'outbound')
					},
				},
				NetworkTypeContract: {
					resolve: async (entitySelector, context) => {
						const { filterCoinBridgeCapabilityRowsForInstance } = await import(
							'$/resolvers/Lifi/Rest/coinBridgeCapabilities.ts'
						)
						const coinId = await coinIdForBridgeInstanceSelector(entitySelector, context)
						const bridgeCapabilities = await coinBridgeCapabilityRowsForCoin({ coinId })
						return filterCoinBridgeCapabilityRowsForInstance(bridgeCapabilities, entitySelector, 'outbound')
					},
				},
			},
		})({
				NativeCurrency: {
					$$outboundBridgeCapabilities: (capabilities) => capabilities,
				},
				Erc20Token: {
					$$outboundBridgeCapabilities: (capabilities) => capabilities,
				},
			}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkType: {
					resolve: async (entitySelector, context) => {
						const { filterCoinBridgeCapabilityRowsForInstance } = await import(
							'$/resolvers/Lifi/Rest/coinBridgeCapabilities.ts'
						)
						const coinId = await coinIdForBridgeInstanceSelector(entitySelector, context)
						const bridgeCapabilities = await coinBridgeCapabilityRowsForCoin({ coinId })
						return filterCoinBridgeCapabilityRowsForInstance(bridgeCapabilities, entitySelector, 'inbound')
					},
				},
				NetworkTypeContract: {
					resolve: async (entitySelector, context) => {
						const { filterCoinBridgeCapabilityRowsForInstance } = await import(
							'$/resolvers/Lifi/Rest/coinBridgeCapabilities.ts'
						)
						const coinId = await coinIdForBridgeInstanceSelector(entitySelector, context)
						const bridgeCapabilities = await coinBridgeCapabilityRowsForCoin({ coinId })
						return filterCoinBridgeCapabilityRowsForInstance(bridgeCapabilities, entitySelector, 'inbound')
					},
				},
			},
		})({
				NativeCurrency: {
					$$inboundBridgeCapabilities: (capabilities) => capabilities,
				},
				Erc20Token: {
					$$inboundBridgeCapabilities: (capabilities) => capabilities,
				},
			}),

		defineResolver(Source.Lifi_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, _context) => {
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
					},
				}
			},
		})({
				$$blockExplorerUrls: (urls) => urls,
			}),
	],
}
