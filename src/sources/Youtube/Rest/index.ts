import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

export default {
	provider: SourceProvider.Youtube,
	source: Source.Youtube_Rest,
	label: 'YouTube Data API v3 (REST)',
} satisfies SourceDefinition
