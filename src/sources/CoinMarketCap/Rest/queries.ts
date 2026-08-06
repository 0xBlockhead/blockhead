/**
	* CoinMarketCap latest quotes and metadata endpoints.
	* @see https://coinmarketcap.com/api/documentation/
	*/

import { coinMarketCapFetch } from '$/sources/CoinMarketCap/Rest/client.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	CoinMarketCapInfoLatestResponse,
	CoinMarketCapOhlcvHistoricalResponse,
	CoinMarketCapQuotesLatestResponse,
} from '$/sources/CoinMarketCap/Rest/types.ts'
import {
	coinMarketCapInfoLatestEnvelope,
	coinMarketCapOhlcvHistoricalEnvelope,
	coinMarketCapQuotesLatestEnvelope,
} from '$/sources/CoinMarketCap/Rest/types.ts'

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`CoinMarketCap_Rest: invalid ${label} response envelope`)
	}
	return value as _Value
}

const assertApiStatus = (
	status: {
		error_code?: number
		error_message?: string | null
	} | undefined,
	label: string
) => {
	if (status?.error_code != null && status.error_code !== 0)
		throw new Error(
			`CoinMarketCap_Rest: ${label} API error ${status.error_code}${
				status.error_message == null || status.error_message === '' ?
					''
				:
					`: ${status.error_message}`
			}`
		)
}

/**
	* `GET /v3/cryptocurrency/quotes/latest`
	*/
export const getQuotesLatest = async ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnv
	id: number
}) => {
	const response = assertEnvelope<CoinMarketCapQuotesLatestResponse>(
		coinMarketCapQuotesLatestEnvelope,
		await coinMarketCapFetch<CoinMarketCapQuotesLatestResponse>(
			publicEnv,
			`/v3/cryptocurrency/quotes/latest?id=${id}&convert=USD`
		),
		'quotes latest'
	)
	assertApiStatus(response.status, 'quotes latest')
	return response
}

/**
	* `GET /v2/cryptocurrency/info`
	*/
export const getInfo = async ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnv
	id: number
}) => {
	const response = assertEnvelope<CoinMarketCapInfoLatestResponse>(
		coinMarketCapInfoLatestEnvelope,
		await coinMarketCapFetch<CoinMarketCapInfoLatestResponse>(
			publicEnv,
			`/v2/cryptocurrency/info?id=${id}&aux=platform`
		),
		'info'
	)
	assertApiStatus(response.status, 'info')
	return response
}

/**
	* `GET /v2/cryptocurrency/ohlcv/historical` — daily OHLCV candles.
	* @see https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyOhlcvHistorical
	*/
export const getOhlcvHistorical = async ({
	publicEnv,
	id,
	count,
}: {
	publicEnv: SourcePublicEnv
	id: number
	count: number
}) => {
	const response = assertEnvelope<CoinMarketCapOhlcvHistoricalResponse>(
		coinMarketCapOhlcvHistoricalEnvelope,
		await coinMarketCapFetch<CoinMarketCapOhlcvHistoricalResponse>(
			publicEnv,
			`/v2/cryptocurrency/ohlcv/historical?id=${id}&time_period=daily&count=${count}&convert=USD`
		),
		'ohlcv historical'
	)
	assertApiStatus(response.status, 'ohlcv historical')
	return response
}
