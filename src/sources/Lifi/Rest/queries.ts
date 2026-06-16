/**
 * LI.FI public catalog — `GET /v1/chains`, `GET /v1/tokens` (no API key).
 * @see https://docs.li.fi/api-reference/get-information-about-all-currently-supported-chains
 * @see https://docs.li.fi/api-reference/fetch-all-known-tokens
 */

import { throwIfHttpNotOk } from '$/lib/http.ts'
import { lifiRestFetch } from '$/sources/Lifi/Rest/client.ts'
import type {
	FetchLifiChainsOptions,
	FetchLifiTokensOptions,
	LifiChainsResponse,
	LifiTokensResponse,
	LifiToolsResponse,
} from '$/sources/Lifi/Rest/types.ts'

/**
 * `GET /v1/chains` — supported chains (optional `chainTypes` e.g. `EVM,SVM`).
 */
export async function fetchChains(
	options?: FetchLifiChainsOptions
): Promise<LifiChainsResponse> {
	const params = new URLSearchParams()
	if (options?.chainTypes != null && options.chainTypes !== '')
		params.set('chainTypes', options.chainTypes)
	const queryString = params.toString()
	const path = `/v1/chains${queryString ? `?${queryString}` : ''}`
	const res = await lifiRestFetch(path, undefined, { baseUrl: options?.baseUrl })
	await throwIfHttpNotOk(res, path)
	return res.json<LifiChainsResponse>()
}

/**
 * `GET /v1/tokens` — token lists keyed by chain id string under `tokens`.
 */
export async function fetchTokens(
	options?: FetchLifiTokensOptions
): Promise<LifiTokensResponse> {
	const params = new URLSearchParams()
	if (options?.chains != null && options.chains !== '')
		params.set('chains', options.chains)
	if (options?.tags != null && options.tags !== '') params.set('tags', options.tags)
	if (options?.chainTypes != null && options.chainTypes !== '')
		params.set('chainTypes', options.chainTypes)
	if (options?.minPriceUSD != null)
		params.set('minPriceUSD', String(options.minPriceUSD))
	const queryString = params.toString()
	const path = `/v1/tokens${queryString ? `?${queryString}` : ''}`
	const res = await lifiRestFetch(path, undefined, { baseUrl: options?.baseUrl })
	await throwIfHttpNotOk(res, path)
	return res.json<LifiTokensResponse>()
}

export const findChainByChainId = async (
	chainId: number
): Promise<LifiChainsResponse['chains'][number] | undefined> => (
	(await fetchChains()).chains.find((row) => row.id === chainId)
)

/**
 * `GET /v1/tools` — supported bridges (and exchanges; callers use `bridges`).
 * @see https://docs.li.fi/li.fi-api/li.fi-api/requesting-all-supported-tools
 */
export async function fetchTools(
	options?: { baseUrl?: string }
): Promise<LifiToolsResponse> {
	const path = '/v1/tools'
	const res = await lifiRestFetch(path, undefined, { baseUrl: options?.baseUrl })
	await throwIfHttpNotOk(res, path)
	return res.json<LifiToolsResponse>()
}
