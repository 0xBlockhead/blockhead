/**
 * Dune REST client — API key from `publicEnv.PUBLIC_DUNE_API_KEY` → `X-DUNE-API-KEY`.
 * @see https://docs.dune.com/api-reference/overview/authentication.md
 */

import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import Dune from '$/sources/Dune/index.ts'
import { baseUrl } from '$/sources/Dune/Rest/constants.ts'

export const duneRequestHeaders = (
	publicEnv: SourcePublicEnvFor<Source.Dune_Rest>,
): Record<string, string> => ({
	'Content-Type': 'application/json',
	Accept: 'application/json',
	'X-DUNE-API-KEY': requiredPublicEnvString(publicEnv, 'PUBLIC_DUNE_API_KEY'),
})

export async function duneFetch<T>(
	publicEnv: SourcePublicEnvFor<Source.Dune_Rest>,
	path: string,
	init?: RequestInit,
): Promise<T> {
	const url = `${baseUrl}${path}`
	const res = await corsFetch(url, {
		origins: Dune.origins,
		init: {
			...init,
			headers: { ...duneRequestHeaders(publicEnv), ...init?.headers },
		},
	})
	if (!res.ok) await throwHttpError('Dune API', res)
	return res.json<T>()
}
