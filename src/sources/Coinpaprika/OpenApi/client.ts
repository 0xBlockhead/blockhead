import { throwHttpError } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import {
	freeBaseUrl,
	proBaseUrl,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'

export const getCoinpaprikaJson = async <_Response>(
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>,
	pathAndQuery: string,
): Promise<_Response> => {
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_COINPAPRIKA_API_KEY')
	const response = await fetch(
		`${apiKey == null ? freeBaseUrl : proBaseUrl}${pathAndQuery}`,
		{
			headers: {
				Accept: 'application/json',
				...(apiKey != null && { Authorization: `Bearer ${apiKey}` }),
			},
		},
	)

	if (!response.ok) await throwHttpError('Coinpaprika API', response)

	return response.json<_Response>()
}
