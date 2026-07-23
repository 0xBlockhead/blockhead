import type { components, paths } from '$/sources/Dexscreener/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

export type DexscreenerPair = components['schemas']['Pair']

export type DexscreenerPairsResponse = (
	paths['/latest/dex/pairs/{chainId}/{pairId}']['get']['responses'][200]['content']['application/json']
)

export type DexscreenerTokenPairsResponse = (
	paths['/token-pairs/v1/{chainId}/{tokenAddress}']['get']['responses'][200]['content']['application/json']
)

export type DexscreenerSearchResponse = (
	paths['/latest/dex/search']['get']['responses'][200]['content']['application/json']
)

export type DexscreenerPairObservation = {
	source: Source.Dexscreener_OpenApi
	resolvedAtMs: number
	chainId: string
	dexId: string
	pairAddress: string
	url?: string
	labels: string[]
	baseToken: {
		address: string
		name: string
		symbol: string
	}
	quoteToken: {
		address: string
		name: string
		symbol: string
	}
	priceNative?: string
	priceUsd?: string
	txns: Partial<Record<string, {
		buys: number
		sells: number
	}>>
	volume: Partial<Record<string, number>>
	priceChange: Partial<Record<string, number>>
	liquidity?: {
		usd?: number
		base?: number
		quote?: number
	}
	fdv?: number
	marketCap?: number
	pairCreatedAt?: number
}

export type DexscreenerPairObservationsResponse = {
	pairs: DexscreenerPairObservation[]
}
