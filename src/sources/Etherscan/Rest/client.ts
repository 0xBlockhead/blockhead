/**
 * Etherscan API V2 client — **`GET`** **`https://api.etherscan.io/v2/api`** with **`chainid`** and optional **`apikey`**.
 *
 * **`apikey`**: `options.apiKey`, else `publicEnv.PUBLIC_ETHERSCAN_API_KEY`, else `publicEnv.PUBLIC_ETHERSCAN_API_KEY_{chainId}` (legacy monorepo pattern).
 *
 * @see https://docs.etherscan.io/v2-migration
 * @see https://docs.etherscan.io/getting-started
 */

import type { EtherscanProxyJsonRpcWire } from '$/sources/Etherscan/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { getJson } from '$/lib/http.ts'
import {
	optionalPublicEnvString,
} from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import Etherscan from '$/sources/Etherscan/index.ts'
import {
	restBaseUrl,
	supportedByChainId,
} from '$/sources/Etherscan/Rest/constants.ts'

export const isEtherscanRestSupportedChainId = (chainId: number): boolean => (
	supportedByChainId[chainId] === true
)

/**
 * Etherscan proxy wire: JSON-RPC `result`, or treat **`status: "0"`** / **`error`** as failure (not RPC data).
 */
export const etherscanV2UnwrapProxyResult = <T>(wire: EtherscanProxyJsonRpcWire<T> | null): T | null => (
	wire == null
	|| wire.error != null
	|| wire.status === '0'
		? null
	:	(wire.result ?? null)
)

/**
 * Resolves Etherscan **`apikey`** for a request (optional; lower rate limits without a key).
 */
export const etherscanResolvedApiKey = (
	chainId: number,
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>,
	options?: { apiKey?: string },
): string | undefined => (
	options?.apiKey?.trim()
		?? optionalPublicEnvString(publicEnv, 'PUBLIC_ETHERSCAN_API_KEY')
)

/**
 * **`GET`** V2 API with **`chainid`** merged into query string.
 * Returns **`null`** when **`chainId`** is not in **`supportedChains`**.
 */
export const etherscanV2GetJson = async <T>({
	chainId,
	query,
	publicEnv,
	options,
}: {
	chainId: number
	query: Record<string, string | undefined>
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	options?: { apiKey?: string }
}): Promise<T | null> => {
	if (!isEtherscanRestSupportedChainId(chainId)) return null
	const search = new URLSearchParams()
	search.set('chainid', String(chainId))
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) search.set(key, value)
	}
	const apiKey = etherscanResolvedApiKey(chainId, publicEnv, options)
	if (apiKey !== undefined) search.set('apikey', apiKey)
	return getJson<T>(`${restBaseUrl}?${search}`, { origins: Etherscan.origins })
}
