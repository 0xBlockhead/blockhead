import { coins } from '$/constants/Coin.ts'
import { NetworkEnvironment } from '$/constants/Network.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	evmChainCatalogEthereumRootAcceptsTestnet,
	evmChainCatalogExplorerUrlEntities,
	evmChainCatalogFamilyKey,
	evmChainCatalogIsEthereumExecutionRoot,
	evmChainCatalogRowImpliesTestnet,
	evmChainCatalogUrlEntities,
	evmChainIdFromCatalogParent,
	evmNetworkSelectorFromChainId,
	selectBestEvmChainCatalogMainnet,
} from '$/resolvers/evm.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.EthereumLists_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmNetworkBridge,
			resolve: {
				FromToUrl: {
					resolve: async (entitySelector) => {
						const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
						const chain = (await fetchChainsJson()).find((listedChain) => (
							listedChain.chainId === Number(entitySelector.$toNetwork.caip2.reference)
						))
						if (chain == null) throw new Error('EthereumLists_Rest: network bridge target chain not in chains.json')
						const parentChainId = evmChainIdFromCatalogParent(chain.parent)
						if (
						parentChainId == null
						|| parentChainId !== Number(entitySelector.$fromNetwork.caip2.reference)
						|| (
							(chain.parent?.bridges ?? []).length > 0
							&& !(chain.parent?.bridges ?? []).some((bridge) => bridge.url === entitySelector.url)
						)
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
					},
				}
			},
		})({
				$fromNetwork: (bridge) => bridge.$fromNetwork,
				$toNetwork: (bridge) => bridge.$toNetwork,
				url: (bridge) => bridge.url,
				relationshipType: (bridge) => bridge.relationshipType,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector) => {
						const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
						const chains = await fetchChainsJson()
						const chain = chains.find((listedChain) => listedChain.chainId === Number(entitySelector.caip2.reference))
						if (chain == null) return undefined

						return {
							entitySelector,
							chain,
							chains,
						}
					},
				}
			},
		})({
			iconUrl: ({ chain }) => resolveMediaUrlTransport(chain.icon)?.url,
			$icon: ({ chain }) => mediaFromUrl(
				resolveMediaUrlTransport(chain.icon)?.url,
				MediaType.Image
			),
			name: ({ chain }) => {
				const name = `${chain.title ?? chain.name}`.trim()
				if (name.length === 0)
					throw new Error(`EthereumLists_Rest: chain display name missing for chain ${chain.chainId}`)

				return name
			},
			environment: ({ chain }) => (
				evmChainCatalogRowImpliesTestnet(chain) ?
					NetworkEnvironment.Testnet
				:
					NetworkEnvironment.Mainnet
			),
			$$blockExplorerUrls: ({ chain }) => evmChainCatalogExplorerUrlEntities({
				explorers: chain.explorers,
				infoURL: chain.infoURL,
			}),
			$$faucetUrls: ({ chain }) => evmChainCatalogUrlEntities(
				(chain.faucets ?? []).filter((url) => url.length > 0)
			),
			Evm: {
				registryStatus: ({ chain }) => (
					chain.status == null || chain.status === '' ?
						undefined
					:
						String(chain.status)
				),
				$$rpcUrls: ({ chain }) => {
					const rpcUrls = chain.rpc.filter((url) => url.length > 0)
					if (rpcUrls.length === 0)
						throw new Error(`EthereumLists_Rest: no RPC URLs for chain ${chain.chainId}`)

					return evmChainCatalogUrlEntities(rpcUrls)
				},
				$nativeCoin: ({ chain }) => {
					const nativeSymbol = chain.nativeCurrency.symbol.trim()
					if (nativeSymbol === '')
						throw new Error(`EthereumLists_Rest: native currency symbol missing for chain ${chain.chainId}`)

					const nativeCoin = coins.find(({ symbol }) => symbol === nativeSymbol.toUpperCase())
					return (
						nativeCoin == null ?
							undefined
						:
							{
								[EntityMetaKey.Selector]: {
									coinId: nativeCoin.id,
								},
							}
					)
				},
				$nativeCoinInstance: ({ entitySelector }) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
						type: CoinInstanceType.NativeCurrency,
					},
				}),
				peeringId: ({ chain }) => chain.networkId,
				shortName: ({ chain }) => (
					chain.shortName === '' ?
						undefined
					:
						chain.shortName
				),
				slip44: ({ chain }) => chain.slip44,
				$parent: ({ chain }) => {
					const parentChainId = evmChainIdFromCatalogParent(chain.parent)
					return (
						parentChainId == null ?
							undefined
						:
							{
								[EntityMetaKey.Selector]: evmNetworkSelectorFromChainId(parentChainId),
							}
					)
				},
				$$bridges: ({ chain }) => {
					const parentChainId = evmChainIdFromCatalogParent(chain.parent)
					if (parentChainId == null) return []

					const fromNetwork = evmNetworkSelectorFromChainId(parentChainId)
					const toNetwork = evmNetworkSelectorFromChainId(chain.chainId)
					return (chain.parent?.bridges ?? []).map((bridge) => ({
						[EntityMetaKey.Selector]: {
							$fromNetwork: fromNetwork,
							$toNetwork: toNetwork,
							url: bridge.url,
						},
						$fromNetwork: {
							[EntityMetaKey.Selector]: fromNetwork,
						},
						$toNetwork: {
							[EntityMetaKey.Selector]: toNetwork,
						},
						url: bridge.url,
						relationshipType: String(chain.parent?.type ?? 'unknown'),
					}))
				},
				$$childLayers: ({ chain, chains }) => chains.flatMap((candidate) => {
					const parentChainId = evmChainIdFromCatalogParent(candidate.parent)
					return (
						parentChainId == null
						|| parentChainId !== chain.chainId
						|| candidate.chainId === chain.chainId ?
							[]
						:
							[{
								[EntityMetaKey.Selector]: evmNetworkSelectorFromChainId(candidate.chainId),
							}]
					)
				}),
				$$testnets: ({ chain, chains }) => {
					if (evmChainCatalogRowImpliesTestnet(chain)) return []

					const sourceFamilyKey = evmChainCatalogFamilyKey(chain)
					if (sourceFamilyKey == null)
						throw new Error('EthereumLists_Rest: cannot pair testnets (no family key)')

					const sourceIsEthereumExecutionRoot = evmChainCatalogIsEthereumExecutionRoot(chain)
					return chains.flatMap((candidate) => (
						candidate.chainId === chain.chainId
						|| !evmChainCatalogRowImpliesTestnet(candidate)
						|| evmChainCatalogFamilyKey(candidate) !== sourceFamilyKey
						|| (
							sourceIsEthereumExecutionRoot
							&& candidate.parent?.chain != null
						)
						|| !evmChainCatalogEthereumRootAcceptsTestnet(chain, candidate) ?
							[]
						:
							[{
								[EntityMetaKey.Selector]: evmNetworkSelectorFromChainId(candidate.chainId),
							}]
					))
				},
				$mainnet: ({ chain, chains }) => {
					if (!evmChainCatalogRowImpliesTestnet(chain)) return undefined

					const sourceFamilyKey = evmChainCatalogFamilyKey(chain)
					if (sourceFamilyKey == null)
						throw new Error('EthereumLists_Rest: cannot pair mainnet (no family key)')

					const testnetIsEthereumExecutionRoot = evmChainCatalogIsEthereumExecutionRoot(chain)
					const mainnet = selectBestEvmChainCatalogMainnet({
						testnetChainId: chain.chainId,
						testnetShortName: chain.shortName,
						mainnetCandidates: chains.filter((candidate) => (
							candidate.chainId !== chain.chainId
							&& !evmChainCatalogRowImpliesTestnet(candidate)
							&& evmChainCatalogFamilyKey(candidate) === sourceFamilyKey
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
								[EntityMetaKey.Selector]: evmNetworkSelectorFromChainId(mainnet.chainId),
							}
					)
				},
				$$siblingShardNetworks: ({ chain, chains }) => (
					chain.parent == null || String(chain.parent.type).toLowerCase() !== 'shard' ?
						[]
					:
						chains.flatMap((candidate) => (
							candidate.chainId === chain.chainId
							|| candidate.parent == null
							|| candidate.parent.chain.trim() !== chain.parent?.chain.trim()
							|| String(candidate.parent.type).toLowerCase() !== 'shard' ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: evmNetworkSelectorFromChainId(candidate.chainId),
								}]
						))
				),
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_entitySelector) => {
						const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
						return (await fetchChainsJson())
							.map((chain) => ({ [EntityMetaKey.Selector]: evmNetworkSelectorFromChainId(chain.chainId) }))
					},
				}
			},
		})({
				$$evmNetworks: (networks) => networks,
			}),
	],
} satisfies RegisteredSourceResolverModule<Source.EthereumLists_Rest>
