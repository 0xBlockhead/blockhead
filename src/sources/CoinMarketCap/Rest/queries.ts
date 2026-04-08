/**
 * CoinMarketCap latest quotes and metadata endpoints.
 * @see https://coinmarketcap.com/api/documentation/
 */

import { coinMarketCapFetch } from '$/sources/CoinMarketCap/Rest/client.ts'
import type {
	CoinMarketCapInfoLatestResponse,
	CoinMarketCapQuotesLatestResponse,
} from '$/sources/CoinMarketCap/Rest/types.ts'

/**
 * `GET /v2/cryptocurrency/quotes/latest`
 */
export const getCoinMarketCapQuotesLatest = async ({
	id,
}: {
	id: number
}) => (
	await coinMarketCapFetch<CoinMarketCapQuotesLatestResponse>(
		`/v2/cryptocurrency/quotes/latest?id=${id}&convert=USD`,
	)
)

/**
 * `GET /v2/cryptocurrency/info`
 */
export const getCoinMarketCapInfo = async ({
	id,
}: {
	id: number
}) => (
	await coinMarketCapFetch<CoinMarketCapInfoLatestResponse>(
		`/v2/cryptocurrency/info?id=${id}`,
	)
)
