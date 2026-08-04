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
import {
	coingeckoCoinEnvelope,
	coingeckoCoinTickersEnvelope,
	coingeckoCoinsMarketEnvelope,
	coingeckoDerivativesExchangeEnvelope,
} from '$/sources/Coingecko/Rest/types.ts'

const assertNonemptyRequiredString = (
	value: string,
	label: string
) => {
	if (value === '')
		throw new Error(`Coingecko_Rest: invalid ${label}`)
}

const assertEnvelope = (
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`Coingecko_Rest: invalid ${label} response envelope`)
	}
}

/** `GET /coins/{id}` — coin metadata and current market data. */
export const getCoin = async ({
	publicEnv,
	id,
	...query
}: GetCoingeckoCoinArgs) => {
	assertNonemptyRequiredString(id, 'coin id')

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

	const coin = await response.json<CoingeckoCoin>()
	assertEnvelope(coingeckoCoinEnvelope, coin, 'coin')
	if (coin.id !== id)
		throw new Error(`Coingecko_Rest: coin response id does not match ${id}`)
	return coin
}

/** `GET /coins/{id}/contract/{contract_address}` — coin data by token address. */
export const getCoinByContract = async ({
	publicEnv,
	id,
	contract_address,
}: GetCoingeckoCoinByContractArgs) => {
	assertNonemptyRequiredString(id, 'asset platform id')
	assertNonemptyRequiredString(contract_address, 'contract address')

	const response = await coingeckoFetch(
		publicEnv,
		`/coins/${encodeURIComponent(id)}/contract/${encodeURIComponent(contract_address)}`
	)

	if (response.status === 404)
		return undefined
	if (!response.ok)
		await throwHttpError(`Coingecko_Rest`, response)

	const coin = await response.json<CoingeckoCoinByContract>()
	assertEnvelope(coingeckoCoinEnvelope, coin, 'contract coin')
	return coin
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

	const platforms = await response.json<CoingeckoAssetPlatform[]>()
	if (!Array.isArray(platforms))
		throw new Error('Coingecko_Rest: invalid asset platforms response envelope')
	return platforms
}

/** `GET /coins/markets` — paged coin market data. */
export const getCoinsMarkets = async ({
	publicEnv,
	...query
}: GetCoingeckoCoinsMarketsArgs) => {
	assertNonemptyRequiredString(query.vs_currency, 'market quote currency')

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

	const markets = await response.json<CoingeckoCoinsMarket[]>()
	assertEnvelope(coingeckoCoinsMarketEnvelope, markets, 'coins markets')
	return markets
}

/** `GET /coins/{id}/ohlc` — fixed-range OHLC candles. */
export const getCoinOhlc = async ({
	publicEnv,
	id,
	days,
	...query
}: GetCoingeckoCoinOhlcArgs) => {
	assertNonemptyRequiredString(id, 'coin id')

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

	const candles = await response.json<CoingeckoOhlc>()
	if (
		!Array.isArray(candles)
		|| candles.some((candle) => (
			!Array.isArray(candle)
			|| candle.length !== 5
			|| candle.some((value) => !Number.isFinite(value))
		))
	)
		throw new Error('Coingecko_Rest: invalid OHLC response envelope')
	return candles
}

/** `GET /coins/{id}/tickers` — spot books across exchanges. */
export const getCoinTickers = async ({
	publicEnv,
	id,
	...query
}: GetCoingeckoCoinTickersArgs) => {
	assertNonemptyRequiredString(id, 'coin id')

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

	const tickers = await response.json<CoingeckoCoinTickers>()
	assertEnvelope(coingeckoCoinTickersEnvelope, tickers, 'coin tickers')
	return tickers
}

/** `GET /derivatives/exchanges/{id}` — one derivatives exchange and its tickers. */
export const getDerivativesExchange = async ({
	publicEnv,
	id,
	include_tickers = 'unexpired',
}: GetCoingeckoDerivativesExchangeArgs) => {
	assertNonemptyRequiredString(id, 'derivatives exchange id')

	const response = await coingeckoFetch(
		publicEnv,
		`/derivatives/exchanges/${encodeURIComponent(id)}?include_tickers=${include_tickers}`
	)

	if (response.status === 404)
		return undefined
	if (!response.ok)
		await throwHttpError(`Coingecko_Rest`, response)

	const exchange = await response.json<CoingeckoDerivativesExchange>()
	assertEnvelope(coingeckoDerivativesExchangeEnvelope, exchange, 'derivatives exchange')
	return exchange
}

/** `GET /simple/price` — batched spot prices by CoinGecko ids. */
export const getSimplePrice = async ({
	publicEnv,
	...query
}: GetCoingeckoSimplePriceArgs) => {
	assertNonemptyRequiredString(query.ids, 'coin ids')
	assertNonemptyRequiredString(query.vs_currencies, 'price currencies')

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

	const prices = await response.json<CoingeckoSimplePrice>()
	if (
		prices == null
		|| Array.isArray(prices)
		|| query.ids.split(',').some((id) => (
			id === ''
			|| !Object.hasOwn(prices, id)
			|| !Number.isFinite(prices[id]?.usd)
			|| (
				query.include_last_updated_at === true
				&& !Number.isFinite(prices[id]?.last_updated_at)
			)
		))
	)
		throw new Error('Coingecko_Rest: incomplete simple price response envelope')
	return prices
}
