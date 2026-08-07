import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type { paths } from '$/sources/Defillama/OpenApi/openapi.d.ts'
import type { paths as proPaths } from '$/sources/Defillama/OpenApi/Pro/openapi.d.ts'
import { type as arktype } from 'arktype'

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

export type DefillamaProtocolsResponse = paths['/protocols']['get']['responses'][200]['content']['application/json']
export type DefillamaProtocolResponse = paths['/protocol/{protocol}']['get']['responses'][200]['content']['application/json']
export type DefillamaChainsTvlResponse = paths['/v2/chains']['get']['responses'][200]['content']['application/json']
export type DefillamaProtocolTvlResponse = paths['/tvl/{protocol}']['get']['responses'][200]['content']['application/json']

export type GetDefillamaProtocolTvlArgs = {
	protocol: string
}

export type GetDefillamaProtocolArgs = {
	protocol: string
}


const defillamaPriceWire = arktype({
	price: 'number',
	symbol: 'string',
	timestamp: 'number',
	'decimals?': 'number',
	'confidence?': 'number',
})
const defillamaFirstPriceWire = arktype({
	'price?': 'number',
	'symbol?': 'string',
	'timestamp?': 'number',
})
const defillamaChartPriceWire = arktype({
	'timestamp?': 'number',
	'price?': 'number',
})
const defillamaChartCoinWire = arktype({
	confidence: 'number',
	prices: defillamaChartPriceWire.array(),
	symbol: 'string',
	'decimals?': 'number',
})

export const defillamaCurrentPricesEnvelope = arktype({
	coins: {
		'[string]': defillamaPriceWire,
	},
})
export const defillamaHistoricalPricesEnvelope = arktype({
	coins: {
		'[string]': defillamaPriceWire,
	},
})
export const defillamaFirstPricesEnvelope = arktype({
	coins: {
		'[string]': defillamaFirstPriceWire,
	},
})
export const defillamaChartEnvelope = arktype({
	coins: {
		'[string]': defillamaChartCoinWire,
	},
})
export const defillamaPercentageEnvelope = arktype({
	coins: {
		'[string]': 'number',
	},
})

export const defillamaProtocolListRowEnvelope = arktype({
	'id?': 'string',
	'name?': 'string',
	'symbol?': 'string',
	'category?': 'string',
	'chains?': 'string[]',
	'tvl?': 'number',
	'chainTvls?': {
		'[string]': 'number',
	},
	'change_1d?': 'number',
	'change_7d?': 'number',
})
export const defillamaProtocolsEnvelope = defillamaProtocolListRowEnvelope.array()

const defillamaProtocolHistoricalTvlPointWire = arktype({
	'date?': 'number',
	'totalLiquidityUSD?': 'number',
})

const defillamaProtocolHistoricalTokensPointWire = arktype({
	'date?': 'number',
	'tokens?': {
		'[string]': 'number',
	},
})

const defillamaProtocolChainTvlHistoryWire = arktype({
	'tvl?': defillamaProtocolHistoricalTvlPointWire.array(),
	'tokens?': defillamaProtocolHistoricalTokensPointWire.array(),
})

export const defillamaProtocolEnvelope = arktype({
	'id?': 'string',
	'name?': 'string',
	'symbol?': 'string',
	'category?': 'string',
	'chains?': 'string[]',
	'currentChainTvls?': {
		'[string]': 'number',
	},
	'chainTvls?': {
		'[string]': defillamaProtocolChainTvlHistoryWire,
	},
})

export const defillamaChainTvlRowEnvelope = arktype({
	'gecko_id?': 'string | null',
	'tvl?': 'number',
	'tokenSymbol?': 'string | null',
	'cmcId?': 'string | null',
	'name?': 'string',
	'chainId?': 'number | null',
})
export const defillamaChainsTvlEnvelope = defillamaChainTvlRowEnvelope.array()

export const defillamaProtocolTvlEnvelope = arktype('number')
