import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Defillama/bindings.ts'
import type {
	DefillamaOpenApiChartResponse,
	DefillamaOpenApiCurrentPricesResponse,
} from '$/sources/Defillama/OpenApi/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Defillama_OpenApi]

const withSearchWidth = (
	url: URL,
	searchWidth: string | undefined
) => {
	if (searchWidth != null) url.searchParams.set('searchWidth', searchWidth)
	return url
}

export const getChartJson = async (
	{
		coins,
		period,
		span,
		searchWidth,
	}: {
		coins: string[]
		period?: string
		span?: number
		searchWidth?: string
	}
): Promise<DefillamaOpenApiChartResponse> => {
	const reqUrl = withSearchWidth(
		new URL(
			`/chart/${coins.map((coin) => encodeURIComponent(coin)).join(',')}`,
			firstHttpUrlForBinding(binding)
		),
		searchWidth
	)
	if (period != null) reqUrl.searchParams.set('period', period)
	if (span != null) reqUrl.searchParams.set('span', String(span))

	return sourceGetJson(binding, reqUrl.href)
}

export const getCurrentPricesJson = async (
	{
		coins,
		searchWidth,
	}: {
		coins: string[]
		searchWidth?: string
	}
): Promise<DefillamaOpenApiCurrentPricesResponse> => {
	const reqUrl = withSearchWidth(
		new URL(
			`/prices/current/${coins.map((coin) => encodeURIComponent(coin)).join(',')}`,
			firstHttpUrlForBinding(binding)
		),
		searchWidth
	)

	return sourceGetJson(binding, reqUrl.href)
}
