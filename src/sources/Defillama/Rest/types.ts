import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type { paths } from '$/sources/Defillama/OpenApi/openapi.d.ts'
import type { paths as proPaths } from '$/sources/Defillama/OpenApi/Pro/openapi.d.ts'

type CurrentPricesOperation = paths['/prices/current/{coins}']['get']
type CurrentPricesResponse = (
	CurrentPricesOperation['responses'][200]['content']['application/json']
)
type CurrentPrice = NonNullable<
	NonNullable<CurrentPricesResponse['coins']>[
		'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'
	]
>
type ProCurrentPricesOperation = proPaths['/coins/prices/current/{coins}']['get']
type ProCurrentPricesResponse = (
	ProCurrentPricesOperation['responses'][200]['content']['application/json']
)
type ProCurrentPrice = NonNullable<
	NonNullable<ProCurrentPricesResponse['coins']>[
		'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'
	]
>
type ChartOperation = paths['/chart/{coins}']['get']
type ChartResponse = ChartOperation['responses'][200]['content']['application/json']
type ChartCoin = NonNullable<
	NonNullable<ChartResponse['coins']>[
		'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'
	]
>
type HistoricalPricesOperation = paths['/prices/historical/{timestamp}/{coins}']['get']
type HistoricalPricesResponse = (
	HistoricalPricesOperation['responses'][200]['content']['application/json']
)
type HistoricalPrice = NonNullable<
	NonNullable<HistoricalPricesResponse['coins']>[
		'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'
	]
>
type ProHistoricalPricesOperation = proPaths['/coins/prices/historical/{timestamp}/{coins}']['get']
type ProHistoricalPricesResponse = (
	ProHistoricalPricesOperation['responses'][200]['content']['application/json']
)
type ProHistoricalPrice = NonNullable<
	NonNullable<ProHistoricalPricesResponse['coins']>[
		'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'
	]
>
type FirstPricesOperation = paths['/prices/first/{coins}']['get']
type FirstPricesResponse = (
	FirstPricesOperation['responses'][200]['content']['application/json']
)
type FirstPrice = NonNullable<
	NonNullable<FirstPricesResponse['coins']>[
		'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'
	]
>
type ProFirstPricesOperation = proPaths['/coins/prices/first/{coins}']['get']
type ProFirstPricesResponse = (
	ProFirstPricesOperation['responses'][200]['content']['application/json']
)
type ProFirstPrice = NonNullable<
	NonNullable<ProFirstPricesResponse['coins']>[
		'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'
	]
>
type PercentageOperation = paths['/percentage/{coins}']['get']
type PercentageResponse = PercentageOperation['responses'][200]['content']['application/json']
type ProPercentageOperation = proPaths['/coins/percentage/{coins}']['get']
type ProPercentageResponse = (
	ProPercentageOperation['responses'][200]['content']['application/json']
)
type ProChartOperation = proPaths['/coins/chart/{coins}']['get']

type DynamicCoinResponse<_Response, _Coin> = (
	& Omit<_Response, 'coins'>
	& {
		coins?: Record<string, _Coin>
	}
)

/** The official schema emits its example coin id as a literal property instead of a dynamic map. */
export type DefillamaCurrentPricesResponse = DynamicCoinResponse<
	CurrentPricesResponse,
	CurrentPrice
>

/** The official Pro schema has the same dynamic-map defect as its free counterpart. */
export type DefillamaProCurrentPricesResponse = DynamicCoinResponse<
	ProCurrentPricesResponse,
	ProCurrentPrice
>

export type GetDefillamaCurrentPricesArgs = (
	& Omit<CurrentPricesOperation['parameters']['path'], 'coins'>
	& {
		coins: string[]
	}
)

export type GetProDefillamaCurrentPricesArgs = (
	& Omit<ProCurrentPricesOperation['parameters']['path'], 'coins'>
	& {
		coins: string[]
		publicEnv: SourcePublicEnv
	}
)

export type GetDefillamaChartArgs = (
	& NonNullable<ChartOperation['parameters']['query']>
	& {
		coins: string[]
	}
)

export type GetProDefillamaChartArgs = (
	& NonNullable<ProChartOperation['parameters']['query']>
	& {
		coins: string[]
		publicEnv: SourcePublicEnv
	}
)

export type DefillamaChartResponse = DynamicCoinResponse<
	ChartResponse,
	ChartCoin
>

export type GetDefillamaHistoricalPricesArgs = (
	& Omit<HistoricalPricesOperation['parameters']['path'], 'coins'>
	& {
		coins: string[]
	}
)

export type GetProDefillamaHistoricalPricesArgs = (
	& Omit<ProHistoricalPricesOperation['parameters']['path'], 'coins'>
	& {
		coins: string[]
		publicEnv: SourcePublicEnv
	}
)

export type DefillamaHistoricalPricesResponse = DynamicCoinResponse<
	HistoricalPricesResponse,
	HistoricalPrice
>

export type DefillamaProHistoricalPricesResponse = DynamicCoinResponse<
	ProHistoricalPricesResponse,
	ProHistoricalPrice
>

export type GetDefillamaFirstPricesArgs = {
	coins: string[]
}

export type GetProDefillamaFirstPricesArgs = {
	coins: string[]
	publicEnv: SourcePublicEnv
}

export type DefillamaFirstPricesResponse = DynamicCoinResponse<
	FirstPricesResponse,
	FirstPrice
>

export type DefillamaProFirstPricesResponse = DynamicCoinResponse<
	ProFirstPricesResponse,
	ProFirstPrice
>

export type GetDefillamaPercentageArgs = (
	& NonNullable<PercentageOperation['parameters']['query']>
	& {
		coins: string[]
	}
)

export type GetProDefillamaPercentageArgs = (
	& NonNullable<ProPercentageOperation['parameters']['query']>
	& {
		coins: string[]
		publicEnv: SourcePublicEnv
	}
)

export type DefillamaPercentageResponse = DynamicCoinResponse<
	PercentageResponse,
	number
>

export type DefillamaProPercentageResponse = DynamicCoinResponse<
	ProPercentageResponse,
	number
>
