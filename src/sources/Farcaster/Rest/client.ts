/**
 * Farcaster Client API GET helper.
 * @see https://docs.farcaster.xyz/reference/farcaster/api
 */

import { getJson } from '$/lib/http.ts'
import Farcaster from '$/sources/Farcaster/index.ts'
import {
	clientBaseUrl,
	webBaseUrl,
} from '$/sources/Farcaster/Rest/constants.ts'

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
	const baseUrl = path.startsWith('/~api/') ? webBaseUrl : clientBaseUrl
	return getJson<T>(`${baseUrl}${path}${toQueryString(params)}`, { origins: Farcaster.origins  })
}
