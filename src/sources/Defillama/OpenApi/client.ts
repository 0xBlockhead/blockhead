import { corsFetch, fetchFailedMessage } from '$/lib/http.ts'
import {
	apiOrigin,
	coinsBaseUrl,
	defillamaOrigins,
	yieldsOrigin,
} from '$/sources/Defillama/Rest/constants.ts'
import type {
	DefillamaOpenApiChartResponse,
	DefillamaOpenApiCurrentPricesResponse,
	DefillamaProtocolResponse,
	DefillamaProtocolsResponse,
	DefillamaYieldPoolChartResponse,
	DefillamaYieldPoolsResponse,
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

const getJson = async <_Response>(
	path: string,
	baseUrl: string
): Promise<_Response> => {
	const requestUrl = new URL(path, baseUrl)
	const response = await corsFetch(requestUrl.href, { origins: defillamaOrigins })
	if (!response.ok)
		throw new Error(await fetchFailedMessage(requestUrl.href, response))
	return response.json<_Response>()
}

export const getProtocolsJson = (
	baseUrl = apiOrigin
): Promise<DefillamaProtocolsResponse> => getJson('/protocols', baseUrl)

export const getProtocolJson = (
	protocolSlug: string,
	baseUrl = apiOrigin
): Promise<DefillamaProtocolResponse> => (
	getJson(`/protocol/${encodeURIComponent(protocolSlug)}`, baseUrl)
)

export const getYieldPoolsJson = (
	baseUrl = yieldsOrigin
): Promise<DefillamaYieldPoolsResponse> => getJson('/pools', baseUrl)

export const getYieldPoolChartJson = (
	poolId: string,
	baseUrl = yieldsOrigin
): Promise<DefillamaYieldPoolChartResponse> => (
	getJson(`/chart/${encodeURIComponent(poolId)}`, baseUrl)
)
