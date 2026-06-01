/**
 * Snapchain node client over public `/v1/*` endpoints.
 * @see https://snapchain.farcaster.xyz/reference/httpapi/httpapi
 */

import { getJson } from '$/lib/http.ts'
import Snapchain from '$/sources/Snapchain/index.ts'
import { nodeEndpoints } from '$/sources/Snapchain/Rest/constants.ts'

const toQueryString = (params?: Record<string, string | number | boolean | undefined>) => {
	const searchParams = new URLSearchParams()

	for (const [key, value] of Object.entries(params ?? {})) {
		if (value == null) continue
		searchParams.set(key, String(value))
	}

	const queryString = searchParams.toString()
	return queryString ? `?${queryString}` : ''
}

export async function snapchainGet<T>(
	path: string,
	params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	let lastError: Error | undefined
	for (const endpoint of nodeEndpoints) {
		try {
			return await getJson<T>(`${endpoint.url}${path}${toQueryString(params)}`, {
				origins: Snapchain.origins ?? [],
			})
		} catch (error) {
			lastError = (
				error instanceof Error ?
					new Error(`Snapchain ${endpoint.id}: ${error.message}`)
				:
					new Error(`Snapchain ${endpoint.id}: ${String(error)}`)
			)
		}
	}
	throw lastError ?? new Error('Snapchain node request failed')
}
