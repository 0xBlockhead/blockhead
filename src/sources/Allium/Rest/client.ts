import { throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

export const alliumFetch = async <_Response>(
	binding: SourceBinding,
	publicEnv: SourcePublicEnv,
	pathAndQuery: string,
	init?: RequestInit
) => {
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
