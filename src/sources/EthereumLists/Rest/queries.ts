/**
 * [ethereum-lists/chains](https://github.com/ethereum-lists/chains) aggregate: `GET /chains.json`
 * on [chainid.network](https://chainid.network).
 */
import { getJson } from '$/lib/http.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import EthereumLists from '$/sources/EthereumLists/index.ts'
import { origin, chainsJsonPath } from '$/sources/EthereumLists/Rest/constants.ts'
import {
	chainPrimaryExplorerUrl,
} from '$/sources/EthereumLists/Rest/chainsJsonWire.ts'
import type { EthereumListsChainJson } from '$/sources/EthereumLists/Rest/types.ts'
import { isPublicRpcUrl } from '$/sources/Chainlist/Rest/queries.ts'

export { isPublicRpcUrl, chainPrimaryExplorerUrl }

const fetchChainsJsonOnce = async (): Promise<EthereumListsChainJson[]> => {
	const url = `${origin}${chainsJsonPath}`
	return getJson<EthereumListsChainJson[]>(url, { origins: EthereumLists.origins })
}

export const fetchChainsJson = singleFlight(fetchChainsJsonOnce)
