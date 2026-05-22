import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import Allium from '$/sources/Allium/index.ts'
import { baseUrl } from '$/sources/Allium/Rest/constants.ts'

export const alliumFetch = async <_Response>(
	publicEnv: SourcePublicEnvFor<Source.Allium_Rest>,
	pathAndQuery: string,
	init?: RequestInit,
): Promise<_Response> => {
	const response = await corsFetch(`${baseUrl}${pathAndQuery}`, {
		origins: Allium.origins ?? [],
		init: {
			...init,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-API-KEY': requiredPublicEnvString(publicEnv, 'PUBLIC_ALLIUM_API_KEY'),
				...init?.headers,
			},
		},
	})

	if (!response.ok) await throwHttpError('Allium API', response)

	return response.json<_Response>()
}
