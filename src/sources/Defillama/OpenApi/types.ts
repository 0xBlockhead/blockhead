import type { paths } from '$/sources/Defillama/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

type CurrentPricesSuccess = (
	paths['/prices/current/{coins}']['get']['responses'][200]['content']['application/json']
)

export type DefillamaOpenApiCurrentPrice = {
	decimals?: number
	price?: number
	symbol?: string
	timestamp?: number
	confidence?: number
}

export type DefillamaOpenApiCurrentPricesResponse = (
	Omit<CurrentPricesSuccess, 'coins'> & {
		coins?: Record<string, DefillamaOpenApiCurrentPrice>
	}
)

export type DefillamaSearchWidth = '4h' | '24h'

export type GetDefillamaCurrentPricesOptions = {
	searchWidth?: DefillamaSearchWidth
}

export type DefillamaChartPricePoint = {
	timestamp?: number
	price?: number
}

export type DefillamaChartCoinBucket = {
	symbol?: string
	confidence?: number
	prices?: DefillamaChartPricePoint[]
}

export type DefillamaOpenApiChartResponse = {
	coins?: Record<string, DefillamaChartCoinBucket>
}

export type DefillamaProtocolsResponse = (
	paths['/protocols']['get']['responses'][200]['content']['application/json']
)

export type DefillamaProtocolResponse = (
	paths['/protocol/{protocol}']['get']['responses'][200]['content']['application/json']
)

export type DefillamaYieldPoolsResponse = (
	paths['/pools']['get']['responses'][200]['content']['application/json']
)

export type DefillamaYieldPoolChartResponse = (
	paths['/chart/{pool}']['get']['responses'][200]['content']['application/json']
)

export type DefillamaProtocol = {
	source: Source.Defillama_OpenApi
	id: string
	name: string
	symbol: string
	category: string
	chains: string[]
	tvlUsd: number
	chainTvlUsd: Record<string, number>
}

export type DefillamaProtocolDetail = {
	source: Source.Defillama_OpenApi
	id: string
	name: string
	symbol: string
	category: string
	chains: string[]
	currentChainTvlUsd: Record<string, number>
	history: {
		chainLabel: string
		timestampMs: number
		tvlUsd: number
	}[]
}

export type DefillamaYieldPoolObservation = {
	source: Source.Defillama_OpenApi
	poolId: string
	projectSlug: string
	chainLabel: string
	symbol: string
	tvlUsd: number
	apyBasePercent?: number
	apyRewardPercent?: number
	apyTotalPercent?: number
	rewardTokens: string[]
	resolvedAtMs: number
}

export type DefillamaYieldPoolHistoryObservation = {
	source: Source.Defillama_OpenApi
	poolId: string
	timestampMs: number
	tvlUsd?: number
	apyBasePercent?: number
	apyRewardPercent?: number
	apyTotalPercent?: number
}
