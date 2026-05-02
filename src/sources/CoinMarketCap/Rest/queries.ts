/**
 * CoinMarketCap latest quotes and metadata endpoints.
 * @see https://coinmarketcap.com/api/documentation/
 */

import { coinMarketCapFetch } from '$/sources/CoinMarketCap/Rest/client.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import type {
	CoinMarketCapInfoLatestResponse,
	CoinMarketCapQuotesLatestResponse,
} from '$/sources/CoinMarketCap/Rest/types.ts'

/**
 * `GET /v2/cryptocurrency/quotes/latest`
 */
export const getCoinMarketCapQuotesLatest = async ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnvFor<Source.CoinMarketCap_Rest>
	id: number
}) => (
	await coinMarketCapFetch<CoinMarketCapQuotesLatestResponse>(
		publicEnv,
		`/v2/cryptocurrency/quotes/latest?id=${id}&convert=USD`,
	)
)

/**
 * `GET /v2/cryptocurrency/info`
 */
export const getCoinMarketCapInfo = async ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnvFor<Source.CoinMarketCap_Rest>
	id: number
}) => (
	await coinMarketCapFetch<CoinMarketCapInfoLatestResponse>(
		publicEnv,
		`/v2/cryptocurrency/info?id=${id}&aux=platform`,
	)
)
