import { Source } from '$/sources/$Source.ts'

/**
 * Transport-only lane for DeFiLlama **Pro** REST (`getProCurrentPrices` in `$/sources/Defillama/Rest/queries.ts`).
 * Public coin prices use **`Source.Defillama_OpenApi`** + **`Defillama-OpenApi.ts`** (checked-in OpenAPI schema).
 */
export default {
	source: Source.Defillama_Rest,

	entityResolvers: [],

	entityFieldResolvers: [],
}
