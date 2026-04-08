/**
 * Snapchain node client over public `/v1/*` endpoints.
 * @see https://snapchain.farcaster.xyz/reference/httpapi/httpapi
 */

import { browser } from '$app/environment'
import { snapchainNodeEndpoints } from '$/sources/Snapchain/Rest/constants.ts'

const toQueryString = (params?: Record<string, string | number | boolean | undefined>) => {
	const searchParams = new URLSearchParams()

	for (const [key, value] of Object.entries(params ?? {})) {
		if (value == null) continue
		searchParams.set(key, String(value))
	}

	const queryString = searchParams.toString()
	return queryString ? `?${queryString}` : ''
}

const snapchainProxyBasePath = '/api/snapchain'

const directSnapchainGet = async <T,>(
	path: string,
	params?: Record<string, string | number | boolean | undefined>,
): Promise<T> => {
	let lastError: Error | undefined

	for (const endpoint of snapchainNodeEndpoints) {
		try {
			const res = await fetch(`${endpoint.url}${path}${toQueryString(params)}`)
			if (res.ok) return res.json() as Promise<T>
			lastError = new Error(`Snapchain ${endpoint.id} ${res.status}: ${await res.text()}`)
		} catch (error) {
			lastError = (
				error instanceof Error ?
					error
				:	new Error(String(error))
			)
		}
	}

	throw lastError ?? new Error('Snapchain node request failed')
}

export async function snapchainGet<T>(
	path: string,
	params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	if (!browser) {
		return directSnapchainGet<T>(path, params)
	}

	const res = await fetch(`${snapchainProxyBasePath}${path}${toQueryString(params)}`)
	if (!res.ok) {
		throw new Error(`Snapchain proxy ${res.status}: ${await res.text()}`)
	}

	return res.json() as Promise<T>
}
