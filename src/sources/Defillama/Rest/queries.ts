/**
 * DeFiLlama REST endpoints backed by the provider's official OpenAPI contracts.
 * @see https://api-docs.defillama.com/
 * @see https://github.com/DefiLlama/api-docs/blob/main/defillama-openapi-free.json
 * @see https://github.com/DefiLlama/api-docs/blob/main/defillama-openapi-pro.json
 */

import { requiredPublicEnvString } from '$/sources/$sources.ts'
import bindings from '$/sources/Defillama/bindings.ts'
import type {
	DefillamaChartResponse,
	DefillamaCurrentPricesResponse,
	DefillamaFirstPricesResponse,
	DefillamaHistoricalPricesResponse,
	DefillamaPercentageResponse,
	DefillamaProCurrentPricesResponse,
	DefillamaProFirstPricesResponse,
	DefillamaProHistoricalPricesResponse,
	DefillamaProPercentageResponse,
	GetDefillamaChartArgs,
	GetDefillamaCurrentPricesArgs,
	GetDefillamaFirstPricesArgs,
	GetDefillamaHistoricalPricesArgs,
	GetDefillamaPercentageArgs,
	GetProDefillamaChartArgs,
	GetProDefillamaCurrentPricesArgs,
	GetProDefillamaFirstPricesArgs,
	GetProDefillamaHistoricalPricesArgs,
	GetProDefillamaPercentageArgs,
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
const proCoinsBinding = bindingByTargetKey['coins-pro']
const iconBinding = bindingByTargetKey['chain-icons']

const validateCoinIds = (coins: string[]) => {
	if (
		new Set(coins).size !== coins.length
		|| coins.some((coin) => coin === '' || !coin.includes(':'))
	)
		throw new Error('Defillama_Rest: malformed requested coin identities')
}

const coinsPathSegment = (coins: string[]) => (
	coins
		.map((coin) => encodeURIComponent(coin))
		.join(',')
)

const proCoinsBasePath = (publicEnv: GetProDefillamaCurrentPricesArgs['publicEnv']) => (
	`/${encodeURIComponent(requiredPublicEnvString(publicEnv, 'PUBLIC_DEFILLAMA_PRO_API_KEY'))}/coins`
)

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

	return sourceGetJson<DefillamaCurrentPricesResponse>(publicCoinsBinding, requestUrl.href)
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

	return sourceGetJson<DefillamaProCurrentPricesResponse>(proCoinsBinding, requestUrl.href)
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

	return sourceGetJson<DefillamaHistoricalPricesResponse>(publicCoinsBinding, requestUrl.href)
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

	return sourceGetJson<DefillamaProHistoricalPricesResponse>(proCoinsBinding, requestUrl.href)
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

	return sourceGetJson<DefillamaFirstPricesResponse>(publicCoinsBinding, requestUrl.href)
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

	return sourceGetJson<DefillamaProFirstPricesResponse>(proCoinsBinding, requestUrl.href)
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

	return sourceGetJson<DefillamaChartResponse>(publicCoinsBinding, requestUrl.href)
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

	return sourceGetJson<DefillamaChartResponse>(proCoinsBinding, requestUrl.href)
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

	return sourceGetJson<DefillamaPercentageResponse>(publicCoinsBinding, requestUrl.href)
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

	return sourceGetJson<DefillamaProPercentageResponse>(proCoinsBinding, requestUrl.href)
}

/** `https://icons.llama.fi/{slug}.png` — DeFiLlama's chain icon CDN. */
export const getChainIconUrl = (slug: string) => (
	`${firstHttpUrlForBinding(iconBinding).replace(/\/$/, '')}/${encodeURIComponent(slug)}.png`
)

/**
 * Chain icon slugs are provider identifiers rather than EVM chain ids, and are not returned by `/v2/chains`.
 * @see https://github.com/DefiLlama/icons
 */
export const chainIconSlugByChainId = Object.fromEntries([
	[1, 'ethereum'],
	[10, 'optimism'],
	[56, 'bsc'],
	[100, 'xdai'],
	[137, 'polygon'],
	[250, 'fantom'],
	[324, 'era'],
	[480, 'worldchain'],
	[1_101, 'polygon_zkevm'],
	[1_135, 'lisk'],
	[1_868, 'soneium'],
	[5_000, 'mantle'],
	[8_453, 'base'],
	[34_443, 'mode'],
	[42_161, 'arbitrum'],
	[43_114, 'avax'],
	[57_073, 'ink'],
	[59_144, 'linea'],
	[60_808, 'bob'],
	[81_457, 'blast'],
	[534_352, 'scroll'],
	[7_777_777, 'zora'],
])
