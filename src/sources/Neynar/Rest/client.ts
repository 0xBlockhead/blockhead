/**
	* Neynar REST client — `publicEnv.PUBLIC_NEYNAR_API_KEY` → `x-api-key`.
	* Missing or invalid keys resolve to `undefined` headers so Farcaster pages can degrade gracefully.
	* @see https://docs.neynar.com/reference
	*/

import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { neynarOrigins } from '$/sources/Neynar/index.ts'
import { baseUrl } from '$/sources/Neynar/Rest/constants.ts'

export const neynarRequestHeaders = (
	publicEnv: SourcePublicEnv
): Record<string, string> | undefined => {
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_NEYNAR_API_KEY')
	return apiKey == null ?
		undefined
	:
		{
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		}
}

export async function neynarFetch<T>(
	publicEnv: SourcePublicEnv,
	path: string,
	init?: RequestInit
): Promise<T | undefined> {
	const headers = neynarRequestHeaders(publicEnv)
	if (headers == null) return undefined
	const res = await corsFetch(`${baseUrl}${path}`, {
		origins: neynarOrigins,
		init: {
			...init,
			headers: {
				...headers,
				...init?.headers,
			},
		},
	})
	if (res.status === 401 || res.status === 403) return undefined
	if (!res.ok) await throwHttpError('Neynar API', res)
	return res.json<T>()
}
