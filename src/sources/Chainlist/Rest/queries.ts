/**
 * Chainlist HTTP: `GET /rpcs.json`.
 * @see https://chainlist.org/rpcs.json
 */

// Types/constants
import { getJson } from '$/lib/fetch.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { chainlistOrigin } from '$/sources/Chainlist/Rest/constants.ts'
import {
	findChainByChainId,
	rpcUrlsWithoutHeavyTracking,
} from '$/sources/Chainlist/Rest/rpcsJsonWire.ts'
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'


// Functions
export const isPublicRpcUrl = (url: string): boolean => {
	if (url.includes('${')) return false
	try {
		const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
		return ![
			/api[_-]?key=/i,
			/apikey=/i,
			/key=[a-zA-Z0-9_-]{20,}/i,
			/getblock\.io\/[a-f0-9]+/i,
			/nodereal\.io\/v1\/[a-f0-9]+/i,
			/ankr\.com\/[^/]+\/[a-f0-9]+/i,
		].some((re) => re.test(`${parsed.origin}${parsed.pathname}${parsed.search}`))
	} catch {
		return false
	}
}

export const chainPrimaryExplorerUrl = (
	chain: ChainlistRpcsJsonChain,
): string | undefined => (
	chain.explorers?.[0]?.url
		?? chain.infoURL
)

const fetchRpcsJsonOnce = async (): Promise<ChainlistRpcsJsonChain[]> => {
	const url = `${chainlistOrigin}/rpcs.json`
	return getJson<ChainlistRpcsJsonChain[]>(url)
}

export const fetchRpcsJson = singleFlight(fetchRpcsJsonOnce)

export const chainlistRpcUrlForChainId = async (chainId: number): Promise<string | undefined> => {
	const chains = await fetchRpcsJson()
	const chain = findChainByChainId(chains, chainId)
	if (chain == null) return undefined
	for (const url of rpcUrlsWithoutHeavyTracking(chain)) {
		if (isPublicRpcUrl(url)) return url
	}
	return undefined
}
