import { throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/Allium/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.Allium_Rest]

export const alliumFetch = async <_Response>(
	publicEnv: SourcePublicEnv,
	pathAndQuery: string,
	init?: RequestInit
): Promise<_Response> => {
	const response = await sourceFetch(
		binding,
		new URL(pathAndQuery, firstHttpUrlForBinding(binding)).toString(),
		{
			...init,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-API-KEY': requiredPublicEnvString(publicEnv, 'PUBLIC_ALLIUM_API_KEY'),
				...init?.headers,
			},
		}
	)

	if (!response.ok) await throwHttpError('Allium API', response)

	return response.json<_Response>()
}
