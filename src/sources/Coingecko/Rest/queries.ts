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
	CoingeckoDerivativesExchangeWire,
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
	coingeckoAssetPlatformsEnvelope,
	coingeckoCoinEnvelope,
	coingeckoCoinTickersEnvelope,
	coingeckoCoinsMarketEnvelope,
	coingeckoDerivativesExchangeEnvelope,
	coingeckoOhlcEnvelope,
	coingeckoSimplePriceEnvelope,
	coingeckoSimplePriceRowEnvelope,
} from '$/sources/Coingecko/Rest/types.ts'

const assertNonemptyRequiredString = (
	value: string,
	label: string
) => {
	if (value === '')
		throw new Error(`Coingecko_Rest: invalid ${label}`)
}

const canonicalDecimalStringFromFiniteWireNumber = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value))
		throw new Error(`Coingecko_Rest: invalid finite ${label}`)
	if (Object.is(value, -0))
		return '0'

	const serialized = value.toString()
	const exponentMarkerIndex = serialized.indexOf('e')
	if (exponentMarkerIndex === -1)
		return serialized

	const negative = serialized.startsWith('-')
	const coefficient = serialized.slice(negative ? 1 : 0, exponentMarkerIndex)
	const decimalPointIndex = coefficient.indexOf('.')
	const integerDigitCount = decimalPointIndex === -1 ? coefficient.length : decimalPointIndex
	const digits = decimalPointIndex === -1 ? coefficient : `${coefficient.slice(0, decimalPointIndex)}${coefficient.slice(decimalPointIndex + 1)}`
	const expandedDecimalPointIndex = integerDigitCount + Number(serialized.slice(exponentMarkerIndex + 1))
	const sign = negative ? '-' : ''
	if (expandedDecimalPointIndex <= 0)
		return `${sign}0.${'0'.repeat(-expandedDecimalPointIndex)}${digits}`
	if (expandedDecimalPointIndex >= digits.length)
		return `${sign}${digits}${'0'.repeat(expandedDecimalPointIndex - digits.length)}`

	return `${sign}${digits.slice(0, expandedDecimalPointIndex)}.${digits.slice(expandedDecimalPointIndex)}`
}

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object') {
		const object = value as Record<string, unknown>
		return Object.fromEntries(
			Object.entries(object)
				.filter(([, entry]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	}
	return value
}

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(omitUndefinedJson(value))
	} catch {
		throw new Error(`Coingecko_Rest: invalid ${label} response envelope`)
	}
	return value as _Value
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

	return assertEnvelope<CoingeckoAssetPlatform[]>(
		coingeckoAssetPlatformsEnvelope,
		await response.json<CoingeckoAssetPlatform[]>(),
		'asset platforms'
	)
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

	const markets = assertEnvelope<CoingeckoCoinsMarket[]>(
		coingeckoCoinsMarketEnvelope,
		await response.json<CoingeckoCoinsMarket[]>(),
		'coins markets'
	)
	if (new Set(markets.map((market) => market.id)).size !== markets.length)
		throw new Error('Coingecko_Rest: coins markets response contains duplicate coin ids')

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

	return assertEnvelope<CoingeckoOhlc>(
		coingeckoOhlcEnvelope,
		await response.json<CoingeckoOhlc>(),
		'OHLC'
	)
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

	return assertEnvelope<CoingeckoCoinTickers>(
		coingeckoCoinTickersEnvelope,
		await response.json<CoingeckoCoinTickers>(),
		'coin tickers'
	)
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

	const exchange = assertEnvelope<CoingeckoDerivativesExchangeWire>(
		coingeckoDerivativesExchangeEnvelope,
		await response.json<CoingeckoDerivativesExchangeWire>(),
		'derivatives exchange'
	)

	return {
		...exchange,
		tickers: (exchange.tickers ?? []).map((ticker) => ({
			...ticker,
			last: canonicalDecimalStringFromFiniteWireNumber(ticker.last, 'derivative mark price'),
			index: canonicalDecimalStringFromFiniteWireNumber(ticker.index, 'derivative index price'),
			open_interest_usd: canonicalDecimalStringFromFiniteWireNumber(ticker.open_interest_usd, 'derivative open interest USD'),
			index_basis_percentage: canonicalDecimalStringFromFiniteWireNumber(ticker.index_basis_percentage, 'derivative index basis percentage'),
			funding_rate: canonicalDecimalStringFromFiniteWireNumber(ticker.funding_rate, 'derivative funding rate'),
		})),
	} satisfies CoingeckoDerivativesExchange
}

/** `GET /simple/price` — batched spot prices by CoinGecko ids. */
export const getSimplePrice = async ({
	publicEnv,
	...query
}: GetCoingeckoSimplePriceArgs) => {
	assertNonemptyRequiredString(query.ids, 'coin ids')
	assertNonemptyRequiredString(query.vs_currencies, 'price currencies')
	const ids = query.ids.split(',')
	if (ids.some((id) => id === '') || new Set(ids).size !== ids.length)
		throw new Error('Coingecko_Rest: malformed requested coin ids')

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
	assertEnvelope(coingeckoSimplePriceEnvelope, prices, 'simple price')
	if (
		Array.isArray(prices)
		|| Object.keys(prices).some((id) => !ids.includes(String(id)))
		|| ids.some((id) => {
			if (id === '' || !Object.hasOwn(prices, id))
				return true
			try {
				coingeckoSimplePriceRowEnvelope.assert(omitUndefinedJson(prices[id]))
			} catch {
				return true
			}
			const row = prices[id]
			return (
				!Number.isFinite(row.usd)
				|| (
					query.include_last_updated_at === true
					&& !Number.isFinite(row.last_updated_at)
				)
			)
		})
	)
		throw new Error('Coingecko_Rest: incomplete simple price response envelope')
	return prices
}
