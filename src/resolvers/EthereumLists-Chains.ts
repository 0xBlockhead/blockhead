import { type } from 'arktype'

import { coinBySymbol } from '$/constants/Coin.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { NetworkEnvironment } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	EthereumListsExplorerLike,
	EthereumListsChainPairing,
} from '$/sources/EthereumLists/Rest/types.ts'

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
	const text = `${title ?? ''} ${name ?? ''} ${shortName ?? ''}`
	if (/\bethereum\s+classic\b/i.test(text)) {
		return 'ethereumclassic'
	}
	if (/\bpolygon\s+zkevm\b/i.test(text) || (/\bpolygon\b/i.test(text) && /\bzkevm\b/i.test(text))) {
		return normalizeFamilyToken('polygonzkevm')
	}
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
	testnetKeywordPattern.test(`${chain.title ?? ''} ${chain.name ?? ''}`)
)

const catalogChainIsEthereumExecutionRoot = (chain: EthereumListsChainPairing): boolean => (
	pairingFamilyKey(chain) === ethereumFamilyCanonical
	&& chain.parent?.chain == null
)

const catalogEthereumExecutionRootAcceptsTestnetCandidate = (
	sourceMainnet: EthereumListsChainPairing,
	candidateTestnet: EthereumListsChainPairing,
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
	if (byChainIdPrefix[0] != null) return byChainIdPrefix[0]
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
		if (byShortNamePrefix[0] != null) return byShortNamePrefix[0]
	}
	const byMainnetKeyword = mainnetCandidates
		.filter((candidate) => /\bmainnet\b/i.test(candidate.name ?? ''))
		.toSorted((leftCandidate, rightCandidate) => (
			leftCandidate.chainId - rightCandidate.chainId
		))
	if (byMainnetKeyword[0] != null) return byMainnetKeyword[0]
	return mainnetCandidates
		.toSorted((leftCandidate, rightCandidate) => (
			leftCandidate.chainId - rightCandidate.chainId
		))[0]
}

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
	blockExplorers: ReturnType<typeof blockExplorerLikeFromExplorersAndInfoUrl>,
) =>
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
			}]
		})

const urlEntitiesFromFaucetUrlStrings = (
	faucetUrls: string[],
) =>
	faucetUrls.flatMap((raw) => {
		const trimmed = raw.trim()
		if (trimmed === '') return []
		const url = canonicalPublicHttpUrlFromCatalogString(trimmed)
		const hrefAsUrlString = UrlString(url)
		if (hrefAsUrlString instanceof type.errors) return []
			return [{ [EntityMetaKey.Id]: { url: hrefAsUrlString } }]
		})

export default {
	source: Source.EthereumLists_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmNetworkBridge,
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chain = (await singleFlight(fetchChainsJson)()).find((row) => (
					row.chainId === Number(entityId.$toNetwork.caip2.reference)
				))
				if (chain == null) throw new Error('EthereumLists_Rest: network bridge target chain not in chains.json')
				const parentMatch = chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
				if (
					parentMatch == null
					|| Number(parentMatch[1]) !== Number(entityId.$fromNetwork.caip2.reference)
					|| !(chain.parent?.bridges ?? []).some((bridge) => bridge.url === entityId.url)
				) throw new Error('EthereumLists_Rest: network bridge not in chains.json')
				return {
					[EntityMetaKey.Id]: entityId,
					$fromNetwork: {
						[EntityMetaKey.Id]: entityId.$fromNetwork,
					},
					$toNetwork: {
						[EntityMetaKey.Id]: entityId.$toNetwork,
					},
					url: entityId.url,
					relationshipType: String(chain.parent?.type ?? 'unknown'),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmNetwork,
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await singleFlight(fetchChainsJson)()
				const chain = chains.find((row) => row.chainId === Number(entityId.caip2.reference))
				if (chain == null) throw new Error('EthereumLists_Rest: chain id not in chains.json')
				const nativeSymbol = chain.nativeCurrency.symbol.trim()
				const displayName = `${chain.title ?? chain.name ?? ''}`.trim()
				if (nativeSymbol === '') throw new Error(`EthereumLists_Rest: native currency symbol missing for chain ${chain.chainId}`)
				if (displayName.length === 0) throw new Error(`EthereumLists_Rest: chain display name missing for chain ${chain.chainId}`)
				const rpcUrls = chain.rpc.filter((url) => url.length > 0)
				if (rpcUrls.length === 0) throw new Error(`EthereumLists_Rest: no RPC URLs for chain ${chain.chainId}`)
				const icon = resolveMediaUrlTransport(chain.icon)?.url
				const nativeCoin = coinBySymbol[nativeSymbol.toUpperCase()]
					const nativeCoinInstanceId = {
						$network: {
							caip2: { namespace: 'eip155' as const, reference: String(chain.chainId) },
						},
						type: CoinInstanceType.NativeCurrency,
					} as const
				return {
					[EntityMetaKey.Id]: { caip2: { namespace: 'eip155', reference: String(chain.chainId) } },
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
					...(nativeCoin != null && {
						$nativeCoin: {
							[EntityMetaKey.Id]: {
								coinId: nativeCoin.id,
							},
						},
					}),
					$nativeCoinInstance: {
						[EntityMetaKey.Id]: nativeCoinInstanceId,
					},
					peeringId: chain.networkId,
					...(chain.shortName !== '' && { shortName: chain.shortName }),
					...(chain.slip44 != null && { slip44: chain.slip44 }),
					...(ethereumListsRowImpliesTestnet(chain) && { environment: NetworkEnvironment.Testnet }),
					$parent: (
						((parentMatch) => (
							parentMatch == null || chain.parent == null ?
								undefined
							:	{
										[EntityMetaKey.Id]: { caip2: { namespace: 'eip155' as const, reference: String(Number(parentMatch[1])) } },
								}
						))(chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim()))
					),
					layerNumber: (() => {
						const chainByChainId = new Map(chains.map((chain) => [chain.chainId, chain]))
						let layer = 1
						let currentChainId: number | undefined = chain.chainId
						const visitedChainIds = new Set<number>()
						for (let hop = 0; hop < 256 && currentChainId !== undefined; hop += 1) {
							if (visitedChainIds.has(currentChainId)) return layer
							visitedChainIds.add(currentChainId)
							const currentChain = chainByChainId.get(currentChainId)
							if (currentChain == null) return layer
							const parentMatch = currentChain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(currentChain.parent.chain.trim())
							if (parentMatch == null || Number(parentMatch[1]) === currentChainId) return layer
							layer += 1
							currentChainId = Number(parentMatch[1])
						}
						return layer
					})(),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$evmNetworks',
			resolve: async (_entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				return (await singleFlight(fetchChainsJson)())
					.map((chain) => ({ [EntityMetaKey.Id]: { caip2: { namespace: 'eip155', reference: String(chain.chainId) } } }))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$bridges',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chain = (await singleFlight(fetchChainsJson)()).find((row) => row.chainId === Number(entityId.caip2.reference))
				const parentMatch = chain?.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
				if (chain == null) throw new Error('EthereumLists_Rest: network not in chains.json for bridge list')
				if (parentMatch == null) return []
				return (chain.parent?.bridges ?? [])
					.map((bridge) => ({
						[EntityMetaKey.Id]: {
							$fromNetwork: { caip2: { namespace: 'eip155', reference: String(Number(parentMatch[1])) } },
							$toNetwork: { caip2: { namespace: 'eip155', reference: String(chain.chainId) } },
							url: bridge.url,
						},
						$fromNetwork: {
							[EntityMetaKey.Id]: { caip2: { namespace: 'eip155', reference: String(Number(parentMatch[1])) } },
						},
						$toNetwork: {
							[EntityMetaKey.Id]: { caip2: { namespace: 'eip155', reference: String(chain.chainId) } },
						},
						url: bridge.url,
						relationshipType: String(chain.parent?.type ?? 'unknown'),
					}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$childLayers',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await singleFlight(fetchChainsJson)()
				const chainId = Number(entityId.caip2.reference)
				if (chains.find((c) => c.chainId === chainId) == null) {
					throw new Error('EthereumLists_Rest: network not in chains.json for child list')
				}
				return chains.flatMap((chain) => {
					const parentMatch = chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
					return parentMatch == null || Number(parentMatch[1]) !== Number(entityId.caip2.reference) || chain.chainId === Number(entityId.caip2.reference) ?
						[]
					:	[{ [EntityMetaKey.Id]: { caip2: { namespace: 'eip155', reference: String(chain.chainId) } } }]
				})
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$testnets',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await singleFlight(fetchChainsJson)()
				const chain = chains.find((row) => row.chainId === Number(entityId.caip2.reference))
				if (chain == null) {
					throw new Error('EthereumLists_Rest: network not in chains.json for testnet list')
				}
				if (ethereumListsRowImpliesTestnet(chain)) return []
				const sourceFamilyKey = pairingFamilyKey(chain)
				if (sourceFamilyKey == null) {
					throw new Error('EthereumLists_Rest: cannot pair testnets (no family key)')
				}
				const sourceIsEthereumExecutionRoot = catalogChainIsEthereumExecutionRoot(chain)
				return chains.flatMap((candidate) => (
					candidate.chainId === Number(entityId.caip2.reference)
						|| !ethereumListsRowImpliesTestnet(candidate)
						|| pairingFamilyKey(candidate) !== sourceFamilyKey
						|| (
							sourceIsEthereumExecutionRoot
							&& candidate.parent?.chain != null
						)
						|| !catalogEthereumExecutionRootAcceptsTestnetCandidate(chain, candidate) ?
						[]
					:	[{ [EntityMetaKey.Id]: { caip2: { namespace: 'eip155', reference: String(candidate.chainId) } } }]
				))
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$mainnet',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await singleFlight(fetchChainsJson)()
				const chain = chains.find((row) => row.chainId === Number(entityId.caip2.reference))
				if (chain == null) {
					throw new Error('EthereumLists_Rest: network not in chains.json for mainnet')
				}
				if (!ethereumListsRowImpliesTestnet(chain)) return undefined
				const sourceFamilyKey = pairingFamilyKey(chain)
				if (sourceFamilyKey == null) {
					throw new Error('EthereumLists_Rest: cannot pair mainnet (no family key)')
				}
				const testnetIsEthereumExecutionRoot = catalogChainIsEthereumExecutionRoot(chain)
				const mainnet = selectBestMainnetCandidate({
					testnetChainId: chain.chainId,
					testnetShortName: chain.shortName,
					mainnetCandidates: chains.filter((candidate) => (
						candidate.chainId !== Number(entityId.caip2.reference)
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
					:	{
							[EntityMetaKey.Id]: { caip2: { namespace: 'eip155', reference: String(mainnet.chainId) } },
						}
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$siblingShardNetworks',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await singleFlight(fetchChainsJson)()
				const chain = chains.find((row) => row.chainId === Number(entityId.caip2.reference))
				if (chain == null) {
					throw new Error('EthereumLists_Rest: network not in chains.json for sibling shard list')
				}
				return (
					chain.parent == null || chain.parent.chain == null || String(chain.parent.type ?? '').toLowerCase() !== 'shard' ?
						[]
					:	chains.flatMap((candidate) => (
							candidate.chainId === chain.chainId
							|| candidate.parent == null
							|| candidate.parent.chain?.trim() !== chain.parent?.chain?.trim()
							|| String(candidate.parent.type ?? '').toLowerCase() !== 'shard' ?
								[]
							:	[{ [EntityMetaKey.Id]: { caip2: { namespace: 'eip155', reference: String(candidate.chainId) } } }]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$blockExplorerUrls',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chain = (await singleFlight(fetchChainsJson)()).find((row) => row.chainId === Number(entityId.caip2.reference))
				if (chain == null) throw new Error('EthereumLists_Rest: network not in chains.json for block explorer URLs')
				return urlEntitiesFromBlockExplorerCatalog(
					blockExplorerLikeFromExplorersAndInfoUrl({
						explorers: chain.explorers,
						infoURL: chain.infoURL,
					}),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$faucetUrls',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chain = (await singleFlight(fetchChainsJson)()).find((row) => row.chainId === Number(entityId.caip2.reference))
				if (chain == null) throw new Error('EthereumLists_Rest: network not in chains.json for faucet URLs')
				return urlEntitiesFromFaucetUrlStrings(
					(chain.faucets ?? []).filter((url) => url.length > 0),
				)
			},
		}),
	],
}
