import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

export default {
	provider: SourceProvider.X,
	source: Source.X_Rest,
	label: 'X API v2 (REST)',
} satisfies SourceDefinition
