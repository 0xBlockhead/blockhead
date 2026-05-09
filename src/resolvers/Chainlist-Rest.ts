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
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'

const parseEip155ChainId = (ref: string) => {
	const match = /^eip155[:-](\d+)$/i.exec(ref.trim())
	return match != null ? Number(match[1]) : undefined
}

const childLayerChainIdsForParent = (
	allChains: ChainlistRpcsJsonChain[],
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
	allChains: ChainlistRpcsJsonChain[],
	chain: ChainlistRpcsJsonChain,
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
	allChains: ChainlistRpcsJsonChain[],
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

const networkParentLayerFromChain = (chain: ChainlistRpcsJsonChain) => (
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

const networkBridgeRowsFromChain = (chain: ChainlistRpcsJsonChain) => (
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
	explorers: ChainlistRpcsJsonChain['explorers'],
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

const networkEntityFieldsFromChainlistRpcsChain = (
	chain: ChainlistRpcsJsonChain,
	chains: ChainlistRpcsJsonChain[],
) => {
	if (chain.nativeCurrency.symbol.trim() === '') {
		throw new Error(`Chainlist_Rest: native currency symbol missing for chain ${chain.chainId}`)
	}
	const resolvedChainName = `${chain.title ?? chain.name ?? ''}`.trim()
	if (resolvedChainName.length === 0) {
		throw new Error(`Chainlist_Rest: chain display name missing for chain ${chain.chainId}`)
	}
	const rpcUrls = (
		(chain.rpc ?? [])
			.filter((entry) => (
				typeof entry === 'string'
				|| (entry.tracking !== 'yes' && entry.tracking !== 'limited')
			))
			.map((entry) => (
				(typeof entry === 'string' ? entry : entry.url).trim()
			))
			.filter((url) => url.length > 0)
	)
	if (rpcUrls.length === 0) {
		throw new Error(`Chainlist_Rest: no RPC URLs for chain ${chain.chainId}`)
	}
	const iconFromIcons = chain.icons?.find((icon) => icon?.url != null && String(icon.url).length > 0)?.url
	const icon = chain.icon ?? iconFromIcons
	return ({
		[EntityMetaKey.Id]: { chainId: chain.chainId },
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
		childLayerChainIds: childLayerChainIdsForParent(chains, chain.chainId),
		correspondingChainIds: [] satisfies number[],
		environment: (
			chain.isTestnet === true ?
				NetworkEnvironment.Testnet
			:
				NetworkEnvironment.Mainnet
		),
		parentLayer: networkParentLayerFromChain(chain),
		rollupLayerNumber: rollupLayerNumberFromChains(chains, chain.chainId),
		siblingShardChainIds: siblingShardChainIds(chains, chain),
		faucets: (chain.faucets ?? []).filter((url) => url.length > 0),
		...(chain.shortName != null && String(chain.shortName).length > 0 ? { shortName: String(chain.shortName) } : {}),
		...(chain.status != null && String(chain.status).length > 0 ? { registryStatus: String(chain.status) } : {}),
		...(chain.networkId != null ? { peeringId: chain.networkId } : {}),
		...(chain.slip44 != null ? { slip44: chain.slip44 } : {}),
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
			icon != null && String(icon).trim().length > 0 ?
				String(icon).trim()
			:	undefined,
		),
	})
}

export const chainlistNetworkEntitiesFieldResolver = defineEntityFieldResolver({
	entityType: EntityType._Global,
	fieldName: '$$networks',
	resolve: async (_entityId) => {
		const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
		const chains = await fetchRpcsJson()
		return (
			[...chains]
				.sort((chainA, chainB) => (
					chainA.chainId - chainB.chainId
				))
				.map((chain) => (
					networkEntityFieldsFromChainlistRpcsChain(chain, chains)
				))
		)
	},
})

const networkBridgeEntitiesFieldResolver = defineEntityFieldResolver({
	entityType: EntityType.Network,
	fieldName: '$$bridges',
	resolve: async (entityId) => {
		const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
		const chains = await fetchRpcsJson()
		const chain = chains.find((c) => c.chainId === entityId.chainId)
		if (chain == null) throw new Error('Chainlist_Rest: network not in rpcs.json for bridge list')
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
	source: Source.Chainlist_Rest,

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
				if (bridge == null) throw new Error('Chainlist_Rest: network bridge not in rpcs.json')
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
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const chains = await fetchRpcsJson()
				const chain = chains.filter((row) => row.chainId === entityId.chainId)[0]
				if (chain == null) throw new Error('Chainlist_Rest: chain id not in rpcs.json')
				return networkEntityFieldsFromChainlistRpcsChain(chain, chains)
			},
		}),
	],

	entityFieldResolvers: [
		chainlistNetworkEntitiesFieldResolver,
		networkBridgeEntitiesFieldResolver,

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$childNetworks',
			resolve: async (entityId) => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const chains = await fetchRpcsJson()
				const chainId = entityId.chainId
				if (chains.find((c) => c.chainId === chainId) == null) {
					throw new Error('Chainlist_Rest: network not in rpcs.json for child list')
				}
				return (
					childLayerChainIdsForParent(chains, chainId)
						.toSorted((chainIdA, chainIdB) => (
							chainIdA - chainIdB
						))
						.map((cid) => {
							const child = chains.find((c) => c.chainId === cid)
							if (child == null) {
								throw new Error(`Chainlist_Rest: child chain ${cid} missing from rpcs.json`)
							}
							return networkEntityFieldsFromChainlistRpcsChain(child, chains)
						})
				)
			},
		}),
	],
}
