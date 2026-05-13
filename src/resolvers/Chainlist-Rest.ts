import { CoinId, coinBySymbol } from '$/constants/Coin.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Chainlist_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NetworkBridge,
			resolve: async (entityId) => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const chain = (await fetchRpcsJson()).find((row) => (
					row.chainId === entityId.$toNetwork.chainId
				))
				if (chain == null) throw new Error('Chainlist_Rest: network bridge target chain not in rpcs.json')
				const parentLayer = (
					((parentMatch) => (
						parentMatch == null ?
							undefined
						:	{
								chainId: Number(parentMatch[1]),
								relationshipType: String(chain.parent?.type ?? 'unknown'),
							}
					))(chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim()))
				)
				if (parentLayer == null) throw new Error('Chainlist_Rest: network bridge not in rpcs.json')
				if (
					parentLayer.chainId !== entityId.$fromNetwork.chainId
					|| !(chain.parent?.bridges ?? []).some((bridge) => bridge.url === entityId.url)
				) throw new Error('Chainlist_Rest: network bridge not in rpcs.json')
				return {
					[EntityMetaKey.Id]: entityId,
					$fromNetwork: {
						[EntityMetaKey.Id]: entityId.$fromNetwork,
					},
					$toNetwork: {
						[EntityMetaKey.Id]: entityId.$toNetwork,
					},
					url: entityId.url,
					relationshipType: parentLayer.relationshipType,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Network,
			resolve: async (entityId) => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const chains = await fetchRpcsJson()
				const chain = chains.find((row) => row.chainId === entityId.chainId)
				if (chain == null) throw new Error('Chainlist_Rest: chain id not in rpcs.json')
				if (chain.nativeCurrency.symbol.trim() === '') throw new Error(`Chainlist_Rest: native currency symbol missing for chain ${chain.chainId}`)
				if (`${chain.title ?? chain.name ?? ''}`.trim().length === 0) throw new Error(`Chainlist_Rest: chain display name missing for chain ${chain.chainId}`)
				const rpcUrls = (chain.rpc ?? [])
					.filter((entry) => (
						typeof entry === 'string'
						|| (entry.tracking !== 'yes' && entry.tracking !== 'limited')
					))
					.map((entry) => (typeof entry === 'string' ? entry : entry.url).trim())
					.filter((url) => url.length > 0)
				if (rpcUrls.length === 0) throw new Error(`Chainlist_Rest: no RPC URLs for chain ${chain.chainId}`)
				const icon = (
					resolveMediaUrlTransport(chain.icons?.find((icon) => icon?.url != null && String(icon.url).length > 0)?.url)?.url
					?? resolveMediaUrlTransport(chain.icon)?.url
				)
				return {
					[EntityMetaKey.Id]: entityId,
					name: `${chain.title ?? chain.name ?? ''}`.trim(),
					nativeCurrencies: [
						{
							name: chain.nativeCurrency.name,
							symbol: chain.nativeCurrency.symbol,
							decimals: chain.nativeCurrency.decimals,
							coinId: coinBySymbol[chain.nativeCurrency.symbol.trim().toUpperCase()]?.id ?? CoinId.Unknown,
							...(chain.slip44 != null ? { slip44: chain.slip44 } : {}),
						},
					],
					blockExplorers: [
						...(chain.explorers ?? [])
							.flatMap((explorer) => (
								explorer.url.trim() === '' ?
									[]
								:	[
										{
											origin: explorer.url,
											...(explorer.name.trim() !== '' ? { name: explorer.name } : {}),
											...(explorer.standard != null && explorer.standard.trim() !== '' ? { standard: explorer.standard } : {}),
											...(explorer.icon != null && explorer.icon.trim() !== '' ? { icon: explorer.icon } : {}),
										},
									]
							)),
						...(
							chain.infoURL?.trim() != null
							&& chain.infoURL.trim() !== ''
							&& !(chain.explorers ?? []).some((explorer) => explorer.url === chain.infoURL?.trim()) ?
								[{ origin: chain.infoURL.trim() }]
							:
								[]
						),
					],
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
					environment: (
						chain.isTestnet === true ?
							NetworkEnvironment.Testnet
						:
							NetworkEnvironment.Mainnet
					),
					parentLayer: (
						((parentMatch) => (
							parentMatch == null || chain.parent == null ?
								undefined
							:	{
									bridgeUrls: (chain.parent.bridges ?? []).map((bridge) => bridge.url).filter((url) => url.length > 0),
									parentChainCaip: chain.parent.chain.trim(),
									parentChainId: Number(parentMatch[1]),
									relationshipType: String(chain.parent.type ?? 'unknown'),
								}
						))(chain.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim()))
					),
					rollupLayerNumber: (() => {
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
					faucets: (chain.faucets ?? []).filter((url) => url.length > 0),
					...(chain.shortName != null && String(chain.shortName).length > 0 ? { shortName: String(chain.shortName) } : {}),
					...(chain.status != null && String(chain.status).length > 0 ? { registryStatus: String(chain.status) } : {}),
					...(chain.networkId != null ? { peeringId: chain.networkId } : {}),
					...(chain.slip44 != null ? { slip44: chain.slip44 } : {}),
					...((iconMedia) => iconMedia == null ? {} : { $icon: iconMedia })(mediaFromUrl(icon, MediaType.Image)),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$networks',
			resolve: async (_entityId) => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				return (await fetchRpcsJson())
					.toSorted((chainA, chainB) => chainA.chainId - chainB.chainId)
					.flatMap((chain) => (
						chain.chainId == null ?
							[]
						:	[{ [EntityMetaKey.Id]: { chainId: chain.chainId } }]
					))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$bridges',
			resolve: async (entityId) => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const chain = (await fetchRpcsJson()).find((row) => row.chainId === entityId.chainId)
				const parentMatch = chain?.parent?.chain == null ? null : /^eip155[:-](\d+)$/i.exec(chain.parent.chain.trim())
				if (chain == null || parentMatch == null) throw new Error('Chainlist_Rest: network not in rpcs.json for bridge list')
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
			fieldName: '$$childNetworks',
			resolve: async (entityId) => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const chains = await fetchRpcsJson()
				if (chains.find((chain) => chain.chainId === entityId.chainId) == null) {
					throw new Error('Chainlist_Rest: network not in rpcs.json for child list')
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
					.toSorted((chainIdA, chainIdB) => (
						chainIdA - chainIdB
					))
					.map((chainId) => ({ [EntityMetaKey.Id]: { chainId } }))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$siblingShardNetworks',
			resolve: async (entityId) => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const chains = await fetchRpcsJson()
				const chain = chains.find((row) => row.chainId === entityId.chainId)
				if (chain == null) {
					throw new Error('Chainlist_Rest: network not in rpcs.json for sibling shard list')
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
					.toSorted((chainIdA, chainIdB) => (
						chainIdA - chainIdB
					))
					.map((chainId) => ({ [EntityMetaKey.Id]: { chainId } }))
			},
		}),
	],
}
