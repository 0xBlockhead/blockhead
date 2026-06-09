import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const CoingeckoOpenApiSource = {
	provider: SourceProvider.Coingecko,
	source: Source.Coingecko_OpenApi,
	label: 'Coingecko OpenApi',
} satisfies SourceDefinition

export default CoingeckoOpenApiSource
