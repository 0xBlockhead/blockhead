import { throwHttpError } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	freeBaseUrl,
	proBaseUrl,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'

const [coinpaprikaBinding] = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => binding.source === Source.Coinpaprika_OpenApi)

export const getCoinpaprikaJson = async <_Response>(
	publicEnv: SourcePublicEnv,
	pathAndQuery: string
): Promise<_Response> => {
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_COINPAPRIKA_API_KEY')
	const response = await sourceFetch(
		coinpaprikaBinding,
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
