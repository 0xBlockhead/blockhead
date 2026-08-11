/**
 * DeFiLlama REST endpoints backed by the provider's official OpenAPI contracts.
 * @see https://api-docs.defillama.com/
 * @see https://github.com/DefiLlama/api-docs/blob/main/defillama-openapi-free.json
 * @see https://github.com/DefiLlama/api-docs/blob/main/defillama-openapi-pro.json
 */

import { requiredPublicEnvString } from '$/sources/$sources.ts'
import bindings from '$/sources/Defillama/bindings.ts'
import type {
	DefillamaChainsTvlResponse,
	DefillamaChartResponse,
	DefillamaCurrentPricesResponse,
	DefillamaFirstPricesResponse,
	DefillamaHistoricalPricesResponse,
	DefillamaPercentageResponse,
	DefillamaProCurrentPricesResponse,
	DefillamaProFirstPricesResponse,
	DefillamaProHistoricalPricesResponse,
	DefillamaProPercentageResponse,
	DefillamaProtocolsResponse,
	DefillamaProtocolResponse,
	DefillamaProtocolTvlResponse,
	GetDefillamaChartArgs,
	GetDefillamaCurrentPricesArgs,
	GetDefillamaFirstPricesArgs,
	GetDefillamaHistoricalPricesArgs,
	GetDefillamaPercentageArgs,
	GetDefillamaProtocolArgs,
	GetDefillamaProtocolTvlArgs,
	GetProDefillamaChartArgs,
	GetProDefillamaCurrentPricesArgs,
	GetProDefillamaFirstPricesArgs,
	GetProDefillamaHistoricalPricesArgs,
	GetProDefillamaPercentageArgs,
} from '$/sources/Defillama/Rest/types.ts'
import {
	defillamaChainsTvlEnvelope,
	defillamaChartEnvelope,
	defillamaCurrentPricesEnvelope,
	defillamaFirstPricesEnvelope,
	defillamaHistoricalPricesEnvelope,
	defillamaPercentageEnvelope,
	defillamaProtocolsEnvelope,
	defillamaProtocolEnvelope,
	defillamaProtocolTvlEnvelope,
} from '$/sources/Defillama/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Defillama_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)
const publicCoinsBinding = bindingByTargetKey['coins-public']
const publicApiBinding = bindingByTargetKey['api-public']
const proCoinsBinding = bindingByTargetKey['coins-pro']
const iconBinding = bindingByTargetKey['chain-icons']

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
		throw new Error(`Defillama_Rest: invalid ${label} response envelope`)
	}
}

const validateCoinIds = (coins: string[]) => {
	if (
		new Set(coins).size !== coins.length
		|| coins.some((coin) => coin === '' || !coin.includes(':'))
	)
		throw new Error('Defillama_Rest: malformed requested coin identities')
}

const assertProtocolSlug = (protocol: string) => {
	if (
		protocol.length < 1
		|| protocol.length > 256
		|| protocol !== protocol.trim()
		|| /[\\/\u0000-\u001f\u007f]/.test(protocol)
	)
		throw new Error('Defillama_Rest: malformed protocol slug')
}

const coinsPathSegment = (coins: string[]) => (
	coins
		.map((coin) => encodeURIComponent(coin))
		.join(',')
)

const proCoinsBasePath = (publicEnv: GetProDefillamaCurrentPricesArgs['publicEnv']) => (
	`/${encodeURIComponent(requiredPublicEnvString(publicEnv, 'PUBLIC_DEFILLAMA_PRO_API_KEY'))}/coins`
)

const getDefillamaJson = async <_Response>(
	binding: typeof publicCoinsBinding,
	requestUrl: URL,
	envelope: {
		assert: (value: unknown) => unknown
	},
	label: string
) => {
	const response = await sourceGetJson<_Response>(binding, requestUrl.href)
	assertEnvelope(envelope, response, label)
	return response
}

const applyChartQuery = (
	requestUrl: URL,
	{
		start,
		end,
		span,
		period,
	}: {
		start?: number
		end?: number
		span?: number
		period?: string
	}
) => {
	for (const [name, value] of Object.entries({
		start,
		end,
		span,
		period,
	}))
		if (value != null)
			requestUrl.searchParams.set(name, String(value))
}

/** `GET /prices/current/{coins}` on the public Coins API. */
export const getCurrentPrices = async ({
	coins,
}: GetDefillamaCurrentPricesArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`/prices/current/${coinsPathSegment(coins)}`,
		firstHttpUrlForBinding(publicCoinsBinding)
	)

	return getDefillamaJson<DefillamaCurrentPricesResponse>(
		publicCoinsBinding,
		requestUrl,
		defillamaCurrentPricesEnvelope,
		'current prices'
	)
}

/** `GET /{APIKEY}/coins/prices/current/{coins}` on the Pro gateway. */
export const getProCurrentPrices = async ({
	coins,
	publicEnv,
}: GetProDefillamaCurrentPricesArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`${proCoinsBasePath(publicEnv)}/prices/current/${coinsPathSegment(coins)}`,
		firstHttpUrlForBinding(proCoinsBinding)
	)

	return getDefillamaJson<DefillamaProCurrentPricesResponse>(
		proCoinsBinding,
		requestUrl,
		defillamaCurrentPricesEnvelope,
		'Pro current prices'
	)
}

/** `GET /prices/historical/{timestamp}/{coins}` on the public Coins API. */
export const getHistoricalPrices = async ({
	coins,
	timestamp,
}: GetDefillamaHistoricalPricesArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`/prices/historical/${timestamp}/${coinsPathSegment(coins)}`,
		firstHttpUrlForBinding(publicCoinsBinding)
	)

	return getDefillamaJson<DefillamaHistoricalPricesResponse>(
		publicCoinsBinding,
		requestUrl,
		defillamaHistoricalPricesEnvelope,
		'historical prices'
	)
}

/** `GET /{APIKEY}/coins/prices/historical/{timestamp}/{coins}` on the Pro gateway. */
export const getProHistoricalPrices = async ({
	coins,
	timestamp,
	publicEnv,
}: GetProDefillamaHistoricalPricesArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`${proCoinsBasePath(publicEnv)}/prices/historical/${timestamp}/${coinsPathSegment(coins)}`,
		firstHttpUrlForBinding(proCoinsBinding)
	)

	return getDefillamaJson<DefillamaProHistoricalPricesResponse>(
		proCoinsBinding,
		requestUrl,
		defillamaHistoricalPricesEnvelope,
		'Pro historical prices'
	)
}

/** `GET /prices/first/{coins}` on the public Coins API. */
export const getFirstPrices = async ({
	coins,
}: GetDefillamaFirstPricesArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`/prices/first/${coinsPathSegment(coins)}`,
		firstHttpUrlForBinding(publicCoinsBinding)
	)

	return getDefillamaJson<DefillamaFirstPricesResponse>(
		publicCoinsBinding,
		requestUrl,
		defillamaFirstPricesEnvelope,
		'first prices'
	)
}

/** `GET /{APIKEY}/coins/prices/first/{coins}` on the Pro gateway. */
export const getProFirstPrices = async ({
	coins,
	publicEnv,
}: GetProDefillamaFirstPricesArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`${proCoinsBasePath(publicEnv)}/prices/first/${coinsPathSegment(coins)}`,
		firstHttpUrlForBinding(proCoinsBinding)
	)

	return getDefillamaJson<DefillamaProFirstPricesResponse>(
		proCoinsBinding,
		requestUrl,
		defillamaFirstPricesEnvelope,
		'Pro first prices'
	)
}

/** `GET /chart/{coins}` on the public Coins API. */
export const getChart = async ({
	coins,
	start,
	end,
	span,
	period,
}: GetDefillamaChartArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`/chart/${coinsPathSegment(coins)}`,
		firstHttpUrlForBinding(publicCoinsBinding)
	)
	applyChartQuery(requestUrl, {
		start,
		end,
		span,
		period,
	})

	return getDefillamaJson<DefillamaChartResponse>(
		publicCoinsBinding,
		requestUrl,
		defillamaChartEnvelope,
		'chart'
	)
}

/** `GET /{APIKEY}/coins/chart/{coins}` on the Pro gateway. */
export const getProChart = async ({
	coins,
	start,
	end,
	span,
	period,
	publicEnv,
}: GetProDefillamaChartArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`${proCoinsBasePath(publicEnv)}/chart/${coinsPathSegment(coins)}`,
		firstHttpUrlForBinding(proCoinsBinding)
	)
	applyChartQuery(requestUrl, {
		start,
		end,
		span,
		period,
	})

	return getDefillamaJson<DefillamaChartResponse>(
		proCoinsBinding,
		requestUrl,
		defillamaChartEnvelope,
		'Pro chart'
	)
}

/** `GET /percentage/{coins}` on the public Coins API. */
export const getPercentageChange = async ({
	coins,
	timestamp,
	lookForward,
	period,
}: GetDefillamaPercentageArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`/percentage/${coinsPathSegment(coins)}`,
		firstHttpUrlForBinding(publicCoinsBinding)
	)
	for (const [name, value] of Object.entries({
		timestamp,
		lookForward,
		period,
	}))
		if (value != null)
			requestUrl.searchParams.set(name, String(value))

	return getDefillamaJson<DefillamaPercentageResponse>(
		publicCoinsBinding,
		requestUrl,
		defillamaPercentageEnvelope,
		'percentage'
	)
}

/** `GET /{APIKEY}/coins/percentage/{coins}` on the Pro gateway. */
export const getProPercentageChange = async ({
	coins,
	timestamp,
	lookForward,
	period,
	publicEnv,
}: GetProDefillamaPercentageArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`${proCoinsBasePath(publicEnv)}/percentage/${coinsPathSegment(coins)}`,
		firstHttpUrlForBinding(proCoinsBinding)
	)
	for (const [name, value] of Object.entries({
		timestamp,
		lookForward,
		period,
	}))
		if (value != null)
			requestUrl.searchParams.set(name, String(value))

	return getDefillamaJson<DefillamaProPercentageResponse>(
		proCoinsBinding,
		requestUrl,
		defillamaPercentageEnvelope,
		'Pro percentage'
	)
}

/** `GET /protocols` on the public TVL API — protocol list with current TVL. */
export const getProtocols = async () => (
	getDefillamaJson<DefillamaProtocolsResponse>(
		publicApiBinding,
		new URL(
			'/protocols',
			firstHttpUrlForBinding(publicApiBinding)
		),
		defillamaProtocolsEnvelope,
		'protocols'
	)
)

/** `GET /v2/chains` on the public TVL API — chain TVL snapshot. */
export const getChainsTvl = async () => (
	getDefillamaJson<DefillamaChainsTvlResponse>(
		publicApiBinding,
		new URL(
			'/v2/chains',
			firstHttpUrlForBinding(publicApiBinding)
		),
		defillamaChainsTvlEnvelope,
		'chains tvl'
	)
)

/** `GET /tvl/{protocol}` on the public TVL API — current protocol TVL USD number. */
export const getProtocolTvl = async ({
	protocol,
}: GetDefillamaProtocolTvlArgs) => {
	assertProtocolSlug(protocol)

	return getDefillamaJson<DefillamaProtocolTvlResponse>(
		publicApiBinding,
		new URL(
			`/tvl/${encodeURIComponent(protocol)}`,
			firstHttpUrlForBinding(publicApiBinding)
		),
		defillamaProtocolTvlEnvelope,
		'protocol tvl'
	)
}

/** `GET /protocol/{protocol}` on the public TVL API — protocol detail + historical chain TVLs. */
export const getProtocol = async ({
	protocol,
}: GetDefillamaProtocolArgs) => {
	assertProtocolSlug(protocol)

	return getDefillamaJson<DefillamaProtocolResponse>(
		publicApiBinding,
		new URL(
			`/protocol/${encodeURIComponent(protocol)}`,
			firstHttpUrlForBinding(publicApiBinding)
		),
		defillamaProtocolEnvelope,
		'protocol'
	)
}

/** `https://icons.llama.fi/{slug}.png` — DeFiLlama's chain icon CDN. */
export const getChainIconUrl = (slug: string) => (
	`${firstHttpUrlForBinding(iconBinding).replace(/\/$/, '')}/${encodeURIComponent(slug)}.png`
)
