/**
 * Coinpaprika coins and ticker endpoints.
 * @see https://docs.coinpaprika.com/api-reference/coins/get-coin-by-id.md
 * @see https://docs.coinpaprika.com/api-reference/tickers/get-ticker-for-a-specific-coin.md
 */

import {
	getCoinpaprikaJson,
	type CoinpaprikaCoin,
	type CoinpaprikaTicker,
} from '$/sources/Coinpaprika/OpenApi/client.ts'

export const getCoinpaprikaCoinById = async ({
	coinpaprikaId,
}: {
	coinpaprikaId: string
}) => (
	await getCoinpaprikaJson<CoinpaprikaCoin>(
		`/coins/${coinpaprikaId}`,
	)
)

export const getCoinpaprikaTickerById = async ({
	coinpaprikaId,
}: {
	coinpaprikaId: string
}) => (
	await getCoinpaprikaJson<CoinpaprikaTicker>(
		`/ticker/${coinpaprikaId}`,
	)
)
