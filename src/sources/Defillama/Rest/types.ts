/**
 * Current prices response (`coins` map keyed by `chain:address` or e.g. `coingecko:ethereum`).
 * @see https://api-docs.defillama.com/
 */
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
