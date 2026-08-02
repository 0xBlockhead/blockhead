/**
	* Dune REST client — API key from `publicEnv.PUBLIC_DUNE_API_KEY` → `X-DUNE-API-KEY`.
	* @see https://docs.dune.com/api-reference/overview/authentication.md
	*/

import { throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/Dune/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.Dune_Rest][0]

export const duneRequestHeaders = (
	publicEnv: SourcePublicEnv
) => ({
	'Content-Type': 'application/json',
	Accept: 'application/json',
	'X-DUNE-API-KEY': requiredPublicEnvString(publicEnv, 'PUBLIC_DUNE_API_KEY'),
})

export async function duneFetch<T>(
	publicEnv: SourcePublicEnv,
	path: string,
	init?: RequestInit
) {
	const url = new URL(path, firstHttpUrlForBinding(binding)).toString()
	const res = await sourceFetch(
		binding,
		url,
		{
			...init,
			headers: {
				...duneRequestHeaders(publicEnv),
				...init?.headers,
			},
		}
	)
	if (!res.ok) await throwHttpError('Dune API', res)
	return res.json<T>()
}
