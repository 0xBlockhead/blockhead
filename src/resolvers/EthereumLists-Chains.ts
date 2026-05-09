import { CoinId, coinBySymbol } from '$/constants/Coin.ts'
import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/$Source.ts'
import type { EthereumListsChainJson } from '$/sources/EthereumLists/Rest/types.ts'

const parseEip155ChainId = (ref: string) => {
	const match = /^eip155[:-](\d+)$/i.exec(ref.trim())
	return match != null ? Number(match[1]) : undefined
}

const childLayerChainIdsForParent = (
	allChains: EthereumListsChainJson[],
	parentChainId: number,
) => (
	[
		...new Set(
			allChains.flatMap((chain) => (
				chain.parent?.chain == null || parseEip155ChainId(chain.parent.chain) !== parentChainId || chain.chainId === parentChainId ?
					[]
				:	[chain.chainId]
			)),
		),
	]
)

const siblingShardChainIds = (
	allChains: EthereumListsChainJson[],
	chain: EthereumListsChainJson,
) => (
	chain.parent == null || chain.parent.chain == null || String(chain.parent.type ?? '').toLowerCase() !== 'shard' ?
		[]
	:	[
			...new Set(
				allChains.flatMap((candidate) => (
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

const rollupLayerNumberFromChains = (
	allChains: EthereumListsChainJson[],
	chainId: number,
) => {
	const byId = new Map(allChains.map((c) => [c.chainId, c]))
	let layer = 1
	let id: number | undefined = chainId
	const visited = new Set<number>()
	for (let hop = 0; hop < 256 && id !== undefined; hop += 1) {
		if (visited.has(id)) {
			return layer
		}
		visited.add(id)
		const chain = byId.get(id)
		if (chain == null) {
			return layer
		}
		const raw = chain.parent?.chain
		const parentId = (
			typeof raw !== 'string' || raw.trim() === '' ?
				undefined
			:	parseEip155ChainId(raw)
		)
		if (parentId == null || parentId === id) {
			return layer
		}
		layer += 1
		id = parentId
	}
	return layer
}

const networkParentLayerFromChain = (chain: EthereumListsChainJson) => (
	chain.parent?.chain == null || parseEip155ChainId(chain.parent.chain) == null ?
		undefined
	:	{
			bridgeUrls: (
				(chain.parent.bridges ?? [])
					.map((bridge) => bridge.url)
					.filter((url) => url.length > 0)
			),
			parentChainCaip: chain.parent.chain.trim(),
			parentChainId: parseEip155ChainId(chain.parent.chain)!,
			relationshipType: String(chain.parent.type ?? 'unknown'),
		}
)

const networkBridgeRowsFromChain = (chain: EthereumListsChainJson) => (
	((parentLayer) => (
		parentLayer == null ?
			[]
		:	parentLayer.bridgeUrls.map((url) => ({
				$fromNetwork: {
					chainId: parentLayer.parentChainId,
				},
				$toNetwork: {
					chainId: chain.chainId,
				},
				url,
				relationshipType: parentLayer.relationshipType,
			}))
	))(networkParentLayerFromChain(chain))
)

const blockExplorerRowsFromWire = (
	explorers: EthereumListsChainJson['explorers'],
	infoURL: string | undefined,
) => {
	const fromExplorers = (
		(explorers ?? [])
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
			))
	)
	const trimmedInfo = infoURL?.trim()
	if (trimmedInfo != null && trimmedInfo !== '' && !fromExplorers.some((row) => row.origin === trimmedInfo)) {
		return [...fromExplorers, { origin: trimmedInfo }]
	}
	return fromExplorers
}

const networkEntityFieldsFromEthereumListsChainJson = (
	chain: EthereumListsChainJson,
	chains: EthereumListsChainJson[],
) => {
	if (chain.nativeCurrency.symbol.trim() === '') {
		throw new Error(`EthereumLists_Rest: native currency symbol missing for chain ${chain.chainId}`)
	}
	const resolvedChainName = `${chain.title ?? chain.name ?? ''}`.trim()
	if (resolvedChainName.length === 0) {
		throw new Error(`EthereumLists_Rest: chain display name missing for chain ${chain.chainId}`)
	}
	const rpcUrls = chain.rpc.filter((url) => url.length > 0)
	if (rpcUrls.length === 0) {
		throw new Error(`EthereumLists_Rest: no RPC URLs for chain ${chain.chainId}`)
	}
	return ({
		[EntityMetaKey.Id]: { chainId: chain.chainId },
		...((
			t,
		) => (
			t == null ?
				{}
			:	{
					$icon: {
						[EntityMetaKey.Id]: { url: t },
						type: MediaType.Image,
					},
				}
		))(
			chain.icon != null && String(chain.icon).trim().length > 0 ?
				String(chain.icon).trim()
			:	undefined,
		),
		...(chain.status != null && chain.status !== '' ?
			{ registryStatus: String(chain.status) }
		:
			{}),
		faucets: (chain.faucets ?? []).filter((url) => url.length > 0),
		blockExplorers: blockExplorerRowsFromWire(chain.explorers, chain.infoURL),
		executionEndpoints: (
			rpcUrls.map((url) => (
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
		name: resolvedChainName,
		nativeCurrencies: (
			[
				{
					name: chain.nativeCurrency.name,
					symbol: chain.nativeCurrency.symbol,
					decimals: chain.nativeCurrency.decimals,
					coinId: coinBySymbol[chain.nativeCurrency.symbol.trim().toUpperCase()]?.id ?? CoinId.Unknown,
					...(chain.slip44 != null ? { slip44: chain.slip44 } : {}),
				},
			]
		),
		peeringId: chain.networkId,
		...(chain.shortName !== '' ? { shortName: chain.shortName } : {}),
		...(chain.slip44 != null ? { slip44: chain.slip44 } : {}),
		childLayerChainIds: childLayerChainIdsForParent(chains, chain.chainId),
		correspondingChainIds: [] satisfies number[],
		...(
			/testnet/i.test(`${chain.title ?? ''} ${chain.name}`) ?
				{ environment: NetworkEnvironment.Testnet }
			:
				{}
		),
		parentLayer: networkParentLayerFromChain(chain),
		rollupLayerNumber: rollupLayerNumberFromChains(chains, chain.chainId),
		siblingShardChainIds: siblingShardChainIds(chains, chain),
	})
}

const globalNetworkEntitiesFieldResolver = defineEntityFieldResolver({
	entityType: EntityType._Global,
	fieldName: '$$networks',
	resolve: async (_entityId) => {
		const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
		const chains = await fetchChainsJson()
		return (
			[...chains]
				.sort((chainA, chainB) => (
					chainA.chainId - chainB.chainId
				))
				.map((chain) => (
					networkEntityFieldsFromEthereumListsChainJson(chain, chains)
				))
		)
	},
})

const networkBridgeEntitiesFieldResolver = defineEntityFieldResolver({
	entityType: EntityType.Network,
	fieldName: '$$bridges',
	resolve: async (entityId) => {
		const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
		const chains = await fetchChainsJson()
		const chain = chains.find((c) => c.chainId === entityId.chainId)
		if (chain == null) throw new Error('EthereumLists_Rest: network not in chains.json for bridge list')
		return (
			networkBridgeRowsFromChain(chain)
				.map((bridge) => ({
					[EntityMetaKey.Id]: {
						$fromNetwork: bridge.$fromNetwork,
						$toNetwork: bridge.$toNetwork,
						url: bridge.url,
					},
					$fromNetwork: {
						[EntityMetaKey.Id]: bridge.$fromNetwork,
					},
					$toNetwork: {
						[EntityMetaKey.Id]: bridge.$toNetwork,
					},
					url: bridge.url,
					relationshipType: bridge.relationshipType,
				}))
		)
	},
})

export default {
	source: Source.EthereumLists_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NetworkBridge,
			resolve: async (entityId, context) => {
				const bridge = (
					await networkBridgeEntitiesFieldResolver.resolve(entityId.$toNetwork, context) ?? []
				).find((bridge) => (
						bridge[EntityMetaKey.Id].$fromNetwork.chainId === entityId.$fromNetwork.chainId
						&& bridge.url === entityId.url
					))
				if (bridge == null) throw new Error('EthereumLists_Rest: network bridge not in chains.json')
				return {
					[EntityMetaKey.Id]: entityId,
					$fromNetwork: {
						[EntityMetaKey.Id]: entityId.$fromNetwork,
					},
					$toNetwork: {
						[EntityMetaKey.Id]: entityId.$toNetwork,
					},
					url: entityId.url,
					relationshipType: bridge.relationshipType,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Network,
			resolve: async (entityId, context) => {
				const network = (await globalNetworkEntitiesFieldResolver.resolve({}, context)).find((row) => row[EntityMetaKey.Id].chainId === entityId.chainId)
				if (network == null) {
					throw new Error('EthereumLists_Rest: chain id not in chains.json')
				}
				return network
			},
		}),
	],

	entityFieldResolvers: [
		globalNetworkEntitiesFieldResolver,
		networkBridgeEntitiesFieldResolver,

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$childNetworks',
			resolve: async (entityId) => {
				const { fetchChainsJson } = await import('$/sources/EthereumLists/Rest/queries.ts')
				const chains = await fetchChainsJson()
				const chainId = entityId.chainId
				if (chains.find((c) => c.chainId === chainId) == null) {
					throw new Error('EthereumLists_Rest: network not in chains.json for child list')
				}
				return (
					childLayerChainIdsForParent(chains, chainId)
						.toSorted((chainIdA, chainIdB) => (
							chainIdA - chainIdB
						))
						.map((cid) => {
							const child = chains.find((c) => c.chainId === cid)
							if (child == null) {
								throw new Error(`EthereumLists_Rest: child chain ${cid} missing from chains.json`)
							}
							return networkEntityFieldsFromEthereumListsChainJson(child, chains)
						})
				)
			},
		}),
	],
}
