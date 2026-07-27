import { throwHttpError } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Coinpaprika/bindings.ts'
import {
	freeBaseUrl,
	proBaseUrl,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'

const binding = bindings[Source.Coinpaprika_OpenApi]

export const getCoinpaprikaJson = async <_Response>(
	publicEnv: SourcePublicEnv,
	pathAndQuery: string
): Promise<_Response> => {
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_COINPAPRIKA_API_KEY')
	const response = await sourceFetch(
		binding,
		`${apiKey == null ? freeBaseUrl : proBaseUrl}${pathAndQuery}`,
		{
			headers: {
				Accept: 'application/json',
				...(apiKey != null && { Authorization: `Bearer ${apiKey}` }),
			},
		}
	)

	if (!response.ok) await throwHttpError('Coinpaprika API', response)

	return response.json<_Response>()
}
