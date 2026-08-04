/**
 * CoinGecko Demo and Pro endpoints backed by the provider's official OpenAPI contracts.
 * @see https://github.com/coingecko/coingecko-api-oas
 * @see https://docs.coingecko.com/reference/endpoint-overview
 */

import { throwHttpError } from '$/lib/http.ts'
import { coingeckoFetch } from '$/sources/Coingecko/Rest/client.ts'
import type {
	CoingeckoAssetPlatform,
	CoingeckoCoin,
	CoingeckoCoinByContract,
	CoingeckoCoinTickers,
	CoingeckoCoinsMarket,
	CoingeckoDerivativesExchange,
	CoingeckoOhlc,
	CoingeckoSimplePrice,
	GetCoingeckoAssetPlatformsArgs,
	GetCoingeckoCoinArgs,
	GetCoingeckoCoinByContractArgs,
	GetCoingeckoCoinOhlcArgs,
	GetCoingeckoCoinsMarketsArgs,
	GetCoingeckoCoinTickersArgs,
	GetCoingeckoDerivativesExchangeArgs,
	GetCoingeckoSimplePriceArgs,
} from '$/sources/Coingecko/Rest/types.ts'

const assertNonemptyPathId = (
	id: string,
	label: string
) => {
	if (id === '')
		throw new Error(`Coingecko_Rest: invalid ${label}`)
}

/** `GET /coins/{id}` — coin metadata and current market data. */
export const getCoin = async ({
	publicEnv,
	id,
	...query
}: GetCoingeckoCoinArgs) => {
	assertNonemptyPathId(id, 'coin id')

	const searchParams = new URLSearchParams()
	for (const [name, value] of Object.entries({
		localization: false,
		tickers: false,
		market_data: true,
		community_data: false,
		developer_data: false,
		sparkline: false,
		...query,
	}))
		if (value != null)
			searchParams.set(name, String(value))

	const response = await coingeckoFetch(
		publicEnv,
		`/coins/${encodeURIComponent(id)}?${searchParams}`
	)

	if (response.status === 404)
		return undefined
	if (!response.ok)
		await throwHttpError(`Coingecko_Rest`, response)

	return response.json<CoingeckoCoin>()
}

/** `GET /coins/{id}/contract/{contract_address}` — coin data by token address. */
export const getCoinByContract = async ({
	publicEnv,
	id,
	contract_address,
}: GetCoingeckoCoinByContractArgs) => {
	assertNonemptyPathId(id, 'asset platform id')
	assertNonemptyPathId(contract_address, 'contract address')

	const response = await coingeckoFetch(
		publicEnv,
		`/coins/${encodeURIComponent(id)}/contract/${encodeURIComponent(contract_address)}`
	)

	if (response.status === 404)
		return undefined
	if (!response.ok)
		await throwHttpError(`Coingecko_Rest`, response)

	return response.json<CoingeckoCoinByContract>()
}

/** `GET /asset_platforms` — supported blockchain networks. */
export const getAssetPlatforms = async ({
	publicEnv,
	filter,
}: GetCoingeckoAssetPlatformsArgs) => {
	const searchParams = new URLSearchParams()
	if (filter != null)
		searchParams.set('filter', filter)

	const response = await coingeckoFetch(
		publicEnv,
		`/asset_platforms${searchParams.size === 0 ? '' : `?${searchParams}`}`
	)

	if (!response.ok)
		await throwHttpError('Coingecko_Rest', response)

	return response.json<CoingeckoAssetPlatform[]>()
}

/** `GET /coins/markets` — paged coin market data. */
export const getCoinsMarkets = async ({
	publicEnv,
	...query
}: GetCoingeckoCoinsMarketsArgs) => {
	const searchParams = new URLSearchParams()
	for (const [name, value] of Object.entries(query))
		if (value != null)
			searchParams.set(name, String(value))

	const response = await coingeckoFetch(
		publicEnv,
		`/coins/markets?${searchParams}`
	)

	if (!response.ok)
		await throwHttpError('Coingecko_Rest', response)

	return response.json<CoingeckoCoinsMarket[]>()
}

/** `GET /coins/{id}/ohlc` — fixed-range OHLC candles. */
export const getCoinOhlc = async ({
	publicEnv,
	id,
	days,
	...query
}: GetCoingeckoCoinOhlcArgs) => {
	assertNonemptyPathId(id, 'coin id')

	const searchParams = new URLSearchParams()
	for (const [name, value] of Object.entries({
		...query,
		days,
	}))
		if (value != null)
			searchParams.set(name, String(value))

	const response = await coingeckoFetch(
		publicEnv,
		`/coins/${encodeURIComponent(id)}/ohlc?${searchParams}`
	)

	if (!response.ok)
		await throwHttpError(`Coingecko_Rest`, response)

	return response.json<CoingeckoOhlc>()
}

/** `GET /coins/{id}/tickers` — spot books across exchanges. */
export const getCoinTickers = async ({
	publicEnv,
	id,
	...query
}: GetCoingeckoCoinTickersArgs) => {
	assertNonemptyPathId(id, 'coin id')

	const searchParams = new URLSearchParams()
	for (const [name, value] of Object.entries(query))
		if (value != null)
			searchParams.set(name, String(value))

	const response = await coingeckoFetch(
		publicEnv,
		`/coins/${encodeURIComponent(id)}/tickers${searchParams.size === 0 ? '' : `?${searchParams}`}`
	)

	if (response.status === 404)
		return undefined
	if (!response.ok)
		await throwHttpError(`Coingecko_Rest`, response)

	return response.json<CoingeckoCoinTickers>()
}

/** `GET /derivatives/exchanges/{id}` — one derivatives exchange and its tickers. */
export const getDerivativesExchange = async ({
	publicEnv,
	id,
	include_tickers = 'unexpired',
}: GetCoingeckoDerivativesExchangeArgs) => {
	assertNonemptyPathId(id, 'derivatives exchange id')

	const response = await coingeckoFetch(
		publicEnv,
		`/derivatives/exchanges/${encodeURIComponent(id)}?include_tickers=${include_tickers}`
	)

	if (response.status === 404)
		return undefined
	if (!response.ok)
		await throwHttpError(`Coingecko_Rest`, response)

	return response.json<CoingeckoDerivativesExchange>()
}

/** `GET /simple/price` — batched spot prices by CoinGecko ids. */
export const getSimplePrice = async ({
	publicEnv,
	...query
}: GetCoingeckoSimplePriceArgs) => {
	const searchParams = new URLSearchParams()
	for (const [name, value] of Object.entries(query))
		if (value != null)
			searchParams.set(name, String(value))

	const response = await coingeckoFetch(
		publicEnv,
		`/simple/price?${searchParams}`
	)

	if (!response.ok)
		await throwHttpError('Coingecko_Rest', response)

	return response.json<CoingeckoSimplePrice>()
}
