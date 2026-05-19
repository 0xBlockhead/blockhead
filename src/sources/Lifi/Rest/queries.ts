/**
 * LI.FI public catalog — `GET /v1/chains`, `GET /v1/tokens` (no API key).
 * @see https://docs.li.fi/api-reference/get-information-about-all-currently-supported-chains
 * @see https://docs.li.fi/api-reference/fetch-all-known-tokens
 */

import { throwIfHttpNotOk } from '$/lib/http.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { baseUrl } from '$/sources/Lifi/Rest/constants.ts'
import type {
	FetchLifiChainsOptions,
	FetchLifiTokensOptions,
	LifiChainsResponse,
	LifiTokensResponse,
} from '$/sources/Lifi/Rest/types.ts'

/**
 * `GET /v1/chains` — supported chains (optional `chainTypes` e.g. `EVM,SVM`).
 */
export async function fetchLifiChains(
	options?: FetchLifiChainsOptions,
): Promise<LifiChainsResponse> {
	const base = options?.baseUrl ?? baseUrl
	const params = new URLSearchParams()
	if (options?.chainTypes != null && options.chainTypes !== '')
		params.set('chainTypes', options.chainTypes)
	const queryString = params.toString()
	const chainsUrl = `${base}/v1/chains${queryString ? `?${queryString}` : ''}`
	const res = await fetch(chainsUrl)
	await throwIfHttpNotOk(res, chainsUrl)
	return res.json<LifiChainsResponse>()
}

/**
 * `GET /v1/tokens` — token lists keyed by chain id string under `tokens`.
 */
export async function fetchLifiTokens(
	options?: FetchLifiTokensOptions,
): Promise<LifiTokensResponse> {
	const base = options?.baseUrl ?? baseUrl
	const params = new URLSearchParams()
	if (options?.chains != null && options.chains !== '')
		params.set('chains', options.chains)
	if (options?.tags != null && options.tags !== '') params.set('tags', options.tags)
	if (options?.chainTypes != null && options.chainTypes !== '')
		params.set('chainTypes', options.chainTypes)
	if (options?.minPriceUSD != null)
		params.set('minPriceUSD', String(options.minPriceUSD))
	const queryString = params.toString()
	const tokensUrl = `${base}/v1/tokens${queryString ? `?${queryString}` : ''}`
	const res = await fetch(tokensUrl)
	await throwIfHttpNotOk(res, tokensUrl)
	return res.json<LifiTokensResponse>()
}

/** Deduped default chain catalog for resolvers (no query options). */
export const fetchLifiChainsCatalog = singleFlight(
	async (): Promise<LifiChainsResponse> => (
		fetchLifiChains()
	),
)
