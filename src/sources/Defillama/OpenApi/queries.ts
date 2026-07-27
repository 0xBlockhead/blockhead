/**
	* DefiLlama OpenAPI-backed price queries sourced from the official schema.
	* `Rest/queries.ts` remains the compatibility surface for resolvers and any existing callers.
	* @see https://api-docs.defillama.com/
	* @see https://docs.llama.fi/coin-prices-api
	*/

import {
	getCurrentPricesJson,
} from '$/sources/Defillama/OpenApi/client.ts'
import bindings from '$/sources/Defillama/bindings.ts'
import type {
	DefillamaOpenApiCurrentPrice,
	GetDefillamaCurrentPricesOptions,
} from '$/sources/Defillama/OpenApi/types.ts'
import type {
	DefiLlamaCurrentPricesResponse,
	DefiLlamaPriceData,
} from '$/sources/Defillama/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Defillama_OpenApi]

const maximumPriceIds = 1_000

/** Match `coins` map key to the id we requested (`coingecko:ethereum`, etc.). */
export const getCoinEntryFromResponse = <_Bucket>(
	coins: Record<string, _Bucket> | undefined,
	requestedCoinId: string
): _Bucket | undefined => {
	const map = coins ?? {}
	if (map[requestedCoinId] != null) return map[requestedCoinId]
	return (
		Object.entries(map)
			.find(([key]) => (
				key === requestedCoinId
				|| decodeURIComponent(key) === requestedCoinId
			))
			?.[1]
	)
}

const normalizeCurrentPriceData = (
	value: DefillamaOpenApiCurrentPrice | undefined
): DefiLlamaPriceData | undefined => {
	if (value == null) return undefined
	if (
		value.price == null
		|| !Number.isFinite(value.price)
		|| value.price < 0
		|| value.timestamp == null
		|| !Number.isSafeInteger(value.timestamp)
		|| value.timestamp <= 0
		|| (value.decimals != null && (
			!Number.isSafeInteger(value.decimals)
			|| value.decimals < 0
			|| value.decimals > 255
		))
		|| (value.confidence != null && !Number.isFinite(value.confidence))
	)
		throw new Error('Defillama_OpenApi: malformed current price observation')
	return {
		decimals: value.decimals ?? 8,
		price: value.price,
		symbol: value.symbol ?? '',
		timestamp: value.timestamp,
		...(value.confidence != null && { confidence: value.confidence }),
	}
}

/**
	* `GET /prices/current/{coins}` — current prices for `{chain}:{address}` or `coingecko:{id}` ids.
	* @see https://docs.llama.fi/coin-prices-api
	*/
export const getCurrentPrices = async (
	coins: string[],
	options?: GetDefillamaCurrentPricesOptions
): Promise<DefiLlamaCurrentPricesResponse> => {
	if (coins.length === 0) return { coins: {} }
	if (
		coins.length > maximumPriceIds
		|| new Set(coins).size !== coins.length
		|| coins.some((coin) => coin === '' || !coin.includes(':'))
	)
		throw new Error('Defillama_OpenApi: malformed requested coin identities')

	const response = await getCurrentPricesJson(
		{
			coins,
			searchWidth: options?.searchWidth,
		}
	)

	return {
		coins: Object.fromEntries(
			coins.flatMap((requestedCoinId) => {
				const wire = getCoinEntryFromResponse(response.coins, requestedCoinId)
				const normalized = normalizeCurrentPriceData(wire)
				return normalized == null ? [] : [[
					requestedCoinId,
					normalized,
				]]
			})
		),
	}
}

/** `https://icons.llama.fi/{slug}.png` — chain icon CDN. Slug is the DeFiLlama chain name lowercased. */
export const getChainIconUrl = (
	slug: string
): string => (
	`${binding.endpoints[1].locator.replace(/\/$/, '')}/${encodeURIComponent(slug)}.png`
)

/**
	* DeFiLlama chain slug keyed by EVM chain id.
	* Slugs match the lowercase `name` field from `/v2/chains`, which also routes `icons.llama.fi`.
	*/
export const getChainSlugByChainId: Partial<Record<number, string>> = {
	1: 'ethereum',
	10: 'optimism',
	56: 'bsc',
	100: 'xdai',
	137: 'polygon',
	250: 'fantom',
	8453: 'base',
	42161: 'arbitrum',
	43114: 'avax',
	59144: 'linea',
	534352: 'scroll',
	1101: 'polygon_zkevm',
	324: 'era',
	5000: 'mantle',
	81457: 'blast',
	34443: 'mode',
	1868: 'soneium',
	480: 'worldchain',
	7777777: 'zora',
	57073: 'ink',
	1135: 'lisk',
	60808: 'bob',
}
