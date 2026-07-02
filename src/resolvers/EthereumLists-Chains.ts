import { type } from 'arktype'

import { coinBySymbol } from '$/constants/Coin.ts'
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
import type { EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { MediaType } from '$/schema/Media.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	EthereumListsExplorerLike,
	EthereumListsChainPairing,
} from '$/sources/EthereumLists/Rest/types.ts'
import { EvmNetworkBridgeSelector } from '$/schema/EvmNetworkBridge.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'

type EvmNetworkId = EntitySelectorForSelectorName<typeof schema, EntityType.EvmNetwork, EvmNetworkSelector.Caip2>

const evmNetworkIdFromChainId = (chainId: number): EvmNetworkId => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
})

const testnetKeywordPattern = /\b(testnet|sepolia|holesky|hoodi|goerli|rinkeby|ropsten|kovan)\b/i

const familyAliasByToken: Record<string, string> = {
	op: 'optimism',
	oeth: 'optimism',
	arb: 'arbitrum',
	arb1: 'arbitrum',
	eth: 'ethereum',
}

const pairingFamilyEquivalenceRoot: Record<string, string> = {
	bnb: 'binance',
	bnbt: 'binance',
	bsctest: 'binance',
	binance: 'binance',
	matic: 'polygon',
	maticmum: 'polygon',
	polygonamoy: 'polygon',
}

const familyStopwords = new Set([
	'mainnet',
	'testnet',
	'network',
	'chain',
	'rollup',
	'l2',
	'l3',
	'public',
	'private',
	'alpha',
	'beta',
	'devnet',
	'deprecated',
	'legacy',
	'stage',
	'staging',
	'v1',
	'v2',
	'v3',
])

const slugFamilyTokenAliases: Record<string, string> = {
	zksyncera: 'zksync',
}

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
	familyAliasByToken[normalizeFamilyToken(value)]
	?? normalizeFamilyToken(value)
)

const ethereumFamilyCanonical = canonicalFamilyToken('ethereum')

const resolveCatalogFamilyToken = ({
	name,
	title,
	shortName,
	chainSlug,
}: Pick<EthereumListsChainPairing, 'name' | 'shortName'> & {
	title?: string
	chainSlug?: string
}): string | undefined => {
	const chainSlugTrimmed = chainSlug?.trim()
	if (chainSlugTrimmed != null && chainSlugTrimmed.length > 0) {
		const slugCanonical = canonicalFamilyToken(chainSlugTrimmed)
		const slugNormalized = normalizeFamilyToken(slugCanonical)
		return slugFamilyTokenAliases[slugNormalized] ?? slugCanonical
	}
	const text = `${title ?? ''} ${name } ${shortName }`
	if (/\bethereum\s+classic\b/i.test(text))
		return 'ethereumclassic'
	if (/\bpolygon\s+zkevm\b/i.test(text) || (/\bpolygon\b/i.test(text) && /\bzkevm\b/i.test(text)))
		return normalizeFamilyToken('polygonzkevm')
	const token = text
		.toLowerCase()
		.split(/[^a-z0-9]+/g)
		.find((value) => value.length > 0 && !familyStopwords.has(value))
	return token == null ? undefined : canonicalFamilyToken(token)
}

const pairingFamilyKey = (chain: EthereumListsChainPairing): string | undefined => {
	const raw = resolveCatalogFamilyToken(chain)
	if (raw == null) return undefined
	const normalized = normalizeFamilyToken(raw)
	return pairingFamilyEquivalenceRoot[normalized] ?? raw
}

const ethereumListsRowImpliesTestnet = (chain: Pick<EthereumListsChainPairing, 'name' | 'title'>): boolean => (
	testnetKeywordPattern.test(`${chain.title ?? ''} ${chain.name }`)
)

const catalogChainIsEthereumExecutionRoot = (chain: EthereumListsChainPairing): boolean => (
	pairingFamilyKey(chain) === ethereumFamilyCanonical
	&& chain.parent?.chain == null
)

const catalogEthereumExecutionRootAcceptsTestnetCandidate = (
	sourceMainnet: EthereumListsChainPairing,
	candidateTestnet: EthereumListsChainPairing
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
	explorers: EthereumListsExplorerLike[] | undefined
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
		}]
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
		return [{ [EntityMetaKey.Selector]: { url: hrefAsUrlString } }]
	})

export default {
	source: Source.EthereumLists_Rest,

	resolvers: [
		defineResolver(Source.EthereumLists_Rest, {
			entityType: EntityType.EvmNetworkBridge,
			resolve: {
				[EvmNetworkBridgeSelector.FromToUrl]: async (entitySelector) => {
					const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
					const chain = (await fetchChainsJson()).find((listedChain) => (
						listedChain.chainId === Number(entitySelector.$toNetwork.caip2.reference)
					))
					if (chain == null) throw new Error('EthereumLists_Rest: network bridge target chain not in chains.json')
					const parentMatch = chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
					if (
					parentMatch == null
					|| Number(parentMatch[1]) !== Number(entitySelector.$fromNetwork.caip2.reference)
					|| !(chain.parent?.bridges ?? []).some((bridge) => bridge.url === entitySelector.url)
					) throw new Error('EthereumLists_Rest: network bridge not in chains.json')
					return {
						[EntityMetaKey.Selector]: entitySelector,
						$fromNetwork: {
							[EntityMetaKey.Selector]: entitySelector.$fromNetwork,
						},
						$toNetwork: {
							[EntityMetaKey.Selector]: entitySelector.$toNetwork,
						},
						url: entitySelector.url,
						relationshipType: String(chain.parent?.type ?? 'unknown'),
					}
				}
			},
		})({
			fields: {
				$fromNetwork: (bridge) => bridge.$fromNetwork,
				$toNetwork: (bridge) => bridge.$toNetwork,
				url: (bridge) => bridge.url,
				relationshipType: (bridge) => bridge.relationshipType,
			},
		}),

		defineResolver(Source.EthereumLists_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
					const chains = await fetchChainsJson()
					const chain = chains.find((listedChain) => listedChain.chainId === Number(caip2.reference))
					if (chain == null) throw new Error('EthereumLists_Rest: chain id not in chains.json')
					const nativeSymbol = chain.nativeCurrency.symbol.trim()
					const displayName = `${chain.title ?? chain.name }`.trim()
					if (nativeSymbol === '') throw new Error(`EthereumLists_Rest: native currency symbol missing for chain ${chain.chainId}`)
					if (displayName.length === 0) throw new Error(`EthereumLists_Rest: chain display name missing for chain ${chain.chainId}`)
					const rpcUrls = chain.rpc.filter((url) => url.length > 0)
					if (rpcUrls.length === 0) throw new Error(`EthereumLists_Rest: no RPC URLs for chain ${chain.chainId}`)
					const icon = resolveMediaUrlTransport(chain.icon)?.url
					const nativeCoin = coinBySymbol[nativeSymbol.toUpperCase()]
					return {
						[EntityMetaKey.Selector]: evmNetworkIdFromChainId(chain.chainId),
						...(icon != null && { iconUrl: icon }),
						...((iconMedia) => iconMedia != null && { $icon: iconMedia })(mediaFromUrl(icon, MediaType.Image)),
						...(chain.status != null && chain.status !== '' && { registryStatus: String(chain.status) }),
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
						name: displayName,
						$nativeCoin: {
							[EntityMetaKey.Selector]: {
								coinId: nativeCoin.id,
							},
						},
						$nativeCoinInstance: {
							[EntityMetaKey.Selector]: {
								$network: evmNetworkIdFromChainId(chain.chainId),
								type: CoinInstanceType.NativeCurrency,
							},
						},
						peeringId: chain.networkId,
						...(chain.shortName !== '' && { shortName: chain.shortName }),
						...(chain.slip44 != null && { slip44: chain.slip44 }),
						environment: ethereumListsRowImpliesTestnet(chain) ?
							NetworkEnvironment.Testnet
						:
							NetworkEnvironment.Mainnet,
						$parent: (
							((parentMatch) => (
							parentMatch == null || chain.parent == null ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: evmNetworkIdFromChainId(Number(parentMatch[1])),
								}
							))(chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim()))
						),
					}
				}
			},
		})({
			fields: {
				iconUrl: (network) => network.iconUrl,
				$icon: (network) => network.$icon,
				registryStatus: (network) => network.registryStatus,
				executionEndpoints: (network) => network.executionEndpoints,
				$$rpcUrls: (network) => network.$$rpcUrls,
				name: (network) => network.name,
				$nativeCoin: (network) => network.$nativeCoin,
				$nativeCoinInstance: (network) => network.$nativeCoinInstance,
				peeringId: (network) => network.peeringId,
				shortName: (network) => network.shortName,
				slip44: (network) => network.slip44,
				environment: (network) => network.environment,
				$parent: (network) => network.$parent,
			},
		}),

		defineResolver(Source.EthereumLists_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_entitySelector) => {
					const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
					return (await fetchChainsJson())
						.map((chain) => ({ [EntityMetaKey.Selector]: evmNetworkIdFromChainId(chain.chainId) }))
				}
			},
		})({
			fields: {
				$$evmNetworks: (networks) => networks,
			},
		}),

		defineResolver(Source.EthereumLists_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
					const chain = (await fetchChainsJson()).find((listedChain) => listedChain.chainId === Number(caip2.reference))
					const parentMatch = chain?.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
					if (chain == null) throw new Error('EthereumLists_Rest: network not in chains.json for bridge list')
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
				}
			},
		})({
			fields: {
				$$bridges: (bridges) => bridges,
			},
		}),

		defineResolver(Source.EthereumLists_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
					const chains = await fetchChainsJson()
					const chainId = Number(caip2.reference)
					if (chains.find((chain) => chain.chainId === chainId) == null)
						throw new Error('EthereumLists_Rest: network not in chains.json for child layer list')

					return chains.flatMap((chain) => {
						const parentMatch = chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
						return parentMatch == null || Number(parentMatch[1]) !== chainId || chain.chainId === chainId ?
							[]
						:
							[{ [EntityMetaKey.Selector]: evmNetworkIdFromChainId(chain.chainId) }]
					})
				}
			},
		})({
			fields: {
				$$childLayers: (childLayers) => childLayers,
			},
		}),

		defineResolver(Source.EthereumLists_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
					const chains = await fetchChainsJson()
					const chain = chains.find((listedChain) => listedChain.chainId === Number(caip2.reference))
					if (chain == null)
						throw new Error('EthereumLists_Rest: network not in chains.json for testnet list')
					if (ethereumListsRowImpliesTestnet(chain)) return []
					const sourceFamilyKey = pairingFamilyKey(chain)
					if (sourceFamilyKey == null)
						throw new Error('EthereumLists_Rest: cannot pair testnets (no family key)')
					const sourceIsEthereumExecutionRoot = catalogChainIsEthereumExecutionRoot(chain)
					return chains.flatMap((candidate) => (
						candidate.chainId === Number(caip2.reference)
						|| !ethereumListsRowImpliesTestnet(candidate)
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
				}
			},
		})({
			fields: {
				$$testnets: (testnets) => testnets,
			},
		}),

		defineResolver(Source.EthereumLists_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
					const chains = await fetchChainsJson()
					const chain = chains.find((listedChain) => listedChain.chainId === Number(caip2.reference))
					if (chain == null)
						throw new Error('EthereumLists_Rest: network not in chains.json for mainnet')
					if (!ethereumListsRowImpliesTestnet(chain)) return undefined
					const sourceFamilyKey = pairingFamilyKey(chain)
					if (sourceFamilyKey == null)
						throw new Error('EthereumLists_Rest: cannot pair mainnet (no family key)')
					const testnetIsEthereumExecutionRoot = catalogChainIsEthereumExecutionRoot(chain)
					const mainnet = selectBestMainnetCandidate({
						testnetChainId: chain.chainId,
						testnetShortName: chain.shortName,
						mainnetCandidates: chains.filter((candidate) => (
							candidate.chainId !== Number(caip2.reference)
						&& !ethereumListsRowImpliesTestnet(candidate)
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
								[EntityMetaKey.Selector]: evmNetworkIdFromChainId(mainnet.chainId),
							}
					)
				}
			},
		})({
			fields: {
				$mainnet: (mainnet) => mainnet,
			},
		}),

		defineResolver(Source.EthereumLists_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
					const chains = await fetchChainsJson()
					const chain = chains.find((listedChain) => listedChain.chainId === Number(caip2.reference))
					if (chain == null)
						throw new Error('EthereumLists_Rest: network not in chains.json for sibling shard list')
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
				}
			},
		})({
			fields: {
				$$siblingShardNetworks: (siblingShardNetworks) => siblingShardNetworks,
			},
		}),

		defineResolver(Source.EthereumLists_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
					const chain = (await fetchChainsJson()).find((listedChain) => listedChain.chainId === Number(caip2.reference))
					if (chain == null) throw new Error('EthereumLists_Rest: network not in chains.json for block explorer URLs')
					return urlEntitiesFromBlockExplorerCatalog(
						blockExplorerLikeFromExplorersAndInfoUrl({
							explorers: chain.explorers,
							infoURL: chain.infoURL,
						})
					)
				}
			},
		})({
			fields: {
				$$blockExplorerUrls: (blockExplorerUrls) => blockExplorerUrls,
			},
		}),

		defineResolver(Source.EthereumLists_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
					const chain = (await fetchChainsJson()).find((listedChain) => listedChain.chainId === Number(caip2.reference))
					if (chain == null) throw new Error('EthereumLists_Rest: network not in chains.json for faucet URLs')
					return urlEntitiesFromFaucetUrlStrings(
						(chain.faucets ?? []).filter((url) => url.length > 0)
					)
				}
			},
		})({
			fields: {
				$$faucetUrls: (faucetUrls) => faucetUrls,
			},
		}),
	],
}
