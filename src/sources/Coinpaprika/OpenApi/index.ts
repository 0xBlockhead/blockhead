import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const CoinpaprikaOpenApiSource = {
	provider: SourceProvider.Coinpaprika,
	source: Source.Coinpaprika_OpenApi,
	label: 'Coinpaprika OpenApi',
} satisfies SourceDefinition

export default CoinpaprikaOpenApiSource
