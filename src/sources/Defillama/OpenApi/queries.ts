/**
	* DefiLlama OpenAPI-backed price queries sourced from the official schema.
	* `Rest/queries.ts` remains the compatibility surface for resolvers and any existing callers.
	* @see https://api-docs.defillama.com/
	* @see https://docs.llama.fi/coin-prices-api
	*/

import { iconsOrigin } from '$/sources/Defillama/Rest/constants.ts'
import {
	getCurrentPricesJson,
	getProtocolJson,
	getProtocolsJson,
	getYieldPoolChartJson,
	getYieldPoolsJson,
} from '$/sources/Defillama/OpenApi/client.ts'
import type {
	DefillamaOpenApiCurrentPrice,
	DefillamaProtocol,
	DefillamaProtocolDetail,
	DefillamaYieldPoolHistoryObservation,
	DefillamaYieldPoolObservation,
	GetDefillamaCurrentPricesOptions,
} from '$/sources/Defillama/OpenApi/types.ts'
import type {
	DefiLlamaCurrentPricesResponse,
	DefiLlamaPriceData,
} from '$/sources/Defillama/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const maximumProtocols = 5_000
const maximumPools = 25_000
const maximumHistoryObservations = 25_000
const maximumRewardTokens = 64
const maximumPriceIds = 1_000

const finiteNumber = (
	value: number | undefined | null,
	label: string,
	minimum?: number
) => {
	if (
		value == null
		|| !Number.isFinite(value)
		|| (minimum != null && value < minimum)
	)
		throw new Error(`Defillama_OpenApi: invalid ${label}`)
	return value
}

const optionalFiniteNumber = (
	value: number | undefined | null,
	label: string,
	minimum?: number
) => (
	value == null ?
		undefined
	:
		finiteNumber(value, label, minimum)
)

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

	const response = await getCurrentPricesJson({
		coins,
		searchWidth: options?.searchWidth,
	})

	return {
		coins: Object.fromEntries(
			coins.flatMap((requestedCoinId) => {
				const wire = getCoinEntryFromResponse(response.coins, requestedCoinId)
				const normalized = normalizeCurrentPriceData(wire)
				return normalized == null ? [] : [[
					requestedCoinId,
					normalized,
				] as const]
			})
		),
	}
}

export const getProtocols = async (
	options?: { baseUrl?: string }
): Promise<DefillamaProtocol[]> => {
	const response = await getProtocolsJson(options?.baseUrl)
	if (
		response.length > maximumProtocols
		|| new Set(response.map((protocol) => protocol.id)).size !== response.length
	)
		throw new Error('Defillama_OpenApi: malformed protocols catalog')

	return response.map((protocol) => {
		if (
			protocol.id == null
			|| protocol.id === ''
			|| protocol.name == null
			|| protocol.name === ''
			|| protocol.symbol == null
			|| protocol.category == null
			|| protocol.chains == null
			|| protocol.tvl == null
			|| protocol.chainTvls == null
		)
			throw new Error('Defillama_OpenApi: incomplete protocol row')

		return {
			source: Source.Defillama_OpenApi,
			id: protocol.id,
			name: protocol.name,
			symbol: protocol.symbol,
			category: protocol.category,
			chains: protocol.chains,
			tvlUsd: finiteNumber(protocol.tvl, 'protocol TVL', 0),
			chainTvlUsd: Object.fromEntries(
				Object.entries(protocol.chainTvls).map(([chain, tvlUsd]) => [
					chain,
					finiteNumber(tvlUsd, `${chain} protocol TVL`, 0),
				])
			),
		}
	})
}

export const getProtocol = async (
	protocolSlug: string,
	options?: { baseUrl?: string }
): Promise<DefillamaProtocolDetail> => {
	if (protocolSlug === '')
		throw new Error('Defillama_OpenApi: empty protocol slug')
	const response = await getProtocolJson(protocolSlug, options?.baseUrl)
	if (
		response.id == null
		|| (
			response.id !== protocolSlug
			&& !response.id.endsWith(`#${protocolSlug}`)
		)
	)
		throw new Error('Defillama_OpenApi: protocol response does not match requested slug')
	if (
		response.name == null
		|| response.symbol == null
		|| response.category == null
		|| response.chains == null
		|| response.currentChainTvls == null
		|| response.chainTvls == null
	)
		throw new Error('Defillama_OpenApi: incomplete protocol detail')
	const history = Object.entries(response.chainTvls).flatMap(([chainLabel, values]) => {
		const rows = values.tvl ?? []
		if (
			rows.length > maximumHistoryObservations
			|| new Set(rows.map((row) => row.date)).size !== rows.length
		)
			throw new Error('Defillama_OpenApi: malformed protocol TVL history')
		return rows.map((row, index) => {
			if (
				row.date == null
				|| !Number.isSafeInteger(row.date)
				|| row.date <= 0
				|| row.totalLiquidityUSD == null
				|| (index > 0 && row.date <= (rows[index - 1].date ?? 0))
			)
				throw new Error('Defillama_OpenApi: malformed protocol TVL observation')
			return {
				chainLabel,
				timestampMs: row.date * 1_000,
				tvlUsd: finiteNumber(row.totalLiquidityUSD, 'protocol historical TVL', 0),
			}
		})
	})
	if (history.length > maximumHistoryObservations)
		throw new Error('Defillama_OpenApi: excessive protocol TVL history')
	return {
		source: Source.Defillama_OpenApi,
		id: response.id,
		name: response.name,
		symbol: response.symbol,
		category: response.category,
		chains: response.chains,
		currentChainTvlUsd: Object.fromEntries(
			Object.entries(response.currentChainTvls).map(([chain, tvlUsd]) => [
				chain,
				finiteNumber(tvlUsd, `${chain} current protocol TVL`, 0),
			])
		),
		history,
	}
}

export const getYieldPools = async (
	options?: {
		baseUrl?: string
		resolvedAtMs?: number
	}
): Promise<DefillamaYieldPoolObservation[]> => {
	const response = await getYieldPoolsJson(options?.baseUrl)
	const rows = response.data ?? []
	if (
		response.status !== 'success'
		|| rows.length > maximumPools
		|| new Set(rows.map((row) => row.pool)).size !== rows.length
	)
		throw new Error('Defillama_OpenApi: malformed yield pools response')

	return rows.map((row) => {
		if (
			row.pool == null
			|| row.pool === ''
			|| row.project == null
			|| row.project === ''
			|| row.chain == null
			|| row.chain === ''
			|| row.symbol == null
			|| row.tvlUsd == null
			|| (row.rewardTokens?.length ?? 0) > maximumRewardTokens
		)
			throw new Error('Defillama_OpenApi: incomplete yield pool row')
		const apyBasePercent = optionalFiniteNumber(row.apyBase, 'base APY')
		const apyRewardPercent = optionalFiniteNumber(row.apyReward, 'reward APY')
		const apyTotalPercent = optionalFiniteNumber(row.apy, 'total APY')

		return {
			source: Source.Defillama_OpenApi,
			poolId: row.pool,
			projectSlug: row.project,
			chainLabel: row.chain,
			symbol: row.symbol,
			tvlUsd: finiteNumber(row.tvlUsd, 'pool TVL', 0),
			...(apyBasePercent != null && {
				apyBasePercent,
			}),
			...(apyRewardPercent != null && {
				apyRewardPercent,
			}),
			...(apyTotalPercent != null && {
				apyTotalPercent,
			}),
			rewardTokens: row.rewardTokens ?? [],
			resolvedAtMs: options?.resolvedAtMs ?? Date.now(),
		}
	})
}

export const getYieldPoolChart = async (
	poolId: string,
	options?: { baseUrl?: string }
): Promise<DefillamaYieldPoolHistoryObservation[]> => {
	if (poolId === '')
		throw new Error('Defillama_OpenApi: empty yield pool id')
	const response = await getYieldPoolChartJson(poolId, options?.baseUrl)
	const rows = response.data ?? []
	if (
		response.status !== 'success'
		|| rows.length > maximumHistoryObservations
	)
		throw new Error('Defillama_OpenApi: malformed yield history response')

	const observations = rows.map((row) => {
		if (row.timestamp == null)
			throw new Error('Defillama_OpenApi: yield history timestamp is missing')
		const timestampMs = Date.parse(row.timestamp)
		if (!Number.isSafeInteger(timestampMs))
			throw new Error('Defillama_OpenApi: invalid yield history timestamp')
		const tvlUsd = optionalFiniteNumber(row.tvlUsd, 'historical TVL', 0)
		const apyBasePercent = optionalFiniteNumber(row.apyBase, 'historical base APY')
		const apyRewardPercent = optionalFiniteNumber(row.apyReward, 'historical reward APY')
		const apyTotalPercent = optionalFiniteNumber(row.apy, 'historical total APY')
		return {
			source: Source.Defillama_OpenApi,
			poolId,
			timestampMs,
			...(tvlUsd != null && {
				tvlUsd,
			}),
			...(apyBasePercent != null && {
				apyBasePercent,
			}),
			...(apyRewardPercent != null && {
				apyRewardPercent,
			}),
			...(apyTotalPercent != null && {
				apyTotalPercent,
			}),
		}
	})
	if (
		new Set(observations.map((row) => row.timestampMs)).size !== observations.length
		|| observations.some((row, index) => (
			index > 0 && row.timestampMs <= observations[index - 1].timestampMs
		))
	)
		throw new Error('Defillama_OpenApi: yield history is not strictly ordered')
	return observations
}

/** `https://icons.llama.fi/{slug}.png` — chain icon CDN. Slug is the DeFiLlama chain name lowercased. */
export const getChainIconUrl = (slug: string): string => (
	`${iconsOrigin}/${encodeURIComponent(slug)}.png`
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
