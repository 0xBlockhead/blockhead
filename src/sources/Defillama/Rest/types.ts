/**
 * Current prices response (`coins` map keyed by `chain:address` or e.g. `coingecko:ethereum`).
 * @see https://api-docs.defillama.com/
 */

import type { DefillamaSearchWidth } from '$/sources/Defillama/OpenApi/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

export type DefiLlamaPriceData = {
	decimals: number
	price: number
	symbol: string
	timestamp: number
	confidence?: number
}

export type DefiLlamaCurrentPricesResponse = {
	coins: Record<string, DefiLlamaPriceData>
}

export type GetProDefillamaCurrentPricesArgs = {
	publicEnv: SourcePublicEnv
	coins: string[]
	searchWidth?: DefillamaSearchWidth
}
