// Types/constants
import type {
	ChainlistRpcsJsonChain,
	ChainlistRpcsJsonRpcEntry,
} from '$/sources/Chainlist/Rest/types.ts'


// Functions
export const rpcEntryUrl = (entry: ChainlistRpcsJsonRpcEntry): string | undefined => {
	const raw = typeof entry === 'string' ? entry : entry.url
	const t = raw?.trim()
	return t || undefined
}

export const findChainByChainId = (
	chains: ChainlistRpcsJsonChain[],
	chainId: number,
) => chains.find((c) => c.chainId === chainId)

export const rpcUrlsWithoutHeavyTracking = (chain: ChainlistRpcsJsonChain): string[] => (
	chain.rpc
		?.filter((entry) => (
			typeof entry === 'string'
			|| (entry.tracking !== 'yes' && entry.tracking !== 'limited')
		))
		?.map((entry) => rpcEntryUrl(entry))
		?.filter((url): url is string => Boolean(url))
		?? []
)
