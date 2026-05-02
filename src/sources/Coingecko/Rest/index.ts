import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const CoingeckoRestSource = {
	provider: SourceProvider.Coingecko,
	source: Source.Coingecko_Rest,
	label: 'Coingecko Rest',
} satisfies SourceDefinition

export default CoingeckoRestSource
