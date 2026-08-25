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

const assertRequestedCoin = (
	response: {
		data?: Record<string, {
			id?: number
		}>
	},
	id: number,
	label: string
) => {
	const entries = Object.entries(response.data ?? {})
	if (entries.length !== 1 || entries[0]?.[0] !== String(id) || entries[0][1].id !== id)
		throw new Error(`CoinMarketCap_Rest: ${label} response does not match requested coin`)
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
	for (const quote of Object.values(response.data ?? {})) {
		const usd = quote.quote?.USD
		if (usd?.price != null && typeof usd.price === 'number')
			usd.price = String(usd.price)
	}
	assertApiStatus(response.status, 'quotes latest')
	assertRequestedCoin(response, id, 'quotes latest')
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
	assertRequestedCoin(response, id, 'info')
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
	assertRequestedCoin(response, id, 'ohlcv historical')
	return response
}
