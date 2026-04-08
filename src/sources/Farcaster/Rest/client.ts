/**
 * Farcaster Client API GET helper.
 * @see https://docs.farcaster.xyz/reference/farcaster/api
 */

import { farcasterApiBaseUrl } from '$/sources/Farcaster/Rest/constants.ts'

const toQueryString = (params?: Record<string, string | number | boolean | undefined>) => {
	const searchParams = new URLSearchParams()

	for (const [key, value] of Object.entries(params ?? {})) {
		if (value == null) continue
		searchParams.set(key, String(value))
	}

	const queryString = searchParams.toString()
	return queryString ? `?${queryString}` : ''
}

export async function farcasterGet<T>(
	path: string,
	params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	const res = await fetch(`${farcasterApiBaseUrl}${path}${toQueryString(params)}`)
	if (!res.ok) throw new Error(`Farcaster API ${res.status}: ${await res.text()}`)
	return res.json() as Promise<T>
}
