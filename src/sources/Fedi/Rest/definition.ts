import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const FediRestSource = {
	provider: SourceProvider.Fedi,
	source: Source.Fedi_Rest,
	label: 'Fedi API v1 (REST)',
} satisfies SourceDefinition

export default FediRestSource
