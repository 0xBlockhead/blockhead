import { throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { baseUrl } from '$/sources/CoinMarketCap/Rest/constants.ts'

export const coinMarketCapFetch = async <_Response>(
	publicEnv: SourcePublicEnvFor<Source.CoinMarketCap_Rest>,
	pathAndQuery: string,
): Promise<_Response> => {
	const response = await fetch(`${baseUrl}${pathAndQuery}`, {
		headers: {
			Accept: 'application/json',
			'X-CMC_PRO_API_KEY': requiredPublicEnvString(publicEnv, 'PUBLIC_COINMARKETCAP_API_KEY'),
		},
	})

	if (!response.ok) await throwHttpError('CoinMarketCap API', response)

	return response.json<_Response>()
}
