import type { paths } from '$/sources/Defillama/OpenApi/openapi.d.ts'

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
