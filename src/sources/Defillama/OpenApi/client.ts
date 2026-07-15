import { corsFetch, fetchFailedMessage } from '$/lib/http.ts'
import {
	coinsBaseUrl,
	defillamaOrigins,
} from '$/sources/Defillama/Rest/constants.ts'
import type {
	DefillamaOpenApiChartResponse,
	DefillamaOpenApiCurrentPricesResponse,
} from '$/sources/Defillama/OpenApi/types.ts'

const withSearchWidth = (
	url: URL,
	searchWidth: string | undefined
) => {
	if (searchWidth != null) url.searchParams.set('searchWidth', searchWidth)
	return url
}

export const getChartJson = async ({
	coins,
	period,
	span,
	searchWidth,
}: {
	coins: string[]
	period?: string
	span?: number
	searchWidth?: string
}): Promise<DefillamaOpenApiChartResponse> => {
	const reqUrl = withSearchWidth(
		new URL(
			`/chart/${coins.map((coin) => encodeURIComponent(coin)).join(',')}`,
			coinsBaseUrl
		),
		searchWidth
	)
	if (period != null) reqUrl.searchParams.set('period', period)
	if (span != null) reqUrl.searchParams.set('span', String(span))

	const response = await corsFetch(reqUrl.href, { origins: defillamaOrigins })

	if (!response.ok) throw new Error(await fetchFailedMessage(reqUrl.href, response))

	return response.json<DefillamaOpenApiChartResponse>()
}

export const getCurrentPricesJson = async ({
	coins,
	searchWidth,
}: {
	coins: string[]
	searchWidth?: string
}): Promise<DefillamaOpenApiCurrentPricesResponse> => {
	const reqUrl = withSearchWidth(
		new URL(
			`/prices/current/${coins.map((coin) => encodeURIComponent(coin)).join(',')}`,
			coinsBaseUrl
		),
		searchWidth
	)
	const response = await corsFetch(reqUrl.href, { origins: defillamaOrigins })

	if (!response.ok) throw new Error(await fetchFailedMessage(reqUrl.href, response))

	return response.json<DefillamaOpenApiCurrentPricesResponse>()
}
