/**
 * Coinpaprika coins and ticker endpoints.
 * @see https://docs.coinpaprika.com/api-reference/coins/get-coin-by-id.md
 * @see https://docs.coinpaprika.com/api-reference/tickers/get-ticker-for-a-specific-coin.md
 */

import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import {
	getCoinpaprikaJson,
	type CoinpaprikaCoin,
	type CoinpaprikaTicker,
} from '$/sources/Coinpaprika/OpenApi/client.ts'

export type { CoinpaprikaCoin, CoinpaprikaTicker }

export const getCoinpaprikaCoinById = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
}) => (
	await getCoinpaprikaJson<CoinpaprikaCoin>(
		publicEnv,
		`/coins/${coinpaprikaId}`,
	)
)

export const getCoinpaprikaTickerById = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
}) => (
	await getCoinpaprikaJson<CoinpaprikaTicker>(
		publicEnv,
		`/tickers/${coinpaprikaId}`,
	)
)
