import { throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/CoinMarketCap/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.CoinMarketCap_Rest]

export const coinMarketCapFetch = async <_Response>(
	publicEnv: SourcePublicEnv,
	pathAndQuery: string
): Promise<_Response> => {
	const response = await sourceFetch(
		binding,
		new URL(pathAndQuery, firstHttpUrlForBinding(binding)).toString(),
		{
			headers: {
				Accept: 'application/json',
				'X-CMC_PRO_API_KEY': requiredPublicEnvString(publicEnv, 'PUBLIC_COINMARKETCAP_API_KEY'),
			},
		}
	)
	if (!response.ok) await throwHttpError('CoinMarketCap API', response)
	return response.json()
}
