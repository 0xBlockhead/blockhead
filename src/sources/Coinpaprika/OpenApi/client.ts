import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { coinpaprikaOrigins } from '$/sources/Coinpaprika/index.ts'
import {
	freeBaseUrl,
	proBaseUrl,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'

export const getCoinpaprikaJson = async <_Response>(
	publicEnv: SourcePublicEnv,
	pathAndQuery: string
): Promise<_Response> => {
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_COINPAPRIKA_API_KEY')
	const response = await corsFetch(
		`${apiKey == null ? freeBaseUrl : proBaseUrl}${pathAndQuery}`,
		{
			origins: coinpaprikaOrigins,
			init: {
				headers: {
					Accept: 'application/json',
					...(apiKey != null && { Authorization: `Bearer ${apiKey}` }),
				},
			},
		}
	)

	if (!response.ok) await throwHttpError('Coinpaprika API', response)

	return response.json<_Response>()
}
