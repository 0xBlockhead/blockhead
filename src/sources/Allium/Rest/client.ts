import { throwHttpError } from '$/lib/http.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const alliumRestBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.Allium_Rest)

if (alliumRestBinding == null)
	throw new Error('Allium_Rest: missing source binding')

export const alliumFetch = async <_Response>(
	publicEnv: SourcePublicEnv,
	pathAndQuery: string,
	init?: RequestInit
): Promise<_Response> => {
	const response = await sourceFetch(
		alliumRestBinding,
		new URL(pathAndQuery, firstHttpUrlForBinding(alliumRestBinding)).toString(),
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
