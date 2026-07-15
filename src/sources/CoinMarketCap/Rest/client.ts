import { getJson } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	baseUrl,
	coinMarketCapOrigins,
} from '$/sources/CoinMarketCap/Rest/constants.ts'

export const coinMarketCapFetch = async <_Response>(
	publicEnv: SourcePublicEnv,
	pathAndQuery: string
): Promise<_Response> => (
	getJson<_Response>(`${baseUrl}${pathAndQuery}`, {
		origins: coinMarketCapOrigins,
		init: {
			headers: {
				Accept: 'application/json',
				'X-CMC_PRO_API_KEY': requiredPublicEnvString(publicEnv, 'PUBLIC_COINMARKETCAP_API_KEY'),
			},
		},
	})
)
