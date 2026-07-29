import {
	chainlistCanonicalFamilyBySlugToken,
	chainlistCanonicalFamilyByToken,
	chainlistFamilyStopwords,
	chainlistRootFamilyByToken,
	chainlistTestnetKeywordPattern,
} from '$/constants/ChainlistPairing.ts'
import { type } from 'arktype'

import { coins } from '$/constants/Coin.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { NetworkEnvironment } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { Entity, EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	ChainlistExplorerLike,
	ChainlistChainPairing,
} from '$/sources/Chainlist/Rest/types.ts'

type EvmNetworkId = EntitySelectorForSelectorName<typeof schema, EntityType.Network, 'Caip2'>
type NetworkId = EntitySelectorForSelectorName<typeof schema, EntityType.Network, 'Caip2'>

const evmNetworkIdFromChainId = (chainId: number): EvmNetworkId => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
})

const networkIdFromChainId = (chainId: number): NetworkId => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
})

const normalizePairingShortName = (shortName: string | undefined): string => (
	(shortName ?? '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '')
		.replace(/(testnet|sepolia|holesky|hoodi|goerli|rinkeby|ropsten|kovan)+$/g, '')
)

const normalizeFamilyToken = (value: string): string => (
	value.toLowerCase().replace(/[^a-z0-9]+/g, '')
)

const canonicalFamilyToken = (value: string): string => (
	chainlistCanonicalFamilyByToken[normalizeFamilyToken(value)]?.canonicalFamily
	?? normalizeFamilyToken(value)
)

const ethereumFamilyCanonical = chainlistCanonicalFamilyByToken.eth.canonicalFamily

const resolveCatalogFamilyToken = ({
	name,
	title,
	shortName,
	chainSlug,
}: Pick<ChainlistChainPairing, 'name' | 'shortName'> & {
	title?: string
	chainSlug?: string
}): string | undefined => {
	const chainSlugTrimmed = chainSlug?.trim()
	if (chainSlugTrimmed != null && chainSlugTrimmed.length > 0) {
		const slugCanonical = canonicalFamilyToken(chainSlugTrimmed)
		const slugNormalized = normalizeFamilyToken(slugCanonical)
		return chainlistCanonicalFamilyBySlugToken[slugNormalized]?.canonicalFamily ?? slugCanonical
	}
	const text = `${title ?? ''} ${name} ${shortName ?? ''}`
	if (/\bethereum\s+classic\b/i.test(text))
		return 'ethereumclassic'
	if (/\bpolygon\s+zkevm\b/i.test(text) || (/\bpolygon\b/i.test(text) && /\bzkevm\b/i.test(text)))
		return normalizeFamilyToken('polygonzkevm')
	const token = text
		.toLowerCase()
		.split(/[^a-z0-9]+/g)
		.find((value) => value.length > 0 && !chainlistFamilyStopwords.some((stopword) => stopword === value))
	return token == null ? undefined : canonicalFamilyToken(token)
}

const pairingFamilyKey = (chain: ChainlistChainPairing): string | undefined => {
	const raw = resolveCatalogFamilyToken(chain)
	if (raw == null) return undefined
	const normalized = normalizeFamilyToken(raw)
	return chainlistRootFamilyByToken[normalized]?.rootFamily ?? raw
}

const chainlistRowImpliesTestnet = (chain: Pick<ChainlistChainPairing, 'name' | 'title' | 'isTestnet' | 'testnet'>): boolean => (
	chain.isTestnet === true
	|| chain.testnet === true
	|| chainlistTestnetKeywordPattern.test(`${chain.title ?? ''} ${chain.name}`)
)

const catalogChainIsEthereumExecutionRoot = (chain: ChainlistChainPairing): boolean => (
	pairingFamilyKey(chain) === ethereumFamilyCanonical
	&& chain.parent?.chain == null
)

const catalogEthereumExecutionRootAcceptsTestnetCandidate = (
	sourceMainnet: ChainlistChainPairing,
	candidateTestnet: ChainlistChainPairing
): boolean => (
	!catalogChainIsEthereumExecutionRoot(sourceMainnet)
	|| candidateTestnet.nativeCurrency.symbol.trim().toUpperCase() === 'ETH'
)

const selectBestMainnetCandidate = ({
	testnetChainId,
	testnetShortName,
	mainnetCandidates,
}: {
	testnetChainId: number
	testnetShortName?: string
	mainnetCandidates: {
		chainId: number
		shortName?: string
		name?: string
	}[]
}) => {
	const testnetChainIdAsString = String(testnetChainId)
	const byChainIdPrefix = mainnetCandidates
		.filter((candidate) => (
			testnetChainIdAsString.startsWith(String(candidate.chainId))
		))
		.toSorted((leftCandidate, rightCandidate) => (
			String(rightCandidate.chainId).length - String(leftCandidate.chainId).length
			|| leftCandidate.chainId - rightCandidate.chainId
		))
	const chainIdPrefixMatch = byChainIdPrefix.at(0)
	if (chainIdPrefixMatch != null) return chainIdPrefixMatch
	const normalizedSourceShortName = normalizePairingShortName(testnetShortName)
	if (normalizedSourceShortName.length > 0) {
		const byShortNamePrefix = mainnetCandidates
			.filter((candidate) => {
				const normalizedCandidateShortName = normalizePairingShortName(candidate.shortName)
				return (
					normalizedCandidateShortName.length > 0
					&& (
						normalizedSourceShortName.startsWith(normalizedCandidateShortName)
						|| normalizedCandidateShortName.startsWith(normalizedSourceShortName)
					)
				)
			})
			.toSorted((leftCandidate, rightCandidate) => (
				leftCandidate.chainId - rightCandidate.chainId
			))
		const shortNamePrefixMatch = byShortNamePrefix.at(0)
		if (shortNamePrefixMatch != null) return shortNamePrefixMatch
	}
	const byMainnetKeyword = mainnetCandidates
		.filter((candidate) => /\bmainnet\b/i.test(candidate.name ?? ''))
		.toSorted((leftCandidate, rightCandidate) => (
			leftCandidate.chainId - rightCandidate.chainId
		))
	const mainnetKeywordMatch = byMainnetKeyword.at(0)
	if (mainnetKeywordMatch != null) return mainnetKeywordMatch
	return mainnetCandidates
		.toSorted((leftCandidate, rightCandidate) => (
			leftCandidate.chainId - rightCandidate.chainId
		)).at(0)
}

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
	explorers: ChainlistExplorerLike[] | undefined
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
		return [({
			[EntityMetaKey.Selector]: { url: hrefAsUrlString },
		}) satisfies Entity<typeof schema, EntityType.Url>]
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

export default {
	source: Source.Chainlist_Rest,

	resolvers: [
		defineResolver(Source.Chainlist_Rest, {
			entityType: EntityType.EvmNetworkBridge,
			resolve: {
				FromToUrl: {
					resolve: async (entitySelector) => {
						const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
						const chain = (await fetchRpcsJson()).find((listedChain) => (
							listedChain.chainId === Number(entitySelector.$toNetwork.caip2.reference)
						))
						if (chain == null) throw new Error('Chainlist_Rest: network bridge target chain not in rpcs.json')
						const parentLayer = (
							((parentMatch) => (
							parentMatch == null ?
								undefined
							:
								{
									chainId: Number(parentMatch[1]),
									relationshipType: String(chain.parent?.type ?? 'unknown'),
								}
							))(chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim()))
						)
						if (parentLayer == null) throw new Error('Chainlist_Rest: network bridge not in rpcs.json')
						if (
						parentLayer.chainId !== Number(entitySelector.$fromNetwork.caip2.reference)
						|| (
							(chain.parent?.bridges ?? []).length > 0
							&& !(chain.parent?.bridges ?? []).some((bridge) => bridge.url === entitySelector.url)
						)
						) throw new Error('Chainlist_Rest: network bridge not in rpcs.json')
						return {
							[EntityMetaKey.Selector]: entitySelector,
							$fromNetwork: {
								[EntityMetaKey.Selector]: entitySelector.$fromNetwork,
							},
							$toNetwork: {
								[EntityMetaKey.Selector]: entitySelector.$toNetwork,
							},
							url: entitySelector.url,
							relationshipType: parentLayer.relationshipType,
						}
					},
				}
			},
		})({
				$fromNetwork: (bridge) => bridge.$fromNetwork,
				$toNetwork: (bridge) => bridge.$toNetwork,
				url: (bridge) => bridge.url,
				relationshipType: (bridge) => bridge.relationshipType,
			}),

		defineResolver(Source.Chainlist_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector) => {
						const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
						const chains = await fetchRpcsJson()
						const chain = chains.find((listedChain) => listedChain.chainId === Number(entitySelector.caip2.reference))
						if (chain == null) return undefined
						const nativeSymbol = chain.nativeCurrency.symbol.trim()
						const displayName = `${chain.title ?? chain.name}`.trim()
						if (nativeSymbol === '') throw new Error(`Chainlist_Rest: native currency symbol missing for chain ${chain.chainId}`)
						if (displayName.length === 0) throw new Error(`Chainlist_Rest: chain display name missing for chain ${chain.chainId}`)
						const rpcUrls = (chain.rpc ?? [])
							.filter((rpcEndpoint) => (
							typeof rpcEndpoint === 'string'
							|| (rpcEndpoint.tracking !== 'yes' && rpcEndpoint.tracking !== 'limited')
							))
							.map((rpcEndpoint) => (typeof rpcEndpoint === 'string' ? rpcEndpoint : rpcEndpoint.url).trim())
							.filter((url) => url.length > 0)
						if (rpcUrls.length === 0) throw new Error(`Chainlist_Rest: no RPC URLs for chain ${chain.chainId}`)
						const icon = resolveMediaUrlTransport(
							chain.icons?.find((icon) => String(icon.url).length > 0)?.url ?? chain.icon
							)?.url
						const nativeCoin = coins.find(({ symbol }) => symbol === nativeSymbol.toUpperCase())
						const nativeCoinInstanceId = {
							$network: entitySelector,
							type: CoinInstanceType.NativeCurrency,
						} as const
						return {
							[EntityMetaKey.Selector]: entitySelector,
							name: displayName,
							...(nativeCoin != null && {
								$nativeCoin: {
									[EntityMetaKey.Selector]: {
										coinId: nativeCoin.id,
									},
								},
							}),
							$nativeCoinInstance: {
								[EntityMetaKey.Selector]: nativeCoinInstanceId,
							},
							executionEndpoints: rpcUrls.map((url) => ({
								url,
								serviceProvider: ExecutionRpcProvider.Unknown,
								transportType: (
									url.toLowerCase().startsWith('ws') ?
										TransportType.WebSocket
									:
										TransportType.Http
								),
							})),
							$$rpcUrls: urlEntitiesFromFaucetUrlStrings(rpcUrls),
							environment: (
								chain.isTestnet === true ?
									NetworkEnvironment.Testnet
								:
									NetworkEnvironment.Mainnet
							),
							$parent: (
								((parentMatch) => (
								parentMatch == null || chain.parent == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: networkIdFromChainId(Number(parentMatch[1])),
									}
								))(chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim()))
							),
							...(chain.shortName != null && String(chain.shortName).length > 0 && { shortName: String(chain.shortName) }),
							...(chain.status != null && String(chain.status).length > 0 && { registryStatus: String(chain.status) }),
							...(chain.networkId != null && { peeringId: chain.networkId }),
							...(chain.slip44 != null && { slip44: chain.slip44 }),
							...((iconMedia) => iconMedia != null && { $icon: iconMedia })(mediaFromUrl(icon, MediaType.Image)),
						}
					},
				}
			},
		})({
				name: (network) => network.name,
				environment: (network) => network.environment,
				$icon: (network) => network.$icon,
				Evm: {
					$nativeCoin: (network) => network.$nativeCoin,
					$nativeCoinInstance: (network) => network.$nativeCoinInstance,
					$$rpcUrls: (network) => network.$$rpcUrls,
					$parent: (network) => network.$parent,
					shortName: (network) => network.shortName,
					registryStatus: (network) => network.registryStatus,
					peeringId: (network) => network.peeringId,
					slip44: (network) => network.slip44,
				},
			}),

		defineResolver(Source.Chainlist_Rest, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_entitySelector) => {
						const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
						return (await fetchRpcsJson())
							.flatMap((chain) => (
							[{ [EntityMetaKey.Selector]: evmNetworkIdFromChainId(chain.chainId) }]
							))
					},
				}
			},
		})({
				$$evmNetworks: (networks) => networks,
			}),

		defineResolver(Source.Chainlist_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
						const chain = (await fetchRpcsJson()).find((listedChain) => listedChain.chainId === Number(caip2.reference))
						const parentMatch = chain?.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
						if (chain == null) return []
						if (parentMatch == null) return []
						return (chain.parent?.bridges ?? [])
							.map((bridge) => ({
								[EntityMetaKey.Selector]: {
									$fromNetwork: evmNetworkIdFromChainId(Number(parentMatch[1])),
									$toNetwork: evmNetworkIdFromChainId(chain.chainId),
									url: bridge.url,
								},
								$fromNetwork: {
									[EntityMetaKey.Selector]: evmNetworkIdFromChainId(Number(parentMatch[1])),
								},
								$toNetwork: {
									[EntityMetaKey.Selector]: evmNetworkIdFromChainId(chain.chainId),
								},
								url: bridge.url,
								relationshipType: String(chain.parent?.type ?? 'unknown'),
							}))
					},
				}
			},
		})({
				Evm: {
					$$bridges: (bridges) => bridges,
				},
			}),

		defineResolver(Source.Chainlist_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
						const chains = await fetchRpcsJson()
						if (chains.find((chain) => chain.chainId === Number(caip2.reference)) == null)
							return []

						return chains.flatMap((chain) => {
							const parentMatch = chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
							return parentMatch == null || Number(parentMatch[1]) !== Number(caip2.reference) || chain.chainId === Number(caip2.reference) ?
								[]
							:
								[{ [EntityMetaKey.Selector]: evmNetworkIdFromChainId(chain.chainId) }]
						})
					},
				}
			},
		})({
				Evm: {
					$$childLayers: (childLayers) => childLayers,
				},
			}),

		defineResolver(Source.Chainlist_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
						const chains = await fetchRpcsJson()
						const chain = chains.find((listedChain) => listedChain.chainId === Number(caip2.reference))
						if (chain == null)
							return []
						if (chainlistRowImpliesTestnet(chain)) return []
						const sourceFamilyKey = pairingFamilyKey(chain)
						if (sourceFamilyKey == null)
							throw new Error('Chainlist_Rest: cannot pair testnets (no family key)')
						const sourceIsEthereumExecutionRoot = catalogChainIsEthereumExecutionRoot(chain)
						return chains.flatMap((candidate) => (
							candidate.chainId === Number(caip2.reference)
							|| !chainlistRowImpliesTestnet(candidate)
							|| pairingFamilyKey(candidate) !== sourceFamilyKey
							|| (
								sourceIsEthereumExecutionRoot
								&& candidate.parent?.chain != null
							)
							|| !catalogEthereumExecutionRootAcceptsTestnetCandidate(chain, candidate) ?
								[]
							:
								[{ [EntityMetaKey.Selector]: evmNetworkIdFromChainId(candidate.chainId) }]
						))
					},
				}
			},
		})({
				Evm: {
					$$testnets: (testnets) => testnets,
				},
			}),

		defineResolver(Source.Chainlist_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
						const chains = await fetchRpcsJson()
						const chain = chains.find((listedChain) => listedChain.chainId === Number(caip2.reference))
						if (chain == null)
							return undefined
						if (!chainlistRowImpliesTestnet(chain)) return undefined
						const sourceFamilyKey = pairingFamilyKey(chain)
						if (sourceFamilyKey == null)
							throw new Error('Chainlist_Rest: cannot pair mainnet (no family key)')
						const testnetIsEthereumExecutionRoot = catalogChainIsEthereumExecutionRoot(chain)
						const mainnet = selectBestMainnetCandidate({
							testnetChainId: chain.chainId,
							testnetShortName: chain.shortName,
							mainnetCandidates: chains.filter((candidate) => (
								candidate.chainId !== Number(caip2.reference)
							&& !chainlistRowImpliesTestnet(candidate)
							&& pairingFamilyKey(candidate) === sourceFamilyKey
							&& (
								!testnetIsEthereumExecutionRoot
								|| candidate.parent?.chain == null
							)
							)),
						})
						return (
							mainnet == null ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: networkIdFromChainId(mainnet.chainId),
								}
						)
					},
				}
			},
		})({
				Evm: {
					$mainnet: (mainnet) => mainnet,
				},
			}),

		defineResolver(Source.Chainlist_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
						const chains = await fetchRpcsJson()
						const chain = chains.find((listedChain) => listedChain.chainId === Number(caip2.reference))
						if (chain == null)
							return []
						return (
							chain.parent == null || String(chain.parent.type).toLowerCase() !== 'shard' ?
								[]
							:
								(() => {
								const shardParentChain = chain.parent.chain.trim()
								return (
									chains.flatMap((candidate) => (
								candidate.chainId === chain.chainId
								|| candidate.parent == null
										|| candidate.parent.chain.trim() !== shardParentChain
										|| String(candidate.parent.type).toLowerCase() !== 'shard' ?
									[]
								:
									[{ [EntityMetaKey.Selector]: evmNetworkIdFromChainId(candidate.chainId) }]
									))
								)
								})()
						)
					},
				}
			},
		})({
				Evm: {
					$$siblingShardNetworks: (siblingShardNetworks) => siblingShardNetworks,
				},
			}),

		defineResolver(Source.Chainlist_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
						const chain = (await fetchRpcsJson()).find((listedChain) => listedChain.chainId === Number(caip2.reference))
						if (chain == null) return []
						return urlEntitiesFromBlockExplorerCatalog(
							blockExplorerLikeFromExplorersAndInfoUrl({
								explorers: chain.explorers,
								infoURL: chain.infoURL,
							})
						)
					},
				}
			},
		})({
				$$blockExplorerUrls: (blockExplorerUrls) => blockExplorerUrls,
			}),

		defineResolver(Source.Chainlist_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
						const chain = (await fetchRpcsJson()).find((listedChain) => listedChain.chainId === Number(caip2.reference))
						if (chain == null) return []
						return urlEntitiesFromFaucetUrlStrings(
							(chain.faucets ?? []).filter((url) => url.length > 0)
						)
					},
				}
			},
		})({
				$$faucetUrls: (faucetUrls) => faucetUrls,
			}),
	],
}
