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
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	accountEmptyMessages,
	supportedChainIds,
} from '$/sources/Etherscan/Rest/constants.ts'

const accountEmptyMessageSet = new Set<string>(accountEmptyMessages)

const supportedChainIdSet = new Set<number>(supportedChainIds)

/**
	* Etherscan proxy wire: JSON-RPC `result` (may be **`null`** when absent), or throw on **`status: "0"`** / **`error`**.
	*/
export const etherscanV2UnwrapProxyResult = <T>(wire: EtherscanProxyJsonRpc<T> | null): T | null => {
	if (wire == null)
		throw new Error('Etherscan_Rest: proxy response missing envelope')
	if (wire.error != null)
		throw new Error(`Etherscan_Rest: proxy error ${wire.error.code}: ${wire.error.message}`)
	if (wire.status === '0')
		throw new Error(`Etherscan_Rest: proxy NOTOK${typeof wire.result === 'string' && wire.result !== '' ? `: ${wire.result}` : wire.message != null && wire.message !== '' ? `: ${wire.message}` : ''}`)
	return wire.result ?? null
}

/**
	* `module=account` list endpoints — empty list on known zero-row messages; throw on hard failure.
	*/
export const etherscanV2UnwrapAccountResultArray = <T>(
	wire: EtherscanAccountArray<T> | null
): T[] => {
	if (wire == null)
		throw new Error('Etherscan_Rest: account list response missing envelope')
	if (wire.status === '1' && Array.isArray(wire.result))
		return wire.result
	if (
		wire.status === '0'
		&& (
			accountEmptyMessageSet.has(wire.message)
			|| (
				typeof wire.result === 'string'
				&& accountEmptyMessageSet.has(wire.result)
			)
		)
	)
		return []
	throw new Error(
		`Etherscan_Rest: account list failed${
			typeof wire.result === 'string' && wire.result !== '' ?
				`: ${wire.result}`
			: wire.message !== '' ?
				`: ${wire.message}`
			:
				''
		}`
	)
}

/**
	* **`GET`** V2 API with **`chainid`** merged into query string.
	* Rejects chain ids outside the binding-owned support catalog.
	*/
export const etherscanV2GetJson = async <T>({
	binding,
	chainId,
	query,
	publicEnv,
}: {
	binding: SourceBinding
	chainId: number
	query: Record<string, string | undefined>
	publicEnv: SourcePublicEnv
}) => {
	if (!supportedChainIdSet.has(chainId))
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
