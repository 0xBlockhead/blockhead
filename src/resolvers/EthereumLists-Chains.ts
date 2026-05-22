import { CoinId, coinBySymbol } from '$/constants/Coin.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import {
	catalogChainIsEthereumExecutionRoot,
	catalogEthereumExecutionRootAcceptsTestnetCandidate,
	ethereumListsRowImpliesTestnet,
	pairingFamilyKey,
	selectBestMainnetCandidate,
} from '$/resolvers/_networkCatalogPairing.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.EthereumLists_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NetworkBridge,
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chain = (await fetchChainsJson()).find((row) => (
					row.chainId === entityId.$toNetwork.chainId
				))
				if (chain == null) throw new Error('EthereumLists_Rest: network bridge target chain not in chains.json')
				const parentMatch = chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
				if (
					parentMatch == null
					|| Number(parentMatch[1]) !== entityId.$fromNetwork.chainId
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
			entityType: EntityType.Network,
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await fetchChainsJson()
				const chain = chains.find((row) => row.chainId === entityId.chainId)
				if (chain == null) throw new Error('EthereumLists_Rest: chain id not in chains.json')
				if (chain.nativeCurrency.symbol.trim() === '') throw new Error(`EthereumLists_Rest: native currency symbol missing for chain ${chain.chainId}`)
				if (`${chain.title ?? chain.name ?? ''}`.trim().length === 0) throw new Error(`EthereumLists_Rest: chain display name missing for chain ${chain.chainId}`)
				const rpcUrls = chain.rpc.filter((url) => url.length > 0)
				if (rpcUrls.length === 0) throw new Error(`EthereumLists_Rest: no RPC URLs for chain ${chain.chainId}`)
				const { urlEntitiesDeduplicatedSortedFromFaucetUrlStrings } = await import(
					'$/resolvers/_networkCatalogUrlEntities.ts'
				)
				const icon = resolveMediaUrlTransport(chain.icon)?.url
				return {
					[EntityMetaKey.Id]: { chainId: chain.chainId },
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
					$$rpcUrls: urlEntitiesDeduplicatedSortedFromFaucetUrlStrings(rpcUrls),
					name: `${chain.title ?? chain.name ?? ''}`.trim(),
					nativeCurrencies: [
						{
							name: chain.nativeCurrency.name,
							symbol: chain.nativeCurrency.symbol,
							decimals: chain.nativeCurrency.decimals,
							coinId: coinBySymbol[chain.nativeCurrency.symbol.trim().toUpperCase()]?.id ?? CoinId.Unknown,
							...(chain.slip44 != null && { slip44: chain.slip44 }),
						},
					],
					peeringId: chain.networkId,
					...(chain.shortName !== '' && { shortName: chain.shortName }),
					...(chain.slip44 != null && { slip44: chain.slip44 }),
					...(isEthereumListsTestnet(chain) && { environment: NetworkEnvironment.Testnet }),
					$parentLayer: (
						((parentMatch) => (
							parentMatch == null || chain.parent == null ?
								undefined
							:	{
									[EntityMetaKey.Id]: { chainId: Number(parentMatch[1]) },
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
			fieldName: '$$networks',
			resolve: async (_entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				return (await fetchChainsJson())
					.toSorted((chainA, chainB) => chainA.chainId - chainB.chainId)
					.map((chain) => ({ [EntityMetaKey.Id]: { chainId: chain.chainId } }))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$bridges',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chain = (await fetchChainsJson()).find((row) => row.chainId === entityId.chainId)
				const parentMatch = chain?.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
				if (chain == null || parentMatch == null) throw new Error('EthereumLists_Rest: network not in chains.json for bridge list')
				return (chain.parent?.bridges ?? [])
					.map((bridge) => ({
						[EntityMetaKey.Id]: {
							$fromNetwork: { chainId: Number(parentMatch[1]) },
							$toNetwork: { chainId: chain.chainId },
							url: bridge.url,
						},
						$fromNetwork: {
							[EntityMetaKey.Id]: { chainId: Number(parentMatch[1]) },
						},
						$toNetwork: {
							[EntityMetaKey.Id]: { chainId: chain.chainId },
						},
						url: bridge.url,
						relationshipType: String(chain.parent?.type ?? 'unknown'),
					}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$childLayers',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await fetchChainsJson()
				const chainId = entityId.chainId
				if (chains.find((c) => c.chainId === chainId) == null) {
					throw new Error('EthereumLists_Rest: network not in chains.json for child list')
				}
				return [
					...new Set(
						chains.flatMap((chain) => {
							const parentMatch = chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
							return parentMatch == null || Number(parentMatch[1]) !== entityId.chainId || chain.chainId === entityId.chainId ?
								[]
							:	[chain.chainId]
						}),
					),
				]
					.toSorted((chainIdA, chainIdB) => chainIdA - chainIdB)
					.map((chainId) => ({ [EntityMetaKey.Id]: { chainId } }))
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$testnets',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await fetchChainsJson()
				const chain = chains.find((row) => row.chainId === entityId.chainId)
				if (chain == null) {
					throw new Error('EthereumLists_Rest: network not in chains.json for testnet list')
				}
				if (ethereumListsRowImpliesTestnet(chain)) return []
				const sourceFamilyKey = pairingFamilyKey(chain)
				if (sourceFamilyKey == null) {
					throw new Error('EthereumLists_Rest: cannot pair testnets (no family key)')
				}
				const sourceIsEthereumExecutionRoot = catalogChainIsEthereumExecutionRoot(chain)
				return [
					...new Set(
						chains.flatMap((candidate) => {
							return candidate.chainId === entityId.chainId
								|| !ethereumListsRowImpliesTestnet(candidate)
								|| pairingFamilyKey(candidate) !== sourceFamilyKey
								|| (
									sourceIsEthereumExecutionRoot
									&& candidate.parent?.chain != null
								)
								|| !catalogEthereumExecutionRootAcceptsTestnetCandidate(chain, candidate) ?
								[]
							:	[candidate.chainId]
						}),
					),
				]
					.map((chainId) => ({ [EntityMetaKey.Id]: { chainId } }))
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$mainnet',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await fetchChainsJson()
				const chain = chains.find((row) => row.chainId === entityId.chainId)
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
						candidate.chainId !== entityId.chainId
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
							[EntityMetaKey.Id]: {
								chainId: mainnet.chainId,
							},
						}
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$siblingShardNetworks',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await fetchChainsJson()
				const chain = chains.find((row) => row.chainId === entityId.chainId)
				if (chain == null) {
					throw new Error('EthereumLists_Rest: network not in chains.json for sibling shard list')
				}
				return (
					chain.parent == null || chain.parent.chain == null || String(chain.parent.type ?? '').toLowerCase() !== 'shard' ?
						[]
					:	[
							...new Set(
								chains.flatMap((candidate) => (
									candidate.chainId === chain.chainId
									|| candidate.parent == null
									|| candidate.parent.chain?.trim() !== chain.parent?.chain?.trim()
									|| String(candidate.parent.type ?? '').toLowerCase() !== 'shard' ?
										[]
									:	[candidate.chainId]
								)),
							),
						]
				)
					.map((chainId) => ({ [EntityMetaKey.Id]: { chainId } }))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$blockExplorerUrls',
			resolve: async (entityId) => {
				const {
					blockExplorerCatalogWireFromExplorersAndInfoUrl,
					urlEntitiesDeduplicatedSortedFromBlockExplorerCatalog,
				} = await import('$/resolvers/_networkCatalogUrlEntities.ts')
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chain = (await fetchChainsJson()).find((row) => row.chainId === entityId.chainId)
				if (chain == null) throw new Error('EthereumLists_Rest: network not in chains.json for block explorer URLs')
				return urlEntitiesDeduplicatedSortedFromBlockExplorerCatalog(
					blockExplorerCatalogWireFromExplorersAndInfoUrl({
						explorers: chain.explorers,
						infoURL: chain.infoURL,
					}),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$faucetUrls',
			resolve: async (entityId) => {
				const { urlEntitiesDeduplicatedSortedFromFaucetUrlStrings } = await import(
					'$/resolvers/_networkCatalogUrlEntities.ts'
				)
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chain = (await fetchChainsJson()).find((row) => row.chainId === entityId.chainId)
				if (chain == null) throw new Error('EthereumLists_Rest: network not in chains.json for faucet URLs')
				return urlEntitiesDeduplicatedSortedFromFaucetUrlStrings(
					(chain.faucets ?? []).filter((url) => url.length > 0),
				)
			},
		}),
	],
}
