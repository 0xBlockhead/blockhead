import type { EthereumListsChainJson } from '$/sources/EthereumLists/Rest/types.ts'

export const chainPrimaryExplorerUrl = (
	chain: EthereumListsChainJson,
): string | undefined => (
	chain.explorers?.[0]?.url
		?? chain.infoURL
)

export const findChainByChainId = (
	chains: EthereumListsChainJson[],
	chainId: number,
): EthereumListsChainJson | undefined => (
	chains.find((c) => c.chainId === chainId)
)

/** Same RPC URL strings as in `rpc`; chains.json uses plain strings for RPC entries. */
export const rpcUrlsFromEthereumListsChain = (chain: EthereumListsChainJson): string[] => (
	(chain.rpc ?? []).filter((u) => typeof u === 'string' && u.length > 0)
)
