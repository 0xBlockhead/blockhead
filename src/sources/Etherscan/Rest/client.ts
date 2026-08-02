/**
	* Etherscan API V2 client — **`GET`** **`https://api.etherscan.io/v2/api`** with **`chainid`** and optional **`apikey`**.
	*
	* **`apikey`**: `publicEnv.PUBLIC_ETHERSCAN_API_KEY` when configured by the binding.
	*
	* @see https://docs.etherscan.io/v2-migration
	* @see https://docs.etherscan.io/getting-started
	*/

import type {
	EtherscanAccountArray,
	EtherscanProxyJsonRpc,
} from '$/sources/Etherscan/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	optionalPublicEnvString,
} from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Etherscan/bindings.ts'
import { supportedChainIds } from '$/sources/Etherscan/Rest/constants.ts'

const binding = bindings[Source.Etherscan_Rest][0]

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
	* **`GET`** V2 API with **`chainid`** merged into query string.
	* Rejects chain ids outside the binding-owned support catalog.
	*/
export const etherscanV2GetJson = async <T>({
	chainId,
	query,
	publicEnv,
}: {
	chainId: number
	query: Record<string, string | undefined>
	publicEnv: SourcePublicEnv
}) => {
	if (!supportedChainIds.some((supportedChainId) => supportedChainId === chainId))
		throw new Error(`Etherscan_Rest: unsupported chain ${String(chainId)}`)

	const search = new URLSearchParams()
	search.set('chainid', String(chainId))
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) search.set(key, value)
	}
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_ETHERSCAN_API_KEY')
	if (apiKey !== undefined) search.set('apikey', apiKey)
	return sourceGetJson<T>(binding, `${firstHttpUrlForBinding(binding)}?${search}`)
}

export const etherscanV2GetProxyResult = async <T>(
	request: Parameters<typeof etherscanV2GetJson>[0]
) => etherscanV2UnwrapProxyResult(
	await etherscanV2GetJson<EtherscanProxyJsonRpc<T>>(request)
)
