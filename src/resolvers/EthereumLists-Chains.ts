import type { ChainId } from '$/constants/ChainId.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import {
	findChainByChainId,
	rpcUrlsFromEthereumListsChain,
} from '$/sources/EthereumLists/Rest/chainsJsonWire.ts'
import {
	childLayerChainIdsForParent,
	networkTopologyFieldsFromEthereumListsChain,
} from '$/sources/EthereumLists/Rest/chainTopology.ts'
import { chainPrimaryExplorerUrl, fetchChainsJson, isPublicRpcUrl } from '$/sources/EthereumLists/Rest/queries.ts'
import type { EthereumListsChainJson } from '$/sources/EthereumLists/Rest/types.ts'

const networkFieldBagFromChain = (
	chain: EthereumListsChainJson,
	chains: EthereumListsChainJson[],
) => {
	const publicRpcUrl = rpcUrlsFromEthereumListsChain(chain).find(isPublicRpcUrl)
	const primaryExplorerUrl = chainPrimaryExplorerUrl(chain)
	const explorers: string[] = []
	const pushUniqueExplorer = (value: string) => {
		const t = value.trim()
		if (t.length && !explorers.includes(t)) explorers.push(t)
	}
	for (const e of chain.explorers ?? []) {
		if (e?.url) pushUniqueExplorer(e.url)
	}
	if (chain.infoURL) pushUniqueExplorer(chain.infoURL)
	const chainId = chain.chainId as ChainId
	return {
		[EntityMetaKey.Id]: { chainId: chain.chainId },
		...(chain.icon != null && chain.icon !== '' ? { chainIcon: chain.icon } : {}),
		...(chain.status != null && chain.status !== '' ?
			{ registryStatus: String(chain.status) }
		:
			{}),
		faucets: [...(chain.faucets ?? [])],
		explorers,
		executionEndpoints: (
			rpcUrlsFromEthereumListsChain(chain).map((url) => (
				{
					chainId,
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
		name: chain.name,
		...(chain.networkId != null ? { registryNetworkId: chain.networkId } : {}),
		...(publicRpcUrl != null ? { rpcUrl: publicRpcUrl } : {}),
		...(chain.shortName != null && chain.shortName !== '' ? { shortName: chain.shortName } : {}),
		...(primaryExplorerUrl != null ? { explorerOrigin: primaryExplorerUrl } : {}),
		...(chain.nativeCurrency.symbol !== '' ?
			{ nativeSymbol: chain.nativeCurrency.symbol }
		:
			{}),
		...(chain.slip44 != null ? { slip44: chain.slip44 } : {}),
		...networkTopologyFieldsFromEthereumListsChain(chain, chains),
	}
}

export default {
	source: Source.EthereumLists_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network,
			resolve: async (entityId) => {
				const chains = await fetchChainsJson()
				const chain = findChainByChainId(chains, entityId.chainId)
				if (chain == null) {
					throw new Error('EthereumLists_Rest: chain id not in chains.json')
				}
				return networkFieldBagFromChain(chain, chains)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$networks',
			resolve: async (_entityId) => {
				const chains = await fetchChainsJson()
				return (
					chains.map((chain) => (
						networkFieldBagFromChain(chain, chains)
					))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$childNetworks',
			resolve: async (entityId) => {
				const chains = await fetchChainsJson()
				if (findChainByChainId(chains, entityId.chainId) == null) {
					return []
				}
				return (
					childLayerChainIdsForParent(chains, entityId.chainId)
						.map((cid) => {
							const chain = findChainByChainId(chains, cid)
							return (
								chain == null ?
									null
								:	networkFieldBagFromChain(chain, chains)
							)
						})
						.filter((row) => row != null)
				)
			},
		}),
	],
}
