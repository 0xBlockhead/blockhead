/**
 * Neynar REST client — `publicEnv.PUBLIC_NEYNAR_API_KEY` → `x-api-key`.
 * Missing or invalid keys resolve to `undefined` headers so Farcaster pages can degrade gracefully.
 * @see https://docs.neynar.com/reference
 */

import { throwHttpError } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { baseUrl } from '$/sources/Neynar/Rest/constants.ts'

export const neynarRequestHeaders = (
	publicEnv: SourcePublicEnvFor<Source.Neynar_Rest>,
): Record<string, string> | undefined => {
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_NEYNAR_API_KEY')
	return apiKey == null ?
			undefined
		:	{
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'x-api-key': apiKey,
			}
}

export async function neynarFetch<T>(
	publicEnv: SourcePublicEnvFor<Source.Neynar_Rest>,
	path: string,
	init?: RequestInit,
): Promise<T | undefined> {
	const headers = neynarRequestHeaders(publicEnv)
	if (headers == null) return undefined
	const res = await fetch(`${baseUrl}${path}`, {
		...init,
		headers: { ...headers, ...init?.headers },
	})
	if (res.status === 401 || res.status === 403) return undefined
	if (!res.ok) await throwHttpError('Neynar API', res)
	return res.json<T>()
}
