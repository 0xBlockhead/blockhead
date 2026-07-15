/**
	* Etherscan API V2 client — **`GET`** **`https://api.etherscan.io/v2/api`** with **`chainid`** and optional **`apikey`**.
	*
	* **`apikey`**: `options.apiKey`, else `publicEnv.PUBLIC_ETHERSCAN_API_KEY`, else `publicEnv.PUBLIC_ETHERSCAN_API_KEY_{chainId}` (legacy monorepo pattern).
	*
	* @see https://docs.etherscan.io/v2-migration
	* @see https://docs.etherscan.io/getting-started
	*/

import type {
	EtherscanAccountArray,
	EtherscanProxyJsonRpc,
} from '$/sources/Etherscan/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { getJson } from '$/lib/http.ts'
import {
	optionalPublicEnvString,
} from '$/sources/$sources.ts'
import {
	etherscanOrigins,
	restBaseUrl,
} from '$/sources/Etherscan/Rest/constants.ts'

/**
	* Etherscan proxy wire: JSON-RPC `result`, or treat **`status: "0"`** / **`error`** as failure (not RPC data).
	*/
export const etherscanV2UnwrapProxyResult = <T>(wire: EtherscanProxyJsonRpc<T> | null): T | null => (
	wire == null
	|| wire.error != null
	|| wire.status === '0' ?
		null
	:
		(wire.result ?? null)
)

const etherscanAccountEmptyMessages = new Set([
	'No transactions found',
	'No records found',
])

/**
	* `module=account` list endpoints — empty list on zero rows; **`null`** on hard failure.
	*/
export const etherscanV2UnwrapAccountResultArray = <T>(
	wire: EtherscanAccountArray<T> | null
): T[] | null => {
	if (wire == null) return null
	if (wire.status === '1' && Array.isArray(wire.result)) return wire.result
	if (
		wire.status === '0'
		&& (
			etherscanAccountEmptyMessages.has(wire.message)
			|| (
				typeof wire.result === 'string'
				&& etherscanAccountEmptyMessages.has(wire.result)
			)
		)
	) {
		return []
	}
	return null
}

/**
	* Resolves Etherscan **`apikey`** for a request (optional; lower rate limits without a key).
	*/
export const etherscanResolvedApiKey = (
	chainId: number,
	publicEnv: SourcePublicEnv,
	options?: { apiKey?: string }
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
	publicEnv: SourcePublicEnv
	options?: { apiKey?: string }
}): Promise<T | null> => {
	const search = new URLSearchParams()
	search.set('chainid', String(chainId))
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) search.set(key, value)
	}
	const apiKey = etherscanResolvedApiKey(chainId, publicEnv, options)
	if (apiKey !== undefined) search.set('apikey', apiKey)
	return getJson<T>(`${restBaseUrl}?${search}`, { origins: etherscanOrigins })
}
