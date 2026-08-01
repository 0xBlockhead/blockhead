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
	DefillamaProCurrentPricesResponse,
	GetDefillamaChartArgs,
	GetDefillamaCurrentPricesArgs,
	GetProDefillamaCurrentPricesArgs,
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

/** `GET /prices/current/{coins}` on the public Coins API. */
export const getCurrentPrices = async ({
	coins,
}: GetDefillamaCurrentPricesArgs) => {
	if (coins.length === 0)
		return { coins: {} }

	validateCoinIds(coins)
	const requestUrl = new URL(
		`/prices/current/${coins.map((coin) => encodeURIComponent(coin)).join(',')}`,
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
		`/${encodeURIComponent(requiredPublicEnvString(publicEnv, 'PUBLIC_DEFILLAMA_PRO_API_KEY'))}/coins/prices/current/${coins.map((coin) => encodeURIComponent(coin)).join(',')}`,
		firstHttpUrlForBinding(proCoinsBinding)
	)

	return sourceGetJson<DefillamaProCurrentPricesResponse>(proCoinsBinding, requestUrl.href)
}

/** `GET /chart/{coins}` on the public Coins API. */
export const getChart = ({
	coins,
	start,
	end,
	span,
	period,
}: GetDefillamaChartArgs) => {
	validateCoinIds(coins)
	const requestUrl = new URL(
		`/chart/${coins.map((coin) => encodeURIComponent(coin)).join(',')}`,
		firstHttpUrlForBinding(publicCoinsBinding)
	)
	for (const [name, value] of Object.entries({
		start,
		end,
		span,
		period,
	}))
		if (value != null)
			requestUrl.searchParams.set(name, String(value))

	return sourceGetJson<DefillamaChartResponse>(publicCoinsBinding, requestUrl.href)
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
