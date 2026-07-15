/**
	* Dune REST client — API key from `publicEnv.PUBLIC_DUNE_API_KEY` → `X-DUNE-API-KEY`.
	* @see https://docs.dune.com/api-reference/overview/authentication.md
	*/

import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	baseUrl,
	duneOrigins,
} from '$/sources/Dune/Rest/constants.ts'

export const duneRequestHeaders = (
	publicEnv: SourcePublicEnv
): Record<string, string> => ({
	'Content-Type': 'application/json',
	Accept: 'application/json',
	'X-DUNE-API-KEY': requiredPublicEnvString(publicEnv, 'PUBLIC_DUNE_API_KEY'),
})

export async function duneFetch<T>(
	publicEnv: SourcePublicEnv,
	path: string,
	init?: RequestInit
): Promise<T> {
	const url = `${baseUrl}${path}`
	const res = await corsFetch(url, {
		origins: duneOrigins,
		init: {
			...init,
			headers: {
				...duneRequestHeaders(publicEnv),
				...init?.headers,
			},
		},
	})
	if (!res.ok) await throwHttpError('Dune API', res)
	return res.json<T>()
}
