import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

export default {
	provider: SourceProvider.NostrBand,
	source: Source.NostrBand_Rest,
	label: 'NostrBand API (REST, public indexer)',
} satisfies SourceDefinition
