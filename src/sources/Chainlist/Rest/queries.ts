/**
 * Chainlist HTTP: `GET /rpcs.json`.
 * @see https://chainlist.org/rpcs.json
 */

import { getJson } from '$/lib/http.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import Chainlist from '$/sources/Chainlist/index.ts'
import { origin } from '$/sources/Chainlist/Rest/constants.ts'
import {
	findChainByChainId,
	rpcUrlsWithoutHeavyTracking,
} from '$/sources/Chainlist/Rest/rpcsJsonWire.ts'
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'

export const isPublicRpcUrl = (url: string): boolean => {
	if (url.includes('${')) return false
	let parsed: URL
	try {
		parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
	} catch {
		return false
	}
	return ![
		/api[_-]?key=/i,
		/apikey=/i,
		/key=[a-zA-Z0-9_-]{20,}/i,
		/getblock\.io\/[a-f0-9]+/i,
		/nodereal\.io\/v1\/[a-f0-9]+/i,
		/ankr\.com\/[^/]+\/[a-f0-9]+/i,
	].some((re) => re.test(`${parsed.origin}${parsed.pathname}${parsed.search}`))
}

export const chainPrimaryExplorerUrl = (
	chain: ChainlistRpcsJsonChain,
): string | undefined => (
	chain.explorers?.[0]?.url
		?? chain.infoURL
)

const fetchRpcsJsonOnce = async (): Promise<ChainlistRpcsJsonChain[]> => {
	const url = `${origin}/rpcs.json`
	return getJson<ChainlistRpcsJsonChain[]>(url, { origins: Chainlist.origins })
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
