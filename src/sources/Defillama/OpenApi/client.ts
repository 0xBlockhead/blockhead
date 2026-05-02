import { coinsBaseUrl } from '$/sources/Defillama/Rest/constants.ts'
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

const withSearchWidth = (
	url: URL,
	searchWidth: string | undefined,
) => {
	if (searchWidth != null) url.searchParams.set('searchWidth', searchWidth)
	return url
}

export const getCurrentPricesJson = async ({
	coins,
	searchWidth,
}: {
	coins: string[]
	searchWidth?: string
}): Promise<DefillamaOpenApiCurrentPricesResponse> => {
	const response = await fetch(
		withSearchWidth(
			new URL(
				`/prices/current/${coins.join(',')}`,
				coinsBaseUrl,
			),
			searchWidth,
		),
	)

	if (!response.ok) throw new Error(`DefiLlama API error: ${response.status}`)

	return response.json() as Promise<DefillamaOpenApiCurrentPricesResponse>
}
