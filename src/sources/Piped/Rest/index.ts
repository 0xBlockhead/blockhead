import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

export default {
	provider: SourceProvider.Piped,
	source: Source.Piped_Rest,
	label: 'Piped API (REST)',
} satisfies SourceDefinition
