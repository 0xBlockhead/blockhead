import { getJson } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import CoinMarketCap from '$/sources/CoinMarketCap/index.ts'
import { baseUrl } from '$/sources/CoinMarketCap/Rest/constants.ts'

export const coinMarketCapFetch = async <_Response>(
	publicEnv: SourcePublicEnvFor<Source.CoinMarketCap_Rest>,
	pathAndQuery: string,
): Promise<_Response> => (
	getJson<_Response>(`${baseUrl}${pathAndQuery}`, {
		origins: CoinMarketCap.origins,
		init: {
			headers: {
				Accept: 'application/json',
				'X-CMC_PRO_API_KEY': requiredPublicEnvString(publicEnv, 'PUBLIC_COINMARKETCAP_API_KEY'),
			},
		},
	})
)
