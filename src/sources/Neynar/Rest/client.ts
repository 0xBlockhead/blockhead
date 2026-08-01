/**
	* Neynar REST client — `publicEnv.PUBLIC_NEYNAR_API_KEY` → `x-api-key`.
	* Missing or invalid keys resolve to `undefined` headers so Farcaster pages can degrade gracefully.
	* @see https://docs.neynar.com/reference
	*/

import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/Neynar/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Neynar_Rest]

export const neynarRequestHeaders = (
	publicEnv: SourcePublicEnv
) => {
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
) {
	const headers = neynarRequestHeaders(publicEnv)
	if (headers == null) return undefined

	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding)}${path}`,
		{
			...init,
			headers: {
				...headers,
				...init?.headers,
			},
		}
	)
	if (response.status === 401 || response.status === 403) return undefined
	if (!response.ok) await throwHttpError('Neynar API', response)
	return response.json<T>()
}
