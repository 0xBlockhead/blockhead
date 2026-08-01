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

export type DefillamaChartResponse = DynamicCoinResponse<
	ChartResponse,
	ChartCoin
>
